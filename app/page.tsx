import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import CursorTracker from '@/components/CursorTracker';
import ScrollReveal from '@/components/ScrollReveal';
// Marketing global styles (palette, layout, hero, sections, responsive).
// These power the global-class components below (Hero, Roles, Footer, etc.).
import '@/app/css/base.css';
import '@/app/css/layout.css';
import '@/app/css/nav.css';
import '@/app/css/hero.css';
import '@/app/css/sections.css';
import '@/app/css/responsive.css';

// Below-the-fold sections — code-split but server-rendered for SEO.
const MarqueeStrip = dynamic(() => import('@/components/MarqueeStrip'), { ssr: true });
const Problem = dynamic(() => import('@/components/Problem'), { ssr: true });
const Process = dynamic(() => import('@/components/Process'), { ssr: true });
const Roles = dynamic(() => import('@/components/Roles'), { ssr: true });
const VsTable = dynamic(() => import('@/components/VsTable'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: true });
const FinalCta = dynamic(() => import('@/components/FinalCta'), { ssr: true });
const CalendlyEmbed = dynamic(() => import('@/components/CalendlyEmbed'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
const StickyCtaBar = dynamic(() => import('@/components/StickyCtaBar'));

export const metadata: Metadata = {
  title: 'Rapid Tal — Elite Filipino Marketing & Sales Talent',
  description:
    'Hire elite Filipino marketing and sales talent directly. No agency markup. No middlemen. 18-day average placement with a 6-month guarantee.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Rapid Tal — Elite Filipino Marketing & Sales Talent',
    description:
      'The top Filipino marketing and sales talent is sharper, hungrier, and half the cost. We find them. You hire them directly.',
    type: 'website',
    url: 'https://rapidtal.com',
    siteName: 'Rapid Tal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rapid Tal — Elite Filipino Marketing & Sales Talent',
    description:
      'Elite Filipino marketing & sales talent. Direct hire. 18-day placement. 6-month guarantee.',
  },
};

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <CursorTracker />
      <ScrollReveal />
      <Nav />
      <main id="main-content">
        <Hero />
        <StatsBar />
        <MarqueeStrip />
        <Problem />
        <Process />
        <Roles />
        <VsTable />
        <Testimonials />
        <Pricing />
        <CalendlyEmbed />
        <FinalCta />
      </main>
      <Footer />
      <StickyCtaBar />
    </>
  );
}
