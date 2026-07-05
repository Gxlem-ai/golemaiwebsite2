"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader, type RM } from "@/components/site/primitives";

/* ═══════════════════════ Results / Impact ═══════════════════════ */

export function ResultsSection() {
  const metrics = [
    { label: "Gross margin", value: "+3–5 pts", sub: "Typical lift within 90 days" },
    { label: "Waste & overstock", value: "Up to 50%", sub: "Less spoilage and dead stock" },
    { label: "Admin time", value: "60–100 hrs", sub: "Saved per month on forecasting & ordering" },
    { label: "Forecast accuracy", value: "96–99%", sub: "Daily demand prediction" },
  ];
  return (
    <Section id="results" divider>
      <SectionHeader
        eyebrow="The impact"
        title={
          <>
            Real outcomes for real businesses.{" "}
            <span className="text-gradient-accent">One site or many.</span>
          </>
        }
        subtitle="Across inventory, pricing, labour, and daily operations, GOLEM AI works from your actual sales and local reality, never industry averages."
      />

      <div className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-w-border bg-w-bg-secondary p-7">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-w-faint">{m.label}</div>
            <div className="mt-3 text-[34px] font-semibold leading-none text-w-cream">{m.value}</div>
            <div className="mt-2 text-[14px] text-w-muted">{m.sub}</div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[12px] text-w-faint">
        Typical results from early deployments. Your numbers will vary by business.
      </p>
    </Section>
  );
}

/* ═══════════════════════ Market opportunity & Why now ═══════════════════════ */

export function MarketSection({ reducedMotion }: { reducedMotion: RM }) {
  const why = [
    {
      title: "POS has opened up",
      desc: "Modern POS and payment platforms now expose clean, real-time APIs. The data has finally become reachable for every small business.",
    },
    {
      title: "Agents are ready",
      desc: "Reliable, tool-using AI agents can now reason over messy operational data and act safely, under human approval, at SME price points.",
    },
    {
      title: "Margins are under pressure",
      desc: "Inflation, labour costs, and thinning margins mean SMEs need an edge. GOLEM AI turns their own data into one.",
    },
  ];

  return (
    <Section id="market" divider>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader
          eyebrow="Why now"
          title={
            <>
              The timing is <span className="text-gradient-accent">right</span>.
            </>
          }
          subtitle="Three shifts put real operational AI within reach of every small and medium business."
        />
      </motion.div>

      {/* Why now */}
      <div className="mx-auto mt-12 grid gap-4 lg:grid-cols-3">
        {why.map((w, i) => (
          <motion.div
            key={w.title}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="rounded-xl border border-w-border bg-w-bg-secondary p-7"
          >
            <h3 className="text-[16px] font-semibold text-w-cream">{w.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-w-text">{w.desc}</p>
          </motion.div>
        ))}
      </div>

    </Section>
  );
}

/* ═══════════════════════ Innovative · Viable · Scalable ═══════════════════════ */

export function PillarsSection({ reducedMotion }: { reducedMotion: RM }) {
  const pillars = [
    {
      title: "An original approach",
      points: [
        "An agentic operating layer on top of the POS, not another dashboard",
        "Privacy-preserving intelligence that sharpens with every business",
        "Human-in-the-loop governance baked in, not bolted on",
      ],
    },
    {
      title: "Grounded in reality",
      points: [
        "Connects to tools businesses already own, with no new hardware",
        "Pays for itself: margin protected and dozens of admin hours saved each month",
        "Cloud by default, with optional private on-prem for sensitive operators",
      ],
    },
    {
      title: "Works at any size",
      points: [
        "One integration layer extends to any POS, any sector, any region",
        "Runs a single site or many locations from one place",
        "Grows with you, from first till to nationwide rollout",
      ],
    },
  ];

  return (
    <Section>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader
          eyebrow="The foundations"
          title={
            <>
              Built to <span className="text-gradient-accent">last</span>.
            </>
          }
          subtitle="A few principles we don't compromise on."
        />
      </motion.div>

      <div className="mx-auto mt-14 grid gap-4 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary p-8"
          >
            <div className="hairline-accent absolute inset-x-0 top-0 h-px" />
            <h3 className="text-[18px] font-semibold text-w-cream">{p.title}</h3>
            <ul className="mt-4 space-y-3">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-[14px] leading-relaxed text-w-text">
                  <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
