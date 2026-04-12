import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Rapid Tal — Hiring Cost Calculator',
  description: 'Answer 7 quick questions to find out if Rapid Tal is right for you. Elite Filipino marketing and sales talent. 18-day placement. AU$3,990 flat fee.',
  alternates: { canonical: '/calculator' },
  openGraph: {
    title: 'Rapid Tal — Hiring Cost Calculator',
    description: 'Prequalification calculator — find out if we\'re a fit in under 2 minutes.',
    type: 'website',
    url: 'https://rapidtal.com/calculator',
    siteName: 'Rapid Tal',
  },
  twitter: {
    card: 'summary',
    title: 'Rapid Tal — Hiring Cost Calculator',
    description: '7 questions. Instant result. Find out if Rapid Tal is right for your next hire.',
  },
};

export default function CalculatorLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
