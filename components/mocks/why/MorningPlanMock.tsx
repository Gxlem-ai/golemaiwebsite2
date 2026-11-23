"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { FloatChip, MockCursor, MockFigure, MockLabel, ResultMark, SkeletonLine, StatusPill, Window, pounds } from "@/components/ui/Mock";
import { TRADING } from "@/content/demo";

/* Five order lines: what was drafted against what the plan calls for. */
const ROWS = [
  { w: "72%", drafted: 40, plan: 84 },
  { w: "56%", drafted: 24, plan: 24 },
  { w: "80%", drafted: 60, plan: 72 },
  { w: "50%", drafted: 18, plan: 18 },
  { w: "66%", drafted: 30, plan: 42 },
] as const;

/**
 * The morning's manual work, done before anyone arrives. Friday's close comes
 * in, the drafted order is reviewed line by line against the plan, the short
 * lines are flagged, and one press adjusts the order.
 */
export function MorningPlanMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 close received · 1 file shown · 2 to 6 one line reviewed each
  // 7 shortfall flagged · 8 pointer travels · 9 press · 10 adjusted · 11 approved
  const { step } = useSequence(ref, [600, 500, 400, 400, 400, 400, 400, 700, 900, 260, 600], { amount: 0.4 });
  const reviewed = Math.max(0, Math.min(ROWS.length, step - 1));
  const flagged = step >= 7;
  const adjusted = step >= 10;
  const approved = step >= 11;

  return (
    <MockFigure
      ref={ref}
      texture="none"
      label="Animation: Friday's sales close arrives, GOLEM reviews Saturday's drafted order line by line against the plan, flags three lines that are short, and the order is adjusted with one press."
      className={cx("h-full w-full", className)}
    >
      {/* Chips, in the order things happen */}
      <FloatChip tone="ink" className="absolute left-4 top-6 z-20 sm:left-0 lg:top-7">
        Friday’s close received
      </FloatChip>
      <motion.div
        initial={false}
        animate={{ opacity: flagged ? 1 : 0, y: flagged ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute bottom-[132px] left-0 z-20 hidden lg:block"
      >
        <FloatChip tone="terra">3 lines short of Saturday’s forecast</FloatChip>
      </motion.div>
      <motion.div
        initial={false}
        animate={{ opacity: approved ? 1 : 0, y: approved ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute bottom-[78px] left-0 z-20 hidden lg:block"
      >
        <FloatChip tone="ok">Plan approved · supplier notified</FloatChip>
      </motion.div>

      {/* The file that arrived */}
      <motion.div
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : 10 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="absolute left-0 top-[196px] hidden w-[268px] rounded-[14px] border border-line bg-white p-5 shadow-window lg:block"
      >
        <p className="flex items-center gap-2.5 text-[13.5px] leading-none text-ink">
          <span className="rounded-[4px] bg-ink px-1.5 py-1 text-[9px] font-bold leading-none text-white">CSV</span>
          friday-close.csv
        </p>
        <p className="mt-5 text-[13px] leading-none text-muted">High Street</p>
        <p className="mt-2.5 text-[18px] font-medium leading-none tracking-[-0.02em] text-ink">{pounds(TRADING.revenue)}</p>
        <div className="mt-4 flex gap-1.5">
          <StatusPill>{TRADING.transactions} transactions</StatusPill>
          <StatusPill>POS export</StatusPill>
        </div>
      </motion.div>

      {/* The review */}
      <div className="absolute bottom-0 left-4 right-4 top-[76px] sm:left-[8%] sm:right-0 lg:left-[300px] lg:top-[92px]">
        <Window
          title="GOLEM · Plan review"
          className="h-full rounded-b-none border-b-0 sm:rounded-tr-none sm:border-r-0"
          bodyClassName="px-4 pt-4 sm:px-6 sm:pt-5"
        >
          <MockLabel>Plan_2211</MockLabel>
          <p className="mt-2 text-[18px] leading-none tracking-[-0.02em] text-ink">Saturday · bakery</p>
          <div className="mt-3 flex gap-1.5">
            <StatusPill tone={adjusted ? "ok" : "flag"}>{adjusted ? "Adjusted" : "Short"}</StatusPill>
            <StatusPill>Ordering</StatusPill>
          </div>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_60px_60px_22px] gap-x-3 border-b border-line pb-2.5 text-[12px] leading-none text-faint sm:grid-cols-[minmax(0,1fr)_84px_84px_22px]">
            <span>Line</span>
            <span className="text-right">Drafted</span>
            <span className="text-right">Plan</span>
            <span />
          </div>
          <ul>
            {ROWS.map((row, i) => {
              const done = i < reviewed;
              const short = row.plan !== row.drafted;
              return (
                <li
                  key={i}
                  className={cx(
                    "-mx-2 grid h-[42px] grid-cols-[minmax(0,1fr)_60px_60px_22px] items-center gap-x-3 border-b border-line px-2 transition-colors duration-500 sm:grid-cols-[minmax(0,1fr)_84px_84px_22px]",
                    done && short && !adjusted && "bg-terra-wash/70"
                  )}
                >
                  <SkeletonLine w={row.w} />
                  <span className={cx("text-right text-[13px] tabular-nums transition-colors duration-500", done && short && !adjusted ? "text-terra-deep" : "text-ink")}>
                    {adjusted && short ? row.plan : row.drafted}
                  </span>
                  <span className="text-right text-[13px] tabular-nums text-muted">{row.plan}</span>
                  <span className="flex justify-end">
                    {done ? (
                      <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}>
                        <ResultMark ok={!short || adjusted} />
                      </motion.span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>

          <motion.div
            initial={false}
            animate={{ opacity: flagged ? 1 : 0, y: flagged ? 0 : 8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={cx(
              "relative mt-4 flex items-center justify-between gap-3 rounded-[10px] border px-3 py-2.5 transition-colors duration-500",
              adjusted ? "border-ok/25 bg-ok-wash" : "border-terra/30 bg-terra-wash"
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className={cx("h-[7px] w-[7px] shrink-0 rounded-full transition-colors duration-500", adjusted ? "bg-ok" : "bg-terra")} />
              <span className="min-w-0">
                <MockLabel tone={adjusted ? "ok" : "terra"}>{adjusted ? "Order_matches_plan" : "Stock_lt_forecast"}</MockLabel>
                <span className={cx("mt-1 block truncate text-[12px] leading-tight", adjusted ? "text-ok-deep" : "text-terra-deep")}>
                  {adjusted ? "3 lines corrected · £408 protected" : "3 lines short · £408 at risk"}
                </span>
              </span>
            </span>
            <span
              className={cx(
                "inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11.5px] font-medium text-white transition-colors duration-300",
                adjusted ? "bg-ok" : "bg-accent"
              )}
            >
              {adjusted ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
              {adjusted ? "Adjusted" : "Adjust order"}
            </span>
            <MockCursor x={step >= 8 ? 88 : 62} y={step >= 8 ? 62 : -90} visible={step >= 8 && step <= 10} press={step === 9} />
          </motion.div>
        </Window>
      </div>
    </MockFigure>
  );
}
