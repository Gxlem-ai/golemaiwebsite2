"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cx, GolemLogo } from "@/components/site/primitives";
import { NAV_ITEMS } from "@/components/site/Nav";

/* ═══════════════════════ Demo request form ═══════════════════════ */

type Status = "idle" | "loading" | "success" | "error";

function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState({ name: "", email: "", company: "", pos: "", website: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "The request could not be submitted.");
      }
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The request could not be submitted.");
      setStatus("error");
    }
  };

  const field = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  const inputClass =
    "mt-1 w-full rounded-lg border border-w-border bg-w-bg px-3.5 py-2.5 text-[14px] text-w-cream outline-none transition-colors duration-200 placeholder:text-w-dim focus:border-accent/60 focus:ring-2 focus:ring-accent/15";
  const labelClass = "text-[12px] font-medium text-w-muted";

  if (status === "success") {
    return (
      <div className="mt-5 rounded-lg border border-accent/25 bg-accent/[0.06] p-5" role="status">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-w-cream">
          <Check className="h-4 w-4 text-accent" aria-hidden="true" />
          Request received
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-w-text">
          Thank you. A member of the team will be in touch within one working day to arrange a session.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3.5" noValidate={false}>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="demo-name">Full name</label>
          <input id="demo-name" name="name" autoComplete="name" required maxLength={120} className={inputClass} placeholder="Jane Doe" {...field("name")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="demo-email">Work email</label>
          <input id="demo-email" name="email" type="email" autoComplete="email" required maxLength={200} className={inputClass} placeholder="jane@company.com" {...field("email")} />
        </div>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="demo-company">Company</label>
          <input id="demo-company" name="company" autoComplete="organization" required maxLength={160} className={inputClass} placeholder="Company name" {...field("company")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="demo-pos">
            Point of sale <span className="font-normal text-w-faint">(optional)</span>
          </label>
          <input id="demo-pos" name="pos" maxLength={120} className={inputClass} placeholder="e.g. Square, Lightspeed" {...field("pos")} />
        </div>
      </div>
      {/* Honeypot: hidden from users, filled only by automated submissions */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="demo-website">Website</label>
        <input id="demo-website" name="website" tabIndex={-1} autoComplete="off" {...field("website")} />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={cx(
          "w-full rounded-lg bg-w-cream px-4 py-2.5 text-[14px] font-medium text-w-bg transition-colors hover:bg-w-cream/85 disabled:cursor-wait",
          status === "loading" && "opacity-70"
        )}
      >
        {status === "loading" ? "Submitting…" : "Request a demo"}
      </button>
      <div aria-live="polite" className="min-h-[16px]">
        {status === "error" && <p className="text-[12px] text-red-600">{error}</p>}
      </div>
      <p className="text-[11px] leading-relaxed text-w-dim">
        By submitting this form you agree to be contacted by GOLEM AI about your request. Your details are used for no other purpose.
      </p>
    </form>
  );
}

/* ═══════════════════════ Contact ═══════════════════════ */

export function CTASection() {
  const expectations = [
    "A walkthrough of the daily plan and the approval workflow",
    "Integration options for your point of sale and back office",
    "Deployment, security and data-handling questions answered",
  ];

  return (
    <section id="contact" className="relative mx-auto max-w-7xl scroll-mt-16 overflow-hidden px-6 pb-16 pt-4 sm:pb-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <div className="h-[280px] w-[800px] rounded-full bg-accent/[0.05] blur-[90px]" />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary">
        <div className="hairline-accent absolute inset-x-0 top-0 h-px" />
        <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:p-12">
          {/* Pitch */}
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-w-cream">Request a demo</p>
            <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.1] tracking-tight text-w-cream sm:text-[40px]">
              See the platform running on{" "}
              <span className="text-gradient-accent">your own numbers.</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-w-text">
              A 30-minute session with the GOLEM AI team, using a sample of your sales data where
              available.
            </p>
            <ul className="mt-6 space-y-2.5">
              {expectations.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-w-text">
                  <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="relative rounded-xl border border-w-border bg-w-bg p-5 sm:p-6">
            <h3 className="text-[16px] font-semibold text-w-cream">Tell us about your business</h3>
            <p className="mt-1 text-[13px] text-w-muted">We respond within one working day.</p>
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ Footer ═══════════════════════ */

export function Footer() {
  const links = [...NAV_ITEMS, { label: "Request a demo", id: "contact" }];
  return (
    <footer className="border-t border-w-border">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <GolemLogo />
              <span className="text-[17px] font-semibold text-w-cream">GOLEM AI</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-w-muted">
              Operational intelligence for businesses that run on a point of sale. Human-approved by design.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-[13px] text-w-muted transition-colors hover:text-w-cream">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 border-t border-w-border pt-6">
          <p className="text-[12px] text-w-faint">© {new Date().getFullYear()} GOLEM AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
