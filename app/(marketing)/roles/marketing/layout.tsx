import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Marketing Roles | Rapid Tal',
  description: 'Explore paid advertising, SEO, email, and social media roles.',
  alternates: { canonical: '/roles/marketing' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
