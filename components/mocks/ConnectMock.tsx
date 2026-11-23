"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, Calculator, CalendarClock, CreditCard, Store, Truck } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { FloatChip, MockFigure, MockLabel, ResultMark, StatusPill, Window } from "@/components/ui/Mock";
import { SOURCES } from "@/content/demo";

const ICONS = {
  pos: Store,
  payments: CreditCard,
  inventory: Boxes,
  suppliers: Truck,
  accounting: Calculator,
  scheduling: CalendarClock,
} as const;

/**
 * Six systems read into one operating record. The rows connect one after
 * another, the chip above counts them in, and the record reports itself
 * current once the last one lands.
 */
export function ConnectMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 nothing connected · 1 to 6 one more system each · 7 record current
  const { step } = useSequence(ref, [600, 340, 340, 340, 340, 340, 500]);
  const connected = Math.min(SOURCES.length, step);
  const current = step >= 7;

  return (
    <MockFigure
      ref={ref}
      texture="clay"
      label="Animation: six systems (point of sale, payments, inventory, suppliers, accounting and scheduling) are read one by one into a single operating record, which then reports itself current to this morning."
      className={cx("h-full w-full", className)}
    >
      <div className="absolute inset-0 flex flex-col items-center px-4">
        <div className="flex h-full w-full max-w-[400px] flex-col">
          <div className="flex h-[68px] shrink-0 items-center">
            <FloatChip tone={connected === SOURCES.length ? "ok" : "accent"} pulse={connected < SOURCES.length}>
              <span className="tabular-nums">{`${connected} of ${SOURCES.length} systems connected`}</span>
            </FloatChip>
          </div>

          <div className="relative min-h-0 flex-1">
            {/* Two sheets behind the window: several systems, stacked into one. */}
            <span className="absolute inset-x-7 -top-4 h-6 rounded-t-[10px] bg-white/35" />
            <span className="absolute inset-x-3.5 -top-2 h-6 rounded-t-[10px] bg-white/60" />

            <Window title="GOLEM · Operating record" className="relative h-full rounded-b-none border-b-0" bodyClassName="px-4 pt-3.5">
              <p className="text-[17px] leading-tight tracking-[-0.02em] text-ink">One record, six systems</p>

              <ul className="mt-2.5 divide-y divide-line border-y border-line">
                {SOURCES.map((source, i) => {
                  const Icon = ICONS[source.key];
                  const on = i < connected;
                  return (
                    <li key={source.key} className="flex h-[33px] items-center gap-3 px-0.5 sm:h-9">
                      <span
                        className={cx(
                          "flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border bg-white transition-colors duration-500",
                          on ? "border-accent/35 text-accent" : "border-line text-faint"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] leading-none text-ink">
                        {source.label}
                        <span className="ml-2 hidden text-[11px] text-faint sm:inline">{source.detail}</span>
                      </span>
                      {on ? (
                        <motion.span
                          initial={{ opacity: 0, x: 6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="flex items-center gap-2"
                        >
                          <MockLabel>Read 05:58</MockLabel>
                          <ResultMark ok />
                        </motion.span>
                      ) : (
                        <span className="flex items-center gap-2 text-[11px] leading-none text-faint">
                          Connecting
                          <svg viewBox="0 0 12 12" className="h-3 w-3 animate-spin motion-reduce:animate-none" fill="none">
                            <circle cx="6" cy="6" r="4.5" stroke="#dad5cc" strokeWidth="1.5" />
                            <path d="M6 1.5a4.5 4.5 0 0 1 4.5 4.5" stroke="#928e86" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <AnimatePresence>
                {current ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mt-2.5 flex items-center justify-between gap-3 rounded-[10px] border border-accent/25 bg-accent-wash px-3 py-2"
                  >
                    <span>
                      <MockLabel tone="accent">Current to</MockLabel>
                      <span className="mt-1 block text-[13px] leading-tight text-ink">This morning, 05:58</span>
                    </span>
                    <StatusPill tone="ok" icon="check">
                      In sync
                    </StatusPill>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Window>
          </div>
        </div>
      </div>
    </MockFigure>
  );
}
