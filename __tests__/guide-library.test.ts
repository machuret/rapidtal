/** @jest-environment node */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { GUIDES, GUIDE_SOURCES } from '@/data/guides';
import { ROLES } from '@/data/roles';
import sitemap from '@/app/sitemap';
import { calculateBudget, EMPTY_BUDGET } from '@/lib/hiring-budget';

const slugs = GUIDES.map(guide => guide.slug);

test('guides have distinct URL, title, and primary search intent', () => {
  for (const values of [slugs, GUIDES.map(g => g.title), GUIDES.map(g => g.primaryKeyword)]) {
    expect(new Set(values).size).toBe(GUIDES.length);
  }
});

test.each(GUIDES)('$slug has a complete navigable article and valid references', guide => {
  expect(guide.sections.length).toBeGreaterThanOrEqual(5);
  expect(new Set(guide.sections.map(section => section.id)).size).toBe(guide.sections.length);
  expect(guide.answer.length).toBeGreaterThan(80);
  expect(guide.description.length).toBeGreaterThan(70);
  for (const section of guide.sections) {
    expect(section.paragraphs.length + section.items.length).toBeGreaterThan(0);
    if (section.table) for (const row of section.table.rows) expect(row.length).toBe(section.table.columns.length);
    for (const id of section.sourceIds) {
      expect(guide.sourceIds).toContain(id);
      expect(GUIDE_SOURCES[id]?.url).toMatch(/^https:\/\//);
    }
  }
  for (const id of guide.sourceIds) expect(GUIDE_SOURCES[id]?.url).toMatch(/^https:\/\//);
  for (const slug of guide.relatedSlugs) {
    expect(slugs).toContain(slug);
    expect(slug).not.toBe(guide.slug);
  }
  for (const role of guide.roleSlugs) {
    expect(ROLES[role]).toBeDefined();
    expect(existsSync(join(process.cwd(), `app/(marketing)/hire-${role}/page.tsx`))).toBe(true);
  }
  if (guide.download) {
    const path = join(process.cwd(), 'public', guide.download.path);
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path, 'utf8')).toContain(`https://rapidtal.com/guides/${guide.slug}`);
  }
});

test('each guide is discoverable in the sitemap with no duplicate or legacy URLs', () => {
  const urls = sitemap().map(entry => entry.url);
  expect(new Set(urls).size).toBe(urls.length);
  for (const slug of slugs) expect(urls).toContain(`https://rapidtal.com/guides/${slug}`);
  expect(urls).toContain('https://rapidtal.com/tools/hiring-budget');
  expect(urls.some(url => url.includes('/cost-comparison/'))).toBe(false);
});

test('budget separates recurring spending from first-year-only costs', () => {
  expect(calculateBudget({ pay: 2000, tools: 150, otherMonthly: 0, recruitment: 4000, equipment: 800, otherOneOff: 0 }))
    .toEqual({ monthly: 2150, oneOff: 4800, firstYear: 30600, recurringYear: 25800 });
});

test('budget includes explicit payroll and other cost inputs', () => {
  expect(calculateBudget({ ...EMPTY_BUDGET, otherMonthly: 100, otherOneOff: 250 }).firstYear).toBe(1450);
});

test.each([-1, NaN, Infinity, 100000001])('budget rejects an invalid amount: %s', pay => {
  expect(() => calculateBudget({ ...EMPTY_BUDGET, pay })).toThrow(RangeError);
});

test('budget supports an honest negative difference and a zero starting state', () => {
  expect(calculateBudget(EMPTY_BUDGET).firstYear).toBe(0);
  const cheaper = calculateBudget({ ...EMPTY_BUDGET, pay: 1000 });
  const dearer = calculateBudget({ ...EMPTY_BUDGET, pay: 2000 });
  expect(cheaper.firstYear - dearer.firstYear).toBe(-12000);
});
