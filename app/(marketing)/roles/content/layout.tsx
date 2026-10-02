import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Content and Creative Roles | Rapid Tal',
  description: 'Explore writing, design, video, and content strategy roles.',
  alternates: { canonical: '/roles/content' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
