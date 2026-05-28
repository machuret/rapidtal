'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './calculator.module.css';
import CursorTracker from '@/components/CursorTracker';
import { useCurrency } from '@/components/CurrencyProvider';
import { formatPrice } from '@/lib/currency';
import type { Currency } from '@/lib/currency';

const CALENDLY_URL =
  'https://calendly.com/machuret/rapid-tal?hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=ff7100';

/* ─── TYPES ──────────────────────────────────────────────────────────── */
interface Option {
  icon: string;
  label: string;
  sub: string;
  qualify: boolean;
}

interface Question {
  id: number;
  headline: React.ReactNode;
  sub: string;
  grid: 'two-col' | 'single-col';
  options: Option[];
}

interface Answer {
  val: string;
  qualify: boolean;
}

interface DisqualifyEntry {
  reason: string;
  rec: string;
}

/* ─── DATA ───────────────────────────────────────────────────────────── */
function getQuestions(currency: Currency): Question[] {
  const sym = currency === 'USD' ? 'US$' : 'AU$';
  const low = currency === 'USD' ? '910' : '1,400';
  const high = currency === 'USD' ? '1,170' : '1,800';
  const fee = formatPrice(3990, currency);
  return [
    {
      id: 1,
      headline: <>What role are you looking to <em>HIRE?</em></>,
      sub: 'We specialise exclusively in revenue-generating roles. Pick the closest match.',
      grid: 'two-col',
      options: [
        { icon: '📈', label: 'Marketing Specialist',   sub: 'Paid ads, SEO, email, social, growth',          qualify: true  },
        { icon: '📞', label: 'Sales / SDR',            sub: 'Outbound, closing, account management',          qualify: true  },
        { icon: '✍️', label: 'Content & Creative',     sub: 'Copywriting, video, design, strategy',           qualify: true  },
        { icon: '🤷', label: 'Something Else',          sub: 'Admin, IT, finance, ops...',                     qualify: false },
      ],
    },
    {
      id: 2,
      headline: <>How are you <em>CURRENTLY</em> handling this role?</>,
      sub: 'Be honest — there\'s no wrong answer here.',
      grid: 'two-col',
      options: [
        { icon: '💸', label: 'Paying an Agency',         sub: 'Monthly retainer, probably $2–6K+',            qualify: true },
        { icon: '🔄', label: 'Freelancer / Contractor',  sub: 'Inconsistent, hard to manage',                 qualify: true },
        { icon: '🏢', label: 'Local Full-Time Hire',     sub: 'Expensive and hard to replace',                qualify: true },
        { icon: '😤', label: 'Nobody — Doing It Myself', sub: 'Wearing too many hats',                        qualify: true },
      ],
    },
    {
      id: 3,
      headline: <>What&apos;s your <em>BIGGEST</em> frustration right now?</>,
      sub: 'Pick the one that stings the most.',
      grid: 'two-col',
      options: [
        { icon: '🤑', label: 'Paying Too Much',          sub: 'Not enough ROI for what I\'m spending',        qualify: true },
        { icon: '❌', label: 'Poor Quality Work',         sub: 'Deliverables are weak, targets missed',        qualify: true },
        { icon: '👻', label: 'No Accountability',         sub: 'They disappear when results are bad',          qualify: true },
        { icon: '📉', label: "Can't Scale Fast Enough",   sub: 'Growth is blocked by hiring bottlenecks',      qualify: true },
      ],
    },
    {
      id: 4,
      headline: <>What&apos;s the #1 <em>GOAL</em> with this hire?</>,
      sub: 'What does success actually look like for you?',
      grid: 'single-col',
      options: [
        { icon: '✂️', label: 'Cut Costs Without Cutting Quality', sub: 'Same output or better, significantly less spend', qualify: true },
        { icon: '🚀', label: 'Scale Marketing / Sales Output',    sub: 'More pipeline, more revenue, more fast',           qualify: true },
        { icon: '🔁', label: 'Replace a Bad Hire or Agency',      sub: 'Fed up. Need someone who actually delivers.',      qualify: true },
        { icon: '🏗️', label: 'Build a Team From Scratch',         sub: 'Starting fresh, want it done right',               qualify: true },
      ],
    },
    {
      id: 5,
      headline: <>What&apos;s your <em>MONTHLY BUDGET</em> for this role?</>,
      sub: `Our talent earns ${sym}${low}–${high}/month. Our one-time placement fee is ${fee}. Be real with us.`,
      grid: 'single-col',
      options: [
        { icon: '😬', label: 'Under $1,500 / month',    sub: 'Might be a stretch for our talent level',               qualify: false },
        { icon: '✅', label: '$1,500 – $2,500 / month', sub: 'This is the sweet spot for most of our placements',      qualify: true  },
        { icon: '💪', label: '$2,500 – $4,000 / month', sub: 'Senior talent, complex roles, high output',              qualify: true  },
        { icon: '🔥', label: '$4,000+ / month',          sub: 'We can build you a team for that',                       qualify: true  },
      ],
    },
    {
      id: 6,
      headline: <>How soon are you looking to <em>HIRE?</em></>,
      sub: 'We average 18 days from brief to shortlist. We work with people who are ready to move.',
      grid: 'single-col',
      options: [
        { icon: '⚡', label: 'ASAP — Within 2 Weeks', sub: 'We can move fast. Let\'s go.',                       qualify: true  },
        { icon: '📅', label: 'Within 30 Days',         sub: 'Ready to kick things off now',                       qualify: true  },
        { icon: '🗓️', label: '1–3 Months',             sub: 'Planning ahead, want to get educated',               qualify: true  },
        { icon: '👀', label: 'Just Researching',        sub: 'No urgency right now',                               qualify: false },
      ],
    },
  ];
}

function getDisqualifyMap(currency: Currency): Record<number, DisqualifyEntry> {
  const sym = currency === 'USD' ? 'US$' : 'AU$';
  const minSalary = currency === 'USD' ? '975' : '1,500';
  const fee = formatPrice(3990, currency);
  return {
    1: { reason: 'Role type outside our scope',    rec: 'We specialise in marketing, sales, and revenue-generating roles only. Check Hunt St or Remote Staff for non-marketing/sales roles.' },
    5: { reason: 'Budget below our talent range',  rec: `Our talent starts at ${sym}${minSalary}/month — below this we can't place the calibre we stand behind. Save up to our ${fee} placement fee, then come back. We'll be here.` },
    6: { reason: 'No hiring urgency right now',    rec: 'We work best with founders who have a live role to fill. Download our free guide and revisit when you have a real hire to make.' },
  };
}

const TOTAL_STEPS = 7;

/* ─── COMPONENT ──────────────────────────────────────────────────────── */
function CalculatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();

  const QUESTIONS = getQuestions(currency);
  const DISQUALIFY_MAP = getDisqualifyMap(currency);

  const [screen, setScreen]               = useState<'intro' | 'question' | 'form' | 'disqualified'>('intro');
  const [questionIdx, setQuestionIdx]     = useState(0);
  const [answers, setAnswers]             = useState<Record<number, Answer>>({});
  const [disqualify, setDisqualify]       = useState<DisqualifyEntry | null>(null);
  const [animating, setAnimating]         = useState(false);
  const [exiting, setExiting]             = useState(false);


  const currentQ = QUESTIONS[questionIdx];
  const stepNum  = questionIdx + 1;
  const progressPct = screen === 'intro' ? 0
    : (screen === 'form' || screen === 'disqualified') ? 100
    : (stepNum / TOTAL_STEPS) * 100;

  const progressLabel = screen === 'intro' ? 'Find Your Hire'
    : (screen === 'form' || screen === 'disqualified') ? 'Done ✓'
    : `${stepNum} / ${TOTAL_STEPS}`;

  /* sync URL with calculator state on mount */
  useEffect(() => {
    const step = searchParams.get('step');
    if (step === 'contact') {
      setScreen('form');
    } else if (step) {
      const n = parseInt(step, 10);
      if (n >= 1 && n <= 6) {
        setQuestionIdx(n - 1);
        setScreen('question');
      }
    }

    if (typeof window !== 'undefined' && (window as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as { fbq?: (...args: unknown[]) => void }).fbq!('track', 'ViewContent', {
        content_name: 'Savings Calculator',
        content_category: 'Calculator',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* update URL when screen or question changes */
  useEffect(() => {
    if (screen === 'intro') {
      router.replace('/calculator', { scroll: false });
    } else if (screen === 'question') {
      router.replace(`/calculator?step=${questionIdx + 1}`, { scroll: false });
    } else if (screen === 'form') {
      router.replace('/calculator?step=contact', { scroll: false });
    }
  }, [screen, questionIdx, router]);

  /* Track Lead event when booking screen appears */
  useEffect(() => {
    if (screen === 'form' && typeof window !== 'undefined' && (window as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as { fbq?: (...args: unknown[]) => void }).fbq!('track', 'Lead', {
        content_name: 'Calculator Booking',
        content_category: 'Calendly',
      });
    }
  }, [screen]);

  const transition = useCallback((fn: () => void) => {
    if (animating) return;
    setAnimating(true);
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      fn();
      setAnimating(false);
    }, 420);
  }, [animating]);

  const selectOption = useCallback((opt: Option, qId: number) => {
    setAnswers(prev => ({ ...prev, [qId]: { val: opt.label, qualify: opt.qualify } }));

    if (!opt.qualify) {
      const entry = DISQUALIFY_MAP[qId] ?? { reason: 'Outside our scope', rec: 'Visit rapidtal.com for more info.' };
      setDisqualify(entry);
    }

    setTimeout(() => {
      transition(() => {
        if (!opt.qualify) {
          setScreen('disqualified');
        } else if (questionIdx < QUESTIONS.length - 1) {
          setQuestionIdx(questionIdx + 1);
          setScreen('question');
        } else {
          setScreen('form');
        }
      });
    }, 300);
  }, [DISQUALIFY_MAP, QUESTIONS.length, questionIdx, transition]);


  /* ─── RENDER ────────────────────────────────────────────────────── */
  return (
    <>
      <CursorTracker />
      <div className={styles.root}>
        {/* ORANGE TOP BAR */}
        <div className={styles.topBar} />

        {/* HEADER */}
        <header className={styles.header}>
          <a href="/" className={styles.logo}>RAPID<span>TAL</span></a>

          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
            <div className={styles.progressLabel}>{progressLabel}</div>
          </div>

          <div className={styles.trustBadges}>
            <span className={styles.trustBadge}>18 day avg hire</span>
            <span className={styles.trustBadge}>94% retention</span>
            <span className={styles.trustBadge}>6-mo guarantee</span>
          </div>
        </header>

        {/* CALCULATOR MAIN */}
        <main className={styles.quizMain}>
          <div className={`${styles.screen} ${exiting ? styles.exitLeft : styles.active}`}>

            {/* ── INTRO ─────────────────────────────────────────────── */}
            {screen === 'intro' && (
              <div className={styles.introLayout}>
                <div>
                  <div className={styles.introEyebrow}>Find Your Hire</div>
                  <h1 className={styles.introHeadline}>
                    STOP PAYING FOR<br />
                    MARKETING EXPERTS<br />
                    TO <span className={styles.accent}>RIP YOU OFF.</span>
                  </h1>
                  <p className={styles.introBody}>
                    Answer 7 quick questions. We&apos;ll tell you exactly whether Rapid Tal is right for you — no fluff, no sales pressure.
                  </p>
                  <ul className={styles.introFeatures}>
                    <li>Takes under 2 minutes</li>
                    <li>Sales &amp; Marketing roles only</li>
                    <li>If we&apos;re a fit, you&apos;ll know instantly</li>
                  </ul>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => transition(() => { setScreen('question'); setQuestionIdx(0); })}
                  >
                    Start the Calculator →
                  </button>
                </div>
                <div className={styles.statCards}>
                  {[
                    { num: '70%',   label: 'Average savings vs. local hire or agency' },
                    { num: '18',    label: 'Days average from brief to shortlist' },
                    { num: formatPrice(3990, currency), label: 'One-time placement fee. No ongoing costs. Ever.' },
                    { num: '6 mo', label: 'Replacement guarantee if the hire doesn\'t work out' },
                  ].map((s) => (
                    <div key={s.num} className={styles.statCard}>
                      <div className={styles.statCardNum}>{s.num}</div>
                      <div className={styles.statCardLabel}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── QUESTION ──────────────────────────────────────────── */}
            {screen === 'question' && currentQ && (
              <div className={styles.screenInner}>
                <div className={styles.screenWatermark}>{stepNum}</div>
                <div className={styles.stepLabel}>Step {stepNum} of 7</div>
                <div className={styles.qLayout}>
                  <div className={styles.qRule} />
                  <div className={styles.qContent}>
                    <h2 className={styles.qHeadline}>{currentQ.headline}</h2>
                    <p className={styles.qSub}>{currentQ.sub}</p>
                    <div className={`${styles.optionsGrid} ${currentQ.grid === 'single-col' ? styles.singleCol : ''}`}>
                      {currentQ.options.map((opt) => {
                        const isSelected = answers[currentQ.id]?.val === opt.label;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            className={`${styles.optionCard} ${isSelected ? styles.selected : ''} ${!opt.qualify ? styles.disqualifyCard : ''}`}
                            onClick={() => selectOption(opt, currentQ.id)}
                          >
                            <span className={styles.optionIcon}>{opt.icon}</span>
                            <span>
                              <span className={styles.optionLabel}>{opt.label}</span>
                              <span className={styles.optionSub}>{opt.sub}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── BOOKING (Calendly) ────────────────────────────────── */}
            {screen === 'form' && (
              <div className={styles.screenInner}>
                <div className={`${styles.resultBadge} ${styles.qualified}`}>You&apos;re Qualified</div>
                <h2 className={styles.resultHeadline}>
                  BOOK YOUR<br /><em>DISCOVERY CALL.</em>
                </h2>
                <p className={styles.resultBody}>
                  Pick a time that works — 20 minutes, no pitch, no pressure. Just a real conversation about your hire.
                </p>
                <div className={styles.calendlyWrap}>
                  <iframe
                    src={CALENDLY_URL}
                    className={styles.calendlyFrame}
                    title="Book a discovery call"
                    frameBorder="0"
                  />
                </div>
              </div>
            )}

            {/* ── DISQUALIFIED ──────────────────────────────────────── */}
            {screen === 'disqualified' && (
              <div className={styles.screenInner}>
                <div className={`${styles.resultBadge} ${styles.disqualified}`}>Not quite the right fit — yet</div>
                <h2 className={styles.resultHeadline}>
                  HONEST ANSWER:<br />
                  <em>NOT RIGHT<br />NOW.</em>
                </h2>
                <p className={styles.resultBody}>
                  Based on your answers, we don&apos;t think we&apos;re the best fit for your situation at this moment — and we&apos;d rather tell you that upfront than waste your time. Here&apos;s why, and what to do instead.
                </p>
                {disqualify && (
                  <div className={styles.disqCard}>
                    <div className={styles.disqReason}>{disqualify.reason}</div>
                    <div className={styles.disqRec}>{disqualify.rec}</div>
                  </div>
                )}
                <p className={styles.resultSub}>
                  We&apos;ll still send you our free guide: <strong>&quot;How to Hire Elite Filipino Marketing Talent Without Getting Burned&quot;</strong> — so when you&apos;re ready, you know exactly what to do. Check your inbox.
                </p>
                <div className={`${styles.resultCtaWrap} ${styles.mt}`}>
                  <a href="/" className={`${styles.btnGhost} ${styles.btnFull}`}>Visit Rapid Tal Anyway →</a>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={<div className={styles.fallback} />}>
      <CalculatorContent />
    </Suspense>
  );
}
