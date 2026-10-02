import s from '@/app/(marketing)/driving-schools/page.module.css';

export default function EmailCaptureForm() {
  return (
    <div className={s.emailForm}>
      <a
        href="mailto:hello@rapidtal.com?subject=Driving%20school%20hiring%20enquiry"
        className={s.emailBtn}
      >
        Email hello@rapidtal.com →
      </a>
    </div>
  );
}
