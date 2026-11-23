"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { CountTo, FloatChip, MockCursor, MockFigure, StatusPill, Window, pounds } from "@/components/ui/Mock";

const TOTAL = 41280;
/* The curve, in viewBox units: flat while GOLEM learns the business, then two climbs. */
const LINE = "M0,186 L150,184 L255,128 L312,112 L412,104 L506,26";
const END = { x: 506, y: 26 };

/**
 * Margin protected, accumulating over a quarter. The figure counts up as the
 * line is drawn, and a tooltip marks where the quarter ends.
 */
export function ImpactChartMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 line drawn and figure counted · 2 the last point is read
  const { step, reduced } = useSequence(ref, [600, 1600], { amount: 0.5 });
  const drawn = step >= 1;
  const read = step >= 2;

  return (
    <MockFigure
      ref={ref}
      texture="none"
      label="Animation: a chart of margin protected across all sites this quarter, climbing to £41,280 in week 13."
      className={cx("h-full w-full", className)}
    >
      <FloatChip tone="ink" className="absolute left-[6%] top-0 z-20">
        Impact report sent to finance
      </FloatChip>

      <div className="absolute bottom-0 left-[6%] right-0 top-[52px]">
        <Window title="GOLEM · Impact" className="h-full rounded-b-none rounded-tr-none border-b-0 border-r-0" bodyClassName="relative px-5 pt-5">
          <p className="text-[16px] font-medium leading-none tracking-[-0.01em] text-ink">Margin protected</p>
          <p className="mt-2 text-[12px] leading-none text-faint">All sites · this quarter</p>
          <p className="mt-4 flex items-center gap-3">
            <CountTo
              value={drawn ? TOTAL : 0}
              duration={1.5}
              format={(n) => pounds(Math.round(n))}
              className="text-[30px] font-medium leading-none tracking-[-0.03em] text-ink"
            />
            <StatusPill tone="ok">3 sites</StatusPill>
          </p>

          <div className="relative mt-6">
            <svg viewBox="0 0 520 210" className="h-auto w-full overflow-visible" fill="none">
              <defs>
                <linearGradient id="impact-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[30, 108, 186].map((y) => (
                <line key={y} x1="0" x2="520" y1={y} y2={y} stroke="#e7e3dc" strokeWidth="1" />
              ))}
              <motion.path
                d={`${LINE} L506,186 L0,186 Z`}
                fill="url(#impact-fill)"
                initial={false}
                animate={{ opacity: drawn ? 1 : 0 }}
                transition={{ duration: 0.9, delay: drawn && !reduced ? 0.7 : 0 }}
              />
              <motion.path
                d={LINE}
                stroke="#7c3aed"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={{ pathLength: drawn ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 1.4, ease: EASE }}
              />
              <motion.g initial={false} animate={{ opacity: read ? 1 : 0 }} transition={{ duration: 0.3 }}>
                <line x1={END.x} x2={END.x} y1={END.y + 7} y2="186" stroke="#bdb9b0" strokeWidth="1" strokeDasharray="2 3" />
                <circle cx={END.x} cy={END.y} r="5" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" />
              </motion.g>
            </svg>

            <motion.div
              initial={false}
              animate={{ opacity: read ? 1 : 0, y: read ? 0 : 6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute right-[7%] top-[12%] rounded-[10px] border border-line bg-white px-3 py-2.5 shadow-float"
            >
              <p className="text-[10.5px] leading-none text-faint">Week 13</p>
              <p className="mt-2 flex items-center gap-2 text-[12px] leading-none text-ink">
                <span className="h-[7px] w-[7px] rounded-full bg-accent" />
                Protected <span className="ml-3 tabular-nums">{pounds(TOTAL)}</span>
              </p>
            </motion.div>
            <MockCursor x={98} y={14} visible={read} duration={0.5} />
          </div>
        </Window>
      </div>
    </MockFigure>
  );
}
