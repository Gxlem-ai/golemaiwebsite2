"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, Check, Tags, Users } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import {
  FloatChip,
  MockCursor,
  MockFigure,
  MockLabel,
  ResultMark,
  StatusPill,
  Window,
  pounds,
} from "@/components/ui/Mock";
import { PLAN, PLAN_IMPACT } from "@/content/demo";

const ICONS = { order: Boxes, price: Tags, labour: Users } as const;

/**
 * The 06:00 plan being approved.
 *
 * Reference implementation for every mock-up on the site. The shape to copy:
 *  - one MockFigure with a text alternative describing what is demonstrated
 *  - a window that bleeds off the bottom of the card, with a chip above it
 *  - a single `useSequence` whose step number drives every state on screen,
 *    so the final frame is also the reduced-motion frame
 *  - a cursor that performs the one action the sequence is about
 */
export function ApprovalMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 waiting · 1 reading the reasoning · 2 pointer travels · 3 press
  // 4-6 the three actions confirm in turn · 7 executed and recorded
  const { step } = useSequence(ref, [900, 1500, 1000, 240, 380, 380, 620]);

  const reasoning = step >= 1 && step <= 3;
  const approved = step >= 4;
  const executed = step >= 7;

  return (
    <MockFigure
      ref={ref}
      texture="ruled"
      label="Animation: the 06:00 daily plan lists three recommended actions with the reasoning behind them. A person presses Approve, each action is confirmed in turn, and the plan is executed and written to the ledger."
      className={cx("h-full w-full", className)}
    >
      <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center px-4">
        <div className="relative flex h-full w-full max-w-[408px] flex-col">
          {/* Status chip above the window */}
          <div className="flex h-[68px] shrink-0 items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={executed ? "done" : "ready"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {executed ? (
                  <FloatChip tone="ok">3 actions executed · written to the ledger</FloatChip>
                ) : (
                  <FloatChip tone="accent" pulse>
                    Daily plan ready · {PLAN.readyAt}
                  </FloatChip>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The window runs off the bottom edge of the card */}
          <div className="relative min-h-0 flex-1">
            <Window
              title="GOLEM · Daily plan"
              className="h-full rounded-b-none border-b-0"
              bodyClassName="px-4 pt-4"
            >
              <MockLabel>{PLAN.id}</MockLabel>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <p className="text-[17px] leading-tight tracking-[-0.02em] text-ink">{PLAN.day} plan</p>
                <div className="flex items-center gap-1.5">
                  <StatusPill tone={approved ? "ok" : "accent"}>{approved ? "Approved" : "Awaiting approval"}</StatusPill>
                  <StatusPill>{PLAN.actions.length} actions</StatusPill>
                </div>
              </div>

              <ul className="mt-3 divide-y divide-line border-y border-line">
                {PLAN.actions.map((action, i) => {
                  const Icon = ICONS[action.key];
                  const done = step >= 4 + i;
                  const open = reasoning && i === 0;
                  return (
                    <li key={action.key} className={cx("transition-colors duration-500", open && "bg-accent-wash/60")}>
                      <div className="flex items-center gap-3 px-1 py-[9px]">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border border-line bg-white">
                          <Icon className="h-3.5 w-3.5 text-ink" strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] leading-tight text-ink">{action.agent}</span>
                          <span className="mt-0.5 block truncate text-[11px] leading-tight text-faint">{action.short}</span>
                        </span>
                        <span className="text-[12px] tabular-nums text-muted">{pounds(action.impact)}</span>
                        {done ? (
                          <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}>
                            <ResultMark ok />
                          </motion.span>
                        ) : (
                          <span className="h-[15px] w-[15px] shrink-0 rounded-full border border-dashed border-line-strong" />
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {open ? (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="overflow-hidden pl-11 pr-3 text-[11px] leading-snug text-accent-ink"
                          >
                            <span className="block pb-2">{action.reason}</span>
                          </motion.p>
                        ) : null}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <div
                className={cx(
                  "mt-3 flex items-center justify-between gap-3 rounded-[10px] border px-3 py-2.5 transition-colors duration-500",
                  approved ? "border-ok/25 bg-ok-wash" : "border-accent/25 bg-accent-wash"
                )}
              >
                <span className="min-w-0">
                  <MockLabel tone={approved ? "ok" : "accent"}>{approved ? "Approved " + PLAN.approvedAt : "Expected impact"}</MockLabel>
                  <span className="mt-1 block text-[13px] leading-tight text-ink">
                    {pounds(PLAN_IMPACT)} <span className="text-muted">across three actions</span>
                  </span>
                </span>
                <span
                  className={cx(
                    "inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11.5px] font-medium text-white transition-colors duration-300",
                    approved ? "bg-ok" : "bg-accent"
                  )}
                >
                  {approved ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                  {approved ? "Approved" : "Approve plan"}
                </span>
              </div>
            </Window>

            <MockCursor x={step >= 2 ? 83 : 56} y={step >= 2 ? 88 : 48} visible={step >= 2 && step <= 5} press={step === 3} />
          </div>
        </div>
      </div>
    </MockFigure>
  );
}
