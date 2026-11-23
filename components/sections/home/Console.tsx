"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, CornerDownLeft, Sparkles } from "lucide-react";
import { MockLabel, Window } from "@/components/ui/Mock";
import { cx, EASE } from "@/components/ui/core";
import { useLiveTicker, usePrefersReducedMotion } from "@/components/ui/hooks";
import { TRADING } from "@/content/demo";

type Exchange = { q: string; a: string; chips: string[] };

const EXCHANGES: Exchange[] = [
  {
    q: "Summarise yesterday’s trading.",
    a: "Revenue £4,920, 8% above the same day last week. Gross margin up 3.1 points following Tuesday’s price changes. 412 transactions at an average basket of £11.94. Two lines sold out before 14:00.",
    chips: ["Revenue +8%", "Margin +3.1 pts", "2 stockouts"],
  },
  {
    q: "Prepare the weekend order and rota.",
    a: "Saturday footfall is forecast 18% above baseline, driven by the market and clear weather. The draft order covers six fast-moving lines and holds three slow movers. One additional midday shift is recommended.",
    chips: ["6 lines reordered", "+1 shift", "Awaiting approval"],
  },
  {
    q: "Where is margin being lost?",
    a: "Weekend discounts were over-applied on three lines, and one supplier raised prices 4% this month. Two price tests and an alternative supplier have been drafted for review.",
    chips: ["3 lines flagged", "Supplier +4%", "2 tests drafted"],
  },
];

/** Types a string out; resolves at once under reduced motion. */
function useTypewriter(text: string, reduced: boolean) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (reduced) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    // Several characters a tick keeps a long answer readable without a long wait.
    const step = Math.max(1, Math.round(text.length / 90));
    const id = setInterval(() => {
      i = Math.min(text.length, i + step);
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [text, reduced]);

  return shown;
}

/** Twelve-point trend for the revenue cell. One series, so no legend. */
function Sparkline({ points }: { points: number[] }) {
  const w = 60;
  const h = 18;
  const min = Math.min(...points);
  const span = Math.max(...points) - min || 1;
  const at = (p: number, i: number) => [(i / (points.length - 1)) * w, h - ((p - min) / span) * h] as const;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${at(p, i)[0].toFixed(1)},${at(p, i)[1].toFixed(1)}`).join(" ");
  const [lx, ly] = at(points[points.length - 1], points.length - 1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="hidden overflow-visible sm:block" aria-hidden="true">
      <path d={d} fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      <circle cx={lx} cy={ly} r="2.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * The operations console: a question, a typed answer, the facts pulled from
 * it and where they were read from. It is real, operable UI: the three
 * questions are buttons, and choosing one stops the automatic cycling.
 */
export function Console({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(false);

  useLiveTicker(rootRef, () => setIdx((i) => (i + 1) % EXCHANGES.length), 7000, !chosen);

  const current = EXCHANGES[idx];
  const typed = useTypewriter(current.a, reduced);
  const done = typed.length === current.a.length;

  // The revenue figure drifts while the console is on screen. The randomness
  // lives in the ticker, after mount, so server and client markup agree.
  const [live, setLive] = useState({
    revenue: TRADING.revenue as number,
    trend: [38, 42, 40, 47, 44, 52, 49, 58, 55, 63, 60, 68],
  });
  useLiveTicker(
    rootRef,
    () =>
      setLive((m) => ({
        revenue: m.revenue + Math.round(Math.random() * 40 - 8),
        trend: [...m.trend.slice(1), Math.max(28, Math.min(78, m.trend[m.trend.length - 1] + (Math.random() * 12 - 5)))],
      })),
    2600
  );

  return (
    <div ref={rootRef} className={cx("h-full", className)}>
      <Window title="GOLEM · Operations console" className="flex h-full flex-col" bodyClassName="flex min-h-0 flex-1 flex-col">
        {/* Questions */}
        <div className="flex flex-wrap gap-1.5 border-b border-line px-4 py-3">
          {EXCHANGES.map((e, i) => (
            <button
              key={e.q}
              type="button"
              aria-pressed={i === idx}
              onClick={() => {
                setIdx(i);
                setChosen(true);
              }}
              className={cx(
                "rounded-full border px-3 py-[5px] text-left text-[11.5px] leading-tight transition-colors duration-300",
                i === idx
                  ? "border-accent/40 bg-accent-wash text-ink"
                  : "border-line bg-white text-muted hover:border-line-strong hover:text-ink"
              )}
            >
              {e.q}
            </button>
          ))}
        </div>

        {/* Transcript */}
        <div className="relative min-h-[236px] flex-1 sm:min-h-[212px]">
          <p className="sr-only" aria-live="polite">
            {current.q} {current.a}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              aria-hidden="true"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="px-4 py-4 sm:px-5"
            >
              <p className="flex items-start gap-1.5 text-[13px] leading-snug text-ink">
                <ChevronRight className="mt-[2px] h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.4} />
                {current.q}
              </p>

              <p className="ml-[7px] mt-3 border-l-2 border-accent/40 pl-3.5 font-mono text-[12px] leading-[1.6] text-copy sm:text-[12.5px]">
                {typed}
                {!done ? <span className="ml-0.5 inline-block h-[12px] w-[6px] translate-y-[2px] animate-caret bg-accent/70" /> : null}
              </p>

              {done ? (
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="ml-[23px] mt-3"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {current.chips.map((c) => (
                      <span key={c} className="rounded-md border border-line bg-paper-soft px-2 py-[3px] text-[11px] leading-none text-muted">
                        {c}
                      </span>
                    ))}
                  </div>
                  <MockLabel className="mt-3 block leading-relaxed">Sources · POS read 05:58 · Inventory read 05:57</MockLabel>
                </motion.div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Composer: an affordance, not an input */}
        <div aria-hidden="true" className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-[12px] text-faint sm:px-5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="flex-1 truncate">Ask anything about the business</span>
          <CornerDownLeft className="h-3.5 w-3.5" />
        </div>

        {/* Metrics */}
        <dl className="grid grid-cols-3 divide-x divide-line border-t border-line bg-paper-soft/60">
          <div className="px-3 py-3 sm:px-4">
            <dt>
              <MockLabel>
                Revenue<span className="hidden sm:inline"> today</span>
              </MockLabel>
            </dt>
            <dd className="mt-1.5 flex items-end justify-between gap-2">
              <span className="text-[17px] font-medium leading-none tabular-nums text-ink sm:text-[18px]">
                £{live.revenue.toLocaleString("en-GB")}
              </span>
              <Sparkline points={live.trend} />
            </dd>
          </div>
          <div className="px-3 py-3 sm:px-4">
            <dt>
              <MockLabel>
                Scenarios<span className="hidden sm:inline"> run</span>
              </MockLabel>
            </dt>
            <dd className="mt-1.5 text-[17px] font-medium leading-none tabular-nums text-ink sm:text-[18px]">
              {TRADING.scenarios.toLocaleString("en-GB")}
            </dd>
          </div>
          <div className="px-3 py-3 sm:px-4">
            <dt>
              <MockLabel>
                Awaiting<span className="hidden sm:inline"> approval</span>
              </MockLabel>
            </dt>
            <dd className="mt-1.5 text-[17px] font-medium leading-none tabular-nums text-ink sm:text-[18px]">3</dd>
          </div>
        </dl>
      </Window>
    </div>
  );
}
