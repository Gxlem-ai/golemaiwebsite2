"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CountUp, Section, SectionHeader, type RM } from "@/components/site/primitives";

/* ═══════════════════════ POS integrations strip ═══════════════════════ */

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
    <div className="mx-auto max-w-7xl px-6 pb-4">
      <p className="mb-6 text-center text-[11px] uppercase tracking-[0.16em] text-w-faint">
        Works with the POS &amp; tools you already run
      </p>
      <div className="marquee-container relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div
          className="flex w-max animate-marquee items-center gap-3"
          style={{ animationPlayState: reducedMotion ? "paused" : undefined }}
        >
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
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

/* ═══════════════════════ Proof band (animated counters) ═══════════════════════ */

/* NOTE: these are product-capability facts, not traction figures. Replace freely. */
export function ProofBand() {
  const stats: { to: number; prefix?: string; suffix?: string; label: string }[] = [
    { to: 30, prefix: "<", suffix: " min", label: "Average time to connect your POS" },
    { to: 6, suffix: " AM", label: "Your plan is ready, every day" },
    { to: 100, suffix: "%", label: "Actions are human-approved" },
    { to: 24, suffix: "/7", label: "Agents working in the background" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid grid-cols-2 divide-y divide-w-border overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {stats.map((s) => (
          <div key={s.label} className="p-7 text-center">
            <div className="text-[36px] font-semibold leading-none text-w-cream sm:text-[40px]">
              <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mx-auto mt-3 max-w-[180px] text-[13px] leading-relaxed text-w-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ Problem → Solution ═══════════════════════ */

export function NewWaySection({ reducedMotion }: { reducedMotion: RM }) {
  const cards = [
    {
      title: "Five dashboards → one conversation",
      desc: "Ditch the spreadsheets, group chats, and the apps no one opens. Ask GOLEM AI anything in plain English: sales, stock, pricing, staffing, suppliers, cashflow. It reads every system and answers like a sharp operator who knows your business.",
    },
    {
      title: "Gut feel → institutional memory",
      desc: "GOLEM AI remembers every promotion, every weather spike, every supplier change and shift note. Your hard-won knowledge compounds in the business instead of walking out the door with your best people.",
    },
    {
      title: "Black box → judgment, amplified",
      desc: "GOLEM AI never decides behind your back. It surfaces clear options with the reasoning in full. You review, tweak, and approve. Owner plus AI beats either one alone.",
    },
  ];

  return (
    <Section>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* Left */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            align="left"
            eyebrow="A new way to operate"
            title={
              <>
                Stop guessing. <span className="text-gradient-accent">Start compounding.</span>
              </>
            }
            subtitle="Most small and medium businesses run on memory, spreadsheets, and luck. GOLEM AI replaces that with a crew of AI agents that already know your numbers, handling demand forecasting, ordering, pricing, labour, and cashflow. Every recommendation waits for your team to approve."
          />

          {/* Before → After */}
          <div className="mt-10 flex items-stretch gap-3">
            <div className="flex-1 rounded-xl border border-w-border bg-w-bg-secondary p-4 opacity-70">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-w-faint">Before</p>
              <div className="space-y-2">
                {["Messy spreadsheets", "Guessing what sells", "Software you don't trust"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[12px] text-w-muted">
                    <div className="h-1 w-1 rounded-full bg-w-dim" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1 rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-accent">With GOLEM AI</p>
              <div className="space-y-2">
                {["Automatic data sync", "Exact demand prediction", "You stay in control"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[12px] text-w-cream">
                    <div className="h-1 w-1 rounded-full bg-accent" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - cards */}
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
              <p className="mt-1 text-[13px] leading-relaxed text-w-muted">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════ Capabilities ═══════════════════════ */

export function CapabilitiesSection({ reducedMotion }: { reducedMotion: RM }) {
  const features = [
    {
      title: "Works with what you have",
      desc: "No new tills, no rip-and-replace. GOLEM AI connects to your existing POS, payments, inventory, and accounting in minutes, then organises the fragmented data for you.",
    },
    {
      title: "Smarter every night",
      desc: "While you sleep, GOLEM AI runs thousands of scenarios on your real sales and prepares ordering, pricing, and labour recommendations so you wake up to a clear plan.",
    },
    {
      title: "One brain across every location",
      desc: "Run a single site or fifty. Every location gets its own plan, and the numbers roll up so you can compare, standardise, and act across the whole business.",
    },
    {
      title: "You approve everything",
      desc: "GOLEM AI proposes; you decide. Every price change and order waits for one-click approval, with clear reasoning and a full audit trail behind it.",
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
          eyebrow="The platform"
          title={
            <>
              One layer on your POS. <span className="text-gradient-accent">Four superpowers.</span>
            </>
          }
          subtitle="GOLEM AI connects to what you have, learns your business overnight, and gives you one place to run it. Cloud by default, with optional private on-prem deployment."
        />
      </motion.div>

      <div className="mx-auto mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-w-border bg-w-bg-secondary p-7 transition-all duration-200 hover:border-w-border-light"
          >
            <div className="hairline-accent absolute inset-x-0 top-0 h-px opacity-60" />
            <h3 className="text-[17px] font-semibold text-w-cream">{f.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-w-text">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
