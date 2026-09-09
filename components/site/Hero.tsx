"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cx, btnPrimary, btnSecondary, type RM, type ScrollTo } from "@/components/site/primitives";

/* ═══════════════════════ Operations console demo ═══════════════════════ */

function HeroConsole({ reducedMotion }: { reducedMotion: RM }) {
  const exchanges = useMemo(
    () => [
      {
        q: "Summarise yesterday's trading.",
        a: "Revenue £4,920, 8% above the same day last week. Gross margin up 3.1 points following Tuesday's price changes. 412 transactions at an average basket of £11.94. Two lines sold out before 14:00.",
      },
      {
        q: "Prepare the weekend order and rota.",
        a: "Saturday footfall is forecast 18% above baseline, driven by the market and clear weather. The draft order covers six fast-moving lines and holds three slow movers. One additional midday shift is recommended. Awaiting approval.",
      },
      {
        q: "Where is margin being lost?",
        a: "Weekend discounts were over-applied on three lines, and one supplier raised prices 4% this month. Two price tests and an alternative supplier have been drafted for review.",
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % exchanges.length), 4200);
    return () => clearInterval(t);
  }, [reducedMotion, exchanges.length]);

  return (
    <div className="overflow-hidden rounded-xl border border-w-border bg-w-bg-secondary shadow-[0_28px_70px_-28px_rgba(27,26,24,0.28)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-w-border bg-w-bg px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-3 flex-1 truncate text-center text-[12px] text-w-faint">
          GOLEM AI · Operations console
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="text-[11px] text-accent/80">Connected</span>
        </div>
      </div>

      {/* Body: content flows normally so long answers never clip on narrow screens */}
      <div className="relative min-h-[230px] sm:min-h-[176px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 p-5 font-mono text-[12.5px] sm:p-6 sm:text-[13px]"
          >
            <div className="flex items-start gap-2">
              <span className="shrink-0 select-none text-accent" aria-hidden="true">
                ❯
              </span>
              <span className="text-w-cream">{exchanges[idx].q}</span>
            </div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="ml-5 border-l-2 border-accent/40 py-1 pl-4"
            >
              <span className="leading-relaxed text-w-text">{exchanges[idx].a}</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="grid grid-cols-3 divide-x divide-w-border border-t border-w-border">
        {[
          { label: "Systems connected", value: "6" },
          { label: "Scenarios evaluated", value: "12,000" },
          { label: "Awaiting approval", value: "3" },
        ].map((m) => (
          <div key={m.label} className="bg-w-bg p-3.5 sm:p-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-w-faint">{m.label}</div>
            <div className="mt-1 text-[18px] font-semibold tabular-nums text-w-cream sm:text-[20px]">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ Hero ═══════════════════════ */

export function HeroSection({ reducedMotion, scrollTo }: { reducedMotion: RM; scrollTo: ScrollTo }) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pb-20 sm:pt-24">
      {/* Ambient glow + faint grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-6%] h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.08),transparent)] blur-[40px]" />
        <div className="absolute left-1/2 top-[0%] h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,119,87,0.06),transparent)] blur-[60px]" />
        <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_36%,transparent_75%)]" />
      </div>

      {/* Star orb with diffraction-spike legs */}
      <div className="pointer-events-none absolute left-1/2 top-[5%] z-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <motion.div
          className="absolute rounded-full blur-[45px]"
          style={{ width: 180, height: 180, background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%)" }}
          animate={reducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.45, 0.28, 0.45] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full blur-[14px]"
          style={{ width: 60, height: 60, background: "radial-gradient(circle, rgba(45,212,191,0.22) 0%, rgba(45,212,191,0.06) 55%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.9, 0.6, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 6, height: 6, background: "#2dd4bf", boxShadow: "0 0 7px 1px rgba(45,212,191,0.4), 0 0 15px 5px rgba(45,212,191,0.14)" }}
          animate={reducedMotion ? {} : { scale: [1, 1.35, 1], opacity: [0.95, 0.8, 0.95] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute"
          style={{ width: 260, height: 1.25, background: "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.32) 35%, #2dd4bf 50%, rgba(45,212,191,0.32) 65%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleX: [1, 1.12, 1], opacity: [0.45, 0.25, 0.45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute"
          style={{ width: 1.25, height: 190, background: "linear-gradient(180deg, transparent 0%, rgba(45,212,191,0.28) 35%, #2dd4bf 50%, rgba(45,212,191,0.28) 65%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleY: [1, 1.15, 1], opacity: [0.4, 0.22, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div
          className="absolute rotate-45"
          style={{ width: 165, height: 0.75, background: "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.2) 40%, rgba(45,212,191,0.42) 50%, rgba(45,212,191,0.2) 60%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleX: [1, 1.08, 1], opacity: [0.32, 0.16, 0.32] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.div
          className="absolute -rotate-45"
          style={{ width: 165, height: 0.75, background: "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.2) 40%, rgba(45,212,191,0.42) 50%, rgba(45,212,191,0.2) 60%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleX: [1, 1.08, 1], opacity: [0.32, 0.16, 0.32] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Positioning badge */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-[12px] font-medium text-w-cream">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="sm:hidden">Agentic operations platform</span>
            <span className="hidden sm:inline">Agentic operations platform · Human-approved by design</span>
          </span>
        </motion.div>

        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-[38px] font-semibold leading-[1.06] tracking-tight sm:text-[54px] lg:text-[66px]"
        >
          <span className="text-w-cream">Operational intelligence,</span>
          <br className="hidden sm:block" />{" "}
          <span className="text-gradient-accent animate-gradient-x">built on the point of sale.</span>
        </motion.h1>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-w-text sm:text-[18px]"
        >
          GOLEM AI connects to the point-of-sale and back-office systems a business already runs. It
          forecasts demand, prepares ordering, pricing and staffing decisions, and executes them once an
          operator approves. One integration covers any POS and every location.
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
        >
          <button
            onClick={() => scrollTo("contact")}
            className={cx(btnPrimary, "w-full px-6 py-3 text-[15px] shadow-[0_0_30px_-8px_rgba(124,58,237,0.45)] sm:w-auto")}
          >
            Request a demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => scrollTo("how")}
            className={cx(btnSecondary, "w-full px-6 py-3 text-[15px] sm:w-auto")}
          >
            See how it works
          </button>
        </motion.div>
      </div>

      {/* Console */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.38 }}
        className="relative mx-auto mt-12 max-w-3xl sm:mt-14"
      >
        <HeroConsole reducedMotion={reducedMotion} />
      </motion.div>
    </section>
  );
}
