"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { CountTo, FloatChip, MockLabel, StatusPill, Window } from "@/components/ui/Mock";
import { Scene } from "@/components/sections/product/how/Scene";
import { LEDGER, PLAN, variancePct } from "@/content/demo";

const SAT = LEDGER[0];
const ENTRIES = [
  { time: "Fri 22:14", text: `Forecast written · ${SAT.forecast} covers` },
  { time: `Sat ${PLAN.approvedAt}`, text: `Plan approved · ${PLAN.actions.length} actions` },
  { time: `Sat ${PLAN.approvedAt}`, text: "Order sent · 6 lines" },
  { time: "Sat 22:05", text: `Outcome recorded · ${SAT.actual} covers` },
];
const WITHIN = Math.abs(variancePct(SAT.forecast, SAT.actual)).toFixed(1);

/** Step 8: forecast, decision and outcome, written down in order and left alone. */
export function WriteToLedger() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 empty · 1 to 4 one entry each · 5 the outcome is compared · 6 sealed
  const { step } = useSequence(ref, [450, 550, 550, 550, 600, 500]);
  const written = Math.min(ENTRIES.length, step);

  return (
    <Scene
      ref={ref}
      label={`Animation: four entries are written to the ledger in order: the forecast on Friday night, the approval and the order on Saturday morning, and the outcome that evening, within ${WITHIN}% of the forecast. Nothing is edited afterwards.`}
    >
      <div className="flex h-[34px] justify-center">{step >= 6 ? <FloatChip tone="ok">On the record</FloatChip> : null}</div>

      <Window title="GOLEM · Ledger" bodyClassName="px-4 pb-3.5 pt-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[16px] leading-none tracking-[-0.02em] text-ink">Saturday</p>
          <MockLabel>
            <CountTo value={written} duration={0.3} /> entries
          </MockLabel>
        </div>

        <ol className="relative mt-3.5 space-y-3.5 pl-5">
          <span className="absolute bottom-1.5 left-[3px] top-1.5 w-px bg-line-strong" />
          {ENTRIES.map((entry, i) => {
            const on = i < written;
            return (
              <motion.li
                key={entry.text}
                initial={false}
                animate={{ opacity: on ? 1 : 0.22, x: on ? 0 : 4 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative"
              >
                <span
                  className={cx(
                    "absolute -left-5 top-[3px] h-[7px] w-[7px] rounded-full ring-2 ring-white transition-colors duration-500",
                    on ? "bg-accent" : "bg-line-strong"
                  )}
                />
                <MockLabel>{entry.time}</MockLabel>
                <p className="mt-1.5 text-[13px] leading-none text-ink">{entry.text}</p>
              </motion.li>
            );
          })}
        </ol>

        <motion.div initial={false} animate={{ opacity: step >= 5 ? 1 : 0 }} transition={{ duration: 0.4 }} className="mt-3.5 pl-5">
          <StatusPill tone="ok" icon="check">
            Within {WITHIN}% of forecast
          </StatusPill>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: step >= 6 ? 1 : 0, y: step >= 6 ? 0 : 6 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-3.5 rounded-lg border border-line bg-paper-soft px-3 py-2.5"
        >
          <MockLabel>Nothing edited afterwards</MockLabel>
        </motion.div>
      </Window>
    </Scene>
  );
}
