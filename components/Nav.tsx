'use client';

import { useEffect, useState } from 'react';
import CurrencyToggle from './CurrencyToggle';
import s from './Nav.module.css';

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
    <nav className={`${s.nav}${scrolled ? ' ' + s.scrolled : ''}`}>
      <a href="/" className={s.logo}>RAPID<span>TAL</span></a>

      <CurrencyToggle />

      <ul className={s.navLinks}>
        <li><a href="/#roles" onClick={close}>Roles</a></li>
        <li><a href="/#process" onClick={close}>How It Works</a></li>
        <li><a href="/#pricing" onClick={close}>Pricing</a></li>
        <li><a href="/#about" onClick={close}>About</a></li>
        <li><a href="/case-studies" onClick={close}>Case Studies</a></li>
        <li><a href="/calculator" className={s.navCta} onClick={close}>Saving$ Calculator →</a></li>
      </ul>

      <button
        type="button"
        className={`${s.hamburger}${open ? ' ' + s.open : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      {open && (
        <div className={s.mobileMenu} role="dialog" aria-modal="true" aria-label="Navigation menu">
          <ul>
            <li><a href="/#roles" onClick={close}>Roles</a></li>
            <li><a href="/#process" onClick={close}>How It Works</a></li>
            <li><a href="/#pricing" onClick={close}>Pricing</a></li>
            <li><a href="/#about" onClick={close}>About</a></li>
            <li><a href="/case-studies" onClick={close}>Case Studies</a></li>
            <li><a href="/calculator" onClick={close} className={s.mobileCta}>Saving$ Calculator →</a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
