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
    { label: "Comms", x: 570, y: 200 },
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
  const sources = ["Square", "Eventbrite", "Google Trends"];
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
      <text x={SX} y="14" textAnchor="middle" fill="rgba(31,29,26,0.25)" fontSize="8" fontFamily="ui-monospace,monospace">YOUR DATA STAYS YOURS</text>
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
    { label: "Ordering", status: "EXEC", task: "Reorder draft" },
    { label: "Pricing", status: "EXEC", task: "Price tests" },
    { label: "Labour", status: "IDLE", task: "Shift plan" },
  ];
  const aCY = [50, 120, 190];
  const LX = 400, LY = 16;
  const entries = [
    { action: "Low stock flagged", time: "05:58:02", done: true },
    { action: "Reorder → approved", time: "06:00:11", done: true },
    { action: "Price test queued", time: "06:00:18", done: true },
    { action: "Daily plan compiling…", time: "06:00:24", done: false },
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
          <rect x="20" y={aCY[i] - 28} width="200" height={56} rx="8" fill="rgba(31,29,26,0.06)" stroke={a.status === "EXEC" ? "rgba(124,58,237,0.35)" : "rgba(31,29,26,0.10)"} strokeWidth="1" />
          <motion.circle cx="40" cy={aCY[i] - 6} r="5" fill={a.status === "EXEC" ? "#7c3aed" : "rgba(31,29,26,0.2)"} animate={a.status === "EXEC" && !rm ? { opacity: [0.4, 1, 0.4] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
          <text x="54" y={aCY[i] - 6} dominantBaseline="middle" fill="rgba(31,29,26,0.88)" fontSize="11.5" fontFamily="ui-sans-serif,sans-serif" fontWeight="600">{a.label}</text>
          <rect x="170" y={aCY[i] - 16} width="40" height="16" rx="4" fill={a.status === "EXEC" ? "rgba(124,58,237,0.12)" : "rgba(31,29,26,0.03)"} stroke={a.status === "EXEC" ? "rgba(124,58,237,0.35)" : "rgba(31,29,26,0.1)"} strokeWidth="1" />
          <text x="190" y={aCY[i] - 8} textAnchor="middle" dominantBaseline="middle" fill={a.status === "EXEC" ? "rgba(124,58,237,0.9)" : "rgba(31,29,26,0.25)"} fontSize="8" fontFamily="ui-monospace,monospace">{a.status}</text>
          <text x="40" y={aCY[i] + 14} dominantBaseline="middle" fill="rgba(31,29,26,0.35)" fontSize="9" fontFamily="ui-monospace,monospace">{a.task}</text>
        </motion.g>
      ))}
      {aCY.map((cy, i) => (
        <motion.g key={`cl-${i}`} variants={lineV}>
          <motion.line x1={220} y1={cy} x2={LX - 2} y2={LY + 105} stroke={agents[i].status === "EXEC" ? "rgba(124,58,237,0.25)" : "rgba(31,29,26,0.06)"} strokeWidth="1" />
          {agents[i].status === "EXEC" && (
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
      title: "Connect your POS",
      headline: "One layer. All your systems.",
      desc: "GOLEM AI connects to the POS you already run, plus payments, inventory, suppliers, accounting, and spreadsheets. Everything lands in one place, so you stop hunting across apps and just ask questions in plain English.",
      tags: ["POS & Payments", "Inventory", "Suppliers", "Accounting", "Spreadsheets"],
    },
    {
      num: "2",
      title: "Simulate overnight",
      headline: "Map reality. Simulate tomorrow.",
      desc: "Every night, GOLEM AI runs thousands of scenarios using signals from the tools you trust: your POS sales, Eventbrite events, and Google Trends demand. It prepares recommendations for ordering, pricing, staffing, and margin, ready for review.",
      tags: ["Square sales", "Eventbrite events", "Google Trends"],
    },
    {
      num: "3",
      title: "Review & execute",
      headline: "Review the logic. Approve. Done.",
      desc: "By 6 AM your daily plan is waiting in one place. Review, tweak, or approve with one click. GOLEM AI handles execution: updating prices, sending orders, logging everything. You stay in the room; the busywork doesn't.",
      tags: ["6 AM Daily Brief", "One-Click Approve", "Human-in-the-loop", "Full Audit Trail"],
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
        title="Set it up. Let it learn. Approve the plan."
        subtitle="Connect once, then just scroll. The plan builds itself, step by step."
      />

      <div className="mx-auto mt-16 grid gap-x-14 lg:grid-cols-2">
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
                className="flex min-h-[60vh] flex-col justify-center py-8"
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
                <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-w-border bg-w-card lg:hidden">
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
      heading: "Connects to what you have",
      desc: "GOLEM AI plugs straight into your existing POS, payments, and back-office tools, then organises the messy data automatically. No new hardware, no rip-and-replace.",
      features: [
        "Connects to your POS, payments, inventory, accounting, and rota tools",
        "One place to ask questions across every system, not five dashboards",
        "Cloud by default, with optional private on-prem deployment",
        "You stay in control, with no black boxes",
      ],
    },
    {
      label: "Predict",
      icon: Brain,
      heading: "Predicts tomorrow, tonight",
      desc: "While you sleep, GOLEM AI runs thousands of what-if scenarios using local weather, events, and your own customer patterns to build the best plan for tomorrow.",
      features: [
        "Tests thousands of demand scenarios every night",
        "Factors in weather, local events, and seasonal trends",
        "Works out exactly what to reorder and what to discount",
        "Delivers your daily plan by 6 AM",
      ],
    },
    {
      label: "Control",
      icon: ShieldCheck,
      heading: "You approve everything",
      desc: "GOLEM AI never changes a price or places an order without your clear, one-click approval. You stay in complete control of every decision.",
      features: [
        "Every recommendation waits for your approval",
        "Plain-English reasoning behind each suggestion",
        "A full record of every decision for your books",
        "One-click approve, or adjust before anything happens",
      ],
    },
  ];

  return (
    <Section>
      <SectionHeader eyebrow="What's under the hood" title="Serious technology. Simple for you." />

      {/* Tabs */}
      <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-1 rounded-lg border border-w-border bg-w-bg-secondary p-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
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
          className="mx-auto mt-8 max-w-5xl"
        >
          <div className="rounded-xl border border-w-border bg-w-bg-secondary">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:gap-10">
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
