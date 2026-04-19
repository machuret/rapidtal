/* ═══════════════════════════════════════════════════════════════════════════
 * Default industry landing-page composer.
 *
 * 99% of industry pages will use this as-is and just pass a config. If a
 * particular industry needs custom section order or an extra section, copy
 * this file into the industry folder and edit it locally — the individual
 * <Section> components and <Calculator> are exported independently.
 * ═══════════════════════════════════════════════════════════════════════════ */

import styles from './landing.module.css';
import Calculator from './Calculator';
import { Hero, Pain, Truth, Roles, HowItWorks, Proof, CTA } from './Sections';
import type { IndustryConfig } from './types';

export default function IndustryPage({ config }: { config: IndustryConfig }) {
  return (
    <div className={styles.page}>
      <Hero       config={config.hero} />
      <Pain       config={config.pain} />
      <Truth      config={config.truth} />
      <Roles      config={config.roles} />
      <HowItWorks config={config.how} />
      <Calculator config={config.calculator} />
      <Proof      config={config.proof} />
      <CTA        config={config.cta} />
    </div>
  );
}
