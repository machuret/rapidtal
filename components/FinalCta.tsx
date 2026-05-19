'use client';

import { useCurrency } from './CurrencyProvider';

export default function FinalCta() {
  const { phone } = useCurrency();
  return (
    <section className="final-cta" id="contact">
      <div className="final-cta-inner">
        <div>
          <h2 className="final-cta-heading">READY TO BUILD<br />A <em>MACHINE</em><br />THAT SELLS?</h2>
          <p className="final-cta-sub">Get a shortlist of elite marketing and sales talent in 18 days. One fee. You own the hire. We back it for 6 months.</p>
        </div>
        <div className="final-cta-actions">
          <a href="https://calendly.com/machuret/rapid-tal" className="btn-dark">Book a Call Now →</a>
          <a href={`tel:${phone}`} className="final-cta-phone">{phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}</a>
        </div>
      </div>
    </section>
  );
}
