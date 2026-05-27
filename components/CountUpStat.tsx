'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpStatProps {
  value: string; // e.g. "+60", "140%", "3x", "<5 min"
  label: string;
  className?: string;
  numberClassName?: string;
  labelClassName?: string;
}

function parseValue(raw: string): { prefix: string; number: number; suffix: string } | null {
  // Match optional prefix (non-digit, non-dot), digits, optional suffix
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], number: parseFloat(match[2]), suffix: match[3] };
}

export default function CountUpStat({ value, label, className, numberClassName, labelClassName }: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const parsed = parseValue(value);

  useEffect(() => {
    if (!parsed) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();
        const from = 0;
        const to = parsed.number;

        function tick(now: number) {
          const elapsed = Math.min((now - start) / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - elapsed, 3);
          const current = Math.round(from + (to - from) * eased);
          setDisplay(`${parsed!.prefix}${current}${parsed!.suffix}`);
          if (elapsed < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={className}>
      <div className={numberClassName}>{display}</div>
      <div
        className={labelClassName}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
}
