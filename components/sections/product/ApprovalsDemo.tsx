"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes,
  Check,
  ClipboardCheck,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
  Users,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Reveal";
import { cx, EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { PLAN } from "@/content/demo";
import { PRODUCT } from "@/content/product";

/* ═══════════════════════ Queue definition ═══════════════════════ */

type Item = {
  id: string;
  agent: string;
  icon: typeof Boxes;
  title: string;
  rationale: string;
  /** Adjustable quantity the operator can tune before approving. */
  unit: string;
  min: number;
  max: number;
  value: number;
  /** Money impact per unit, in pounds. */
  perUnit: number;
  impactLabel: string;
};

const ICONS = { order: Boxes, price: Tags, labour: Users } as const;

/* What an operator can tune on each recommendation before approving it. At
   the starting values the impact equals the figure quoted in the daily plan. */
const TUNING = {
  order: { unit: "lines", min: 3, max: 9, value: 6, perUnit: 68 },
  price: { unit: "% depth", min: 8, max: 20, value: 12, perUnit: 37 },
  labour: { unit: "shifts", min: 1, max: 3, value: 1, perUnit: 95 },
} as const;

const INITIAL: Item[] = PLAN.actions.map((action) => ({
  id: action.key,
  agent: action.agent,
  icon: ICONS[action.key],
  title: action.title,
  rationale: action.reason,
  impactLabel: action.impactLabel,
  ...TUNING[action.key],
}));

type LogEntry = { id: string; label: string; time: string; amended: boolean };

/** Deterministic timestamps so server and client markup agree. */
const LOG_TIMES = ["06:02:11", "06:02:26", "06:02:40", "06:02:52", "06:03:05"];

/* ═══════════════════════ Queue card ═══════════════════════ */

/* AnimatePresence in "popLayout" mode measures its children, so the card has
   to pass a ref through to its root element. */
const QueueCard = React.forwardRef<
  HTMLDivElement,
  {
    item: Item;
    onApprove: (amended: boolean) => void;
    onChange: (value: number) => void;
    reducedMotion: boolean;
  }
>(function QueueCard({ item, onApprove, onChange, reducedMotion }, ref) {
  const [adjusting, setAdjusting] = useState(false);
  const amended = item.value !== INITIAL.find((i) => i.id === item.id)!.value;
  const impact = item.value * item.perUnit;

  return (
    <motion.div
      ref={ref}
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, x: 60, scale: 0.96, transition: { duration: 0.35, ease: EASE } }
      }
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-card border border-line bg-white p-4 shadow-card sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-paper-soft">
          <item.icon className="h-4 w-4 text-ink" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-faint">
              {item.agent} agent
            </span>
            <span className="rounded-full bg-accent-wash px-2 py-0.5 text-[10px] font-medium text-accent-ink">
              Awaiting approval
            </span>
            {amended && (
              <span className="rounded-full bg-terra-wash px-2 py-0.5 text-[10px] font-medium text-terra-deep">
                Amended
              </span>
            )}
          </div>

          <h3 className="mt-2 text-[16px] font-medium leading-snug tracking-[-0.01em] text-ink">{item.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.rationale}</p>

          {/* Adjuster */}
          <AnimatePresence initial={false}>
            {adjusting && (
              <motion.div
                initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-lg border border-line bg-white p-3">
                  <label
                    htmlFor={`adjust-${item.id}`}
                    className="flex items-center justify-between text-[12px] text-muted"
                  >
                    <span>Adjust {item.unit}</span>
                    <span className="font-semibold tabular-nums text-ink">
                      {item.value} {item.unit}
                    </span>
                  </label>
                  <input
                    id={`adjust-${item.id}`}
                    type="range"
                    min={item.min}
                    max={item.max}
                    value={item.value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="mt-3 h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-float"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Impact + actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-medium tabular-nums tracking-[-0.02em] text-ink">
                £{impact.toLocaleString("en-GB")}
              </span>
              <span className="text-[12px] text-faint">{item.impactLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdjusting((v) => !v)}
                aria-expanded={adjusting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-[12.5px] font-medium text-muted transition-all duration-200 hover:border-line-strong hover:text-ink active:scale-[0.97]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Adjust
              </button>
              <button
                onClick={() => onApprove(amended)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-1.5 text-[12.5px] font-medium text-white transition-all duration-200 hover:bg-accent-deep active:scale-[0.97]"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════ Section ═══════════════════════ */

export function ApprovalsDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const { approvalsDemo } = PRODUCT;
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [log, setLog] = useState<LogEntry[]>([]);

  // Running total of the impact actually approved, using the values at approval time.
  const [banked, setBanked] = useState(0);

  const reviewed = INITIAL.length - items.length;
  const progress = (reviewed / INITIAL.length) * 100;

  const approve = (item: Item, amended: boolean) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setBanked((b) => b + item.value * item.perUnit);
    setLog((prev) => [
      ...prev,
      {
        id: item.id,
        label: `${item.agent} · ${item.value} ${item.unit} approved`,
        time: LOG_TIMES[Math.min(prev.length, LOG_TIMES.length - 1)],
        amended,
      },
    ]);
  };

  const reset = () => {
    setItems(INITIAL);
    setLog([]);
    setBanked(0);
  };

  return (
    <section id="approvals" className="bg-paper-soft py-16 sm:py-20 lg:py-24">
      <Container>
        <Reveal className="mx-auto max-w-[760px] text-center">
          <Eyebrow kind="dot">{approvalsDemo.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-balance text-h2 text-ink">{approvalsDemo.h2}</h2>
          <p className="mx-auto mt-4 max-w-[640px] text-pretty text-para text-muted">{approvalsDemo.sub}</p>
        </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-[1100px] gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* Queue */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-mono text-label uppercase text-muted">
              Daily plan · {items.length} pending
            </h3>
            {reviewed > 0 && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-[12px] text-muted transition-colors hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset queue
              </button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <QueueCard
                  key={item.id}
                  item={item}
                  reducedMotion={reducedMotion}
                  onApprove={(amended) => approve(item, amended)}
                  onChange={(value) =>
                    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, value } : i)))
                  }
                />
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center rounded-card border border-line bg-white px-6 py-12 text-center shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-accent/10">
                  <ClipboardCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-ink">Plan approved</h3>
                <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted">
                  Orders are placed, prices are updated and the rota is published. Every decision is in
                  the ledger.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-paper-soft"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Run it again
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Audit rail. Sticky on desktop so it stays beside the queue as cards clear. */}
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-card border border-line bg-white p-5 shadow-card">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              <h3 className="font-mono text-label uppercase text-muted">Session impact</h3>
            </div>

            <div className="mt-4">
              <div className="text-[34px] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">
                £
                <motion.span
                  key={banked}
                  initial={reducedMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {banked.toLocaleString("en-GB")}
                </motion.span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-muted">
                Expected impact from approved actions
              </p>
            </div>

            {/* Progress meter: fill and track are steps of the same ramp */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] text-faint">
                <span>Reviewed</span>
                <span className="tabular-nums">
                  {reviewed} of {INITIAL.length}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-accent/15">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-card border border-line bg-white p-5 shadow-card">
            <h3 className="font-mono text-label uppercase text-muted">Ledger</h3>

            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <Check className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] leading-snug text-copy">Forecast written · Fri 22:14</p>
                  <p className="font-mono text-[11px] text-faint">22:14:07</p>
                </div>
              </li>

              <AnimatePresence initial={false}>
                {log.map((entry) => (
                  <motion.li
                    key={entry.id}
                    initial={reducedMotion ? false : { opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="flex items-start gap-2.5 overflow-hidden"
                  >
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <Check className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] leading-snug text-copy">
                        {entry.label}
                        {entry.amended && <span className="text-faint"> (amended)</span>}
                      </p>
                      <p className="font-mono text-[11px] text-faint">{entry.time}</p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>

              {log.length === 0 && (
                <li className="pt-1 text-[12.5px] leading-relaxed text-faint">
                  Approve a recommendation to write the next entry.
                </li>
              )}
            </ul>
          </div>
        </div>
      </Reveal>
      </Container>
    </section>
  );
}
