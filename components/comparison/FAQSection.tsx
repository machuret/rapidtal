'use client';

import { useState } from 'react';
import styles from './FAQSection.module.css';

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "How long does hiring take?",
    answer: "18 days on average from brief to start date. We shortlist 3-5 pre-vetted candidates within 7 days, you interview, make an offer, and they start within 2 weeks. No 3-month recruitment cycles."
  },
  {
    question: "What if they don't work out?",
    answer: "We offer a 90-day performance guarantee. If your hire isn't meeting expectations within the first 3 months, we'll replace them at no additional fee. We also provide ongoing support to ensure success."
  },
  {
    question: "Do I need to provide equipment?",
    answer: "No. Your hire works from their own setup with high-speed internet, backup power, and professional equipment. You provide software licenses (like Ahrefs, WordPress access), but hardware is on them."
  },
  {
    question: "What timezone do they work?",
    answer: "Philippines is GMT+8, which overlaps well with Australian business hours. Most hires work 9am-5pm AEST/AEDT, giving you 4-6 hours of real-time collaboration daily. Async work covers the rest."
  },
  {
    question: "How do payments work?",
    answer: "You pay us one monthly invoice in AUD. We handle all Philippines payroll, tax compliance, and employment obligations. No international transfers, no currency risk, no admin burden on your end."
  },
  {
    question: "What's included in the $3,990 fee?",
    answer: "Everything: recruitment, vetting, interviews, onboarding, ongoing HR support, and our 90-day guarantee. One fee. No retainers, no percentage of salary, no hidden costs."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.tag}>
            <span className={styles.tagLine}></span>
            Common Questions
          </div>
          <h2 className={styles.title}>EVERYTHING YOU NEED TO KNOW.</h2>
        </div>
        
        <div className={styles.faqList}>
          {FAQS.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${openIndex === index ? styles.open : ''}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className={styles.icon}>{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
