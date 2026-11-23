"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { FloatChip, MockCursor, MockLabel, Window } from "@/components/ui/Mock";
import { CheckRow, Scene } from "@/components/sections/product/how/Scene";
import { PLAN } from "@/content/demo";

const AFTER = ["Order sent to the supplier", "Written to the ledger"];

/** Step 7: nothing is sent until a person approves it. */
export function HoldForApproval() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 held · 1 pointer travels · 2 press · 3 approved · 4 and 5 one consequence each
  const { step } = useSequence(ref, [900, 950, 260, 500, 450]);
  const approved = step >= 3;
  const done = Math.max(0, Math.min(AFTER.length, step - 3));
  const action = PLAN.actions[0];

  return (
    <Scene
      ref={ref}
      label="Animation: an order waits, held for approval, with nothing sent. A person presses Approve; only then is the order sent to the supplier and written to the ledger."
    >
      <div className="flex justify-center">
        <FloatChip tone={approved ? "ok" : "accent"} pulse={!approved}>
          {approved ? "Executed after approval" : "Held for approval"}
        </FloatChip>
      </div>

      <div className="relative">
        <Window title="GOLEM · Approval" bodyClassName="px-4 pb-3 pt-3.5">
          <MockLabel>{action.agent}</MockLabel>
          <p className="mt-2 text-[15px] leading-snug tracking-[-0.01em] text-ink">{action.title}</p>
          <p className="mt-1.5 text-[12px] leading-none text-muted">
            £{action.impact} {action.impactLabel}
          </p>

          <div className="mt-3.5 flex items-center justify-between gap-3">
            <p className="text-[11.5px] leading-tight text-faint">{approved ? `Sent ${PLAN.approvedAt}, after approval` : "Nothing has been sent"}</p>
            <div className="flex shrink-0 gap-2">
              <motion.span
                initial={false}
                animate={{ opacity: approved ? 0 : 1 }}
                transition={{ duration: 0.25 }}
                className="inline-flex h-[30px] items-center rounded-lg border border-line bg-white px-3 text-[12px] font-medium text-ink"
              >
                Adjust
              </motion.span>
              <span
                className={cx(
                  "inline-flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-[12px] font-medium text-white transition-colors duration-300",
                  approved ? "bg-ok" : "bg-accent"
                )}
              >
                {approved ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                {approved ? `Approved ${PLAN.approvedAt}` : "Approve"}
              </span>
            </div>
          </div>

          <ul className="mt-3 divide-y divide-line border-t border-line">
            {AFTER.map((row, i) => (
              <CheckRow key={row} on={i < done}>
                {row}
              </CheckRow>
            ))}
          </ul>
        </Window>
        <MockCursor x={step >= 1 ? 84 : 52} y={step >= 1 ? 55 : 92} visible={step >= 1 && step <= 3} press={step === 2} duration={0.85} />
      </div>
    </Scene>
  );
}
