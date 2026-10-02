import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Explore Hiring Roles | Rapid Tal',
  description: 'Explore marketing, sales, creative, and operations roles available through Rapid Tal.',
  alternates: { canonical: '/roles' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
