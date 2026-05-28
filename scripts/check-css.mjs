#!/usr/bin/env node
/**
 * CSS guardrails — Phase 0 of the styling-architecture standardization.
 *
 * Runs three checks against the source tree (no external dependencies):
 *
 *   1. UNDEFINED CSS VARIABLES  (hard fail, zero tolerance)
 *      Any `var(--x)` used WITHOUT a fallback whose `--x` is never defined
 *      in our CSS, set in JS/inline, or part of a known external allowlist
 *      (next/font, Tailwind, Radix). These are silent failures — the exact
 *      bug that left fonts/colors blank across the marketing pages.
 *
 *   2. INLINE STYLES IN PAGES  (ratchet)
 *      `style={{ ... }}` occurrences in page.tsx files. Compared against a
 *      committed budget. New inline styles fail the build; removing them and
 *      lowering the budget is encouraged. Prevents regression during cleanup.
 *
 *   3. HARDCODED COLORS IN COMPONENT CSS  (ratchet)
 *      Raw hex / rgb() / hsl() literals in *.module.css and app/css/*.css,
 *      excluding the token-definition files where literals belong.
 *
 * Usage:
 *   node scripts/check-css.mjs                 # check (exit 1 on violation)
 *   node scripts/check-css.mjs --update-baseline  # ratchet budgets to current
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const BASELINE_PATH = join(ROOT, 'scripts', 'css-baseline.json');
const SCAN_DIRS = ['app', 'components'];
const IGNORE = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

// CSS variables defined outside our CSS (next/font on <html>, lib runtime vars).
const EXTERNAL_VARS = new Set([
  'font-sans', 'font-mono', 'font-display', 'font-ui',
  'ds-font', 'ds-font-display',
]);
// Prefixes for runtime-injected variables we don't define ourselves.
const EXTERNAL_PREFIXES = ['tw-', 'radix-', 'sonner-', 'recharts-'];

const isExternal = (name) =>
  EXTERNAL_VARS.has(name) || EXTERNAL_PREFIXES.some((p) => name.startsWith(p));

// ── file walking ──────────────────────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const allFiles = SCAN_DIRS
  .map((d) => join(ROOT, d))
  .filter(existsSync)
  .flatMap((d) => walk(d));

const cssFiles = allFiles.filter((f) => extname(f) === '.css');
const tsxFiles = allFiles.filter((f) => ['.tsx', '.ts'].includes(extname(f)));
const read = (f) => readFileSync(f, 'utf8');
const rel = (f) => relative(ROOT, f);

// ── 1. undefined CSS variables ──────────────────────────────────────────────
const defined = new Set(EXTERNAL_VARS);

// custom-property definitions in CSS:  --foo:
for (const f of cssFiles) {
  for (const m of read(f).matchAll(/(?:^|[^\w-])--([\w-]+)\s*:/g)) defined.add(m[1]);
}
// custom properties set from JS / inline:  '--foo':  or setProperty('--foo'
for (const f of tsxFiles) {
  const src = read(f);
  for (const m of src.matchAll(/['"]--([\w-]+)['"]\s*:/g)) defined.add(m[1]);
  for (const m of src.matchAll(/setProperty\(\s*['"]--([\w-]+)['"]/g)) defined.add(m[1]);
}

// references:  var(--foo)  /  var(--foo, fallback)
const undefinedRefs = [];
const VAR_RE = /var\(\s*--([\w-]+)\s*(,)?/g;
for (const f of [...cssFiles, ...tsxFiles]) {
  const src = read(f);
  let lineStarts = null;
  for (const m of src.matchAll(VAR_RE)) {
    const name = m[1];
    const hasFallback = Boolean(m[2]);
    if (hasFallback || defined.has(name) || isExternal(name)) continue;
    if (!lineStarts) lineStarts = src.slice(0, m.index).split('\n').length;
    undefinedRefs.push({ file: rel(f), name, line: src.slice(0, m.index).split('\n').length });
  }
}

// ── 2. inline styles in page files ──────────────────────────────────────────
let inlineStyleCount = 0;
const inlineByFile = {};
for (const f of tsxFiles) {
  if (!f.endsWith('page.tsx')) continue;
  const n = (read(f).match(/style=\{\{/g) || []).length;
  if (n) { inlineStyleCount += n; inlineByFile[rel(f)] = n; }
}

// ── 3. hardcoded colors in component / shared CSS ────────────────────────────
// Token-definition files are allowed to contain raw color literals.
const TOKEN_FILES = ['marketing-theme.css', 'base.css', 'globals.css'];
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g;
let hardcodedColorCount = 0;
const colorByFile = {};
for (const f of cssFiles) {
  if (TOKEN_FILES.some((t) => f.endsWith(t))) continue;
  const n = (read(f).match(COLOR_RE) || []).length;
  if (n) { hardcodedColorCount += n; colorByFile[rel(f)] = n; }
}

// ── baseline / ratchet ───────────────────────────────────────────────────────
const current = { inlineStylesInPages: inlineStyleCount, hardcodedColorsInCss: hardcodedColorCount };

if (process.argv.includes('--update-baseline')) {
  writeFileSync(BASELINE_PATH, JSON.stringify(current, null, 2) + '\n');
  console.log('✓ baseline updated:', current);
  process.exit(0);
}

const baseline = existsSync(BASELINE_PATH)
  ? JSON.parse(read(BASELINE_PATH))
  : { inlineStylesInPages: Infinity, hardcodedColorsInCss: Infinity };

// ── report ────────────────────────────────────────────────────────────────
let failed = false;

if (undefinedRefs.length) {
  failed = true;
  console.error(`\n✗ Undefined CSS variables (${undefinedRefs.length}) — used with no fallback and never defined:`);
  for (const r of undefinedRefs) console.error(`    ${r.file}:${r.line}  var(--${r.name})`);
  console.error('  → define the token (preferably in app/css/marketing-theme.css) or add a fallback.');
}

if (inlineStyleCount > baseline.inlineStylesInPages) {
  failed = true;
  console.error(`\n✗ Inline styles in pages increased: ${inlineStyleCount} > budget ${baseline.inlineStylesInPages}`);
  console.error('  New style={{…}} in a page. Move it into a CSS Module. Files:');
  for (const [f, n] of Object.entries(inlineByFile).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.error(`    ${f}  (${n})`);
  }
} else if (inlineStyleCount < baseline.inlineStylesInPages) {
  console.log(`✓ Inline styles in pages reduced: ${inlineStyleCount} < budget ${baseline.inlineStylesInPages}. Run --update-baseline to ratchet down.`);
}

if (hardcodedColorCount > baseline.hardcodedColorsInCss) {
  failed = true;
  console.error(`\n✗ Hardcoded colors in component CSS increased: ${hardcodedColorCount} > budget ${baseline.hardcodedColorsInCss}`);
  console.error('  Use a design token (var(--…)) instead of a raw color literal.');
} else if (hardcodedColorCount < baseline.hardcodedColorsInCss) {
  console.log(`✓ Hardcoded colors reduced: ${hardcodedColorCount} < budget ${baseline.hardcodedColorsInCss}. Run --update-baseline to ratchet down.`);
}

if (failed) {
  console.error('\nCSS guardrails failed. See scripts/check-css.mjs for the rules.\n');
  process.exit(1);
}
console.log(`✓ CSS guardrails passed (vars ok · inline styles ${inlineStyleCount} · hardcoded colors ${hardcodedColorCount}).`);
