"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "mt-2 h-[46px] w-full rounded-[10px] border border-transparent bg-paper-soft px-3.5 text-[15px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-faint hover:bg-paper-sunk focus:border-accent/60 focus:bg-white focus:ring-4 focus:ring-accent/10";
const labelClass = "block text-[13px] font-medium leading-none text-ink";

/**
 * The demo request form. It posts to /api/demo, which emails the request and
 * forwards it to a webhook when either is configured. When neither is, the API
 * answers `delivered: false` and the form hands the visitor a prefilled email
 * instead, so no enquiry is lost.
 */
export function DemoForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [delivered, setDelivered] = useState(true);
  const [values, setValues] = useState({ name: "", email: "", company: "", pos: "", website: "" });
  const reduced = usePrefersReducedMotion();

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
      const data = (await res.json().catch(() => null)) as { delivered?: boolean } | null;
      setDelivered(data?.delivered !== false);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The request could not be submitted.");
      setStatus("error");
    }
  };

  const field = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  if (status === "success" && !delivered) {
    const subject = encodeURIComponent("Demo request");
    const body = encodeURIComponent(
      [
        "Hello GOLEM AI team,",
        "",
        "I would like to request a demo.",
        "",
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Company: ${values.company}`,
        values.pos ? `Point of sale: ${values.pos}` : "",
      ]
        .filter((line, i, all) => line !== "" || all[i - 1] !== "")
        .join("\n")
    );
    return (
      <div className="mt-6 rounded-xl border border-accent/25 bg-accent-wash p-5" role="status">
        <p className="text-[15px] font-medium text-ink">One last step</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-copy">
          Send your details to {CONTACT_EMAIL} and we will be in touch within one working day.
        </p>
        <a
          href={`${CONTACT_MAILTO}?subject=${subject}&body=${body}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent-ink underline underline-offset-4"
        >
          Email {CONTACT_EMAIL}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mt-6 rounded-xl border border-accent/25 bg-accent-wash p-5"
        role="status"
      >
        <p className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
          <motion.span
            initial={reduced ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 18 }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white"
          >
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          </motion.span>
          Request received
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-copy">
          Thank you. A member of the team will be in touch within one working day to arrange a session.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="demo-name">
            Full name
          </label>
          <input id="demo-name" name="name" autoComplete="name" required maxLength={120} className={inputClass} {...field("name")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="demo-email">
            Work email
          </label>
          <input
            id="demo-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            className={inputClass}
            placeholder="you@company.com"
            {...field("email")}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="demo-company">
            Company
          </label>
          <input
            id="demo-company"
            name="company"
            autoComplete="organization"
            required
            maxLength={160}
            className={inputClass}
            {...field("company")}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="demo-pos">
            Point of sale <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="demo-pos"
            name="pos"
            maxLength={120}
            className={inputClass}
            placeholder="e.g. Square, Lightspeed"
            {...field("pos")}
          />
        </div>
      </div>

      {/* Honeypot: hidden from people, filled only by automated submissions. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="demo-website">Website</label>
        <input id="demo-website" name="website" tabIndex={-1} autoComplete="off" {...field("website")} />
      </div>

      <div className="flex flex-col-reverse items-start justify-between gap-4 pt-1 sm:flex-row sm:items-center">
        <p className="max-w-[300px] text-[12px] leading-relaxed text-muted">
          By submitting you agree to be contacted by GOLEM AI about this request. Your details are used for nothing else.
        </p>
        <Button type="submit" pill size="lg" arrow disabled={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? "Submitting…" : "Request a demo"}
        </Button>
      </div>

      <div aria-live="polite" className="min-h-[18px]">
        {status === "error" ? (
          <p className="text-[13px] text-terra-deep">
            {error} You can also email us at{" "}
            <a href={CONTACT_MAILTO} className="underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        ) : null}
      </div>
    </form>
  );
}
