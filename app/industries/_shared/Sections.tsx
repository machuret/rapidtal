/* ═══════════════════════════════════════════════════════════════════════════
 * All landing-page sections except the Calculator (which is a client island
 * in its own file). These are server components — pure config-to-markup.
 *
 * Each section:
 *   - reads from its own config slice (HeroConfig, PainConfig, …)
 *   - is fully self-contained (includes its own background + spacing)
 *   - uses the shared .container div to cap content at 960px
 *
 * If you need to add / reorder sections on a per-industry basis, compose
 * them yourself in a custom page.tsx instead of using <IndustryPage>.
 * ═══════════════════════════════════════════════════════════════════════════ */

import styles from './landing.module.css';
import ScrollButton from './ScrollButton';
import type {
  HeroConfig, PainConfig, TruthConfig, RolesConfig,
  HowConfig, ProofConfig, CtaConfig,
} from './types';

/* ── HERO ────────────────────────────────────────────────────────────────── */
export function Hero({ config }: { config: HeroConfig }) {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {config.watermark && <div className={styles.wm}>{config.watermark}</div>}
        <div className={styles.eyebrow}>{config.eyebrow}</div>
        <h1>
          {config.titleBefore}
          {config.titleBefore && ' '}
          <em>{config.titleHighlight}</em>
          {config.titleAfter && ` ${config.titleAfter}`}
        </h1>
        <p className={styles.heroSub}>{config.subhead}</p>
        <div className={styles.hstats}>
          {config.stats.map((s) => (
            <div key={s.label} className={styles.hstat}>
              <div className={styles.hstatNum}>{s.num}</div>
              <div className={styles.hstatLbl}>{s.label}</div>
            </div>
          ))}
        </div>
        <ScrollButton target={config.ctaScrollTarget ?? 'calc-sec'}>
          {config.ctaLabel}
        </ScrollButton>
        {config.microCopy && <p className={styles.heroMicro}>{config.microCopy}</p>}
      </div>
    </section>
  );
}

/* ── PAIN ────────────────────────────────────────────────────────────────── */
export function Pain({ config }: { config: PainConfig }) {
  return (
    <section className={styles.painSec}>
      <div className={styles.container}>
        <div className={styles.secTag}>{config.tag}</div>
        <div className={styles.secH}>{config.heading}</div>
        <p className={styles.secSub}>{config.subhead}</p>
        <div className={styles.painGrid}>
          {config.cards.map((p) => (
            <div key={p.title} className={styles.pcard}>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
              <span className={styles.badge}>{p.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TRUTH ───────────────────────────────────────────────────────────────── */
export function Truth({ config }: { config: TruthConfig }) {
  return (
    <section className={styles.truthSec}>
      <div className={styles.container}>
        <div className={styles.secTag}>{config.tag}</div>
        <div className={styles.truthH}>
          {config.headingLine1}<br />
          {config.headingLine2Before}
          {config.headingLine2Before && ' '}
          <em>{config.headingLine2Highlight}</em>
          {config.headingLine2After && ` ${config.headingLine2After}`}
        </div>
        <p className={styles.truthSub}>{config.subhead}</p>
        <div className={styles.eqBox}>
          <div className={styles.eqPart}>
            <div className={styles.eqLbl}>{config.equation.left.label}</div>
            <div className={styles.eqVal}>{config.equation.left.value}</div>
          </div>
          <div className={styles.eqOp}>+</div>
          <div className={styles.eqPart}>
            <div className={styles.eqLbl}>{config.equation.middle.label}</div>
            <div className={styles.eqVal}>{config.equation.middle.value}</div>
          </div>
          <div className={styles.eqOp}>=</div>
          <div className={styles.eqPart}>
            <div className={styles.eqLbl}>{config.equation.right.label}</div>
            <div className={`${styles.eqVal} ${styles.eqValO}`}>
              {config.equation.right.value}
            </div>
          </div>
        </div>
        <p className={styles.truthNote}>{config.note}</p>
      </div>
    </section>
  );
}

/* ── ROLES ───────────────────────────────────────────────────────────────── */
export function Roles({ config }: { config: RolesConfig }) {
  return (
    <section className={styles.rolesSec}>
      <div className={styles.container}>
        <div className={styles.secTag}>{config.tag}</div>
        <div className={styles.secH}>{config.heading}</div>
        <p className={styles.secSub}>{config.subhead}</p>
        {config.cards.map((r) => (
          <div key={r.name} className={styles.rcard}>
            <div className={styles.rcardHead}>
              <div className={styles.rcardLeft}>
                <div className={styles.rico}>{r.icon}</div>
                <div>
                  <div className={styles.rcardName}>{r.name}</div>
                  <div className={styles.rcardType}>{r.subtitle}</div>
                </div>
              </div>
              <div className={styles.rcardRight}>
                <div className={styles.rcardCostLbl}>Local hire true annual cost</div>
                <div className={styles.rcardCost}>{r.costRange}</div>
              </div>
            </div>
            <div className={styles.rcardBody}>
              <div>
                <div className={styles.rcolLbl}>What this role does for your business</div>
                <ul className={styles.rtasks}>
                  {r.tasks.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
              <div>
                <div className={styles.rcolLbl}>Your Offshore Marketing Ninja + AI stack</div>
                <div className={styles.toolsWrap}>
                  {r.tools.map((t) => <span key={t} className={styles.tchip}>{t}</span>)}
                </div>
              </div>
            </div>
            <div className={styles.rcardSave}>
              <span className={styles.rsaveLbl}>Annual saving vs local hire (fully loaded)</span>
              <span className={styles.rsaveVal}>{r.saving}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ────────────────────────────────────────────────────────── */
export function HowItWorks({ config }: { config: HowConfig }) {
  return (
    <section className={styles.howitSec}>
      <div className={styles.container}>
        <div className={styles.secTag}>{config.tag}</div>
        <div className={styles.secH}>{config.heading}</div>
        <p className={styles.secSub}>{config.subhead}</p>
        <div className={styles.steps}>
          {config.steps.map((s, i) => (
            <div key={s.title} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
                <p className={styles.stepNote}>{s.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROOF ───────────────────────────────────────────────────────────────── */
export function Proof({ config }: { config: ProofConfig }) {
  return (
    <section className={styles.proofSec}>
      <div className={styles.container}>
        <div className={styles.secTag}>{config.tag}</div>
        <div className={styles.secH}>{config.heading}</div>
        <p className={styles.secSub}>{config.subhead}</p>
        <div className={styles.proofGrid}>
          {config.items.map((p) => (
            <div key={p.title} className={styles.proofCard}>
              <div className={styles.proofTop}>
                <div className={styles.proofIco}>{p.tag}</div>
                <span className={styles.proofIcoLbl}>{p.title}</span>
              </div>
              <p>{p.body}</p>
              <div className={styles.proofBig}>{p.big}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────────────────────── */
export function CTA({ config }: { config: CtaConfig }) {
  return (
    <section className={styles.ctaSec}>
      <div className={styles.container}>
        <div className={styles.secTag}>{config.tag}</div>
        <div className={styles.ctaH}>
          {config.headingLine1}<br />
          {config.headingLine2Before}
          {config.headingLine2Before && ' '}
          <em>{config.headingLine2Highlight}</em>
          {config.headingLine2After && config.headingLine2After}
        </div>
        <p className={styles.ctaSub}>{config.subhead}</p>
        <p className={styles.ctaMicro}>{config.microCopy}</p>

        <div className={styles.ctaBox}>
          <div className={styles.ctaBoxLbl}>{config.listHeading}</div>
          <div className={styles.bpItems}>
            {config.bullets.map((line) => (
              <div key={line} className={styles.bpItem}>
                <div className={styles.bpCheck}>✓</div>
                <span>{line}</span>
              </div>
            ))}
          </div>
          <a href={config.bookingHref} className={styles.btnBig}>
            {config.buttonLabel}
          </a>
        </div>

        <div className={styles.trustRow}>
          {config.trustItems.map((t) => (
            <span key={t} className={styles.trustItem}>
              <span className={styles.tdot} />{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
