'use client';

/* ═══════════════════════════════════════════════════════════════════════════
 * Animated number counter for hero stat tiles.
 *
 * Accepts the raw stat string (e.g. "$220K", "3×", "14 days") and extracts
 * the leading/trailing numeric portion to count up from 0 on scroll-into-view.
 * Non-numeric prefixes ($) and suffixes (×, K, days, etc.) are preserved in
 * place — so "$220K" animates "0" → "220" while keeping the "$" prefix and
 * "K" suffix pinned.
 *
 * Runs once per mount (not on repeat scroll) via IntersectionObserver with
 * the `once` flag. Respects prefers-reduced-motion (freezes on final value).
 *
 * Falls back gracefully if we can't parse a number from the string — just
 * renders the raw value statically.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';

/** Splits "$220K" → { prefix: "$", num: 220, suffix: "K" } */
function parseStat(raw: string): { prefix: string; num: number; suffix: string } | null {
  // Match: optional non-digit prefix, digits (+ optional decimal), remainder
  const m = raw.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const num = parseFloat(m[2].replace(/,/g, ''));
  if (Number.isNaN(num)) return null;
  return { prefix: m[1], num, suffix: m[3] };
}

/** Ease-out cubic — feels quick at start then gently settles on target */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function AnimatedStat({
  value,
  durationMs = 1400,
  className,
}: {
  value: string;
  durationMs?: number;
  className?: string;
}) {
  const parsed = parseStat(value);
  const [display, setDisplay] = useState<number>(parsed ? 0 : 0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  // Trigger on scroll-into-view (once)
  useEffect(() => {
    if (!parsed || !ref.current) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(parsed.num);
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [parsed, started]);

  // Animate once `started` flips
  useEffect(() => {
    if (!parsed || !started) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      setDisplay(parsed.num * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(parsed.num); // snap to exact final
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parsed, started, durationMs]);

  if (!parsed) {
    // Not a numeric stat — render raw string unchanged
    return <span ref={ref} className={className}>{value}</span>;
  }

  // Format: whole-numbers for big counts, preserve the parsed suffix/prefix
  const shown = parsed.num >= 100
    ? Math.round(display).toString()
    : display.toFixed(display < 10 ? 0 : 0);

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}{shown}{parsed.suffix}
    </span>
  );
}
