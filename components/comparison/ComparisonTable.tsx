import styles from './ComparisonTable.module.css';

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

export default function ComparisonTable({ costs }: ComparisonTableProps) {
  const auTotal = costs.auBaseSalary + costs.auSuper + costs.auLeave + 
                  costs.auSick + costs.auRecruitment + costs.tools + 
                  costs.auOffice + costs.auHR + costs.auWorkersComp;
  
  const phTotal = costs.phBaseSalary + costs.phRecruitment + costs.tools;

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
        ausVal={costs.auBaseSalary} phVal={costs.phBaseSalary} />
      <ComparisonRow label="Superannuation" sub="11.5% on top of salary — mandatory" 
        ausVal={costs.auSuper} phVal={0} />
      <ComparisonRow label="Annual Leave Loading" sub="4 weeks + 17.5% loading, amortised monthly" 
        ausVal={costs.auLeave} phVal={0} />
      <ComparisonRow label="Sick Leave Provision" sub="10 days per year, amortised" 
        ausVal={costs.auSick} phVal={0} />
      <ComparisonRow label="Recruitment Cost" sub="Typical agency fee, amortised over 12 months" 
        ausVal={costs.auRecruitment} phVal={costs.phRecruitment} />
      <ComparisonRow label="SEO Tools & Software" sub="Ahrefs, SEMrush, Screaming Frog, etc." 
        ausVal={costs.tools} phVal={costs.tools} />
      <ComparisonRow label="Office / Desk Space" sub="Desk, utilities, equipment contribution" 
        ausVal={costs.auOffice} phVal={0} />
      <ComparisonRow label="HR & Payroll Admin" sub="Time cost, software, compliance" 
        ausVal={costs.auHR} phVal={0} />
      <ComparisonRow label="Workers Comp Insurance" sub="Approx 1.5% of wage, amortised" 
        ausVal={costs.auWorkersComp} phVal={0} />

      <div className={`${styles.comparisonRow} ${styles.totalRow}`}>
        <div className={styles.rowLabel}>
          <strong style={{fontSize: '17px', color: 'var(--white)'}}>TOTAL MONTHLY COST</strong>
          <span>Everything included</span>
        </div>
        <div className={`${styles.rowVal} ${styles.ausVal} ${styles.total}`}>
          AU${auTotal.toLocaleString()}
        </div>
        <div className={`${styles.rowVal} ${styles.phVal} ${styles.total}`}>
          AU${phTotal.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, sub, ausVal, phVal }: { label: string; sub: string; ausVal: number; phVal: number }) {
  return (
    <div className={styles.comparisonRow}>
      <div className={styles.rowLabel}>
        <strong>{label}</strong>
        <span>{sub}</span>
      </div>
      <div className={`${styles.rowVal} ${styles.ausVal}`}>
        {ausVal > 0 ? `AU$${ausVal.toLocaleString()}` : <span className={styles.zero}>AU$0</span>}
      </div>
      <div className={`${styles.rowVal} ${styles.phVal}`}>
        {phVal > 0 ? `AU$${phVal.toLocaleString()}` : <span className={styles.zero}>AU$0</span>}
      </div>
    </div>
  );
}
