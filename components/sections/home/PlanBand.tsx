"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Band, TwoTone } from "@/components/ui/Layout";
import { MockCursor, MockLabel, ResultMark, StatusPill, pounds } from "@/components/ui/Mock";
import { Reveal } from "@/components/ui/Reveal";
import { cx, EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { PLAN, PLAN_IMPACT, SATURDAY, SOURCES, TRADING } from "@/content/demo";
import { HOME } from "@/content/home";

const STEPS = ["Connect", "Model", "Approve", "Execute"] as const;
/** How long each step is shown, and how finely its own animation is divided. */
const STEP_MS = 4200;
const BEATS = 8;
const LOOP_MS = STEP_MS * STEPS.length;
const APPROVE = 2;

/**
 * The dark band that introduces the daily plan: the claim on the left and, on
 * the right, a stage that plays the plan's four steps on a loop.
 */
export function PlanBand() {
  const { planBand } = HOME;
  return (
    <Band glow="bc">
      <div className="grid items-center gap-x-[85px] gap-y-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Reveal>
          <TwoTone onDark as="h2" className="text-h2 font-medium" lead={planBand.h2Lead} rest={planBand.h2Muted} />
          <p className="mt-7 text-pretty text-para text-white/80">{planBand.body}</p>
          <div className="mt-8">
            <Button href="/product#how" size="lg">
              {planBand.cta}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <PlanStage />
        </Reveal>
      </div>
    </Band>
  );
}

/* ═══════════════════════ Stage ═══════════════════════ */

/**
 * One clock drives everything on the stage: `time` is milliseconds into the
 * loop. The progress rule and the ring read it directly as motion values;
 * React re-renders only when the step or the beat within it changes. Pausing
 * stops the clock, so every part of the stage freezes together.
 */
function PlanStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { amount: 0.3 });
  const [playing, setPlaying] = useState(true);
  const [at, setAt] = useState({ step: 0, beat: 0 });
  const time = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (!playing || !inView || reduced) return;
    // Cap the delta so a background tab does not leap ahead on return.
    const next = (time.get() + Math.min(delta, 64)) % LOOP_MS;
    time.set(next);
    const step = Math.floor(next / STEP_MS);
    const beat = Math.floor(((next % STEP_MS) / STEP_MS) * BEATS);
    setAt((prev) => (prev.step === step && prev.beat === beat ? prev : { step, beat }));
  });

  // Reduced motion: one still frame, the plan approved.
  const step = reduced ? APPROVE : at.step;
  const beat = reduced ? BEATS - 1 : at.beat;

  const stepProgress = useTransform(time, (t) => (t % STEP_MS) / STEP_MS);
  const loopProgress = useTransform(time, (t) => t / LOOP_MS);

  return (
    <div
      ref={ref}
      role="group"
      aria-label="The daily plan, step by step: connect, model, approve, execute"
      className="stage relative h-[520px] rounded-card"
    >
      <p className="sr-only">
        GOLEM reads the point of sale and back office, models the day ahead overnight, presents a daily plan of three
        actions for approval, and carries out only what is approved, writing each step to the ledger.
      </p>

      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center px-3 pt-[46px] sm:px-4">
        {/* Step pills */}
        <div className="flex items-center">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 ? (
                <span className="relative mx-1.5 w-4 border-t border-dashed border-white/45 sm:mx-2 sm:w-7">
                  {i === step && !reduced ? (
                    <motion.span
                      key={`dot-${step}`}
                      className="absolute -top-[3px] h-[5px] w-[5px] rounded-full bg-white"
                      initial={{ left: "0%", opacity: 0 }}
                      animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ) : null}
                </span>
              ) : null}
              <motion.span
                animate={{ scale: i === step ? 1.04 : 1 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={cx(
                  "flex h-[22px] items-center rounded-[6px] px-2 font-mono text-[10.5px] uppercase leading-none tracking-[0.08em] transition-colors duration-300 sm:text-[11px]",
                  i === step ? "bg-white text-ink shadow-[0_0_0_4px_rgba(255,255,255,0.25)]" : "bg-white/25 text-white"
                )}
              >
                {label}
              </motion.span>
            </React.Fragment>
          ))}
        </div>

        {/* Panel */}
        <div className="relative mt-7 h-[344px] w-full max-w-[510px] overflow-hidden rounded-[10px] bg-white shadow-[0_24px_60px_-22px_rgba(60,20,140,0.5)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute inset-0 px-4 pb-4 pt-4 sm:px-5"
            >
              <Scene step={step} beat={beat} progress={stepProgress} still={reduced} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      {reduced ? null : (
        <div className="absolute inset-x-0 bottom-[26px] flex items-center justify-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause the animation" : "Play the animation"}
            aria-pressed={!playing}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-float transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <svg aria-hidden="true" viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
              <circle cx="18" cy="18" r="16.5" fill="none" stroke="#e9defc" strokeWidth="1.5" />
              <motion.circle cx="18" cy="18" r="16.5" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: loopProgress }} />
            </svg>
            {playing ? <Pause className="h-3 w-3" fill="currentColor" strokeWidth={0} /> : <Play className="ml-px h-3 w-3" fill="currentColor" strokeWidth={0} />}
          </button>

          <div aria-hidden="true" className="mask-fade-x h-[34px] w-full max-w-[350px] overflow-hidden rounded-lg bg-white/70">
            <div
              className="flex h-full w-max animate-marquee items-center font-mono text-[12px] lowercase text-muted"
              style={{ animationDuration: "26s", animationPlayState: playing ? "running" : "paused" }}
            >
              {[0, 1].map((copy) => (
                <span key={copy} className="flex shrink-0 items-center">
                  {SOURCES.map((s) => (
                    <span key={s.key} className="px-2.5">
                      {s.label} ·
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ Scenes ═══════════════════════ */

function Header({
  meta,
  status,
  title,
  progress,
  still,
}: {
  meta: string;
  status: string;
  title: string;
  progress: MotionValue<number>;
  still: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between text-[12px] leading-none text-muted">
        <span>{meta}</span>
        <span>{status}</span>
      </div>
      <p className="mt-2.5 text-[17px] leading-tight tracking-[-0.02em] text-ink">{title}</p>
      <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-line">
        <motion.div className="h-full origin-left bg-accent" style={still ? { scaleX: 1 } : { scaleX: progress }} />
      </div>
    </>
  );
}

function TickRow({ children, on }: { children: React.ReactNode; on: boolean }) {
  return (
    <motion.li
      initial={false}
      animate={{ opacity: on ? 1 : 0.28 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between gap-3 py-[11px] text-[13px] leading-none text-ink"
    >
      {children}
      {on ? (
        <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}>
          <ResultMark ok />
        </motion.span>
      ) : (
        <span className="h-[15px] w-[15px] rounded-full border border-dashed border-line-strong" />
      )}
    </motion.li>
  );
}

/** Deterministic PRNG, so the scenario fan is identical on server and client. */
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

function ScenarioFan({ still }: { still: boolean }) {
  const paths = useMemo(() => {
    const rand = mulberry32(2211);
    return Array.from({ length: 30 }, () => {
      // The mean of three uniforms is near-normal, so the fan bunches in the middle.
      const g = (rand() + rand() + rand()) / 3 - 0.5;
      return `M8,64 C150,64 300,${(64 + g * 50).toFixed(1)} 462,${(64 + g * 150).toFixed(1)}`;
    });
  }, []);
  return (
    <svg viewBox="0 0 470 128" className="mt-4 h-auto w-full">
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="#7c3aed"
          strokeOpacity="0.17"
          strokeWidth="0.9"
          initial={still ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: (i % 10) * 0.05, ease: EASE }}
        />
      ))}
      <motion.path
        d="M8,64 C150,64 300,60 462,52"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={still ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.3, delay: 0.5, ease: EASE }}
      />
      <circle cx="8" cy="64" r="4" fill="#7c3aed" />
    </svg>
  );
}

function Scene({
  step,
  beat,
  progress,
  still,
}: {
  step: number;
  beat: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  if (step === 0) {
    const rows = [
      `${TRADING.transactions} transactions read`,
      "218 stock lines read",
      "Next week’s rota read",
    ];
    return (
      <>
        <Header meta="From: point of sale" status="Reading" title="Friday close · High Street" progress={progress} still={still} />
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
          <span className="rounded-[4px] bg-ink px-1.5 py-1 text-[9px] font-bold leading-none text-white">CSV</span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] leading-tight text-ink">friday-close.csv</span>
            <span className="mt-0.5 block text-[11px] leading-tight text-faint">
              {TRADING.transactions} transactions · {pounds(TRADING.revenue)}
            </span>
          </span>
        </div>
        <ul className="mt-1.5 divide-y divide-line">
          {rows.map((row, i) => (
            <TickRow key={row} on={beat >= 1 + i * 2}>
              {row}
            </TickRow>
          ))}
        </ul>
        <motion.div
          initial={false}
          animate={{ opacity: beat >= 6 ? 1 : 0, y: beat >= 6 ? 0 : 6 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-1.5 rounded-lg border border-line bg-paper-soft px-3 py-2.5"
        >
          <MockLabel>Record updated 05:58</MockLabel>
        </motion.div>
      </>
    );
  }

  if (step === 1) {
    const ready = beat >= 4;
    return (
      <>
        <Header meta="Overnight model" status="Modelling" title={`Saturday · ${TRADING.scenarios.toLocaleString("en-GB")} scenarios`} progress={progress} still={still} />
        <ScenarioFan still={still} />
        <motion.div
          initial={false}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 6 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3"
        >
          <div>
            <MockLabel>Forecast</MockLabel>
            <p className="mt-1.5 text-[18px] font-medium leading-none tracking-[-0.02em] text-ink">{SATURDAY.forecast} covers</p>
          </div>
          <StatusPill tone="accent">+{SATURDAY.upliftPct}% vs baseline</StatusPill>
        </motion.div>
      </>
    );
  }

  if (step === APPROVE) {
    const approved = beat >= 6;
    return (
      <div className="relative h-full">
        <Header
          meta={`Daily plan · ${PLAN.readyAt}`}
          status={approved ? `Approved ${PLAN.approvedAt}` : "Awaiting approval"}
          title="Three actions for Saturday"
          progress={progress}
          still={still}
        />
        <ul className="mt-3 divide-y divide-line">
          {PLAN.actions.map((action) => (
            <li key={action.key} className="flex items-center justify-between gap-3 py-[10px]">
              <span className="min-w-0">
                <span className="block text-[13px] leading-tight text-ink">{action.agent}</span>
                <span className="mt-0.5 block truncate text-[11px] leading-tight text-faint">{action.short}</span>
              </span>
              <span className="text-[12.5px] tabular-nums text-muted">{pounds(action.impact)}</span>
            </li>
          ))}
        </ul>
        <div
          className={cx(
            "mt-3 flex items-center justify-between gap-3 rounded-[10px] border px-3 py-2.5 transition-colors duration-500",
            approved ? "border-ok/25 bg-ok-wash" : "border-accent/25 bg-accent-wash"
          )}
        >
          <span className="text-[13px] leading-tight text-ink">
            {pounds(PLAN_IMPACT)} <span className="text-muted">expected impact</span>
          </span>
          <span
            className={cx(
              "inline-flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-[11.5px] font-medium text-white transition-colors duration-300",
              approved ? "bg-ok" : "bg-accent"
            )}
          >
            {approved ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
            {approved ? "Approved" : "Approve"}
          </span>
        </div>
        <MockCursor x={beat >= 3 ? 88 : 60} y={beat >= 3 ? 84 : 40} visible={!still && beat >= 3 && beat <= 6} press={beat === 5} duration={0.8} />
      </div>
    );
  }

  const done = ["Order sent to the supplier", "Prices updated at the till", "Rota published", "Written to the ledger"];
  return (
    <>
      <Header meta={`Executed ${PLAN.approvedAt}`} status="Done" title="Approved and carried out" progress={progress} still={still} />
      <ul className="mt-3 divide-y divide-line">
        {done.map((row, i) => (
          <TickRow key={row} on={beat >= 1 + i}>
            {row}
          </TickRow>
        ))}
      </ul>
      <motion.div
        initial={false}
        animate={{ opacity: beat >= 6 ? 1 : 0, y: beat >= 6 ? 0 : 6 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mt-2 rounded-lg border border-ok/25 bg-ok-wash px-3 py-2.5"
      >
        <MockLabel tone="ok">Nothing edited afterwards</MockLabel>
      </motion.div>
    </>
  );
}
