# Rapid Tal — Marketing Site

Next.js 16 marketing landing page for Rapid Tal — elite Filipino marketing & sales talent placement.

## Stack

- **Framework**: Next.js 16 (App Router, static export)
- **Language**: TypeScript 5, strict mode
- **Styling**: Global CSS with CSS custom properties (no Tailwind, no CSS-in-JS)
- **Fonts**: Bebas Neue, Barlow Condensed, DM Sans via Google Fonts
- **Deployment**: Vercel (auto-deploy on push to `main`)

## Project Structure

```
app/
  layout.tsx       # Root layout — metadata, SEO, fonts, viewport
  page.tsx         # Homepage — assembles all section components
  globals.css      # All styles — design tokens, components, responsive
components/
  Nav.tsx          # Fixed navigation bar
  Hero.tsx         # Full-screen hero section
  StatsBar.tsx     # 4-stat social proof bar
  MarqueeStrip.tsx # Animated orange ticker strip
  Problem.tsx      # Problem/agitation section
  Process.tsx      # 3-step how-it-works
  Roles.tsx        # Tabbed roles grid (client component)
  VsTable.tsx      # Rapid Tal vs agencies comparison table
  Testimonials.tsx # 3-column testimonial cards
  Pricing.tsx      # Single pricing card
  FinalCta.tsx     # Orange CTA banner
  Footer.tsx       # 4-column footer
  CursorTracker.tsx # Custom cursor (mouse devices only, client component)
  ScrollReveal.tsx  # IntersectionObserver scroll animations (client component)
```

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript check
```

## Deployment

Connected to Vercel via GitHub. Every push to `main` triggers an auto-deploy.
No environment variables required — this is a fully static site with no database.

## Adding Content

All copy and data is colocated inside each component file. To update:
- **Roles/salaries** → `components/Roles.tsx` (`ROLES` constant)
- **Stats** → `components/StatsBar.tsx` (`stats` array)
- **Testimonials** → `components/Testimonials.tsx`
- **Pricing features** → `components/Pricing.tsx` (`features` array)
- **Process steps** → `components/Process.tsx` (`steps` array)
- **SEO/metadata** → `app/layout.tsx`
