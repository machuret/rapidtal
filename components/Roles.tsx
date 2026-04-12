'use client';

import { useState } from 'react';

type Tab = 'marketing' | 'sales' | 'content' | 'ops';

const TABS: { id: Tab; label: string }[] = [
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'content', label: 'Content & Creative' },
  { id: 'ops', label: 'Revenue Ops' },
];

const ROLES: Record<Tab, { title: string; amount: string; save: string }[]> = {
  marketing: [
    { title: 'Paid Ads Specialist', amount: 'AU$1,600', save: 'Save up to 78%' },
    { title: 'SEO Strategist', amount: 'AU$1,700', save: 'Save up to 75%' },
    { title: 'Email Marketing Manager', amount: 'AU$1,500', save: 'Save up to 80%' },
    { title: 'Growth Hacker', amount: 'AU$1,800', save: 'Save up to 72%' },
    { title: 'Social Media Manager', amount: 'AU$1,400', save: 'Save up to 76%' },
    { title: 'Marketing Coordinator', amount: 'AU$1,400', save: 'Save up to 74%' },
    { title: 'CRM Manager', amount: 'AU$1,600', save: 'Save up to 77%' },
    { title: 'Performance Marketer', amount: 'AU$1,700', save: 'Save up to 73%' },
  ],
  sales: [
    { title: 'Sales Development Rep (SDR)', amount: 'AU$1,500', save: 'Save up to 79%' },
    { title: 'Account Executive', amount: 'AU$1,800', save: 'Save up to 71%' },
    { title: 'Sales Closer', amount: 'AU$1,700', save: 'Save up to 73%' },
    { title: 'Lead Generation Specialist', amount: 'AU$1,400', save: 'Save up to 76%' },
    { title: 'Outbound Sales Rep', amount: 'AU$1,500', save: 'Save up to 77%' },
    { title: 'Client Success Manager', amount: 'AU$1,600', save: 'Save up to 75%' },
  ],
  content: [
    { title: 'Copywriter', amount: 'AU$1,500', save: 'Save up to 78%' },
    { title: 'Content Strategist', amount: 'AU$1,600', save: 'Save up to 74%' },
    { title: 'Video Editor', amount: 'AU$1,400', save: 'Save up to 77%' },
    { title: 'Graphic Designer', amount: 'AU$1,400', save: 'Save up to 75%' },
    { title: 'UGC / Influencer Manager', amount: 'AU$1,500', save: 'Save up to 76%' },
    { title: 'Blog & SEO Writer', amount: 'AU$1,300', save: 'Save up to 80%' },
  ],
  ops: [
    { title: 'Marketing Ops Manager', amount: 'AU$1,700', save: 'Save up to 74%' },
    { title: 'HubSpot / Salesforce Admin', amount: 'AU$1,600', save: 'Save up to 76%' },
    { title: 'Data Analyst', amount: 'AU$1,700', save: 'Save up to 72%' },
    { title: 'Funnel Builder', amount: 'AU$1,600', save: 'Save up to 75%' },
    { title: 'Automation Specialist', amount: 'AU$1,700', save: 'Save up to 73%' },
    { title: 'Reporting & BI Specialist', amount: 'AU$1,600', save: 'Save up to 75%' },
  ],
};

export default function Roles() {
  const [active, setActive] = useState<Tab>('marketing');

  return (
    <section className="roles" id="roles">
      <div className="roles-intro">
        <div>
          <span className="section-label">— Roles We Fill</span>
          <h2 className="section-heading">BUILT FOR<br /><em>REVENUE</em><br />TEAMS.</h2>
        </div>
        <p className="roles-body">
          We specialise in the roles that directly impact your pipeline. Every candidate has international client exposure and a minimum 3 years experience. Salaries below are monthly estimates.
        </p>
      </div>

      <div className="roles-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab-btn${active === t.id ? ' active' : ''}`}
            onClick={() => setActive(t.id)}
            aria-pressed={active === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="roles-grid" role="list">
        {ROLES[active].map((r) => (
          <div className="role-card" key={r.title} role="listitem">
            <span className="role-title">{r.title}</span>
            <div className="role-salary">
              <span className="amount">{r.amount}</span>
              <span className="save">{r.save}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
