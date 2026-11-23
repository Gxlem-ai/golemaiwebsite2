"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { useSequence } from "@/components/ui/hooks";
import { MockCursor, MockFigure, MockLabel, SkeletonLine, Window } from "@/components/ui/Mock";

const FIGURES = [
  { key: "covers", label: "Forecast covers", sub: "Sat", value: "720" },
  { key: "stock", label: "Stock cover", sub: "six fast lines", value: "71%" },
  { key: "margin", label: "Margin", sub: "yesterday", value: "+3.1 pts" },
  { key: "labour", label: "Labour", sub: "Sat midday", value: "1 short" },
] as const;

/** The figure the animation traces, and the row it was read from. */
const TRACED = "stock";

const STOCK = [
  null,
  { item: "Oat milk 1L", qty: "9 on hand" },
  null,
  { item: "Sourdough loaf", qty: "12 on hand", source: true },
  null,
  { item: "Seeded batch", qty: "18 on hand" },
  { item: "Butter 250g", qty: "14 on hand" },
  null,
] as const;

type Link = { x1: number; y1: number; x2: number; y2: number; w: number; h: number };

/**
 * A figure traced to its source. A pointer selects one number in the morning
 * brief; a line runs from it to the row of the stock count it was read from,
 * and a card names the system and the time of the reading.
 */
export function SourceTraceMock({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLLIElement>(null);
  const toRef = useRef<HTMLLIElement>(null);
  // 0 at rest · 1 pointer travels · 2 press · 3 figure selected, line drawn
  // 4 source row found · 5 source named
  const { step } = useSequence(ref, [900, 1000, 240, 750, 500]);
  const selected = step >= 3;
  const found = step >= 4;
  const named = step >= 5;

  // The connector's ends are measured from the two real rows, so the curve
  // meets them exactly at any card width.
  const [link, setLink] = useState<Link | null>(null);
  const measure = useCallback(() => {
    const fig = ref.current;
    const a = fromRef.current;
    const b = toRef.current;
    if (!fig || !a || !b) return;
    const f = fig.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    if (br.width === 0) {
      setLink(null); // The source window is hidden on narrow screens.
      return;
    }
    setLink({
      x1: ar.right - f.left,
      y1: ar.top + ar.height / 2 - f.top,
      x2: br.left - f.left,
      y2: br.top + br.height / 2 - f.top,
      w: f.width,
      h: f.height,
    });
  }, []);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    const fig = ref.current;
    if (!fig) return;
    const observer = new ResizeObserver(measure);
    observer.observe(fig);
    return () => observer.disconnect();
  }, [measure]);

  const mid = link ? (link.x1 + link.x2) / 2 : 0;
  const path = link ? `M${link.x1},${link.y1} C${mid},${link.y1} ${mid},${link.y2} ${link.x2},${link.y2}` : "";

  // The pointer aims at the traced figure; without a measurement it uses a
  // sensible spot inside the left-hand window.
  const aim = link ? { x: ((link.x1 - 44) / link.w) * 100, y: (link.y1 / link.h) * 100 } : { x: 62, y: 40 };

  return (
    <MockFigure
      ref={ref}
      texture="ruled"
      label="Animation: a pointer selects the stock cover figure in the morning brief. A line connects it to the row of the inventory count it was read from, and a card states the source and the time it was read."
      className={cx("h-full w-full", className)}
    >
      {/* The brief */}
      <div className="absolute left-4 right-4 top-5 sm:left-[5%] sm:right-auto sm:w-[41%] sm:max-w-[272px]">
        <Window title="GOLEM · Morning brief">
          <div className="flex items-end justify-between px-3.5 pb-2.5 pt-3">
            <div>
              <p className="text-[15px] leading-tight text-ink">Saturday</p>
              <p className="mt-0.5 text-[11px] leading-tight text-faint">High Street</p>
            </div>
            <p className="text-[11px] leading-tight text-faint">{named ? "1 traced" : "4 figures"}</p>
          </div>
          <ul className="divide-y divide-line border-t border-line">
            {FIGURES.map((figure) => {
              const traced = figure.key === TRACED;
              const lit = traced && selected;
              return (
                <li
                  key={figure.key}
                  ref={traced ? fromRef : undefined}
                  className={cx(
                    "relative flex h-[42px] items-center justify-between gap-3 px-3.5 transition-colors duration-500",
                    lit && "bg-accent-wash"
                  )}
                >
                  {lit ? <span className="absolute inset-y-0 left-0 w-0.5 bg-accent" /> : null}
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] leading-tight text-ink">{figure.label}</span>
                    <span className="mt-0.5 block truncate text-[10.5px] leading-tight text-faint">{figure.sub}</span>
                  </span>
                  <span className={cx("text-[13px] tabular-nums", traced ? "text-terra-deep" : "text-ink")}>{figure.value}</span>
                </li>
              );
            })}
          </ul>
        </Window>

        <div className="relative mt-2.5 h-[80px]">
          <AnimatePresence mode="wait" initial={false}>
            {named ? (
              <motion.div
                key="source"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-0 rounded-window border border-accent/25 bg-accent-wash px-3.5 py-3"
              >
                <MockLabel tone="accent">§ Source · Inventory</MockLabel>
                <p className="mt-1.5 text-[13px] leading-tight text-ink">Stock count, High Street</p>
                <p className="mt-1 truncate text-[11.5px] leading-tight text-accent-ink">Read 05:57 · 6 lines below Saturday cover</p>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center gap-2.5 rounded-window border border-line bg-white px-3.5"
              >
                <MousePointer2 className="h-3.5 w-3.5 shrink-0 text-faint" strokeWidth={1.8} />
                <p className="text-[12.5px] leading-snug text-muted">Select a figure to trace it to its source</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* The source */}
      <div className="absolute bottom-0 left-[54%] top-3 hidden w-[40%] max-w-[258px] sm:block">
        <Window title="Source · Inventory" brand={false} className="h-full rounded-b-none border-b-0">
          <div className="px-3.5 pb-2 pt-3">
            <p className="text-[15px] leading-tight text-ink">Stock count</p>
            <MockLabel className="mt-1.5 block">218 lines · read 05:57</MockLabel>
          </div>
          <ul className="border-t border-line px-2 pt-1.5">
            {STOCK.map((row, i) => {
              if (!row) {
                return (
                  <li key={i} className={cx("space-y-1.5 px-1.5 py-[9px] transition-opacity duration-500", found && "opacity-50")}>
                    <SkeletonLine w={i % 2 === 0 ? "72%" : "58%"} />
                    <SkeletonLine w={i % 2 === 0 ? "44%" : "66%"} />
                  </li>
                );
              }
              const isSource = "source" in row;
              const lit = isSource && found;
              return (
                <li
                  key={i}
                  ref={isSource ? toRef : undefined}
                  className={cx(
                    "relative rounded-[6px] px-1.5 py-[7px] text-[11.5px] leading-tight transition-all duration-500",
                    lit ? "bg-accent-wash text-ink" : "text-copy",
                    found && !lit && "opacity-50"
                  )}
                >
                  {lit ? <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" /> : null}
                  <span className="font-medium text-ink">{row.item}</span> · {row.qty}
                </li>
              );
            })}
          </ul>
        </Window>
      </div>

      {/* The connector */}
      {link ? (
        <svg className="pointer-events-none absolute inset-0 z-20 hidden h-full w-full sm:block" fill="none">
          <motion.path
            d={path}
            stroke="#7c3aed"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
            transition={{ pathLength: { duration: 0.7, ease: EASE }, opacity: { duration: 0.15 } }}
          />
          <motion.circle cx={link.x1} cy={link.y1} r="3" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.5" initial={false} animate={{ opacity: selected ? 1 : 0 }} />
          <motion.circle cx={link.x2} cy={link.y2} r="3" fill="#7c3aed" initial={false} animate={{ opacity: found ? 1 : 0 }} />
        </svg>
      ) : null}

      <MockCursor x={step >= 1 ? aim.x : aim.x + 16} y={step >= 1 ? aim.y + 1 : aim.y + 26} visible={step >= 1 && step <= 4} press={step === 2} />
    </MockFigure>
  );
}
