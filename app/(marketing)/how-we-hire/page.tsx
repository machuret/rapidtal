import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import CursorTracker from '@/components/CursorTracker';
import s from './page.module.css';

const ComparisonNav = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonNav })), { ssr: true });
const ComparisonFooter = dynamic(() => import('@/components/comparison').then(mod => ({ default: mod.ComparisonFooter })), { ssr: true });

export const metadata: Metadata = {
  title: 'How We Hire | Our Recruitment Process | Rapid Tal',
  description: 'Our proven 18-day hiring process for finding experienced marketing, sales, and operations talent in the Philippines. No agencies. No markup. Direct hire only.',
  openGraph: {
    title: 'How We Hire | Our Recruitment Process',
    description: 'Our proven 18-day hiring process for finding experienced marketing, sales, and operations talent in the Philippines.',
  }
};

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Intake Brief',
    duration: 'Day 1',
    description: 'We start with a 45-minute call to understand your role requirements, team structure, and what good looks like. No generic job descriptions — we dig into the actual work, tools, and outcomes you need.',
    details: [
      'Role scope and responsibilities',
      'Required tools and platforms',
      'Team structure and reporting lines',
      'Success metrics and KPIs',
      'Cultural fit and working style'
    ]
  },
  {
    number: '02',
    title: 'Candidate Sourcing',
    duration: 'Days 2-7',
    description: 'We tap into our network of 12,000+ pre-vetted candidates in the Philippines, filtering for international client experience, technical skills, and minimum 3 years in role. No fresh graduates. No career switchers.',
    details: [
      'Search our proprietary candidate database',
      'Screen resumes for experience and skills',
      'Verify international client exposure',
      'Check tool proficiency and certifications',
      'Conduct initial phone screens'
    ]
  },
  {
    number: '03',
    title: 'Skills Assessment',
    duration: 'Days 8-12',
    description: 'Shortlisted candidates complete role-specific assessments — not generic aptitude tests. A paid ads specialist builds a campaign. An SDR writes a cold email sequence. A copywriter rewrites your homepage.',
    details: [
      'Role-specific practical assessments',
      'Real-world scenario testing',
      'Tool proficiency demonstrations',
      'Portfolio and work sample review',
      'Video introduction submissions'
    ]
  },
  {
    number: '04',
    title: 'Client Interviews',
    duration: 'Days 13-16',
    description: 'We present 3-5 qualified candidates with full profiles, assessment results, and video introductions. You interview them directly via Zoom. We facilitate, but you make the call.',
    details: [
      'Detailed candidate profiles delivered',
      'Assessment results and work samples',
      'Schedule and coordinate interviews',
      'Interview guide and question framework',
      'Reference checks on request'
    ]
  },
  {
    number: '05',
    title: 'Offer & Onboarding',
    duration: 'Days 17-18',
    description: 'Once you select your candidate, we handle the offer, contract, payroll setup, and onboarding logistics. They start on your agreed date, fully equipped and ready to contribute.',
    details: [
      'Employment contract preparation',
      'Salary and benefits negotiation',
      'Payroll and compliance setup',
      'Equipment and tool provisioning',
      'First-week onboarding support'
    ]
  }
];

const GUARANTEES = [
  {
    title: '18-Day Hire',
    description: 'From intake call to candidate start date in 18 days or less. No 60-day recruitment cycles.'
  },
  {
    title: '90-Day Replacement',
    description: 'If your hire doesn\'t work out in the first 90 days, we replace them at no additional cost.'
  },
  {
    title: 'Direct Employment',
    description: 'You hire them directly. No ongoing agency fees. No markup on salary. One flat fee.'
  },
  {
    title: 'Pre-Vetted Only',
    description: 'Every candidate has 3+ years experience and proven international client work. No juniors.'
  }
];

export default function HowWeHirePage() {
  return (
    <>
      <CursorTracker />
      <ComparisonNav />

      <section className={s.heroSection}>
        <div className={s.heroInner}>
          <span className={s.heroEyebrow}>
            — Our Process
          </span>

          <h1 className={s.heroTitle}>
            HOW WE<br />
            <em className={s.heroTitleAccent}>HIRE</em><br />
            FOR YOU.
          </h1>

          <p className={s.heroBody}>
            Our recruitment process is built for speed and quality. No agencies. No markup. No 60-day hiring cycles. Just experienced candidates who can start contributing from day one.
          </p>
        </div>
      </section>

      <section className={s.processSection}>
        <div className={s.processInner}>
          <div className={s.stepList}>
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.number}
                className={idx < PROCESS_STEPS.length - 1 ? s.stepRow : s.stepRowLast}
              >
                <div className={s.stepNumber}>
                  {step.number}
                </div>

                <div className={s.stepContent}>
                  <div className={s.stepHeader}>
                    <h2 className={s.stepTitle}>
                      {step.title}
                    </h2>
                    <span className={s.stepDuration}>
                      {step.duration}
                    </span>
                  </div>

                  <p className={s.stepDescription}>
                    {step.description}
                  </p>

                  <ul className={s.stepDetailList}>
                    {step.details.map((detail, detailIdx) => (
                      <li
                        key={detailIdx}
                        className={s.stepDetailItem}
                      >
                        <span className={s.stepDetailArrow}>→</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.guaranteesSection}>
        <div className={s.guaranteesInner}>
          <h2 className={s.guaranteesTitle}>
            Our Guarantees
          </h2>

          <div className={s.guaranteesGrid}>
            {GUARANTEES.map((guarantee) => (
              <div
                key={guarantee.title}
                className={s.guaranteeCard}
              >
                <h3 className={s.guaranteeCardTitle}>
                  {guarantee.title}
                </h3>
                <p className={s.guaranteeCardBody}>
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.ctaSection}>
        <div className={s.ctaInner}>
          <h2 className={s.ctaTitle}>
            Ready to Start Hiring?
          </h2>

          <p className={s.ctaBody}>
            Browse our roles or book a call to discuss your hiring needs.
          </p>

          <div className={s.ctaButtons}>
            <Link
              href="/roles"
              className={s.ctaBtnPrimary}
            >
              Browse Roles
            </Link>

            <a
              href="https://calendly.com/machuret/rapid-tal"
              className={s.ctaBtnSecondary}
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>

      <ComparisonFooter />
    </>
  );
}
