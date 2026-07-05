"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cx, btnPrimary, btnSecondary, type RM, type ScrollTo } from "@/components/site/primitives";

/* ═══════════════════════ Live POS terminal demo ═══════════════════════ */

function HeroTerminal({ reducedMotion }: { reducedMotion: RM }) {
  const exchanges = useMemo(
    () => [
      {
        q: "How did we do yesterday?",
        a: "Revenue £4,920, up 8% on last week. Margin +3.1 pts after the price tweaks. 412 transactions, avg basket £11.94. Two SKUs sold out by 2pm.",
      },
      {
        q: "What should I reorder and staff for the weekend?",
        a: "Saturday footfall +18% (market day + sun). Reorder 6 fast movers, hold 3 slow ones. Add one midday shift. Plan ready for your approval.",
      },
      {
        q: "Where am I leaking margin?",
        a: "Weekend discounts over-applied on 3 lines and supplier X raised prices 4%. I drafted two price tests and a supplier switch. Want the breakdown?",
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % exchanges.length), 3500);
    return () => clearInterval(t);
  }, [reducedMotion, exchanges.length]);

  return (
    <div className="overflow-hidden rounded-xl border border-w-border bg-w-bg-secondary shadow-[0_32px_80px_-20px_rgba(0,0,0,0.65)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-w-border bg-w-bg px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-3 flex-1 text-center text-[12px] text-w-faint">
          golem ai · connected to your POS
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="text-[11px] text-accent/80">live</span>
        </div>
      </div>

      {/* Body */}
      <div className="relative min-h-[185px] p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 space-y-4 p-6 font-mono text-[13px]"
          >
            <div className="flex items-start gap-2">
              <span className="shrink-0 select-none text-accent">❯</span>
              <span className="text-w-cream">{exchanges[idx].q}</span>
            </div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="ml-5 rounded-lg border-l-2 border-accent/40 py-1 pl-4"
            >
              <span className="leading-relaxed text-w-text">{exchanges[idx].a}</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Metrics bar */}
      <div className="grid grid-cols-3 divide-x divide-w-border border-t border-w-border">
        {[
          { label: "Transactions read", value: "1,200/hr" },
          { label: "Scenarios / night", value: "12k" },
          { label: "Actions approved", value: "98%" },
        ].map((m) => (
          <div key={m.label} className="bg-w-bg p-4">
            <div className="text-[10px] font-medium uppercase tracking-wider text-w-faint">{m.label}</div>
            <div className="mt-1 text-[20px] font-semibold tabular-nums text-w-cream">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ Hero ═══════════════════════ */

export function HeroSection({ reducedMotion, scrollTo }: { reducedMotion: RM; scrollTo: ScrollTo }) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-28">
      {/* Ambient glow + faint grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-6%] h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.08),transparent)] blur-[40px]" />
        <div className="absolute left-1/2 top-[0%] h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(217,119,87,0.06),transparent)] blur-[60px]" />
        <div className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_36%,transparent_75%)]" />
      </div>

      {/* Compact, subtle light cyan-green star orb with diffraction-spike legs */}
      <div className="pointer-events-none absolute left-1/2 top-[5%] z-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        {/* Outer halo */}
        <motion.div
          className="absolute rounded-full blur-[45px]"
          style={{ width: 180, height: 180, background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%)" }}
          animate={reducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.45, 0.28, 0.45] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner glow */}
        <motion.div
          className="absolute rounded-full blur-[14px]"
          style={{ width: 60, height: 60, background: "radial-gradient(circle, rgba(45,212,191,0.22) 0%, rgba(45,212,191,0.06) 55%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.9, 0.6, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Light-purple core (filled) */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 6, height: 6, background: "#2dd4bf", boxShadow: "0 0 7px 1px rgba(45,212,191,0.4), 0 0 15px 5px rgba(45,212,191,0.14)" }}
          animate={reducedMotion ? {} : { scale: [1, 1.35, 1], opacity: [0.95, 0.8, 0.95] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Horizontal leg */}
        <motion.div
          className="absolute"
          style={{ width: 260, height: 1.25, background: "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.32) 35%, #2dd4bf 50%, rgba(45,212,191,0.32) 65%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleX: [1, 1.12, 1], opacity: [0.45, 0.25, 0.45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Vertical leg */}
        <motion.div
          className="absolute"
          style={{ width: 1.25, height: 190, background: "linear-gradient(180deg, transparent 0%, rgba(45,212,191,0.28) 35%, #2dd4bf 50%, rgba(45,212,191,0.28) 65%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleY: [1, 1.15, 1], opacity: [0.4, 0.22, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        {/* Diagonal leg +45° */}
        <motion.div
          className="absolute rotate-45"
          style={{ width: 165, height: 0.75, background: "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.2) 40%, rgba(45,212,191,0.42) 50%, rgba(45,212,191,0.2) 60%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleX: [1, 1.08, 1], opacity: [0.32, 0.16, 0.32] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        {/* Diagonal leg -45° */}
        <motion.div
          className="absolute -rotate-45"
          style={{ width: 165, height: 0.75, background: "linear-gradient(90deg, transparent 0%, rgba(45,212,191,0.2) 40%, rgba(45,212,191,0.42) 50%, rgba(45,212,191,0.2) 60%, transparent 100%)" }}
          animate={reducedMotion ? {} : { scaleX: [1, 1.08, 1], opacity: [0.32, 0.16, 0.32] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Positioning badge */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 inline-flex"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-[12px] font-medium text-w-cream">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Agentic infrastructure for SMEs · Predictive · Human-Approved
          </span>
        </motion.div>

        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[58px] lg:text-[74px]"
        >
          <span className="text-w-cream">Connect your POS.</span>
          <br />
          <span className="text-gradient-accent animate-gradient-x">Let AI run the rest.</span>
        </motion.h1>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-w-text sm:text-[18px]"
        >
          GOLEM AI is the agentic operating system that plugs into the point-of-sale every small and medium
          business already runs. It turns each transaction into foresight: predicting demand, automating
          ordering and pricing, planning labour, and protecting margin. Every action is human-approved.
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <button
            onClick={() => scrollTo("cta")}
            className={cx(btnPrimary, "px-6 py-3 text-[15px] shadow-[0_0_30px_-8px_rgba(124,58,237,0.45)]")}
          >
            Book a demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => scrollTo("how")}
            className={cx(btnSecondary, "px-6 py-3 text-[15px]")}
          >
            See how it works
          </button>
        </motion.div>
      </div>

      {/* Terminal */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.38 }}
        className="relative mx-auto mt-16 max-w-3xl"
      >
        <HeroTerminal reducedMotion={reducedMotion} />
      </motion.div>
    </section>
  );
}
