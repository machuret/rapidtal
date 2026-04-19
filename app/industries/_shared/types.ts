/* ═══════════════════════════════════════════════════════════════════════════
 * Industry landing-page config schema.
 *
 * One IndustryConfig drives an entire industry landing page — every visible
 * string, every card, every calculator slider range. To add a new industry:
 *
 *   1. Create `app/industries/<slug>/config.ts` exporting an IndustryConfig
 *   2. Create `app/industries/<slug>/page.tsx` (≈10 lines) that renders
 *      <IndustryPage config={config}/> and exports metadata from config.meta
 *
 * That's it. Zero duplicated markup. All sections (Hero, Pain, Truth, Roles,
 * HowItWorks, Calculator, Proof, CTA) read from this single object.
 *
 * Design principle: keep every string/number in config, NEVER hard-code
 * industry-specific copy inside components. If you find yourself wanting to
 * add an `industryName` param to a Section, add it to the config schema
 * instead.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { Metadata } from 'next';

/* ── HERO ────────────────────────────────────────────────────────────────── */
export interface HeroConfig {
  /** Top pre-heading line. Usually "RapidTAL · Built for Australian Business" */
  watermark?: string;
  /** Orange pill text identifying the audience */
  eyebrow: string;
  /** Static lead-in text rendered above the animated rotating word.
   *  Example: "Your Commercial Real Estate Agency is" */
  titleLead: string;
  /** 3–6 words that cycle every ~2s under the titleLead, rendered in brand
   *  orange with a spring slide-in/out animation. Pick words that all read
   *  as a grammatical continuation of titleLead for maximum punch. */
  rotatingWords: string[];
  subhead: string;
  /** Three stat tiles below the sub. Keep at exactly 3 for layout balance. */
  stats: [HeroStat, HeroStat, HeroStat];
  /** CTA label + scroll target (id of the calculator section) */
  ctaLabel: string;
  ctaScrollTarget?: string;
  microCopy?: string;
}
export interface HeroStat {
  num: string;
  label: string;
}

/* ── PAIN ────────────────────────────────────────────────────────────────── */
export interface PainCard {
  title: string;
  body: string;
  badge: string;
}
export interface PainConfig {
  tag: string;
  heading: string;
  subhead: string;
  cards: PainCard[];
}

/* ── TRUTH (the solution statement) ──────────────────────────────────────── */
export interface TruthEquationPart {
  label: string;
  value: string;
}
export interface TruthConfig {
  tag: string;
  /** H2 rendered as two lines. `highlight` renders in orange in line 2. */
  headingLine1: string;
  headingLine2Before: string;
  headingLine2Highlight: string;
  headingLine2After?: string;
  subhead: string;
  equation: {
    left: TruthEquationPart;
    middle: TruthEquationPart;
    /** Right-hand side renders in orange — the punch-line value. */
    right: TruthEquationPart;
  };
  note: string;
}

/* ── ROLES ───────────────────────────────────────────────────────────────── */
/** Supported lucide-react icon keys for role cards. Add new keys here as
 *  new industries need them — keep the set small so cards stay coherent. */
export type RoleIcon =
  | 'trending-up'   // Paid ads / growth
  | 'search'        // SEO
  | 'smartphone'    // Social media
  | 'pen-line'      // Content / copy
  | 'mail'          // Email / EDM
  | 'megaphone'     // PR / outreach
  | 'chart-bar'     // Analytics / reporting
  | 'video'         // Video / creative
  | 'users';        // Community / CS

export interface RoleCard {
  /** Icon key — rendered as a lucide-react SVG in the orange icon tile.
   *  See RoleIcon for the supported set. */
  icon: RoleIcon;
  name: string;
  /** One-line role description under the name */
  subtitle: string;
  costRange: string;
  tasks: string[];
  tools: string[];
  saving: string;
}
export interface RolesConfig {
  tag: string;
  heading: string;
  subhead: string;
  cards: RoleCard[];
}

/* ── HOW IT WORKS ────────────────────────────────────────────────────────── */
export interface Step {
  title: string;
  body: string;
  note: string;
}
export interface HowConfig {
  tag: string;
  heading: string;
  subhead: string;
  steps: Step[];
}

/* ── CALCULATOR ──────────────────────────────────────────────────────────── */
export interface CalcSliderConfig {
  min: number;
  max: number;
  step: number;
  default: number;
  label: string;
  description: string;
}
export interface CalcConfig {
  tag: string;
  heading: string;
  subhead: string;
  sliders: {
    roles: CalcSliderConfig;     // integer count
    salary: CalcSliderConfig;    // AUD/year per role
    va: CalcSliderConfig;        // AUD/year offshore
    tools: CalcSliderConfig;     // AUD/month AI stack
  };
  /** Labels for the three headline result tiles (industry-customizable). */
  resultLabels: {
    localCost: string;
    offshoreCost: string;
    saving: string;
  };
  /** Label for the full breakdown heading */
  breakdownHeading: string;
  totalLabel: string;
  disclaimer: string;
}

/* ── PROOF ───────────────────────────────────────────────────────────────── */
export interface ProofItem {
  /** 2-4 char tag shown in the orange icon tile (e.g. "AU", "AI", "PH") */
  tag: string;
  title: string;
  body: string;
  /** Large orange stat at the bottom of the card */
  big: string;
}
export interface ProofConfig {
  tag: string;
  heading: string;
  subhead: string;
  items: ProofItem[];
}

/* ── ATTENTION BAR ───────────────────────────────────────────────────────── */
/** Top-of-page announcement strip. Optional — omit from config to hide. */
export interface AttentionBarConfig {
  badge?: string;
  message: string;
  ctaLabel: string;
  /** Element id to scroll to on CTA click. Defaults to "cta-sec". */
  target?: string;
}

/* ── FAQ ─────────────────────────────────────────────────────────────────── */
export interface FaqItem {
  question: string;
  /** Can contain basic inline text. For rich markup, expand in a future rev. */
  answer: string;
}
export interface FaqConfig {
  tag: string;
  heading: string;
  subhead: string;
  /** 5–10 questions is the sweet spot — answers principal-level objections. */
  items: FaqItem[];
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */
export interface CtaConfig {
  tag: string;
  /** H2 rendered as two lines; line 2 contains an orange highlight. */
  headingLine1: string;
  headingLine2Before: string;
  headingLine2Highlight: string;
  headingLine2After?: string;
  subhead: string;
  microCopy: string;
  listHeading: string;
  bullets: string[];
  /** LeadConnector / GoHighLevel form embed ID for this industry. Each
   *  industry has its own form so submissions land in the right pipeline.
   *  Find it in HighLevel → Sites → Forms → Embed code (the UUID after
   *  /widget/form/). The form_embed.js script auto-resizes the iframe. */
  embedFormId: string;
  /** Human-readable name passed to the iframe title + data-form-name (a11y
   *  + the LC backend uses it for tracking). */
  embedFormName: string;
  /** Min-height in px to reserve for the iframe before it resizes itself.
   *  Prevents layout shift on load. Defaults to 737 (LC's standard). */
  embedMinHeight?: number;
  trustItems: string[];
  /** Short label (≤ 32 chars) shown in the mobile sticky CTA bar.
   *  Tapping it smooth-scrolls to the CTA section. Optional — if omitted,
   *  the sticky bar falls back to a generic label. */
  stickyMobileLabel?: string;
}

/* ── ROOT ────────────────────────────────────────────────────────────────── */
export interface IndustryConfig {
  /** Slug matches the route folder name, e.g. "commercial-real-estate" */
  slug: string;
  /** Human name used only if a component ever needs it (prefer baking into
   *  copy inside config fields, to keep components industry-agnostic). */
  industryName: string;
  /** Optional top-of-page attention strip. */
  attentionBar?: AttentionBarConfig;
  hero: HeroConfig;
  pain: PainConfig;
  truth: TruthConfig;
  roles: RolesConfig;
  how: HowConfig;
  calculator: CalcConfig;
  proof: ProofConfig;
  faq: FaqConfig;
  cta: CtaConfig;
  /** Passed straight to Next.js via `export const metadata` on page.tsx */
  meta: Metadata;
}
