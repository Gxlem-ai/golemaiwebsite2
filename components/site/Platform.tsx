"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CountUp, Section, SectionHeader, type RM } from "@/components/site/primitives";

/* ═══════════════════════ Integrations strip ═══════════════════════ */

const INTEGRATIONS = [
  "Square",
  "Shopify",
  "Lightspeed",
  "Clover",
  "Zettle",
  "SumUp",
  "Epos Now",
  "Dojo",
  "Toast",
  "Xero",
  "QuickBooks",
  "Sage",
];

export function IntegrationsStrip({ reducedMotion }: { reducedMotion: RM }) {
  const row = [...INTEGRATIONS, ...INTEGRATIONS];
  return (
    <div className="mx-auto max-w-7xl px-6">
      <p className="mb-5 text-center text-[11px] uppercase tracking-[0.16em] text-w-faint">
        Integrates with the point-of-sale and finance systems already in use
      </p>
      <div className="marquee-container relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div
          className="flex w-max animate-marquee items-center gap-3"
          style={{ animationPlayState: reducedMotion ? "paused" : undefined }}
        >
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              aria-hidden={i >= INTEGRATIONS.length}
              className="whitespace-nowrap rounded-lg border border-w-border bg-w-bg-secondary px-5 py-2.5 text-[14px] font-medium text-w-muted"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ Capability band ═══════════════════════ */

/* NOTE: these describe how the product operates, not traction. Replace as needed. */
export function ProofBand() {
  const stats: { to: number; prefix?: string; suffix?: string; label: string }[] = [
    { to: 30, prefix: "<", suffix: " min", label: "Typical time to connect a POS" },
    { to: 6, prefix: "0", suffix: ":00", label: "Daily plan delivered, every trading day" },
    { to: 100, suffix: "%", label: "Actions subject to human approval" },
    { to: 24, suffix: "/7", label: "Continuous monitoring of connected systems" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid grid-cols-2 divide-y divide-w-border overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {stats.map((s) => (
          <div key={s.label} className="p-5 text-center sm:p-7">
            <div className="whitespace-nowrap text-[28px] font-semibold leading-none text-w-cream sm:text-[38px]">
              <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mx-auto mt-3 max-w-[190px] text-[13px] leading-relaxed text-w-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ Operating model ═══════════════════════ */

export function NewWaySection({ reducedMotion }: { reducedMotion: RM }) {
  const cards = [
    {
      title: "One system of record for operations",
      desc: "Sales, stock, pricing, staffing, supplier and cash data are consolidated into a single operating view. Questions are answered from the underlying systems, not from a report assembled the week before.",
    },
    {
      title: "Institutional memory that stays with the business",
      desc: "Every promotion, supplier change, weather event and shift note is retained and used in subsequent forecasts. Operating knowledge accumulates in the platform rather than leaving with individual staff.",
    },
    {
      title: "Judgement remains with the operator",
      desc: "GOLEM AI presents options together with the data and reasoning behind them. Operators review, adjust and approve. Nothing is executed without sign-off.",
    },
  ];

  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            align="left"
            eyebrow="The operating model"
            title={
              <>
                From fragmented systems to{" "}
                <span className="text-gradient-accent">one governed operation.</span>
              </>
            }
            subtitle="Most small and mid-sized businesses run on disconnected tools, spreadsheets and the memory of a few key people. GOLEM AI consolidates that operating data, prepares the decisions that depend on it, and holds every action for approval."
          />

          {/* Before / after */}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row">
            <div className="flex-1 rounded-xl border border-w-border bg-w-bg-secondary p-4 opacity-70">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-w-faint">Today</p>
              <div className="space-y-2">
                {["Data spread across disconnected tools", "Ordering and pricing set by instinct", "Knowledge held by individuals"].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-[12px] leading-snug text-w-muted">
                    <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-w-dim" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 rotate-90 text-accent sm:rotate-0" aria-hidden="true" />
            </div>
            <div className="flex-1 rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-accent">With GOLEM AI</p>
              <div className="space-y-2">
                {["A single, consolidated operating record", "Forecast-driven ordering and pricing", "Every decision reviewed and logged"].map((t) => (
                  <div key={t} className="flex items-start gap-2 text-[12px] leading-snug text-w-cream">
                    <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: cards */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          {cards.map((card) => (
            <div
              key={card.title}
              className="group rounded-xl border border-w-border bg-w-bg-secondary p-5 transition-all duration-200 hover:border-w-border-light hover:bg-w-card"
            >
              <h3 className="text-[15px] font-semibold text-w-cream">{card.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-w-muted">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════ Platform capabilities ═══════════════════════ */

export function CapabilitiesSection({ reducedMotion }: { reducedMotion: RM }) {
  const features = [
    {
      title: "Integrates with existing systems",
      desc: "Connects to the POS, payment, inventory and accounting platforms already in use. No new hardware, and no replacement of the tools staff already know.",
    },
    {
      title: "Models the business every night",
      desc: "Evaluates thousands of demand scenarios against actual sales history and prepares ordering, pricing and staffing recommendations before trading begins.",
    },
    {
      title: "Consolidates every location",
      desc: "Each site receives its own plan. Results roll up so performance can be compared, standardised and acted on across the whole estate.",
    },
    {
      title: "Holds every action for approval",
      desc: "Price changes, orders and rota adjustments wait for explicit approval, with the reasoning and a complete audit trail attached to each one.",
    },
  ];

  return (
    <Section id="platform" divider>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader
          eyebrow="Platform"
          title={
            <>
              One integration. <span className="text-gradient-accent">Four operating functions.</span>
            </>
          }
          subtitle="GOLEM AI connects to the systems a business already runs, models the business overnight, and provides a single place to operate it. Cloud-hosted by default, with private deployment available."
        />
      </motion.div>

      <div className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-w-border bg-w-bg-secondary p-6 transition-all duration-200 hover:border-w-border-light"
          >
            <div className="hairline-accent absolute inset-x-0 top-0 h-px opacity-60" />
            <h3 className="text-[16px] font-semibold text-w-cream">{f.title}</h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-w-text">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
