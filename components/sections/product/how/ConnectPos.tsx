"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { FloatChip, MockLabel, Window } from "@/components/ui/Mock";
import { CheckRow, Scene } from "@/components/sections/product/how/Scene";

const SOURCES = ["Point of sale", "Payments", "Inventory"];
const ROWS = ["Authorised by the owner", "218 items and prices read", "90 days of transactions read"];

/** Step 1: the point of sale is connected, with nothing new to install. */
export function ConnectPos() {
  const ref = useRef<HTMLDivElement>(null);
  // 0 connecting · 1 to 3 one check passes each · 4 connected
  const { step } = useSequence(ref, [600, 550, 550, 650]);
  const passed = Math.min(ROWS.length, step);
  const connected = step >= 4;

  return (
    <Scene
      ref={ref}
      label="Animation: the point of sale is authorised, its items and ninety days of transactions are read, and the connection completes in 24 minutes with no new hardware."
    >
      <div className="flex flex-wrap justify-center gap-2">
        {SOURCES.map((s, i) => (
          <FloatChip key={s} tone={i < passed ? "ok" : "faint"}>
            {s}
          </FloatChip>
        ))}
      </div>

      <Window title="GOLEM · Connections" bodyClassName="px-4 pb-4 pt-3.5">
        <MockLabel>High Street</MockLabel>
        <p className="mt-1.5 text-[16px] leading-tight tracking-[-0.02em] text-ink">Connecting the point of sale</p>
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {ROWS.map((row, i) => (
            <CheckRow key={row} on={i < passed}>
              {row}
            </CheckRow>
          ))}
        </ul>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full origin-left bg-accent"
            initial={false}
            animate={{ scaleX: passed / ROWS.length }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: connected ? 1 : 0, y: connected ? 0 : 6 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-3 rounded-lg border border-ok/25 bg-ok-wash px-3 py-2"
        >
          <MockLabel tone="ok">Connected in 24 minutes</MockLabel>
          <p className="mt-1 text-[12px] leading-tight text-muted">No new hardware, no migration</p>
        </motion.div>
      </Window>
    </Scene>
  );
}
