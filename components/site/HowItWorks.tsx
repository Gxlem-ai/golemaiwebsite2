"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, ShieldCheck } from "lucide-react";
import { cx, Section, SectionHeader, type RM } from "@/components/site/primitives";

/* ═══════════════════════ Illustration: Connect ═══════════════════════ */

function IllustrationConnect({ rm }: { rm: boolean }) {
  const CX = 320, CY = 120;
  const NW = 72, NH = 28, HR = 44;
  const left = [
    { label: "POS", x: 70, y: 40 },
    { label: "Payments", x: 70, y: 120 },
    { label: "Inventory", x: 70, y: 200 },
  ];
  const right = [
    { label: "Suppliers", x: 570, y: 40 },
    { label: "Accounting", x: 570, y: 120 },
    { label: "Scheduling", x: 570, y: 200 },
  ];
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
  const nodeV = { hidden: { opacity: 0, scale: 0.6 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 180, damping: 16 } } };
  const pathV = { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeOut" } } };

  const curvePath = (ex: number, ey: number, hx: number, hy: number) => {
    const mx = (ex + hx) / 2;
    return `M${ex},${ey} C${mx},${ey} ${mx},${hy} ${hx},${hy}`;
  };

  const sides = [
    ...left.map((n) => ({ ...n, edgeX: n.x + NW / 2, hubX: CX - HR })),
    ...right.map((n) => ({ ...n, edgeX: n.x - NW / 2, hubX: CX + HR })),
  ];

  return (
    <motion.svg viewBox="0 0 640 240" fill="none" className="h-full w-full" variants={container} initial={rm ? "visible" : "hidden"} animate="visible">
      <defs>
        <radialGradient id="cn-rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(124,58,237,0.16)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
      </defs>
      {Array.from({ length: 16 }).map((_, i) =>
        Array.from({ length: 6 }).map((_, j) => (
          <circle key={`d-${i}-${j}`} cx={20 + i * 40} cy={20 + j * 40} r="0.7" fill="rgba(31,29,26,0.05)" />
        ))
      )}
      <ellipse cx={CX} cy={CY} rx="100" ry="85" fill="url(#cn-rg)" />
      {sides.map((n, i) => {
        const d = curvePath(n.edgeX, n.y, n.hubX, CY);
        return <motion.path key={`p-${i}`} d={d} stroke="rgba(31,29,26,0.14)" strokeWidth="1" fill="none" variants={pathV} />;
      })}
      {sides.map((n, i) => {
        const d = curvePath(n.edgeX, n.y, n.hubX, CY);
        const id = `cn-mp-${i}`;
        return (
          <g key={`tp-${i}`}>
            <path id={id} d={d} fill="none" stroke="none" />
            {!rm && (
              <circle r="2" fill="#7c3aed" opacity="0">
                <animateMotion dur={`${4.5 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.6}s`}>
                  <mpath href={`#${id}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.15;0.85;1" dur={`${4.5 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
              </circle>
            )}
          </g>
        );
      })}
      <motion.circle cx={CX} cy={CY} r="52" fill="none" stroke="rgba(31,29,26,0.08)" strokeWidth="0.5" strokeDasharray="3 5" animate={rm ? {} : { rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: `${CX}px ${CY}px` }} />
      <motion.circle cx={CX} cy={CY} r={HR} fill="rgba(124,58,237,0.06)" stroke="rgba(124,58,237,0.35)" strokeWidth="1" variants={pathV} />
      <motion.circle cx={CX} cy={CY} r="30" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.45)" strokeWidth="1.5" animate={rm ? {} : { opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} />
      <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle" fill="rgba(31,29,26,0.95)" fontSize="12" fontFamily="ui-sans-serif,sans-serif" fontWeight="700">GOLEM</text>
      {left.map((n, i) => (
        <motion.g key={`nl-${i}`} variants={nodeV}>
          <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx="6" fill="rgba(31,29,26,0.07)" stroke="rgba(31,29,26,0.22)" strokeWidth="1" />
          <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(31,29,26,0.65)" fontSize="10" fontFamily="ui-monospace,monospace">{n.label}</text>
        </motion.g>
      ))}
      {right.map((n, i) => (
        <motion.g key={`nr-${i}`} variants={nodeV}>
          <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx="6" fill="rgba(31,29,26,0.07)" stroke="rgba(31,29,26,0.22)" strokeWidth="1" />
          <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(31,29,26,0.65)" fontSize="10" fontFamily="ui-monospace,monospace">{n.label}</text>
        </motion.g>
      ))}
      <motion.text x={175} y={18} textAnchor="middle" variants={nodeV} fill="rgba(31,29,26,0.18)" fontSize="7.5" fontFamily="ui-monospace,monospace">ingest →</motion.text>
      <motion.text x={465} y={18} textAnchor="middle" variants={nodeV} fill="rgba(31,29,26,0.18)" fontSize="7.5" fontFamily="ui-monospace,monospace">← ingest</motion.text>
    </motion.svg>
  );
}

/* ═══════════════════════ Illustration: Learn ═══════════════════════ */

function IllustrationLearn({ rm }: { rm: boolean }) {
  const sources = ["POS sales", "Event calendar", "Search trends"];
  const sCY = [50, 120, 190];
  const SX = 90, MX = 320, MY = 120;
  const bars = [{ label: "Accuracy", pct: 87 }, { label: "Coverage", pct: 94 }, { label: "Recency", pct: 98 }];
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
  const itemV = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 150, damping: 16 } } };
  const rightV = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 150, damping: 16 } } };
  const lineV = { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 0.7 } } };

  return (
    <motion.svg viewBox="0 0 640 240" fill="none" className="h-full w-full" variants={container} initial={rm ? "visible" : "hidden"} animate="visible">
      <defs>
        <radialGradient id="lr-rg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(124,58,237,0.14)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0)" />
        </radialGradient>
      </defs>
      {Array.from({ length: 15 }).map((_, i) =>
        Array.from({ length: 6 }).map((_, j) => (
          <circle key={`d-${i}-${j}`} cx={40 + i * 40} cy={20 + j * 40} r="0.8" fill="rgba(31,29,26,0.06)" />
        ))
      )}
      <text x={SX} y="14" textAnchor="middle" fill="rgba(31,29,26,0.25)" fontSize="8" fontFamily="ui-monospace,monospace">DATA ISOLATED PER BUSINESS</text>
      {sources.map((s, i) => (
        <motion.g key={s} variants={itemV}>
          <rect x={SX - 55} y={sCY[i] - 14} width={110} height={28} rx="6" fill="rgba(31,29,26,0.07)" stroke="rgba(31,29,26,0.22)" strokeWidth="1" />
          <text x={SX} y={sCY[i]} textAnchor="middle" dominantBaseline="middle" fill="rgba(31,29,26,0.6)" fontSize="10" fontFamily="ui-monospace,monospace">{s}</text>
        </motion.g>
      ))}
      {sCY.map((cy, i) => (
        <motion.g key={`fl-${i}`} variants={lineV}>
          <motion.line x1={SX + 55} y1={cy} x2={MX - 52} y2={MY} stroke="rgba(31,29,26,0.15)" strokeWidth="1" />
          <motion.circle r="2" fill="#7c3aed" animate={rm ? {} : { cx: [SX + 55, MX - 52], cy: [cy, MY], opacity: [0, 0.7, 0] }} transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }} />
        </motion.g>
      ))}
      <ellipse cx={MX} cy={MY} rx="70" ry="70" fill="url(#lr-rg)" />
      <motion.circle cx={MX} cy={MY} r="52" fill="none" stroke="rgba(31,29,26,0.08)" strokeWidth="0.5" strokeDasharray="3 5" animate={rm ? {} : { rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: `${MX}px ${MY}px` }} />
      <motion.circle cx={MX} cy={MY} r="46" fill="rgba(124,58,237,0.05)" stroke="rgba(124,58,237,0.40)" strokeWidth="1.5" animate={rm ? {} : { opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />
      <circle cx={MX} cy={MY} r="32" fill="rgba(124,58,237,0.08)" stroke="rgba(31,29,26,0.15)" strokeWidth="1" />
      <text x={MX} y={MY - 8} textAnchor="middle" dominantBaseline="middle" fill="rgba(31,29,26,0.92)" fontSize="11" fontFamily="ui-sans-serif,sans-serif" fontWeight="700">Knowledge</text>
      <text x={MX} y={MY + 8} textAnchor="middle" dominantBaseline="middle" fill="rgba(31,29,26,0.92)" fontSize="11" fontFamily="ui-sans-serif,sans-serif" fontWeight="700">Graph</text>
      <motion.g variants={rightV}>
        <rect x="420" y="30" width="196" height="180" rx="8" fill="rgba(31,29,26,0.04)" stroke="rgba(31,29,26,0.15)" strokeWidth="1" />
        <rect x="421" y="31" width="194" height="30" rx="7" fill="rgba(31,29,26,0.06)" />
        <motion.circle cx="434" cy="46" r="3.5" fill="#7c3aed" animate={rm ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <text x="444" y="46" dominantBaseline="middle" fill="rgba(31,29,26,0.45)" fontSize="9" fontFamily="ui-monospace,monospace">LIVE · MODEL STATUS</text>
        {bars.map((b, i) => (
          <g key={b.label}>
            <text x="434" y={80 + i * 48} dominantBaseline="middle" fill="rgba(31,29,26,0.4)" fontSize="9" fontFamily="ui-monospace,monospace">{b.label}</text>
            <rect x="434" y={90 + i * 48} width="168" height="5" rx="2.5" fill="rgba(31,29,26,0.08)" />
            <motion.rect x="434" y={90 + i * 48} height="5" rx="2.5" fill="rgba(124,58,237,0.7)" initial={{ width: 0 }} animate={{ width: (b.pct / 100) * 168 }} transition={{ duration: 1.2, delay: 0.6 + i * 0.2, ease: "easeOut" }} />
            <text x={434 + (b.pct / 100) * 168 + 6} y={94 + i * 48} dominantBaseline="middle" fill="rgba(31,29,26,0.35)" fontSize="8" fontFamily="ui-monospace,monospace">{b.pct}%</text>
          </g>
        ))}
      </motion.g>
      <motion.line x1={MX + 52} y1={MY} x2={418} y2={MY} stroke="rgba(31,29,26,0.15)" strokeWidth="1" variants={lineV} />
    </motion.svg>
  );
}

/* ═══════════════════════ Illustration: Agents ═══════════════════════ */

function IllustrationAgents({ rm }: { rm: boolean }) {
  const agents = [
    { label: "Ordering", status: "ACTIVE", task: "Reorder draft" },
    { label: "Pricing", status: "ACTIVE", task: "Price tests" },
    { label: "Labour", status: "QUEUED", task: "Shift plan" },
  ];
  const aCY = [50, 120, 190];
  const LX = 400, LY = 16;
  const entries = [
    { action: "Low stock flagged", time: "05:58:02", done: true },
    { action: "Reorder approved", time: "06:00:11", done: true },
    { action: "Price test queued", time: "06:00:18", done: true },
    { action: "Daily plan in progress", time: "06:00:24", done: false },
  ];
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
  const leftV = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 160, damping: 16 } } };
  const rightV = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 160, damping: 16, delay: 0.4 } } };
  const lineV = { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.3 } } };

  return (
    <motion.svg viewBox="0 0 640 240" fill="none" className="h-full w-full" variants={container} initial={rm ? "visible" : "hidden"} animate="visible">
      {Array.from({ length: 15 }).map((_, i) =>
        Array.from({ length: 6 }).map((_, j) => (
          <circle key={`d-${i}-${j}`} cx={40 + i * 40} cy={20 + j * 40} r="0.8" fill="rgba(31,29,26,0.06)" />
        ))
      )}
      {agents.map((a, i) => (
        <motion.g key={a.label} variants={leftV}>
          <rect x="20" y={aCY[i] - 28} width="200" height={56} rx="8" fill="rgba(31,29,26,0.06)" stroke={a.status === "ACTIVE" ? "rgba(124,58,237,0.35)" : "rgba(31,29,26,0.10)"} strokeWidth="1" />
          <motion.circle cx="40" cy={aCY[i] - 6} r="5" fill={a.status === "ACTIVE" ? "#7c3aed" : "rgba(31,29,26,0.2)"} animate={a.status === "ACTIVE" && !rm ? { opacity: [0.4, 1, 0.4] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
          <text x="54" y={aCY[i] - 6} dominantBaseline="middle" fill="rgba(31,29,26,0.88)" fontSize="11.5" fontFamily="ui-sans-serif,sans-serif" fontWeight="600">{a.label}</text>
          <rect x="170" y={aCY[i] - 16} width="40" height="16" rx="4" fill={a.status === "ACTIVE" ? "rgba(124,58,237,0.12)" : "rgba(31,29,26,0.03)"} stroke={a.status === "ACTIVE" ? "rgba(124,58,237,0.35)" : "rgba(31,29,26,0.1)"} strokeWidth="1" />
          <text x="190" y={aCY[i] - 8} textAnchor="middle" dominantBaseline="middle" fill={a.status === "ACTIVE" ? "rgba(124,58,237,0.9)" : "rgba(31,29,26,0.25)"} fontSize="8" fontFamily="ui-monospace,monospace">{a.status}</text>
          <text x="40" y={aCY[i] + 14} dominantBaseline="middle" fill="rgba(31,29,26,0.35)" fontSize="9" fontFamily="ui-monospace,monospace">{a.task}</text>
        </motion.g>
      ))}
      {aCY.map((cy, i) => (
        <motion.g key={`cl-${i}`} variants={lineV}>
          <motion.line x1={220} y1={cy} x2={LX - 2} y2={LY + 105} stroke={agents[i].status === "ACTIVE" ? "rgba(124,58,237,0.25)" : "rgba(31,29,26,0.06)"} strokeWidth="1" />
          {agents[i].status === "ACTIVE" && (
            <motion.circle r="2" fill="#7c3aed" animate={rm ? {} : { cx: [220, LX - 2], cy: [cy, LY + 105], opacity: [0, 0.7, 0] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }} />
          )}
        </motion.g>
      ))}
      <motion.g variants={rightV}>
        <rect x={LX} y={LY} width="224" height="210" rx="8" fill="rgba(31,29,26,0.04)" stroke="rgba(31,29,26,0.18)" strokeWidth="1" />
        <rect x={LX + 1} y={LY + 1} width="222" height="32" rx="7" fill="rgba(31,29,26,0.06)" />
        <line x1={LX} y1={LY + 33} x2={LX + 224} y2={LY + 33} stroke="rgba(31,29,26,0.10)" strokeWidth="0.75" />
        <motion.circle cx={LX + 16} cy={LY + 17} r="3.5" fill="#7c3aed" animate={rm ? {} : { opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1.6, repeat: Infinity }} />
        <text x={LX + 28} y={LY + 17} dominantBaseline="middle" fill="rgba(31,29,26,0.6)" fontSize="10" fontFamily="ui-sans-serif,sans-serif" fontWeight="600">Audit Log</text>
        {entries.map((e, i) => (
          <motion.g key={e.action} initial={rm ? {} : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.15, duration: 0.3 }}>
            <rect x={LX + 8} y={LY + 40 + i * 42} width="208" height="34" rx="5" fill="rgba(31,29,26,0.03)" stroke={!e.done ? "rgba(124,58,237,0.3)" : "rgba(31,29,26,0.08)"} strokeWidth="0.75" />
            <text x={LX + 22} y={LY + 57 + i * 42} textAnchor="middle" dominantBaseline="middle" fill={e.done ? "rgba(124,58,237,0.9)" : "rgba(31,29,26,0.4)"} fontSize="11">{e.done ? "✓" : "●"}</text>
            <text x={LX + 34} y={LY + 51 + i * 42} dominantBaseline="middle" fill="rgba(31,29,26,0.55)" fontSize="9" fontFamily="ui-monospace,monospace">{e.action}</text>
            <text x={LX + 34} y={LY + 65 + i * 42} dominantBaseline="middle" fill="rgba(31,29,26,0.25)" fontSize="8" fontFamily="ui-monospace,monospace">{e.time}</text>
          </motion.g>
        ))}
      </motion.g>
    </motion.svg>
  );
}

function StepIllustration({ step, reducedMotion }: { step: number; reducedMotion: RM }) {
  if (step === 0) return <IllustrationConnect rm={reducedMotion} />;
  if (step === 1) return <IllustrationLearn rm={reducedMotion} />;
  return <IllustrationAgents rm={reducedMotion} />;
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
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold transition-all duration-300",
                      active ? "bg-accent text-w-bg" : "bg-w-bg-secondary text-w-faint"
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
                </div>
                <h3
                  className={cx(
                    "mt-4 text-[24px] font-semibold leading-tight tracking-tight transition-colors duration-300 sm:text-[30px]",
                    active ? "text-w-cream" : "text-w-muted"
                  )}
                >
                  {s.headline}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-w-text">{s.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-w-border bg-w-bg-secondary px-3 py-1 text-[12px] text-w-muted">
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
            <div className="rounded-2xl border border-w-border bg-w-bg-secondary p-4">
              <div className="aspect-[16/11] w-full overflow-hidden rounded-xl border border-w-border bg-w-card">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
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
                      "h-1.5 rounded-full transition-all duration-300",
                      i === activeStep ? "w-7 bg-accent" : "w-1.5 bg-w-border-light"
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

/* ═══════════════════════ Under the hood (lifecycle tabs) ═══════════════════════ */

export function LifecycleSection({ reducedMotion }: { reducedMotion: RM }) {
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

      {/* Tabs */}
      <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-1 rounded-lg border border-w-border bg-w-bg-secondary p-1" role="tablist" aria-label="Architecture components">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={i === activeTab}
            onClick={() => setActiveTab(i)}
            className={cx(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-medium transition-all duration-200",
              i === activeTab ? "bg-w-card text-w-cream" : "text-w-muted hover:text-w-text"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mx-auto mt-6 max-w-5xl"
        >
          <div className="rounded-xl border border-w-border bg-w-bg-secondary">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10">
              <div>
                <h3 className="text-[22px] font-semibold text-w-cream">{tabs[activeTab].heading}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-w-text">{tabs[activeTab].desc}</p>
              </div>
              <ul className="space-y-3">
                {tabs[activeTab].features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={reducedMotion ? false : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
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
