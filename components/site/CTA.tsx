"use client";

import React, { useState } from "react";
import { cx, GolemLogo } from "@/components/site/primitives";

/* ═══════════════════════ Demo form ═══════════════════════ */

function DemoForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [values, setValues] = useState({ name: "", email: "", company: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 700));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-w-border bg-w-bg px-4 py-2.5 text-[14px] text-w-cream outline-none transition-colors duration-200 placeholder:text-w-dim focus:border-accent/60";

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <div>
        <label className="text-[11px] font-medium text-w-faint" htmlFor="demo-name">Name</label>
        <input id="demo-name" name="name" autoComplete="name" required value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} className={inputClass} placeholder="Your name" />
      </div>
      <div>
        <label className="text-[11px] font-medium text-w-faint" htmlFor="demo-email">Email</label>
        <input id="demo-email" name="email" type="email" autoComplete="email" required value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} className={inputClass} placeholder="you@business.com" />
      </div>
      <div>
        <label className="text-[11px] font-medium text-w-faint" htmlFor="demo-company">Business</label>
        <input id="demo-company" name="company" autoComplete="organization" required value={values.company}
          onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))} className={inputClass} placeholder="Business name" />
      </div>
      <button type="submit" disabled={status === "loading" || status === "success"}
        className={cx("w-full rounded-lg bg-w-cream px-4 py-2.5 text-[14px] font-medium text-w-bg transition-colors hover:bg-w-cream/85",
          status === "loading" && "opacity-70")}>
        {status === "loading" ? "Submitting…" : status === "success" ? "Request received ✓" : "Book a demo"}
      </button>
      <div aria-live="polite" className="min-h-[14px]">
        {status === "error" && <p className="text-[11px] text-red-600">Something went wrong. Please try again.</p>}
        {status === "success" && <p className="text-[11px] text-accent">Thanks, we&apos;ll reach out within a day.</p>}
      </div>
      <p className="text-[11px] text-w-dim">By submitting, you agree to be contacted by GOLEM AI.</p>
    </form>
  );
}

/* ═══════════════════════ CTA ═══════════════════════ */

export function CTASection() {
  return (
    <section id="cta" className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-28 pt-10">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <div className="h-[280px] w-[800px] rounded-full bg-accent/[0.05] blur-[90px]" />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-w-border bg-w-bg-secondary">
        <div className="hairline-accent absolute inset-x-0 top-0 h-px" />
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-14">
          {/* Pitch */}
          <div className="flex items-center">
            <h2 className="text-[32px] font-semibold leading-tight tracking-tight text-w-cream sm:text-[44px]">
              Want better <span className="text-gradient-accent">margins</span>?
            </h2>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-w-border bg-w-bg p-6">
            <h3 className="text-[16px] font-semibold text-w-cream">Book a demo</h3>
            <p className="mt-1 text-[12px] text-w-muted">Tell us about your business. We&apos;ll reach out within a day.</p>
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ Footer ═══════════════════════ */

export function Footer() {
  return (
    <footer className="border-t border-w-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <GolemLogo />
          <span className="text-[17px] font-semibold text-w-cream">GOLEM AI</span>
        </div>
        <p className="text-[12px] text-w-faint">© {new Date().getFullYear()} GOLEM AI. All rights reserved.</p>
        <div className="flex gap-5">
          {["Privacy", "Terms", "Cookies"].map((l) => (
            <a key={l} href="#" className="text-[12px] text-w-faint transition-colors hover:text-w-muted">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
