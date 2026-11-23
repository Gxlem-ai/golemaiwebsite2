"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Boxes, Tags, Users } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { CountTo, FloatChip, MockLabel, Window, pounds } from "@/components/ui/Mock";
import { Scene } from "@/components/sections/product/how/Scene";
import { PLAN, PLAN_IMPACT } from "@/content/demo";

const ICONS = { order: Boxes, price: Tags, labour: Users } as const;
const STATS = [
  { label: "Orders", value: 6, dot: "bg-accent" },
  { label: "Prices", value: 3, dot: "bg-ink" },
  { label: "Shifts", value: 1, dot: "bg-dim" },
] as const;

/** Step 5: the forecast becomes specific orders, prices and shifts. */
export function DailyPlan() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 counts · 2 to 4 one action drafted each · 5 plan ready
  const { step } = useSequence(ref, [450, 700, 450, 450, 600]);
  const drafted = Math.max(0, Math.min(PLAN.actions.length, step - 1));
  const ready = step >= 5;

  return (
    <Scene
      ref={ref}
      label={`Animation: the daily plan is drafted for Saturday: six orders, three price changes and one shift, three actions in all with an expected impact of ${pounds(PLAN_IMPACT)}, ready at ${PLAN.readyAt}.`}
    >
      <div className="grid grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-[12px] border border-line bg-white px-3 py-2.5">
            <p className="flex items-center gap-1.5 text-[11px] leading-none text-muted">
              <span className={cx("h-[6px] w-[6px] rounded-full", s.dot)} />
              {s.label}
            </p>
            <CountTo value={step >= 1 ? s.value : 0} duration={0.6} className="mt-2 block text-[22px] font-medium leading-none tracking-[-0.02em] text-ink" />
          </div>
        ))}
      </div>

      <Window title="GOLEM · Daily plan" bodyClassName="px-4 pb-3.5 pt-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[16px] leading-none tracking-[-0.02em] text-ink">{PLAN.day}</p>
          <MockLabel tone={ready ? "accent" : "faint"}>{ready ? `Ready ${PLAN.readyAt}` : "Drafting"}</MockLabel>
        </div>
        <ul className="mt-2.5 divide-y divide-line border-y border-line">
          {PLAN.actions.map((action, i) => {
            const Icon = ICONS[action.key];
            const on = i < drafted;
            return (
              <motion.li
                key={action.key}
                initial={false}
                animate={{ opacity: on ? 1 : 0.25 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex h-[44px] items-center gap-3"
              >
                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border border-line bg-white">
                  <Icon className="h-3.5 w-3.5 text-ink" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] leading-tight text-ink">{action.agent}</span>
                  <span className="mt-0.5 block truncate text-[11px] leading-tight text-faint">{action.short}</span>
                </span>
                <span className="text-[12.5px] tabular-nums text-muted">{pounds(action.impact)}</span>
              </motion.li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] leading-none text-muted">Expected impact</span>
          <CountTo
            value={PLAN.actions.slice(0, drafted).reduce((sum, a) => sum + a.impact, 0)}
            duration={0.4}
            format={(n) => pounds(Math.round(n))}
            className="text-[16px] font-medium leading-none text-accent"
          />
        </div>
      </Window>

      <div className="flex h-[34px] justify-center">{ready ? <FloatChip tone="accent">Daily plan ready · {PLAN.readyAt}</FloatChip> : null}</div>
    </Scene>
  );
}
