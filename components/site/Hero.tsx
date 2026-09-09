"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import {
  Aurora,
  LiveDot,
  Magnetic,
  ShinyButton,
  btnSecondary,
  cx,
  usePrefersReducedMotion,
  useLiveTicker,
  type RM,
  type ScrollTo,
} from "@/components/site/primitives";

/* ═══════════════════════ Orbital mark ═══════════════════════ */

/** Concentric rings with orbiting nodes, sitting behind the headline. */
function OrbitField({ reducedMotion }: { reducedMotion: RM }) {
  const rings = [
    { r: 96, dur: 34, dir: 1, nodes: 3 },
    { r: 152, dur: 48, dir: -1, nodes: 4 },
    { r: 216, dur: 64, dir: 1, nodes: 5 },
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-[4%] -z-10 -translate-x-1/2 scale-[0.62] sm:scale-90 lg:scale-100">
      <svg
        width="520"
        height="520"
        viewBox="-260 -260 520 520"
        aria-hidden="true"
        className="overflow-visible opacity-70"
      >
        <defs>
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(124,58,237,0.30)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0)" />
          </radialGradient>
        </defs>
        <circle r="70" fill="url(#orb-core)" />
        {rings.map((ring, i) => (
          <motion.g
            key={ring.r}
            animate={reducedMotion ? {} : { rotate: 360 * ring.dir }}
            transition={{ duration: ring.dur, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0px 0px" }}
          >
            <circle
              r={ring.r}
              fill="none"
              stroke="rgba(27,26,24,0.13)"
              strokeWidth="1"
              strokeDasharray={i === 1 ? "2 7" : undefined}
            />
            {Array.from({ length: ring.nodes }).map((_, n) => {
              const angle = (n / ring.nodes) * Math.PI * 2;
              return (
                <circle
                  key={n}
                  cx={Math.cos(angle) * ring.r}
                  cy={Math.sin(angle) * ring.r}
                  r={n === 0 ? 3.5 : 2.2}
                  fill={n === 0 ? "#7c3aed" : "rgba(27,26,24,0.3)"}
                  opacity={n === 0 ? 0.9 : 1}
                />
              );
            })}
          </motion.g>
        ))}
        <circle r="4" fill="#7c3aed" />
      </svg>
    </div>
  );
}

/* ═══════════════════════ Sparkline ═══════════════════════ */

/** 12-point trend line for the console's metric strip. One series, so no legend. */
function Sparkline({ points, className = "" }: { points: number[]; className?: string }) {
  const w = 64;
  const h = 18;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / span) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastX = w;
  const lastY = h - ((points[points.length - 1] - min) / span) * h;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={cx("overflow-visible", className)} aria-hidden="true">
      <path d={d} fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      <circle cx={lastX} cy={lastY} r="2.5" fill="#7c3aed" stroke="#fcfcfc" strokeWidth="1.5" />
    </svg>
  );
}

/* ═══════════════════════ Operations console ═══════════════════════ */

type Exchange = { q: string; a: string; chips: string[] };

const EXCHANGES: Exchange[] = [
  {
    q: "Summarise yesterday's trading.",
    a: "Revenue £4,920, 8% above the same day last week. Gross margin up 3.1 points following Tuesday's price changes. 412 transactions at an average basket of £11.94. Two lines sold out before 14:00.",
    chips: ["Revenue +8%", "Margin +3.1 pts", "2 stockouts"],
  },
  {
    q: "Prepare the weekend order and rota.",
    a: "Saturday footfall is forecast 18% above baseline, driven by the market and clear weather. The draft order covers six fast-moving lines and holds three slow movers. One additional midday shift is recommended.",
    chips: ["6 lines reordered", "+1 shift", "Awaiting approval"],
  },
  {
    q: "Where is margin being lost?",
    a: "Weekend discounts were over-applied on three lines, and one supplier raised prices 4% this month. Two price tests and an alternative supplier have been drafted for review.",
    chips: ["3 lines flagged", "Supplier +4%", "2 tests drafted"],
  },
];

/** Types a string out character by character; resolves instantly under reduced motion. */
function useTypewriter(text: string, active: boolean, reduced: boolean, speed = 12) {
  const [shown, setShown] = useState(reduced ? text : "");

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setShown(text);
      return;
    }
    setShown("");
    let i = 0;
    // Several characters per tick keeps long answers readable without a long wait.
    const step = Math.max(1, Math.round(text.length / 90));
    const id = setInterval(() => {
      i = Math.min(text.length, i + step);
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, reduced, speed]);

  return shown;
}

function Console({ reducedMotion }: { reducedMotion: RM }) {
  const [idx, setIdx] = useState(0);
  const [pinned, setPinned] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const advance = useCallback(() => {
    setIdx((p) => (p + 1) % EXCHANGES.length);
  }, []);

  // Auto-advance only while nobody has taken manual control.
  useLiveTicker(rootRef, advance, 6200, !pinned);

  const current = EXCHANGES[idx];
  const typed = useTypewriter(current.a, true, reducedMotion);
  const done = typed.length === current.a.length;

  const [metrics, setMetrics] = useState({
    revenue: 4920,
    trend: [38, 42, 40, 47, 44, 52, 49, 58, 55, 63, 60, 68],
  });

  useLiveTicker(
    rootRef,
    () =>
      setMetrics((m) => {
        const next = Math.max(28, Math.min(78, m.trend[m.trend.length - 1] + (Math.random() * 12 - 5)));
        return {
          revenue: m.revenue + Math.round(Math.random() * 40 - 8),
          trend: [...m.trend.slice(1), next],
        };
      }),
    2600
  );

  return (
    <div
      ref={rootRef}
      className="surface-raised noise relative overflow-hidden rounded-2xl shadow-panel"
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-w-border bg-w-bg/70 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-3 flex-1 truncate text-center text-[12px] text-w-faint">
          GOLEM AI · Operations console
        </span>
        <LiveDot label="Connected" />
      </div>

      {/* Query chips: clicking one drives the console */}
      <div className="flex flex-wrap gap-1.5 border-b border-w-border/70 px-4 py-3">
        {EXCHANGES.map((e, i) => (
          <button
            key={e.q}
            onClick={() => {
              setIdx(i);
              setPinned(true);
            }}
            className={cx(
              "rounded-full border px-3 py-1 text-left text-[11.5px] transition-all duration-300",
              i === idx
                ? "border-accent/40 bg-accent/10 text-w-cream"
                : "border-w-border bg-w-bg text-w-muted hover:border-w-border-light hover:text-w-cream"
            )}
          >
            {e.q}
          </button>
        ))}
      </div>

      {/* Transcript */}
      <div className="relative min-h-[214px] sm:min-h-[168px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 p-5 font-mono text-[12.5px] sm:p-6 sm:text-[13px]"
          >
            <div className="flex items-start gap-2">
              <span className="shrink-0 select-none text-accent" aria-hidden="true">
                ❯
              </span>
              <span className="text-w-cream">{current.q}</span>
            </div>

            <div className="ml-5 border-l-2 border-accent/40 py-1 pl-4">
              <span className="leading-relaxed text-w-text">{typed}</span>
              {!done && !reducedMotion && (
                <span className="ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] animate-caret bg-accent/70" />
              )}
            </div>

            {/* Extracted facts appear once the answer has finished */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-9 flex flex-wrap gap-1.5 pt-1"
                >
                  {current.chips.map((c, i) => (
                    <motion.span
                      key={c}
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-md border border-w-border bg-w-bg px-2 py-0.5 font-sans text-[11px] text-w-muted"
                    >
                      {c}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prompt affordance */}
      <div className="flex items-center gap-2 border-t border-w-border/70 px-5 py-2.5 text-[11.5px] text-w-dim">
        <Sparkles className="h-3.5 w-3.5 text-accent/60" aria-hidden="true" />
        <span className="flex-1 truncate">Ask anything about the business</span>
        <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" />
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-3 divide-x divide-w-border border-t border-w-border">
        <div className="bg-w-bg/60 p-3.5 sm:p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-w-faint">Revenue today</div>
          <div className="mt-1 flex items-end justify-between gap-2">
            <span className="text-[18px] font-semibold tabular-nums text-w-cream sm:text-[20px]">
              £{metrics.revenue.toLocaleString("en-GB")}
            </span>
            <Sparkline points={metrics.trend} className="hidden sm:block" />
          </div>
        </div>
        <div className="bg-w-bg/60 p-3.5 sm:p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-w-faint">Scenarios run</div>
          <div className="mt-1 text-[18px] font-semibold tabular-nums text-w-cream sm:text-[20px]">12,000</div>
        </div>
        <div className="bg-w-bg/60 p-3.5 sm:p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-w-faint">Awaiting approval</div>
          <div className="mt-1 text-[18px] font-semibold tabular-nums text-w-cream sm:text-[20px]">3</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ Hero ═══════════════════════ */

const HEADLINE_TOP = ["Operational", "intelligence,"];
const HEADLINE_BOTTOM = ["built", "on", "the", "point", "of", "sale."];

export function HeroSection({ reducedMotion, scrollTo }: { reducedMotion: RM; scrollTo: ScrollTo }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Gentle parallax: the console settles as the page scrolls away from it.
  const consoleY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -40]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 90]);

  const word = useMemo(
    () => ({
      hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
      visible: { opacity: 1, y: "0em", filter: "blur(0px)" },
    }),
    []
  );

  return (
    <section
      ref={sectionRef}
      /* Clipped because the orbit field and aurora are deliberately larger than
         the section; without this they widen the document on narrow screens. */
      className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-14 pt-14 sm:pb-20 sm:pt-20"
    >
      {/* Backdrop */}
      <motion.div style={{ y: backdropY }} className="pointer-events-none absolute inset-0 -z-20">
        <Aurora />
        <div className="absolute inset-0 bg-grid-faint mask-radial-top" />
      </motion.div>
      <OrbitField reducedMotion={reducedMotion} />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Positioning badge */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex"
        >
          <span className="group inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.07] px-3.5 py-1.5 text-[12px] font-medium text-w-cream backdrop-blur-sm">
            <LiveDot />
            <span className="sm:hidden">Agentic operations platform</span>
            <span className="hidden sm:inline">
              Agentic operations platform · Human-approved by design
            </span>
          </span>
        </motion.div>

        {/* Headline, revealed word by word */}
        <motion.h1
          initial={reducedMotion ? false : "hidden"}
          animate="visible"
          transition={{ staggerChildren: 0.055, delayChildren: 0.1 }}
          className="text-balance text-[38px] font-semibold leading-[1.06] tracking-tight sm:text-[54px] lg:text-[66px]"
        >
          <span className="text-w-cream">
            {HEADLINE_TOP.map((w, i) => (
              <React.Fragment key={w}>
                <motion.span
                  variants={word}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block [will-change:transform,opacity]"
                >
                  {w}
                </motion.span>
                {/* A real space between the inline-blocks, so the headline
                    copies as ordinary text rather than with hard spaces. */}
                {i < HEADLINE_TOP.length - 1 ? " " : null}
              </React.Fragment>
            ))}
          </span>
          <br className="hidden sm:block" />
          {/* Animated as one unit: background-clip:text cannot paint through
              per-word child spans, which would render this line invisible. */}
          <motion.span
            variants={word}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-gradient-accent animate-gradient-x inline-block [will-change:transform,opacity]"
          >
            {HEADLINE_BOTTOM.join(" ")}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-w-text sm:text-[18px]"
        >
          GOLEM AI connects to the point-of-sale and back-office systems a business already runs. It
          forecasts demand, prepares ordering, pricing and staffing decisions, and executes them once an
          operator approves. One integration covers any POS and every location.
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
        >
          <Magnetic className="w-full sm:w-auto">
            <ShinyButton
              onClick={() => scrollTo("contact")}
              className="w-full px-6 py-3 text-[15px] shadow-glow sm:w-auto"
            >
              Request a demo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </ShinyButton>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <button
              onClick={() => scrollTo("forecast")}
              className={cx(btnSecondary, "w-full px-6 py-3 text-[15px] sm:w-auto")}
            >
              See it forecast
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Console */}
      <motion.div
        style={{ y: consoleY }}
        initial={reducedMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-12 max-w-3xl sm:mt-14"
      >
        <Console reducedMotion={reducedMotion} />
      </motion.div>
    </section>
  );
}
