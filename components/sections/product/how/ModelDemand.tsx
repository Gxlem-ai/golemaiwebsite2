"use client";

import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { CountTo, FloatChip, MockLabel, Window } from "@/components/ui/Mock";
import { Scene } from "@/components/sections/product/how/Scene";
import { SATURDAY, TRADING } from "@/content/demo";

/** Deterministic PRNG, so the fan is identical on server and client. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Step 4: thousands of scenarios overnight, converging on one forecast. */
export function ModelDemand() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 at rest · 1 scenarios run · 2 forecast ready
  const { step, reduced } = useSequence(ref, [450, 1700]);
  const running = step >= 1;
  const ready = step >= 2;

  const { paths, bins } = useMemo(() => {
    const rand = mulberry32(20261122);
    const ends: number[] = [];
    const paths = Array.from({ length: 40 }, () => {
      // The mean of three uniforms is near-normal, so the fan bunches in the middle.
      const g = (rand() + rand() + rand()) / 3 - 0.5;
      const end = 85 + g * 190;
      ends.push(end);
      return `M10,85 C110,85 190,${(85 + g * 60).toFixed(1)} 292,${end.toFixed(1)}`;
    });
    const counts = new Array<number>(9).fill(0);
    for (const y of ends) counts[Math.min(8, Math.max(0, Math.floor(((y - 10) / 150) * 9)))] += 1;
    const max = Math.max(...counts);
    return { paths, bins: counts.map((c, i) => ({ y: 10 + i * (150 / 9), w: (c / max) * 52, peak: c === max })) };
  }, []);

  return (
    <Scene
      ref={ref}
      label={`Animation: overnight, ${TRADING.scenarios.toLocaleString("en-GB")} demand scenarios fan out from tonight and converge on tomorrow's forecast of ${SATURDAY.forecast} covers.`}
    >
      <div className="flex justify-center">
        <FloatChip tone={ready ? "ok" : "accent"} pulse={!ready}>
          {ready ? "Forecast ready for 06:00" : "Modelling overnight"}
        </FloatChip>
      </div>

      <Window title="GOLEM · Overnight model" bodyClassName="px-4 pb-4 pt-3.5">
        <div className="flex justify-between">
          <MockLabel>Tonight</MockLabel>
          <MockLabel>Tomorrow</MockLabel>
        </div>
        <svg viewBox="0 0 360 170" className="mt-1 h-auto w-full" fill="none">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="#7c3aed"
              strokeOpacity="0.16"
              strokeWidth="0.9"
              initial={false}
              animate={{ pathLength: running ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : (i % 12) * 0.045, ease: EASE }}
            />
          ))}
          <motion.path
            d="M10,85 C110,85 190,88 292,92"
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: running ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : 0.5, ease: EASE }}
          />
          <circle cx="10" cy="85" r="4.5" fill="#7c3aed" />
          <line x1="300" x2="300" y1="10" y2="160" stroke="#dad5cc" />
          {bins.map((b, i) => (
            <motion.rect
              key={i}
              x="304"
              y={b.y + 1}
              height={150 / 9 - 2}
              rx="2"
              fill="#7c3aed"
              fillOpacity={b.peak ? 1 : 0.3}
              initial={false}
              animate={{ width: running ? b.w : 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.7 + i * 0.03, ease: EASE }}
            />
          ))}
        </svg>
        <div className="mt-2 flex items-end justify-between border-t border-line pt-3">
          <p className="text-[12px] leading-none text-muted">
            <CountTo value={running ? TRADING.scenarios : 0} duration={1.5} className="mr-1.5 text-[16px] font-medium text-ink" />
            scenarios evaluated
          </p>
          <motion.p
            initial={false}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="text-right text-[16px] font-medium leading-none tracking-[-0.01em] text-ink"
          >
            <span className="mr-2 text-[12px] font-normal text-muted">Saturday</span>
            {SATURDAY.forecast} covers
          </motion.p>
        </div>
      </Window>
    </Scene>
  );
}
