import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Link from 'next/link';
import CursorTracker from '@/components/CursorTracker';

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
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <CursorTracker />
      <ComparisonNav />
      
      <section style={{ 
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 4vw, 60px) clamp(60px, 8vw, 80px)',
        background: 'var(--black)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            marginBottom: 'clamp(16px, 2vw, 24px)',
            fontWeight: 500
          }}>
            — Our Process
          </span>
          
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)',
            lineHeight: 1.1,
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: 'clamp(24px, 3vw, 32px)',
            letterSpacing: '-0.02em'
          }}>
            HOW WE<br />
            <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>HIRE</em><br />
            FOR YOU.
          </h1>
          
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '700px'
          }}>
            Our recruitment process is built for speed and quality. No agencies. No markup. No 60-day hiring cycles. Just experienced candidates who can start contributing from day one.
          </p>
        </div>
      </section>

      <section style={{ 
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
        background: 'var(--black)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(48px, 6vw, 64px)' }}>
            {PROCESS_STEPS.map((step, idx) => (
              <div 
                key={step.number}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 'clamp(24px, 4vw, 48px)',
                  paddingBottom: idx < PROCESS_STEPS.length - 1 ? 'clamp(48px, 6vw, 64px)' : '0',
                  borderBottom: idx < PROCESS_STEPS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}
              >
                <div style={{ 
                  fontSize: 'clamp(48px, 6vw, 72px)',
                  fontWeight: 700,
                  color: 'var(--orange)',
                  lineHeight: 1,
                  opacity: 0.3,
                  minWidth: 'clamp(60px, 8vw, 100px)'
                }}>
                  {step.number}
                </div>
                
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    gap: '16px',
                    marginBottom: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <h2 style={{
                      fontSize: 'clamp(24px, 2.8vw, 32px)',
                      fontWeight: 700,
                      color: 'var(--white)',
                      letterSpacing: '-0.01em'
                    }}>
                      {step.title}
                    </h2>
                    <span style={{
                      fontSize: 'clamp(13px, 1.4vw, 15px)',
                      color: 'var(--orange)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}>
                      {step.duration}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: 'clamp(15px, 1.6vw, 18px)',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '24px'
                  }}>
                    {step.description}
                  </p>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {step.details.map((detail, detailIdx) => (
                      <li 
                        key={detailIdx}
                        style={{
                          fontSize: 'clamp(14px, 1.5vw, 16px)',
                          color: 'rgba(255,255,255,0.5)',
                          paddingLeft: '20px',
                          position: 'relative'
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: 'var(--orange)'
                        }}>→</span>
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

      <section style={{ 
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: 'clamp(32px, 4vw, 48px)',
            letterSpacing: '-0.01em',
            textAlign: 'center'
          }}>
            Our Guarantees
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(24px, 3vw, 32px)'
          }}>
            {GUARANTEES.map((guarantee) => (
              <div
                key={guarantee.title}
                style={{
                  padding: 'clamp(28px, 3.5vw, 36px)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              >
                <h3 style={{
                  fontSize: 'clamp(18px, 2vw, 22px)',
                  fontWeight: 700,
                  color: 'var(--orange)',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em'
                }}>
                  {guarantee.title}
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.6)',
                  margin: 0
                }}>
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ 
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
        background: 'var(--black)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            color: 'var(--white)',
            marginBottom: '24px',
            letterSpacing: '-0.01em'
          }}>
            Ready to Start Hiring?
          </h2>
          
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '32px'
          }}>
            Browse our roles or book a call to discuss your hiring needs.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              href="/roles"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'var(--orange)',
                color: 'var(--black)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                borderRadius: '4px',
                transition: 'transform 0.2s ease',
                letterSpacing: '0.02em'
              }}
            >
              Browse Roles
            </Link>
            
            <a 
              href="https://rapidtal.com/#contact"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'transparent',
                color: 'var(--white)',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em'
              }}
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>

      <ComparisonFooter />
    </div>
  );
}
