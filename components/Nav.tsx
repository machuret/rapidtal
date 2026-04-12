'use client';

import { useEffect, useState } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={scrolled ? 'nav-scrolled' : ''}>
      <a href="/" className="logo">RAPID<span>TAL</span></a>

      <ul className="nav-links">
        <li><a href="#roles" onClick={close}>Roles</a></li>
        <li><a href="#process" onClick={close}>How It Works</a></li>
        <li><a href="#pricing" onClick={close}>Pricing</a></li>
        <li><a href="#about" onClick={close}>About</a></li>
        <li><a href="/case-studies" onClick={close}>Case Studies</a></li>
        <li><a href="/calculator" className="nav-cta" onClick={close}>Saving$ Calculator →</a></li>
      </ul>

      <button
        type="button"
        className={`hamburger${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <ul>
            <li><a href="#roles" onClick={close}>Roles</a></li>
            <li><a href="#process" onClick={close}>How It Works</a></li>
            <li><a href="#pricing" onClick={close}>Pricing</a></li>
            <li><a href="#about" onClick={close}>About</a></li>
            <li><a href="/case-studies" onClick={close}>Case Studies</a></li>
            <li><a href="/calculator" onClick={close} className="mobile-cta">Saving$ Calculator →</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
