'use client';

/* ═══════════════════════════════════════════════════════════════════════════
 * Savings calculator — fully config-driven.
 *
 * Formula is industry-agnostic (same Australian employment cost structure
 * applies to every SMB vertical): base salary × roles + super 11.5% + leave
 * 6wk equiv + WorkCover 1.5% + recruitment 15% + equipment $6K + onboarding
 * 12.5%. Offshore side: VA salary + AI tool annual + $2K setup.
 *
 * What IS customisable per industry: slider ranges, defaults, labels,
 * descriptions, and result-tile labels. All passed via CalcConfig.
 *
 * Saving is clamped to >= 0 for UX — if a user drags sliders into an
 * impossible region (e.g. 1 role at $65K vs $40K VA with $2K/mo tools) we
 * never show a negative "saving" which would confuse the pitch.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useMemo, useState } from 'react';
import styles from './landing.module.css';
import type { CalcConfig } from './types';

/* ─── CALCULATION CONSTANTS ──────────────────────────────────────────────────
 * Australian employment cost loading — figures drawn from ATO / Fair Work /
 * WorkCover AU. Update here once and every industry page recalculates.
 * ────────────────────────────────────────────────────────────────────────── */
export const CALC_CONSTANTS = {
  /** Superannuation — 11.5% from July 2024, legislated to 12% July 2025. */
  SUPER_RATE: 0.115,
  /** Leave equivalent (annual + sick) = 6 weeks of the 52-week salary */
  LEAVE_WEEKS: 6,
  WEEKS_PER_YEAR: 52,
  /** WorkCover + employer liability insurance (varies by state; 1.5% avg) */
  WORKCOVER_RATE: 0.015,
  /** Recruitment fee — average 15% of base salary per hire */
  RECRUITMENT_RATE: 0.15,
  /** Equipment + software licences + desk cost per role per year */
  EQUIPMENT_PER_ROLE: 6000,
  /** Onboarding + productivity loss over first 3-4 months = ~12.5% of salary */
  ONBOARDING_RATE: 0.125,
  /** One-off RapidTAL setup fee (blueprint delivery + matching + SOP install) */
  OFFSHORE_SETUP_FEE: 2000,
} as const;

const fmt = (v: number) => '$' + Math.max(0, Math.round(v)).toLocaleString();
const fmtSigned = (v: number) => '$' + Math.round(v).toLocaleString();

/** Maps a slider's current value into a 0–100% fill for the CSS gradient
 *  background trick that gives us the "filled" portion of the track. */
function pct(value: number, min: number, max: number): string {
  if (max === min) return '0%';
  return `${((value - min) / (max - min)) * 100}%`;
}

export default function Calculator({ config }: { config: CalcConfig }) {
  const s = config.sliders;
  const [roles, setRoles] = useState(s.roles.default);
  const [sal,   setSal]   = useState(s.salary.default);
  const [va,    setVa]    = useState(s.va.default);
  const [tools, setTools] = useState(s.tools.default);

  const calc = useMemo(() => {
    const k = CALC_CONSTANTS;
    const totalSal = sal * roles;
    const sup      = Math.round(totalSal * k.SUPER_RATE);
    const lv       = Math.round((sal / k.WEEKS_PER_YEAR * k.LEAVE_WEEKS) * roles);
    const wc       = Math.round(totalSal * k.WORKCOVER_RATE);
    const rec      = Math.round(sal * k.RECRUITMENT_RATE * roles);
    const eq       = k.EQUIPMENT_PER_ROLE * roles;
    const ob       = Math.round(sal * k.ONBOARDING_RATE * roles);
    const auTotal  = totalSal + sup + lv + wc + rec + eq + ob;

    const vaTotal  = va + (tools * 12) + k.OFFSHORE_SETUP_FEE;
    const saving   = auTotal - vaTotal;

    return { totalSal, sup, lv, wc, rec, eq, ob, auTotal, vaTotal, saving };
  }, [roles, sal, va, tools]);

  return (
    <section className={styles.calcSec} id="calc-sec">
      <div className={styles.container}>
        <div className={styles.secTag}>{config.tag}</div>
        <div className={styles.secH}>{config.heading}</div>
        <p className={styles.secSub}>{config.subhead}</p>

        {/* ── SLIDERS ───────────────────────────────────────────────── */}
        <div className={styles.sliders}>
          {/* roles */}
          <SliderRow
            label={s.roles.label}
            value={`${roles} role${roles > 1 ? 's' : ''}`}
            description={s.roles.description}
            min={s.roles.min} max={s.roles.max} step={s.roles.step}
            current={roles}
            onChange={(v) => setRoles(v)}
          />
          {/* salary */}
          <SliderRow
            label={s.salary.label}
            value={fmt(sal)}
            description={s.salary.description}
            min={s.salary.min} max={s.salary.max} step={s.salary.step}
            current={sal}
            onChange={(v) => setSal(v)}
          />
          {/* va */}
          <SliderRow
            label={s.va.label}
            value={fmt(va)}
            description={s.va.description}
            min={s.va.min} max={s.va.max} step={s.va.step}
            current={va}
            onChange={(v) => setVa(v)}
          />
          {/* tools */}
          <SliderRow
            label={s.tools.label}
            value={`${fmt(tools)}/mo`}
            description={s.tools.description}
            min={s.tools.min} max={s.tools.max} step={s.tools.step}
            current={tools}
            onChange={(v) => setTools(v)}
          />
        </div>

        {/* ── HEADLINE RESULTS ─────────────────────────────────────── */}
        <div className={styles.resultsGrid}>
          <div className={styles.rmet}>
            <div className={styles.rmetLbl}>{config.resultLabels.localCost}</div>
            <div className={styles.rmetVal}>{fmt(calc.auTotal)}</div>
          </div>
          <div className={styles.rmet}>
            <div className={styles.rmetLbl}>{config.resultLabels.offshoreCost}</div>
            <div className={styles.rmetVal}>{fmt(calc.vaTotal)}</div>
          </div>
          <div className={styles.rmet}>
            <div className={styles.rmetLbl}>{config.resultLabels.saving}</div>
            <div className={`${styles.rmetVal} ${styles.rmetValO}`}>{fmt(calc.saving)}</div>
          </div>
        </div>

        {/* ── FULL BREAKDOWN ───────────────────────────────────────── */}
        <div className={styles.bdown}>
          <div className={styles.bdHeader}>
            <span>{config.breakdownHeading}</span>
            <span>Per year</span>
          </div>
          <BdRow label={`Base salaries (${roles} role${roles > 1 ? 's' : ''} at ${fmt(sal)} each)`}>
            <span className={`${styles.bdV} ${styles.bdVRed}`}>{fmt(calc.totalSal)}</span>
          </BdRow>
          <BdRow label="Superannuation (11.5% — mandatory from July 2024)">
            <span className={`${styles.bdV} ${styles.bdVRed}`}>{fmt(calc.sup)}</span>
          </BdRow>
          <BdRow label="Annual leave + sick leave (6 weeks equivalent)">
            <span className={`${styles.bdV} ${styles.bdVRed}`}>{fmt(calc.lv)}</span>
          </BdRow>
          <BdRow label="WorkCover and employer insurance (1.5%)">
            <span className={`${styles.bdV} ${styles.bdVRed}`}>{fmt(calc.wc)}</span>
          </BdRow>
          <BdRow label="Recruitment fees (average 15% of salary per hire)">
            <span className={`${styles.bdV} ${styles.bdVRed}`}>{fmt(calc.rec)}</span>
          </BdRow>
          <BdRow label="Equipment, software licences and desk cost">
            <span className={`${styles.bdV} ${styles.bdVRed}`}>{fmt(calc.eq)}</span>
          </BdRow>
          <BdRow label="Onboarding and lost productivity (3–4 months)">
            <span className={`${styles.bdV} ${styles.bdVRed}`}>{fmt(calc.ob)}</span>
          </BdRow>

          <div className={styles.bdSect}>
            <span>Offshore Marketing Ninja model — full cost</span>
            <span>Per year</span>
          </div>
          <BdRow label="Ninja annual salary (AUD) — no super, no leave liability">
            <span className={`${styles.bdV} ${styles.bdVGrn}`}>{fmt(va)}</span>
          </BdRow>
          <BdRow label="Full AI tool stack (annual)">
            <span className={`${styles.bdV} ${styles.bdVGrn}`}>{fmt(tools * 12)}</span>
          </BdRow>
          <BdRow label="Onboarding blueprint and setup (one-off)">
            <span className={`${styles.bdV} ${styles.bdVGrn}`}>$2,000</span>
          </BdRow>

          <div className={styles.bdTotal}>
            <span className={styles.bdTotalLbl}>{config.totalLabel}</span>
            {/* Use signed formatter here so we still honour what math says at
                 the grand-total line, even if headline tiles clamp to 0. */}
            <span className={styles.bdTotalV}>{fmtSigned(calc.saving)}</span>
          </div>
        </div>

        <p className={styles.calcDisclaimer}>{config.disclaimer}</p>
      </div>
    </section>
  );
}

/* ── Subcomponents ────────────────────────────────────────────────────────── */

function SliderRow({
  label, value, description, min, max, step, current, onChange,
}: {
  label: string;
  value: string;
  description: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}) {
  const fill = pct(current, min, max);
  return (
    <div className={styles.slRow}>
      <div className={styles.slTop}>
        <span className={styles.slLbl}>{label}</span>
        <span className={styles.slVal}>{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={current}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label={label}
        // CSS var drives the gradient fill — see landing.module.css .slRow rule
        style={{ ['--pct' as keyof React.CSSProperties]: fill } as React.CSSProperties}
      />
      <p className={styles.slDesc}>{description}</p>
    </div>
  );
}

function BdRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.bdRow}>
      <span className={styles.bdLbl}>{label}</span>
      {children}
    </div>
  );
}
