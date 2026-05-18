const steps = [
  {
    num: "01",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: "We Go Hunting",
    desc: "We blast your role to 300+ candidates, run targeted technical assessments specific to marketing and sales, and interview the top performers. You get a shortlist of 3–4 weapon-grade candidates.",
  },
  {
    num: "02",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
      </svg>
    ),
    title: "You Choose, You Own",
    desc: "Interview your shortlist. Pick your person. We handle contracts, onboarding guidance, and compliance. The hire is yours — not managed by us, not belonging to an agency. Yours.",
  },
  {
    num: "03",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: "Pay Them Fair. Keep the Rest.",
    desc: "Your new hire earns a competitive Filipino salary — no agency skimming their wage. You pay fair market rates directly. The savings you keep are real and immediate.",
  },
];

export default function Process() {
  return (
    <section className="process" id="process">
      <div className="reveal">
        <span className="section-label">— How It Works</span>
        <h2 className="section-heading">THREE STEPS TO<br /><em>DANGEROUS</em> TALENT.</h2>
      </div>
      <div className="process-grid">
        {steps.map((s) => (
          <div className="process-card reveal" key={s.num}>
            <div className="process-num">{s.num}</div>
            <div className="process-icon">{s.icon}</div>
            <div className="process-title">{s.title}</div>
            <p className="process-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
