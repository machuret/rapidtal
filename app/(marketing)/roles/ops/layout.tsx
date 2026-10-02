import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Revenue Operations Roles | Rapid Tal',
  description: 'Explore CRM, automation, reporting, and operations roles.',
  alternates: { canonical: '/roles/ops' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
