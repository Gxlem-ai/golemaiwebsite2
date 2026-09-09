"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeader, type RM } from "@/components/site/primitives";

/* ═══════════════════════ Outcomes ═══════════════════════ */

export function ResultsSection() {
  const metrics = [
    { label: "Gross margin", value: "+3–5 pts", sub: "Typical improvement within 90 days" },
    { label: "Waste and overstock", value: "Up to 50%", sub: "Reduction in spoilage and dead stock" },
    { label: "Administrative time", value: "60–100 hrs", sub: "Recovered per month across forecasting and ordering" },
    { label: "Forecast accuracy", value: "96–99%", sub: "Daily demand, measured at line level" },
  ];
  return (
    <Section id="outcomes" divider>
      <SectionHeader
        eyebrow="Outcomes"
        title={
          <>
            Measured outcomes, from a single site{" "}
            <span className="text-gradient-accent">to a multi-location estate.</span>
          </>
        }
        subtitle="Across inventory, pricing, labour and daily operations, GOLEM AI works from actual sales and local conditions rather than industry averages."
      />

      <div className="mx-auto mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-w-border bg-w-bg-secondary p-6">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-w-faint">{m.label}</div>
            <div className="mt-3 text-[32px] font-semibold leading-none tracking-tight text-w-cream">{m.value}</div>
            <div className="mt-2 text-[13px] leading-snug text-w-muted">{m.sub}</div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-[12px] text-w-faint">
        Figures reflect early deployments and vary by business, sector and data quality.
      </p>
    </Section>
  );
}

/* ═══════════════════════ Why now ═══════════════════════ */

export function MarketSection({ reducedMotion }: { reducedMotion: RM }) {
  const why = [
    {
      title: "Point-of-sale data is now accessible",
      desc: "Modern POS and payment platforms expose reliable, real-time APIs. Operating data that was previously locked inside proprietary systems can now be read and acted on.",
    },
    {
      title: "Agents are dependable enough to act",
      desc: "Tool-using AI agents can reason over inconsistent operational data and take bounded actions under human approval, at a cost that is viable for smaller businesses.",
    },
    {
      title: "Margins leave no room for error",
      desc: "Inflation, labour costs and price pressure have compressed margins. The businesses that hold their position will be those that make full use of the data they already generate.",
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
              Three shifts have made this <span className="text-gradient-accent">practical</span>.
            </>
          }
          subtitle="Operational AI of this kind was not viable for small and mid-sized businesses until recently. Three developments changed that."
        />
      </motion.div>

      <div className="mx-auto mt-12 grid gap-4 lg:grid-cols-3">
        {why.map((w, i) => (
          <motion.div
            key={w.title}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="rounded-xl border border-w-border bg-w-bg-secondary p-6"
          >
            <h3 className="text-[16px] font-semibold text-w-cream">{w.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-w-text">{w.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════ Principles ═══════════════════════ */

export function PillarsSection({ reducedMotion }: { reducedMotion: RM }) {
  const pillars = [
    {
      title: "A different architecture",
      points: [
        "An operating layer above the POS, rather than another reporting dashboard",
        "Models that improve with each deployment while customer data stays isolated",
        "Human approval designed into every workflow, not added afterwards",
      ],
    },
    {
      title: "Grounded in existing operations",
      points: [
        "Works with the systems businesses already own; no new hardware required",
        "Pays back through protected margin and recovered management time",
        "Cloud-hosted by default, with private deployment for regulated or sensitive operations",
      ],
    },
    {
      title: "Designed to scale",
      points: [
        "One integration layer that extends to any POS, sector or region",
        "Operates a single site or a multi-location estate from one place",
        "Supports growth from the first location to a national footprint",
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
          eyebrow="Principles"
          title={
            <>
              Built to be <span className="text-gradient-accent">trusted</span>.
            </>
          }
          subtitle="The commitments that shape how the platform is designed, deployed and operated."
        />
      </motion.div>

      <div className="mx-auto mt-12 grid gap-4 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary p-7"
          >
            <div className="hairline-accent absolute inset-x-0 top-0 h-px" />
            <h3 className="text-[17px] font-semibold text-w-cream">{p.title}</h3>
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
