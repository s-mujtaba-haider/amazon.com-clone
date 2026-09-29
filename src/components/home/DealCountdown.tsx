'use client';

import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

function untilMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad);
}

/** "Ends in HH:MM:SS" until local midnight; each changing digit group flips in. Empty until mounted to avoid a hydration mismatch. */
export function DealCountdown() {
  const [parts, setParts] = useState<string[] | null>(null);

  useEffect(() => {
    setParts(untilMidnight());
    const t = setInterval(() => setParts(untilMidnight()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted sm:text-sm">
      <span>Ends in</span>
      <span className="flex items-center gap-1" role="timer" aria-live="off">
        {(parts ?? ['--', '--', '--']).map((v, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="font-bold text-deal">:</span>}
            <span className="min-w-[2.1em] overflow-hidden rounded-lg bg-ink px-1.5 py-1 text-center font-extrabold text-white tabular-nums">
              <span key={v} className="inline-block animate-[tick_.35s_cubic-bezier(.2,.8,.2,1)]">
                {v}
              </span>
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
