"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, ShieldCheck } from "lucide-react";
import {
  Reveal,
  Section,
  SectionHeader,
  cx,
  usePrefersReducedMotion,
  type RM,
} from "@/components/site/primitives";

const INK = "rgba(27,26,24,";
const ACCENT = "#7c3aed";

/* ═══════════════════════ Illustration: Connect ═══════════════════════ */

function IllustrationConnect({ rm }: { rm: boolean }) {
  const CX = 320;
  const CY = 120;
  const NW = 76;
  const NH = 28;
  const HR = 44;
  const left = [
    { label: "POS", y: 40 },
    { label: "Payments", y: 120 },
    { label: "Inventory", y: 200 },
  ];
  const right = [
    { label: "Suppliers", y: 40 },
    { label: "Accounting", y: 120 },
    { label: "Scheduling", y: 200 },
  ];

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } };
  const nodeV = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 190, damping: 17 } },
  };
  const pathV = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const curve = (ex: number, ey: number, hx: number, hy: number) => {
    const mx = (ex + hx) / 2;
    return `M${ex},${ey} C${mx},${ey} ${mx},${hy} ${hx},${hy}`;
  };

  const edges = [
    ...left.map((n) => ({ ...n, x: 70, edgeX: 70 + NW / 2, hubX: CX - HR })),
    ...right.map((n) => ({ ...n, x: 570, edgeX: 570 - NW / 2, hubX: CX + HR })),
  ];

  return (
    <motion.svg
      viewBox="0 0 640 240"
      fill="none"
      className="h-full w-full"
      variants={container}
      initial={rm ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cn-rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(124,58,237,0.18)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
      </defs>

      <ellipse cx={CX} cy={CY} rx="104" ry="88" fill="url(#cn-rg)" />

      {edges.map((n, i) => {
        const d = curve(n.edgeX, n.y, n.hubX, CY);
        const id = `cn-mp-${i}`;
        return (
          <g key={`edge-${i}`}>
            <motion.path d={d} stroke={`${INK}0.14)`} strokeWidth="1" fill="none" variants={pathV} />
            <path id={id} d={d} fill="none" stroke="none" />
            {!rm && (
              <circle r="2.2" fill={ACCENT}>
                <animateMotion dur={`${4.2 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.55}s`}>
                  <mpath href={`#${id}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;0.9;0.9;0"
                  keyTimes="0;0.15;0.85;1"
                  dur={`${4.2 + i * 0.35}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.55}s`}
                />
              </circle>
            )}
          </g>
        );
      })}

      <motion.circle
        cx={CX}
        cy={CY}
        r="54"
        fill="none"
        stroke={`${INK}0.09)`}
        strokeWidth="0.75"
        strokeDasharray="3 6"
        animate={rm ? {} : { rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />
      <motion.circle cx={CX} cy={CY} r={HR} fill="rgba(124,58,237,0.07)" stroke="rgba(124,58,237,0.38)" strokeWidth="1" variants={pathV} />
      <motion.circle
        cx={CX}
        cy={CY}
        r="30"
        fill="rgba(124,58,237,0.10)"
        stroke="rgba(124,58,237,0.5)"
        strokeWidth="1.5"
        animate={rm ? {} : { opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle" fill={`${INK}0.95)`} fontSize="12" fontWeight="700">
        GOLEM
      </text>

      {edges.map((n, i) => (
        <motion.g key={`node-${i}`} variants={nodeV}>
          <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx="7" fill={`${INK}0.05)`} stroke={`${INK}0.2)`} strokeWidth="1" />
          <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fill={`${INK}0.62)`} fontSize="10" fontFamily="ui-monospace,monospace">
            {n.label}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
}

/* ═══════════════════════ Illustration: Model ═══════════════════════ */

/** Deterministic PRNG so the scenario fan renders identically on server and client. */
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

/**
 * The overnight simulation drawn as a fan of candidate scenarios converging on
 * one forecast, with the endpoint distribution binned along the right edge.
 */
function IllustrationModel({ rm }: { rm: boolean }) {
  const { paths, bins, forecastPath } = useMemo(() => {
    const rand = mulberry32(20260909);
    const originX = 92;
    const originY = 120;
    const endX = 468;
    const count = 46;

    const ends: number[] = [];
    const paths: string[] = [];

    for (let i = 0; i < count; i++) {
      // Sum of three uniforms approximates a normal, so the fan clusters.
      const g = (rand() + rand() + rand()) / 3 - 0.5;
      const endY = originY + g * 190;
      ends.push(endY);
      const midY = originY + g * 70;
      paths.push(`M${originX},${originY} C${originX + 130},${originY} ${endX - 150},${midY} ${endX},${endY.toFixed(1)}`);
    }

    // Bin the endpoints into a vertical histogram.
    const BINS = 11;
    const top = 20;
    const bottom = 220;
    const counts = new Array(BINS).fill(0);
    for (const y of ends) {
      const t = Math.min(0.999, Math.max(0, (y - top) / (bottom - top)));
      counts[Math.floor(t * BINS)] += 1;
    }
    const maxCount = Math.max(...counts);
    const bins = counts.map((c, i) => ({
      y: top + (i / BINS) * (bottom - top),
      h: (bottom - top) / BINS - 2,
      w: (c / maxCount) * 74,
      peak: c === maxCount,
    }));

    const forecastPath = `M${originX},${originY} C${originX + 130},${originY} ${endX - 150},${originY + 6} ${endX},${originY + 10}`;

    return { paths, bins, forecastPath };
  }, []);

  return (
    <motion.svg
      viewBox="0 0 640 240"
      fill="none"
      className="h-full w-full"
      initial={rm ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      aria-hidden="true"
    >
      <text x="92" y="16" textAnchor="middle" fill={`${INK}0.28)`} fontSize="8" fontFamily="ui-monospace,monospace">
        TONIGHT
      </text>
      <text x="530" y="16" textAnchor="middle" fill={`${INK}0.28)`} fontSize="8" fontFamily="ui-monospace,monospace">
        TOMORROW
      </text>

      {/* Candidate scenarios */}
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={ACCENT}
          strokeWidth="0.9"
          fill="none"
          strokeOpacity="0.16"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.9, delay: (i % 12) * 0.045, ease: [0.16, 1, 0.3, 1] as const },
            },
          }}
        />
      ))}

      {/* The selected forecast */}
      <motion.path
        d={forecastPath}
        stroke={ACCENT}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1, transition: { duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
        }}
      />

      {/* Origin */}
      <circle cx="92" cy="120" r="5" fill={ACCENT} />
      {!rm && (
        <circle cx="92" cy="120" r="5" fill="none" stroke={ACCENT} strokeWidth="1.5" opacity="0.5">
          <animate attributeName="r" values="5;16;5" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Endpoint distribution */}
      <line x1="478" y1="20" x2="478" y2="220" stroke={`${INK}0.12)`} strokeWidth="1" />
      {bins.map((b, i) => (
        <motion.rect
          key={i}
          x="482"
          y={b.y + 1}
          height={b.h}
          rx="2"
          fill={b.peak ? ACCENT : "rgba(124,58,237,0.3)"}
          variants={{
            hidden: { width: 0 },
            visible: { width: b.w, transition: { duration: 0.6, delay: 0.7 + i * 0.03, ease: [0.16, 1, 0.3, 1] as const } },
          }}
        />
      ))}
      <text x="482" y="234" fill={`${INK}0.3)`} fontSize="8" fontFamily="ui-monospace,monospace">
        12,000 scenarios
      </text>
    </motion.svg>
  );
}

/* ═══════════════════════ Illustration: Approve ═══════════════════════ */

function IllustrationApprove({ rm }: { rm: boolean }) {
  const agents = [
    { label: "Ordering", status: "ACTIVE", task: "Reorder draft" },
    { label: "Pricing", status: "ACTIVE", task: "Price tests" },
    { label: "Labour", status: "QUEUED", task: "Shift plan" },
  ];
  const aCY = [50, 120, 190];
  const LX = 396;
  const LY = 16;
  const entries = [
    { action: "Low stock flagged", time: "05:58:02", done: true },
    { action: "Reorder approved", time: "06:00:11", done: true },
    { action: "Price test queued", time: "06:00:18", done: true },
    { action: "Daily plan in progress", time: "06:00:24", done: false },
  ];

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.11, delayChildren: 0.12 } } };
  const leftV = {
    hidden: { opacity: 0, x: -18 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 165, damping: 17 } },
  };
  const rightV = {
    hidden: { opacity: 0, x: 18 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 165, damping: 17, delay: 0.35 } },
  };

  return (
    <motion.svg
      viewBox="0 0 640 240"
      fill="none"
      className="h-full w-full"
      variants={container}
      initial={rm ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true }}
      aria-hidden="true"
    >
      {agents.map((a, i) => {
        const on = a.status === "ACTIVE";
        return (
          <motion.g key={a.label} variants={leftV}>
            <rect
              x="18"
              y={aCY[i] - 28}
              width="200"
              height="56"
              rx="9"
              fill={`${INK}0.05)`}
              stroke={on ? "rgba(124,58,237,0.33)" : `${INK}0.1)`}
              strokeWidth="1"
            />
            <motion.circle
              cx="38"
              cy={aCY[i] - 6}
              r="5"
              fill={on ? ACCENT : `${INK}0.2)`}
              animate={on && !rm ? { opacity: [0.4, 1, 0.4] } : {}}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <text x="52" y={aCY[i] - 6} dominantBaseline="middle" fill={`${INK}0.88)`} fontSize="11.5" fontWeight="600">
              {a.label}
            </text>
            <rect
              x="160"
              y={aCY[i] - 16}
              width="48"
              height="16"
              rx="4"
              fill={on ? "rgba(124,58,237,0.12)" : `${INK}0.03)`}
              stroke={on ? "rgba(124,58,237,0.32)" : `${INK}0.1)`}
            />
            <text
              x="184"
              y={aCY[i] - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={on ? "rgba(124,58,237,0.9)" : `${INK}0.28)`}
              fontSize="7.5"
              fontFamily="ui-monospace,monospace"
            >
              {a.status}
            </text>
            <text x="38" y={aCY[i] + 14} dominantBaseline="middle" fill={`${INK}0.35)`} fontSize="9" fontFamily="ui-monospace,monospace">
              {a.task}
            </text>
          </motion.g>
        );
      })}

      {aCY.map((cy, i) => {
        const on = agents[i].status === "ACTIVE";
        return (
          <motion.g
            key={`link-${i}`}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.25 } },
            }}
          >
            <motion.line
              x1={218}
              y1={cy}
              x2={LX - 2}
              y2={LY + 105}
              stroke={on ? "rgba(124,58,237,0.24)" : `${INK}0.06)`}
              strokeWidth="1"
            />
            {on && !rm && (
              /* cx/cy are set explicitly as well as animated: without a starting
                 value framer has nothing to read off the element and writes
                 cx="undefined" on the first frame. */
              <motion.circle
                r="2"
                fill={ACCENT}
                cx={218}
                cy={cy}
                initial={{ cx: 218, cy, opacity: 0 }}
                animate={{ cx: [218, LX - 2], cy: [cy, LY + 105], opacity: [0, 0.75, 0] }}
                transition={{ duration: 3.6 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
              />
            )}
          </motion.g>
        );
      })}

      <motion.g variants={rightV}>
        <rect x={LX} y={LY} width="228" height="210" rx="9" fill={`${INK}0.035)`} stroke={`${INK}0.16)`} strokeWidth="1" />
        <rect x={LX + 1} y={LY + 1} width="226" height="32" rx="8" fill={`${INK}0.05)`} />
        <line x1={LX} y1={LY + 33} x2={LX + 228} y2={LY + 33} stroke={`${INK}0.1)`} strokeWidth="0.75" />
        <motion.circle
          cx={LX + 16}
          cy={LY + 17}
          r="3.5"
          fill={ACCENT}
          animate={rm ? {} : { opacity: [0.3, 0.95, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <text x={LX + 28} y={LY + 17} dominantBaseline="middle" fill={`${INK}0.6)`} fontSize="10" fontWeight="600">
          Audit log
        </text>
        {entries.map((e, i) => (
          <motion.g
            key={e.action}
            initial={rm ? {} : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.75 + i * 0.14, duration: 0.35 }}
          >
            <rect
              x={LX + 8}
              y={LY + 40 + i * 42}
              width="212"
              height="34"
              rx="6"
              fill={`${INK}0.025)`}
              stroke={!e.done ? "rgba(124,58,237,0.28)" : `${INK}0.07)`}
              strokeWidth="0.75"
            />
            <text
              x={LX + 22}
              y={LY + 57 + i * 42}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={e.done ? "rgba(124,58,237,0.9)" : `${INK}0.38)`}
              fontSize="11"
            >
              {e.done ? "✓" : "●"}
            </text>
            <text x={LX + 34} y={LY + 51 + i * 42} dominantBaseline="middle" fill={`${INK}0.55)`} fontSize="9" fontFamily="ui-monospace,monospace">
              {e.action}
            </text>
            <text x={LX + 34} y={LY + 65 + i * 42} dominantBaseline="middle" fill={`${INK}0.25)`} fontSize="8" fontFamily="ui-monospace,monospace">
              {e.time}
            </text>
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
}

function StepIllustration({ step, reducedMotion }: { step: number; reducedMotion: RM }) {
  if (step === 0) return <IllustrationConnect rm={reducedMotion} />;
  if (step === 1) return <IllustrationModel rm={reducedMotion} />;
  return <IllustrationApprove rm={reducedMotion} />;
}

/* ═══════════════════════ Workflow steps ═══════════════════════ */

export function WorkflowStepsSection({ reducedMotion }: { reducedMotion: RM }) {
  const steps = [
    {
      num: "1",
      title: "Connect",
      headline: "One integration across every system.",
      desc: "GOLEM AI connects to the point of sale in use, alongside payment, inventory, supplier, accounting and scheduling tools. Operating data is consolidated into a single record that can be queried directly, in plain language.",
      tags: ["POS and payments", "Inventory", "Suppliers", "Accounting", "Scheduling"],
    },
    {
      num: "2",
      title: "Model",
      headline: "Tomorrow's trading, modelled tonight.",
      desc: "Each night the platform evaluates thousands of demand scenarios using sales history, local events, weather and search trends. It produces recommendations for ordering, pricing, staffing and margin, with the supporting data attached.",
      tags: ["Sales history", "Local events", "Weather", "Search trends"],
    },
    {
      num: "3",
      title: "Approve",
      headline: "Review the reasoning. Approve the plan.",
      desc: "The daily plan is ready by 06:00. Operators review, adjust or approve each recommendation. On approval, GOLEM AI executes: prices are updated, orders are sent and every action is written to the audit log.",
      tags: ["06:00 daily plan", "Single-step approval", "Human-in-the-loop", "Full audit trail"],
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActiveStep(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    blockRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="how" divider>
      <SectionHeader
        eyebrow="How it works"
        title="From integration to execution in three stages."
        subtitle="A single integration, an overnight modelling cycle, and a daily plan that waits for approval."
      />

      <div className="mx-auto mt-12 grid gap-x-14 lg:grid-cols-2">
        {/* Left: scroll-driven step blocks */}
        <div>
          {steps.map((s, i) => {
            const active = i === activeStep;
            return (
              <div
                key={s.num}
                data-idx={i}
                ref={(el) => {
                  blockRefs.current[i] = el;
                }}
                className="flex flex-col justify-center py-6 lg:min-h-[36vh] lg:py-10"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold transition-all duration-500 ease-out-expo",
                      active
                        ? "scale-105 bg-accent text-w-bg shadow-glow"
                        : "bg-w-bg-secondary text-w-faint"
                    )}
                  >
                    {s.num}
                  </span>
                  <span
                    className={cx(
                      "text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300",
                      active ? "text-accent" : "text-w-faint"
                    )}
                  >
                    {s.title}
                  </span>
                  <span
                    className={cx(
                      "h-px flex-1 origin-left transition-all duration-500 ease-out-expo",
                      active ? "scale-x-100 bg-accent/30" : "scale-x-0 bg-transparent"
                    )}
                  />
                </div>

                <h3
                  className={cx(
                    "mt-4 text-[24px] font-semibold leading-tight tracking-tight transition-colors duration-500 sm:text-[30px]",
                    active ? "text-w-cream" : "text-w-muted"
                  )}
                >
                  {s.headline}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-w-text">{s.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cx(
                        "rounded-full border px-3 py-1 text-[12px] transition-all duration-500",
                        active
                          ? "border-accent/25 bg-accent/[0.06] text-w-text"
                          : "border-w-border bg-w-bg-secondary text-w-muted"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Inline illustration (mobile) */}
                <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-w-border bg-w-card lg:hidden">
                  <StepIllustration step={i} reducedMotion={reducedMotion} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: sticky visual (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="surface-raised rounded-2xl p-4">
              <div className="bg-grid-lines aspect-[16/11] w-full overflow-hidden rounded-xl border border-w-border bg-w-card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full"
                  >
                    <StepIllustration step={activeStep} reducedMotion={reducedMotion} />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Progress rail */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {steps.map((s, i) => (
                  <span
                    key={s.num}
                    className={cx(
                      "h-1.5 rounded-full transition-all duration-500 ease-out-expo",
                      i === activeStep ? "w-8 bg-accent" : "w-1.5 bg-w-border-light"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════ Architecture tabs ═══════════════════════ */

export function LifecycleSection({ reducedMotion }: { reducedMotion: RM }) {
  const prefersReduced = usePrefersReducedMotion();
  const rm = reducedMotion || prefersReduced;
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: "Connect",
      icon: Cpu,
      heading: "Integrates with existing infrastructure",
      desc: "GOLEM AI connects to the POS, payment and back-office systems already in place and normalises the data automatically. There is no new hardware and no migration.",
      features: [
        "Native connectors for POS, payments, inventory, accounting and scheduling",
        "A single query layer across every connected system",
        "Cloud-hosted by default, with private deployment available",
        "Full visibility into what the platform is doing and why",
      ],
    },
    {
      label: "Forecast",
      icon: Brain,
      heading: "Forecasts built on the business's own data",
      desc: "The platform models thousands of scenarios overnight, combining sales history with weather, local events and seasonal patterns to produce the next day's plan.",
      features: [
        "Thousands of demand scenarios evaluated every night",
        "Weather, local events and seasonality factored in",
        "Specific reorder quantities and price adjustments, not generic alerts",
        "Daily plan delivered by 06:00",
      ],
    },
    {
      label: "Govern",
      icon: ShieldCheck,
      heading: "Nothing executes without approval",
      desc: "GOLEM AI does not change a price or place an order without explicit sign-off. Control over every decision remains with the operator.",
      features: [
        "Every recommendation held for approval",
        "Plain-language reasoning attached to each action",
        "A permanent record of every decision for audit and accounting",
        "Approve in one step, or adjust before anything is executed",
      ],
    },
  ];

  return (
    <Section contentClassName="pt-4 sm:pt-6">
      <SectionHeader
        eyebrow="Architecture"
        title="Rigorous underneath. Straightforward to operate."
        subtitle="Three components, each designed so that automation stays accountable to the people running the business."
      />

      {/* Tabs with a sliding indicator */}
      <Reveal delay={0.1} className="mx-auto mt-8 flex max-w-md items-center justify-center gap-1 rounded-lg border border-w-border bg-w-bg-secondary p-1">
        <div className="flex w-full" role="tablist" aria-label="Architecture components">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              role="tab"
              aria-selected={i === activeTab}
              onClick={() => setActiveTab(i)}
              className={cx(
                "relative flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                i === activeTab ? "text-w-cream" : "text-w-muted hover:text-w-text"
              )}
            >
              {i === activeTab && (
                <motion.span
                  layoutId="lifecycle-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 -z-10 rounded-md bg-w-card shadow-card"
                />
              )}
              <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={rm ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={rm ? undefined : { opacity: 0, y: -14 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-5xl"
        >
          <div className="surface-raised relative overflow-hidden rounded-xl">
            <div className="hairline-accent absolute inset-x-0 top-0 h-px" />
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10">
              <div>
                <h3 className="text-[22px] font-semibold text-w-cream">{tabs[activeTab].heading}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-w-text">{tabs[activeTab].desc}</p>
              </div>
              <ul className="space-y-3">
                {tabs[activeTab].features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={rm ? false : { opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 text-[14px] text-w-text"
                  >
                    <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
