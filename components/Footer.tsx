'use client';

import { useCurrency } from './CurrencyProvider';

export default function Footer() {
  const { phone } = useCurrency();
  return (
    <footer id="about">
      <div className="footer-top">
        <div>
          <a href="/" className="footer-logo">RAPID<span>TAL</span></a>
          <p className="footer-desc">We help Australian businesses hire elite Filipino marketing and sales talent directly — no middlemen, no monthly fees, no compromises.</p>
        </div>
        <div>
          <div className="footer-col-title">Roles</div>
          <ul className="footer-links">
            <li><a href="/roles/marketing">Marketing</a></li>
            <li><a href="/roles/sales">Sales &amp; SDR</a></li>
            <li><a href="/roles/content">Content &amp; Creative</a></li>
            <li><a href="/roles/ops">Revenue Ops</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><a href="/guides">Hiring Guides</a></li>
            <li><a href="/#about">Contact</a></li>
            <li><a href="/how-we-hire">How We Hire</a></li>
            <li><a href="/#pricing">Pricing</a></li>
            <li><a href="mailto:hello@rapidtal.com?subject=Candidate%20enquiry" target="_blank" rel="noopener noreferrer">Candidate Enquiries</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li><a href={`tel:${phone}`}>{phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}</a></li>
            <li><a href="mailto:hello@rapidtal.com">hello@rapidtal.com</a></li>
            <li><a href="/#book-call">Book a Call</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Rapid Tal — All rights reserved.</span>
        <span><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms &amp; Conditions</a></span>
      </div>
    </footer>
  );
}
