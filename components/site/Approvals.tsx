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
import {
  Reveal,
  Section,
  SectionHeader,
  SpotlightCard,
  cx,
  type RM,
} from "@/components/site/primitives";

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

const INITIAL: Item[] = [
  {
    id: "order",
    agent: "Ordering",
    icon: Boxes,
    title: "Increase Saturday order across fast-moving lines",
    rationale:
      "Saturday demand is forecast 18% above baseline. Current stock covers 71% of projected covers, with two lines projected to run out before 14:00.",
    unit: "lines",
    min: 3,
    max: 9,
    value: 6,
    perUnit: 68,
    impactLabel: "margin protected",
  },
  {
    id: "price",
    agent: "Pricing",
    icon: Tags,
    title: "Reduce weekend discount depth on three lines",
    rationale:
      "Discounts were applied to lines already selling at full rate last weekend. Demand elasticity on these lines is low; a shallower discount holds volume.",
    unit: "% depth",
    min: 8,
    max: 20,
    value: 12,
    perUnit: 37,
    impactLabel: "margin recovered",
  },
  {
    id: "labour",
    agent: "Labour",
    icon: Users,
    title: "Move one shift from Tuesday evening to Saturday midday",
    rationale:
      "Tuesday evening is over-covered against forecast footfall, while Saturday midday is short by roughly one person for the market peak.",
    unit: "shifts",
    min: 1,
    max: 3,
    value: 1,
    perUnit: 95,
    impactLabel: "labour cost avoided",
  },
];

type LogEntry = { id: string; label: string; time: string; amended: boolean };

/** Deterministic timestamps so server and client markup agree. */
const LOG_TIMES = ["06:00:04", "06:00:19", "06:00:31", "06:00:44", "06:01:02"];

/* ═══════════════════════ Queue card ═══════════════════════ */

function QueueCard({
  item,
  onApprove,
  onChange,
  reducedMotion,
}: {
  item: Item;
  onApprove: (amended: boolean) => void;
  onChange: (value: number) => void;
  reducedMotion: RM;
}) {
  const [adjusting, setAdjusting] = useState(false);
  const amended = item.value !== INITIAL.find((i) => i.id === item.id)!.value;
  const impact = item.value * item.perUnit;

  return (
    <motion.div
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, x: 60, scale: 0.96, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
      }
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="surface-raised rounded-xl p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10">
          <item.icon className="h-4 w-4 text-accent" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-w-faint">
              {item.agent} agent
            </span>
            <span className="rounded-full border border-w-border bg-w-bg px-2 py-0.5 text-[10px] font-medium text-w-muted">
              Awaiting approval
            </span>
            {amended && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                Amended
              </span>
            )}
          </div>

          <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-w-cream">{item.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-w-muted">{item.rationale}</p>

          {/* Adjuster */}
          <AnimatePresence initial={false}>
            {adjusting && (
              <motion.div
                initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-lg border border-w-border bg-w-bg p-3">
                  <label
                    htmlFor={`adjust-${item.id}`}
                    className="flex items-center justify-between text-[12px] text-w-muted"
                  >
                    <span>Adjust {item.unit}</span>
                    <span className="font-semibold tabular-nums text-w-cream">
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
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-w-border accent-accent"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Impact + actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-semibold tabular-nums text-w-cream">
                £{impact.toLocaleString("en-GB")}
              </span>
              <span className="text-[12px] text-w-faint">{item.impactLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdjusting((v) => !v)}
                aria-expanded={adjusting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-w-border bg-w-bg px-3 py-1.5 text-[12.5px] font-medium text-w-muted transition-all duration-200 hover:border-w-border-light hover:text-w-cream active:scale-[0.97]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Adjust
              </button>
              <button
                onClick={() => onApprove(amended)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-w-cream px-3.5 py-1.5 text-[12.5px] font-medium text-w-bg transition-all duration-200 hover:bg-w-cream/85 active:scale-[0.97]"
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
}

/* ═══════════════════════ Section ═══════════════════════ */

export function ApprovalsSection({ reducedMotion }: { reducedMotion: RM }) {
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
    <Section id="approvals">
      <SectionHeader
        eyebrow="Governance"
        title={
          <>
            Nothing executes until <span className="text-gradient-accent">someone approves it</span>.
          </>
        }
        subtitle="This is the 06:00 queue as an operator sees it. Adjust any recommendation, approve it, and watch it reach the audit log. Every action carries its reasoning and its expected impact."
      />

      <Reveal delay={0.1} className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[1.35fr_1fr]">
        {/* Queue */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-w-faint">
              Daily plan · {items.length} pending
            </h3>
            {reviewed > 0 && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-[12px] text-w-muted transition-colors hover:text-w-cream"
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
                className="surface-raised flex flex-col items-center rounded-xl px-6 py-12 text-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-accent/10">
                  <ClipboardCheck className="h-5 w-5 text-accent" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[16px] font-semibold text-w-cream">Plan approved</h3>
                <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-w-muted">
                  Orders are placed, prices are updated and the rota is published. The full decision
                  record is retained for audit.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-w-border bg-w-bg px-3.5 py-2 text-[13px] font-medium text-w-cream transition-colors hover:bg-w-bg-secondary"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Run it again
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Audit rail. Sticky on desktop so it stays beside the queue as cards clear. */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SpotlightCard className="surface-raised rounded-xl p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-w-faint">
                Session impact
              </h3>
            </div>

            <div className="mt-4">
              <div className="text-[32px] font-semibold leading-none tabular-nums text-w-cream">
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
              <p className="mt-1.5 text-[12.5px] text-w-muted">
                Expected impact from approved actions
              </p>
            </div>

            {/* Progress meter: fill and track are steps of the same ramp */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] text-w-faint">
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
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </SpotlightCard>

          <div className="surface-raised rounded-xl p-5">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-w-faint">
              Audit log
            </h3>

            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <Check className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] leading-snug text-w-text">Overnight modelling complete</p>
                  <p className="font-mono text-[11px] text-w-dim">06:00:00</p>
                </div>
              </li>

              <AnimatePresence initial={false}>
                {log.map((entry) => (
                  <motion.li
                    key={entry.id}
                    initial={reducedMotion ? false : { opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-2.5 overflow-hidden"
                  >
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <Check className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] leading-snug text-w-text">
                        {entry.label}
                        {entry.amended && <span className="text-w-faint"> (amended)</span>}
                      </p>
                      <p className="font-mono text-[11px] text-w-dim">{entry.time}</p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>

              {log.length === 0 && (
                <li className="pt-1 text-[12.5px] leading-relaxed text-w-dim">
                  Approve a recommendation to write the first entry.
                </li>
              )}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
