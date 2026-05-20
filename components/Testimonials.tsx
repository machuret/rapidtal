const testimonials = [
  {
    initials: "JM",
    name: "James M.",
    company: "SaaS Founder, Sydney",
    color: "#FF5500",
    text: "We hired a paid ads specialist through Rapid Tal. She was running campaigns by week two and cut our CPL by 40% within the first month. Absurd value for money.",
  },
  {
    initials: "TC",
    name: "Tara C.",
    company: "Head of Sales, Melbourne Agency",
    color: "#e04400",
    text: "Three SDRs in 30 days. All hitting quota. The process was shockingly fast — shortlist landed in my inbox within 10 days. I'll never hire locally for outbound again.",
  },
  {
    initials: "RD",
    name: "Ryan D.",
    company: "Marketing Director, Brisbane",
    color: "#c73d00",
    text: "The content strategist they found us produces better work than the $95K local hire we let go. I wish I'd done this two years ago. Genuinely transformative for our team.",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="reveal">
        <span className="section-label">— What Clients Say</span>
        <h2 className="section-heading">THE PROOF<br />IS IN THE <em>PIPELINE.</em></h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((t) => (
          <div className="testi-card reveal" key={t.initials}>
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: t.color }}>{t.initials}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-company">{t.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
