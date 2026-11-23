"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { FloatChip, MockLabel, StatusPill, Window } from "@/components/ui/Mock";
import { Scene } from "@/components/sections/product/how/Scene";
import { PLAN, SATURDAY } from "@/content/demo";

const SOURCES = ["POS · read 05:58", "Inventory · read 05:57", "Events · read Thu"];

const show = (on: boolean) => ({ opacity: on ? 1 : 0, y: on ? 0 : 6 });

/** Step 6: a recommendation with the figures behind it and where they came from. */
export function Reasoning() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 the recommendation · 1 the two figures · 2 what is at risk · 3 to 5 one source each · 6 done
  const { step } = useSequence(ref, [500, 700, 600, 350, 350, 500]);
  const sources = Math.max(0, Math.min(SOURCES.length, step - 2));
  const action = PLAN.actions[0];

  return (
    <Scene
      ref={ref}
      label="Animation: the recommendation to order six lines up for Saturday is shown with its reasoning: demand forecast 18% above baseline, stock covering 71% of it, £408 of margin at risk, and three named sources."
    >
      <div className="flex h-[34px] justify-center">
        {step >= 6 ? <FloatChip tone="ok">Reasoning attached · 3 sources</FloatChip> : null}
      </div>

      <Window title="GOLEM · Recommendation" bodyClassName="px-4 pb-4 pt-3.5">
        <StatusPill tone="accent">{action.agent}</StatusPill>
        <p className="mt-2.5 text-[15px] leading-snug tracking-[-0.01em] text-ink">{action.title}</p>

        <motion.div initial={false} animate={show(step >= 1)} transition={{ duration: 0.4, ease: EASE }} className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-[10px] border border-line p-3">
            <MockLabel>Forecast</MockLabel>
            <p className="mt-2 text-[16px] font-medium leading-none text-ink">{SATURDAY.forecast} covers</p>
            <p className="mt-1.5 text-[11px] leading-none text-muted">{SATURDAY.upliftPct}% above baseline</p>
          </div>
          <div className="rounded-[10px] border border-line p-3">
            <MockLabel>Stock</MockLabel>
            <p className="mt-2 text-[16px] font-medium leading-none text-terra-deep">71% covered</p>
            <p className="mt-1.5 text-[11px] leading-none text-muted">six lines short</p>
          </div>
        </motion.div>

        <motion.div initial={false} animate={show(step >= 2)} transition={{ duration: 0.4, ease: EASE }} className="mt-2 rounded-[10px] bg-terra-wash px-3 py-2.5">
          <MockLabel tone="terra">At risk</MockLabel>
          <p className="mt-1 text-[12.5px] leading-tight text-terra-deep">£{action.impact} of margin if the order stands</p>
        </motion.div>

        <div className="mt-3 border-t border-line pt-3">
          <MockLabel>Sources</MockLabel>
          <div className="mt-2 flex min-h-[24px] flex-wrap gap-1.5">
            {SOURCES.map((s, i) => (
              <motion.span
                key={s}
                initial={false}
                animate={{ opacity: i < sources ? 1 : 0, scale: i < sources ? 1 : 0.94 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-full border border-line px-2 py-[5px]"
              >
                <MockLabel>{s}</MockLabel>
              </motion.span>
            ))}
          </div>
        </div>
      </Window>
    </Scene>
  );
}
