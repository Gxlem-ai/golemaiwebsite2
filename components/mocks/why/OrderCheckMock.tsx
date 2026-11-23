"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { CountTo, FloatChip, Marked, MockCursor, MockFigure, MockLabel, ResultMark, SkeletonLine, Window } from "@/components/ui/Mock";

const LINES = [
  { item: "Sourdough loaf", qty: "×40", short: true },
  { item: "Seeded batch", qty: "×24", short: false },
  { item: "Croissant", qty: "×60", short: true },
] as const;

/**
 * A supplier order checked against the forecast before it is sent: the lines
 * are read one by one, the shortfall is counted, and the margin it would have
 * cost is reported as protected.
 */
export function OrderCheckMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 to 3 one order line read each · 4 shortfall counted
  // 5 compared with the forecast · 6 margin reported
  const { step } = useSequence(ref, [800, 600, 600, 700, 900, 500], { amount: 0.5 });
  const read = Math.min(LINES.length, step);
  const counted = step >= 4;
  const compared = step >= 5;
  const reported = step >= 6;

  return (
    <MockFigure
      ref={ref}
      texture="none"
      label="Animation: Saturday's supplier order is checked against the forecast before it is placed. It is 44 loaves short; the order is corrected and £408 of margin is protected."
      className={cx("h-full w-full", className)}
    >
      <FloatChip tone="accent" pulse={!reported} className="absolute left-[6%] top-0 z-20 max-w-[88%]">
        <span className="truncate">Checking Saturday’s order against the forecast</span>
      </FloatChip>
      <motion.div
        initial={false}
        animate={{ opacity: reported ? 1 : 0, y: reported ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute left-[14%] top-[40px] z-20 max-w-[84%] sm:left-[36%]"
      >
        <FloatChip tone="ok">
          <span className="truncate">£408 of margin protected before the order is placed</span>
        </FloatChip>
      </motion.div>

      {/* The order as drafted */}
      <div className="absolute bottom-0 left-[6%] top-[62px] w-[60%] max-w-[300px]">
        <Window title="Supplier order · Saturday" brand={false} className="h-full rounded-b-none border-b-0" bodyClassName="px-4 pt-4">
          <MockLabel>§ Bakery order</MockLabel>
          <div className="mt-3.5 space-y-2">
            <SkeletonLine w="78%" />
            <SkeletonLine w="52%" />
          </div>
          <ul className="mt-4 space-y-4">
            {LINES.map((line, i) => (
              <li key={line.item}>
                <p className="text-[13px] leading-none text-copy">
                  {line.item}{" "}
                  <Marked on={i < read} tone={line.short ? "terra" : "accent"}>
                    {line.qty}
                  </Marked>
                </p>
                <div className="mt-2.5 space-y-2">
                  <SkeletonLine w={i === 1 ? "64%" : "86%"} />
                </div>
              </li>
            ))}
          </ul>
        </Window>
        <MockCursor x={56} y={read === 0 ? 30 : 37 + Math.min(read, 3) * 13.5} visible={step >= 1 && step <= 3} duration={0.5} />
      </div>

      {/* The check */}
      <div className="absolute bottom-0 right-[6%] top-[96px] w-[46%] max-w-[226px]">
        <Window chrome={false} className="h-full rounded-b-none border-b-0" bodyClassName="px-4 pt-4">
          <p className="flex items-center gap-1.5 text-[11px] leading-none text-faint">
            <span className="font-semibold tracking-[-0.02em] text-ink">GOLEM</span> Order check
          </p>
          <p className="mt-4 text-[12px] leading-none text-muted">Short of forecast</p>
          <p className="mt-2 text-[38px] font-medium leading-none tracking-[-0.03em] text-terra-deep">
            <CountTo value={counted ? 44 : 0} duration={0.9} />
            <span className="ml-1.5 text-[13px] font-normal tracking-normal text-muted">loaves</span>
          </p>
          <dl className="mt-4 divide-y divide-line border-t border-line text-[12.5px]">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-muted">Forecast need</dt>
              <dd className="flex items-center gap-2 tabular-nums text-ink">
                84 <ResultMark ok className={cx("transition-opacity duration-300", !compared && "opacity-0")} />
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-muted">Drafted order</dt>
              <dd className="flex items-center gap-2 tabular-nums text-terra-deep">
                40 <ResultMark ok={false} className={cx("transition-opacity duration-300", !compared && "opacity-0")} />
              </dd>
            </div>
          </dl>
        </Window>
      </div>
    </MockFigure>
  );
}
