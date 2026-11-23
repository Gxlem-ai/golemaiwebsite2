"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import {
  CountTo,
  FloatChip,
  MockFigure,
  MockLabel,
  ScanLine,
  SkeletonLine,
  StatusPill,
  Window,
} from "@/components/ui/Mock";
import { LEDGER, variancePct } from "@/content/demo";

const ROW_H = 52;

/** "1.1" for a hit, "−27.4" for a miss: a real minus sign, one decimal. */
const signed = (n: number) => (n < 0 ? `−${Math.abs(n).toFixed(1)}` : n.toFixed(1));

/**
 * The ledger being checked. A line sweeps down the week's forecasts; as it
 * passes each one, what actually happened is written beside it. Hits are
 * confirmed; the miss is marked and kept.
 */
export function LedgerScanMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 nothing checked · 1 to 4 one more entry each · 5 all recorded
  const { step } = useSequence(ref, [700, 800, 800, 800, 800]);
  const checked = Math.min(LEDGER.length, step);
  const finished = step >= 5;
  const misses = LEDGER.filter((e) => !e.hit).length;

  return (
    <MockFigure
      ref={ref}
      texture="ruled"
      label={`Animation: a line sweeps down four forecasts in the ledger. Beside each, the actual outcome is recorded: three land within a few per cent, and one miss is marked and kept on the record.`}
      className={cx("h-full w-full", className)}
    >
      {/* The forecast as it was written, behind the ledger. */}
      <div className="absolute left-[8%] right-[10%] top-5 -rotate-[2.5deg] rounded-t-[10px] border border-line bg-white px-3.5 pb-10 pt-3 shadow-window">
        <div className="flex items-center gap-2">
          <span className="flex gap-[5px]">
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
          </span>
          <MockLabel tone="ink">Forecast_2211</MockLabel>
          <MockLabel>· written Fri 22:14</MockLabel>
        </div>
      </div>

      <div className="absolute inset-x-3 top-[62px] sm:inset-x-9">
        <Window title="GOLEM · Ledger">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <p className="text-[13.5px] font-medium leading-none text-ink">
              Week 47 <span className="font-normal text-faint">· all sites</span>
            </p>
            <MockLabel className="hidden sm:inline">Sealed Fri 22:14</MockLabel>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_50px_44px_70px] gap-x-2 border-y border-line bg-paper-soft px-4 py-2 text-[11.5px] leading-none text-faint sm:grid-cols-[minmax(0,1fr)_72px_72px_124px]">
            <span>Entry</span>
            <span className="text-right">Forecast</span>
            <span className="text-right">Actual</span>
            <span className="text-right">Result</span>
          </div>

          <div className="relative">
            <ScanLine top={`${Math.min(checked, LEDGER.length) * ROW_H}px`} visible={step >= 1 && !finished} />
            <ul className="divide-y divide-line">
              {LEDGER.map((entry, i) => {
                const done = i < checked;
                const pct = variancePct(entry.forecast, entry.actual);
                return (
                  <li
                    key={entry.key}
                    style={{ height: ROW_H }}
                    className={cx(
                      "grid grid-cols-[minmax(0,1fr)_50px_44px_70px] items-center gap-x-2 px-4 transition-colors duration-500 sm:grid-cols-[minmax(0,1fr)_72px_72px_124px]",
                      done && !entry.hit && "bg-terra-wash/70"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] leading-tight text-ink">{entry.label}</span>
                      <span className="mt-0.5 block truncate text-[10.5px] leading-tight text-faint">
                        {done && !entry.hit ? (
                          <MockLabel tone="terra">
                            Kept<span className="hidden sm:inline"> on record</span>
                          </MockLabel>
                        ) : (
                          entry.scope
                        )}
                      </span>
                    </span>
                    <span className="text-right text-[12.5px] tabular-nums text-ink">{entry.forecast}</span>
                    <span className="flex justify-end text-[12.5px] tabular-nums text-ink">
                      {done ? entry.actual : <SkeletonLine w={22} />}
                    </span>
                    <span className="flex justify-end">
                      {done ? (
                        <motion.span initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                          {entry.hit ? (
                            <StatusPill tone="ok" icon="check">
                              <span className="hidden sm:inline">Within </span>
                              {Math.abs(pct).toFixed(1)}%
                            </StatusPill>
                          ) : (
                            <StatusPill tone="flag">
                              <span className="hidden sm:inline">Miss </span>
                              {signed(pct)}%
                            </StatusPill>
                          )}
                        </motion.span>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
            <span className="text-[12px] leading-none text-muted">On the record</span>
            <span className="text-[26px] font-medium leading-none tracking-[-0.02em] text-accent">
              <CountTo value={checked} duration={0.4} /> <span className="text-[15px] tracking-normal">entries</span>
            </span>
          </div>
        </Window>

        <div className="mt-3 h-[34px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={finished ? "done" : "run"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {finished ? (
                <FloatChip tone="ok">
                  {LEDGER.length} entries recorded · {misses} miss kept
                </FloatChip>
              ) : (
                <FloatChip tone="accent" pulse>
                  <span className="tabular-nums">
                    Checking entry {Math.min(LEDGER.length, checked + 1)} of {LEDGER.length}
                  </span>
                </FloatChip>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MockFigure>
  );
}
