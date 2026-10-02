'use client';

import { calculateHiringCosts } from '@/lib/hiring-costs';

import styles from './ComparisonTable.module.css';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatPrice } from '@/lib/currency';

interface CostData {
  auBaseSalary: number;
  phBaseSalary: number;
  auSuper: number;
  auLeave: number;
  auSick: number;
  auRecruitment: number;
  phRecruitment: number;
  tools: number;
  auOffice: number;
  auHR: number;
  auWorkersComp: number;
}

interface ComparisonTableProps {
  costs: CostData;
}

function formatCost(amount: number, currency: 'AUD' | 'USD'): string {
  if (amount === 0) return formatPrice(0, currency);
  return formatPrice(amount, currency);
}

export default function ComparisonTable({ costs }: ComparisonTableProps) {
  const { currency } = useCurrency();

  const { auTotal, phTotal } = calculateHiringCosts(costs);

  return (
    <div className={styles.comparisonWrap}>
      <div className={styles.comparisonHeader}>
        <div className={styles.colHeader}>Cost Item</div>
        <div className={`${styles.colHeader} ${styles.aus}`}>
          <span className={styles.colFlag}>🇦🇺</span> Australian Hire
        </div>
        <div className={`${styles.colHeader} ${styles.ph}`}>
          <span className={styles.colFlag}>🇵🇭</span> Philippines Direct
        </div>
      </div>

      <ComparisonRow label="Base Salary" sub="Monthly before anything else"
        ausVal={costs.auBaseSalary} phVal={costs.phBaseSalary} currency={currency} />
      <ComparisonRow label="Superannuation" sub="12% of base salary in this estimate"
        ausVal={costs.auSuper} phVal={0} currency={currency} />
      <ComparisonRow label="Annual Leave Coverage Provision" sub="Illustrative allowance for coverage; not an additional statutory salary charge"
        ausVal={costs.auLeave} phVal={0} currency={currency} />
      <ComparisonRow label="Sick Leave Provision" sub="Illustrative absence coverage allowance; actual costs vary"
        ausVal={costs.auSick} phVal={0} currency={currency} />
      <ComparisonRow label="Recruitment Cost" sub="Typical agency fee, amortised over 12 months"
        ausVal={costs.auRecruitment} phVal={costs.phRecruitment} currency={currency} />
      <ComparisonRow label="Tools & Software" sub="Illustrative role-specific software budget"
        ausVal={costs.tools} phVal={costs.tools} currency={currency} />
      <ComparisonRow label="Office / Desk Space" sub="Desk, utilities, equipment contribution"
        ausVal={costs.auOffice} phVal={0} currency={currency} />
      <ComparisonRow label="HR & Payroll Admin" sub="Time cost, software, compliance"
        ausVal={costs.auHR} phVal={0} currency={currency} />
      <ComparisonRow label="Workers Comp Insurance" sub="Approx 1.5% of wage, amortised"
        ausVal={costs.auWorkersComp} phVal={0} currency={currency} />

      <div className={`${styles.comparisonRow} ${styles.totalRow}`}>
        <div className={styles.rowLabel}>
          <strong style={{fontSize: '17px', color: 'var(--white)'}}>ESTIMATED MONTHLY COST</strong>
          <span>First-year costs averaged monthly</span>
        </div>
        <div className={`${styles.rowVal} ${styles.ausVal} ${styles.total}`}>
          {formatCost(auTotal, currency)}
        </div>
        <div className={`${styles.rowVal} ${styles.phVal} ${styles.total}`}>
          {formatCost(phTotal, currency)}
        </div>
      </div>
      <p>
        Illustrative estimates, not a quote or measured average. Recruitment fees are spread
        over the first 12 months. Leave provisions model additional coverage and may not apply
        to your business. Zero entries are exclusions from this model, not confirmation that
        no obligations or costs apply. Confirm benefits, equipment, payroll, taxes, and
        engagement arrangements before hiring. USD values use a fixed indicative rate of
        AU$1 = US$0.65.
      </p>
    </div>
  );
}

function ComparisonRow({ label, sub, ausVal, phVal, currency }: { label: string; sub: string; ausVal: number; phVal: number; currency: 'AUD' | 'USD' }) {
  return (
    <div className={styles.comparisonRow}>
      <div className={styles.rowLabel}>
        <strong>{label}</strong>
        <span>{sub}</span>
      </div>
      <div className={`${styles.rowVal} ${styles.ausVal}`}>
        {ausVal > 0 ? formatCost(ausVal, currency) : <span className={styles.zero}>{formatCost(0, currency)}</span>}
      </div>
      <div className={`${styles.rowVal} ${styles.phVal}`}>
        {phVal > 0 ? formatCost(phVal, currency) : <span className={styles.zero}>{formatCost(0, currency)}</span>}
      </div>
    </div>
  );
}
