"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cx, EASE } from "@/components/ui/core";
import { useLiveTicker, usePrefersReducedMotion } from "@/components/ui/hooks";
import { MockFigure, pounds } from "@/components/ui/Mock";

type Outcome = "Approved" | "Amended" | "Held";

const ACTIONS: { text: string; amount: number; outcome: Outcome }[] = [
  { text: "Ordering · six lines up for Saturday", amount: 408, outcome: "Approved" },
  { text: "Pricing · weekend discount to 12%", amount: 444, outcome: "Amended" },
  { text: "Labour · one shift to Saturday midday", amount: 95, outcome: "Approved" },
  { text: "Ordering · switch to the alternate supplier", amount: 120, outcome: "Held" },
];

/* Light tints of the palette's green, lavender and terracotta, for dark ground. */
const TAG: Record<Outcome, string> = { Approved: "text-[#86d6a0]", Amended: "text-accent-lav", Held: "text-[#eba58c]" };

const PITCH = 52;
const VISIBLE = 4;
/* Rows fade out down the list. */
const DEPTH = [1, 0.55, 0.34, 0.18];

/**
 * Proposed actions reaching "your desk". The list rises through a line; the
 * action on the line is decided (approved, amended or held) and moves on, and
 * the counters beneath keep the tally. It loops for as long as it is on screen.
 */
export function DecisionLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const onScreen = useInView(ref, { amount: 0.2 });
  // Two beats per action: it arrives on the line, then it is decided.
  const [beat, setBeat] = useState(0);
  useLiveTicker(ref, () => setBeat((b) => b + 1), 950, onScreen);

  const head = Math.floor(beat / 2); // sequence number of the action on the line
  const decided = beat % 2 === 1;

  // The tally restarts with each pass through the four actions.
  const pass = reduced ? ACTIONS : ACTIONS.slice(0, (head % ACTIONS.length) + (decided ? 1 : 0));
  const amended = pass.filter((a) => a.outcome === "Amended").length;
  const approvedSum = pass.filter((a) => a.outcome !== "Held").reduce((sum, a) => sum + a.amount, 0);

  // One slot above the line for the action leaving, four on and below it.
  const slots = Array.from({ length: VISIBLE + 1 }, (_, k) => head - 1 + k).filter((n) => n >= 0);

  return (
    <MockFigure
      ref={ref}
      texture="none"
      label="Animation: proposed actions rise one at a time to a line marked as your desk. Each is approved, amended or held there before anything is carried out."
      className={cx("w-full rounded-none", className)}
    >
      <div className="relative" style={{ height: VISIBLE * PITCH - 12 }}>
        {/* Your desk */}
        <div className="absolute inset-x-0 top-5 h-px bg-gradient-to-r from-accent-lav/80 via-accent-lav/60 to-accent-lav/0" />
        <span className="absolute left-0 top-[15.5px] flex h-[9px] w-[9px]">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent-lav" />
          <span className="relative h-[9px] w-[9px] rounded-full bg-accent-lav" />
        </span>

        {/* Rows are inset so the line shows either side of the one it passes behind. */}
        <div className="mask-fade-b absolute inset-y-0 left-[26px] right-[26px]">
          {slots.map((n) => {
            const slot = n - head; // -1 leaving, 0 on the line, 1.. waiting
            const action = ACTIONS[n % ACTIONS.length];
            const onLine = slot === 0;
            const tagged = slot < 0 || (onLine && decided);
            return (
              <motion.div
                key={n}
                initial={reduced ? false : { y: (slot + 1) * PITCH, opacity: 0 }}
                animate={{ y: slot * PITCH, opacity: slot < 0 ? 0 : DEPTH[slot] ?? 0 }}
                transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
                className={cx(
                  "absolute inset-x-0 top-0 flex h-10 items-center justify-between gap-3 rounded-[10px] border px-3.5 text-[13.5px] leading-none text-white transition-colors duration-500",
                  onLine ? "border-band-line bg-band-raised" : "border-white/10 bg-white/[0.05]"
                )}
              >
                <span className="min-w-0 truncate">{action.text}</span>
                <span className="flex shrink-0 items-center gap-3 tabular-nums">
                  {pounds(action.amount)}
                  <span className={cx("w-[62px] text-right text-[11.5px] font-medium transition-opacity duration-300", TAG[action.outcome], tagged ? "opacity-100" : "opacity-0")}>
                    {action.outcome}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 pl-[26px] text-[13px] leading-none text-white/60">
        <span>
          <span className="font-medium tabular-nums text-white">{pass.length}</span> reviewed
        </span>
        <span>
          <span className="font-medium tabular-nums text-white">{amended}</span> amended
        </span>
        <span>
          <span className="font-medium tabular-nums text-accent-lav">{pounds(approvedSum)}</span> approved
        </span>
      </p>
    </MockFigure>
  );
}
