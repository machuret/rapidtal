'use client';

import { useState } from 'react';
import { BudgetInputs, EMPTY_BUDGET, calculateBudget } from '@/lib/hiring-budget';
import s from './guides.module.css';

const fields: { key: keyof BudgetInputs; label: string }[] = [
  { key: 'pay', label: 'Monthly worker pay or service charge' },
  { key: 'tools', label: 'Monthly software and tools' },
  { key: 'otherMonthly', label: 'Other monthly costs: benefits, payroll, support, management' },
  { key: 'recruitment', label: 'One-off recruitment or setup fee' },
  { key: 'equipment', label: 'One-off equipment cost' },
  { key: 'otherOneOff', label: 'Other one-off costs' },
];
const initial = Object.fromEntries(fields.map(({ key }) => [key, ''])) as Record<keyof BudgetInputs, string>;
const format = (value: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }).format(value);

export default function HiringBudget() {
  const [values, setValues] = useState([initial, initial]);
  const parsed = values.map(value => Object.fromEntries(fields.map(({ key }) => [key, value[key] === '' ? 0 : Number(value[key])])) as unknown as BudgetInputs);
  const invalid = parsed.some(budget => Object.values(budget).some(value => !Number.isFinite(value) || value < 0 || value > 100000000));
  const totals = parsed.map(budget => calculateBudget(invalid ? EMPTY_BUDGET : budget));
  const ready = !invalid && totals.every(total => total.firstYear > 0);
  const difference = totals[0].firstYear - totals[1].firstYear;
  return <>
    <p className={s.note} id="budget-help">Enter your own figures in AUD. Blank fields count as zero, so include all applicable costs before comparing. Do not enter the same included cost twice. No figures are sent or saved.</p>
    <form className={s.form} aria-describedby="budget-help" onSubmit={event => event.preventDefault()}>
      {['Current or alternative arrangement', 'Proposed remote hire'].map((title, i) => <fieldset key={title}><legend>{title}</legend>
        {fields.map(({ key, label }) => <label className={s.field} key={key} htmlFor={`${i}-${key}`}>{label} (AUD)
          <input id={`${i}-${key}`} type="number" min="0" max="100000000" step="0.01" inputMode="decimal" placeholder="0" value={values[i][key]}
            aria-invalid={parsed[i][key] < 0 || !Number.isFinite(parsed[i][key]) || parsed[i][key] > 100000000}
            onChange={event => setValues(previous => previous.map((budget, index) => index === i ? { ...budget, [key]: event.target.value } : budget))} />
        </label>)}
      </fieldset>)}
    </form>
    {invalid && <p role="alert">Use amounts between 0 and 100,000,000 in each field.</p>}
    <section aria-label="Budget comparison" aria-live="polite" aria-atomic="true">
      {ready ? <>
        <dl className={s.results}>
          <div className={s.result}><dt>Alternative: first year</dt><dd>{format(totals[0].firstYear)}</dd></div>
          <div className={s.result}><dt>Remote hire: first year</dt><dd>{format(totals[1].firstYear)}</dd></div>
          <div className={s.result}><dt>{difference < 0 ? 'Remote hire costs more by' : 'Estimated first-year saving'}</dt><dd>{format(Math.abs(difference))}</dd></div>
        </dl>
        <p className={s.note}>Recurring annual subtotal: {format(totals[0].recurringYear)} for the alternative and {format(totals[1].recurringYear)} for the remote hire. This excludes future replacements, renewals, and changes to your inputs.</p>
      </> : !invalid && <p className={s.note}>Enter at least one cost for each arrangement to see the comparison.</p>}
    </section>
    <button className={s.button} type="button" onClick={() => setValues([initial, initial])}>Clear figures</button>
  </>;
}
