/* ═══════════════════════════════════════════════════════════════════════════
 * Default industry landing-page composer.
 *
 * 99% of industry pages will use this as-is and just pass a config. If a
 * particular industry needs custom section order or an extra section, copy
 * this file into the industry folder and edit it locally — the individual
 * <Section> components and <Calculator> are exported independently.
 * ═══════════════════════════════════════════════════════════════════════════ */

import styles from './landing.module.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Calculator from './Calculator';
import { Hero, Pain, Truth, Roles, HowItWorks, Proof, Faq, CTA } from './Sections';
import StructuredData from './StructuredData';
import StickyMobileCta from './StickyMobileCta';
import AttentionBar from './AttentionBar';
import type { IndustryConfig } from './types';

export default function IndustryPage({ config }: { config: IndustryConfig }) {
  return (
    <>
      {/* JSON-LD: Service + FAQPage + BreadcrumbList. Rendered at the top of
          the tree so it ships in the initial HTML payload for crawlers. */}
      <StructuredData config={config} />
      {config.attentionBar && (
        <AttentionBar
          badge={config.attentionBar.badge}
          message={config.attentionBar.message}
          ctaLabel={config.attentionBar.ctaLabel}
          target={config.attentionBar.target ?? 'cta-sec'}
          contactName={config.attentionBar.contactName}
          contactPhone={config.attentionBar.contactPhone}
          storageKey={`attnbar:${config.slug}`}
        />
      )}
      <Nav />
      <main className={styles.page}>
        <Hero       config={config.hero} />
        <Pain       config={config.pain} />
        <Truth      config={config.truth} />
        <Roles      config={config.roles} />
        <HowItWorks config={config.how} />
        <Calculator config={config.calculator} />
        <Proof      config={config.proof} />
        <Faq        config={config.faq} />
        <CTA        config={config.cta} />
      </main>
      <Footer />
      <StickyMobileCta
        label={config.cta.stickyMobileLabel ?? 'Book Your Free Strategy Call'}
        target="cta-sec"
      />
    </>
  );
}
