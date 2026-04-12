import dynamic from 'next/dynamic';
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import CursorTracker from "@/components/CursorTracker";
import ScrollReveal from "@/components/ScrollReveal";

// Dynamic imports for below-the-fold components
const MarqueeStrip = dynamic(() => import("@/components/MarqueeStrip"), { ssr: true });
const Problem = dynamic(() => import("@/components/Problem"), { ssr: true });
const Process = dynamic(() => import("@/components/Process"), { ssr: true });
const Roles = dynamic(() => import("@/components/Roles"), { ssr: true });
const VsTable = dynamic(() => import("@/components/VsTable"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true });
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: true });
const FinalCta = dynamic(() => import("@/components/FinalCta"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const StickyCtaBar = dynamic(() => import("@/components/StickyCtaBar"));

export default function Home() {
  return (
    <>
      <CursorTracker />
      <ScrollReveal />
      <Nav />
      <main id="main-content">
        <Hero />
        <StatsBar />
        <MarqueeStrip />
        <Problem />
        <Process />
        <Roles />
        <VsTable />
        <Testimonials />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
      <StickyCtaBar />
    </>
  );
}
