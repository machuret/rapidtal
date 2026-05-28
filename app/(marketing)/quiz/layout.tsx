import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Rapid Tal — Find Your Hire',
  description: 'Answer 7 quick questions to find out if Rapid Tal is right for you. Elite Filipino marketing and sales talent. 18-day placement. AU$3,990 flat fee.',
  alternates: { canonical: '/quiz' },
  openGraph: {
    title: 'Rapid Tal — Find Your Hire',
    description: 'Prequalification quiz — find out if we\'re a fit in under 2 minutes.',
    type: 'website',
    url: 'https://rapidtal.com/quiz',
    siteName: 'Rapid Tal',
  },
  twitter: {
    card: 'summary',
    title: 'Rapid Tal — Find Your Hire',
    description: '7 questions. Instant result. Find out if Rapid Tal is right for your next hire.',
  },
};

export default function QuizLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
