'use client';

import s from '@/app/(marketing)/driving-schools/page.module.css';

export default function EmailCaptureForm() {
  return (
    <form
      className={s.emailForm}
      onSubmit={(e) => e.preventDefault()}
      aria-label="Email lead capture"
    >
      <input
        type="email"
        placeholder="your@email.com"
        required
        className={s.emailInput}
        aria-label="Your email address"
      />
      <button type="submit" className={s.emailBtn}>Send Me the Info →</button>
    </form>
  );
}
