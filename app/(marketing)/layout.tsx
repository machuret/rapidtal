import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import '@/app/css/base.css';
import '@/app/css/layout.css';
import '@/app/css/nav.css';
import '@/app/css/hero.css';
import '@/app/css/sections.css';
import '@/app/css/responsive.css';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
