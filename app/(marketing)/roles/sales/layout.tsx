import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sales Roles | Rapid Tal',
  description: 'Explore sales development, account executive, and lead generation roles.',
  alternates: { canonical: '/roles/sales' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
