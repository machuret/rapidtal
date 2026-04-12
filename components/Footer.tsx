export default function Footer() {
  return (
    <footer id="about">
      <div className="footer-top">
        <div>
          <a href="#" className="footer-logo">RAPID<span>TAL</span></a>
          <p className="footer-desc">We help Australian businesses hire elite Filipino marketing and sales talent directly — no middlemen, no monthly fees, no compromises.</p>
        </div>
        <div>
          <div className="footer-col-title">Roles</div>
          <ul className="footer-links">
            <li><a href="#">Marketing</a></li>
            <li><a href="#">Sales &amp; SDR</a></li>
            <li><a href="#">Content &amp; Creative</a></li>
            <li><a href="#">Revenue Ops</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">How We Hire</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Apply for a Job</a></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li><a href="tel:0488845951">0488 845 951</a></li>
            <li><a href="mailto:hello@rapidtal.com">hello@rapidtal.com</a></li>
            <li><a href="#contact">Book a Call</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Rapid Tal — All rights reserved.</span>
        <span><a href="#">Privacy Policy</a> · <a href="#">Terms &amp; Conditions</a></span>
      </div>
    </footer>
  );
}
