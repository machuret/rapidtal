# Frontend Styling Architecture

This project contains **two separate styling worlds** that share one Next.js app.
Keeping them isolated is the single most important rule.

| World         | Where                                  | System                                  |
| ------------- | -------------------------------------- | --------------------------------------- |
| **Portal**    | `app/(portal)/**`                      | Tailwind + shadcn tokens (`globals.css`) |
| **Marketing** | homepage + `hire-*`, `roles/*`, `industries/*`, `*-specialists`, long-form pages | `.marketing-theme` tokens + CSS Modules |

## Where tokens live

- **Marketing palette / fonts / spacing**: `app/css/marketing-theme.css` — the
  single source of truth. Scoped to the `.marketing-theme` class (NOT `:root`)
  so it can load globally without colliding with the portal's shadcn tokens
  (e.g. both define `--border`).
- **Portal tokens**: `app/globals.css` (`:root`, shadcn HSL triplets).
- **Fonts**: declared once via `next/font` in `app/layout.tsx`, exposed as
  `--font-display` (Bebas), `--font-ui` (Barlow), `--ds-font` (DM Sans),
  `--font-sans` (Inter), `--font-mono`. Never hardcode a font family.

## How styling is applied

1. **Tokens** → CSS custom properties from the sources above.
2. **Components own their styles** → CSS Modules (`Component.module.css`)
   referencing tokens via `var(--…)`.
3. **Pages compose components.** Pages should not carry visual styling.

A marketing page gets the theme from its layout/root wrapper carrying
`className="marketing-theme"`; everything inside inherits the correct colors
and fonts. Do not re-declare palette values per page.

## Forbidden patterns (enforced by `npm run lint:css`)

- ❌ `var(--x)` with **no fallback** for a variable that isn't defined anywhere
  → silent failure (blank font/color). Define the token or add a fallback.
- ❌ **New inline `style={{ }}` in a `page.tsx`.** Move it to a CSS Module.
  Dynamic, JS-driven styles in components are the only acceptable exception.
- ❌ **New hardcoded color** (`#hex`, `rgb()`, `hsl()`) in component CSS.
  Use a token. Literals belong only in the token-definition files.

These run in `prebuild` (so `npm run build` / Vercel fails on a violation) and
in CI (`.github/workflows/css-guardrails.yml`).

The inline-style and hardcoded-color checks are **ratchets**: a committed
budget (`scripts/css-baseline.json`) that may only go down. After removing
some, run `npm run lint:css:update` to lower the budget so it can't creep back.

## Adding a new marketing page

1. Place it so it inherits the marketing layout / `marketing-theme` wrapper.
2. Build it from existing `components/comparison` or `components/pillar`
   components. Don't fork a near-identical copy.
3. Put any page-specific styling in a `page.module.css` using tokens.
4. Run `npm run lint:css` before committing.

## Migration status

- [x] **Phase 0** — guardrails (undefined-var / inline-style / hardcoded-color
      checks) + token aliases for previously-undefined font variables.
- [ ] Phase 1 — move marketing pages under an `app/(marketing)` route group so
      the theme is owned by a layout, not a per-page class.
- [ ] Phase 2 — single token source; retire `base.css`/`marketing-theme.css`
      duplication into one namespace.
- [ ] Phase 3 — migrate the ~424 page-level inline styles into modules.
- [ ] Phase 4 — consolidate repeated page structures into shared sections.
- [ ] Phase 5 — collapse duplicate font aliases (`--font-barlow`,
      `--font-dm-sans`) into the canonical names, then remove them.
