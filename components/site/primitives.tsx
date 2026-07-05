"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/* ═══════════════════════ Shared types ═══════════════════════ */

export type RM = boolean;
export type ScrollTo = (id: string) => void;

/* ═══════════════════════ Utilities ═══════════════════════ */

export const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    return undefined;
  }, []);
  return reduced;
}

/* ═══════════════════════ Brand mark ═══════════════════════ */

export function GolemLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={cx("block", className)}
    >
      <path
        d="M21.5 7.5 A9 9 0 1 0 21.5 15 H14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="2.2" fill="currentColor" />
    </svg>
  );
}

/* ═══════════════════════ Buttons ═══════════════════════ */

export const btnPrimary =
  "group inline-flex items-center justify-center gap-2 rounded-lg bg-w-cream px-5 py-2.5 text-[14px] font-medium text-w-bg transition-colors duration-200 hover:bg-w-cream/85";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-w-border bg-w-bg-secondary px-5 py-2.5 text-[14px] font-medium text-w-cream transition-colors duration-200 hover:border-w-border-light hover:bg-w-card";

/* ═══════════════════════ Eyebrow label ═══════════════════════ */

export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cx(
        "inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-w-cream",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent-terra to-accent-lav" />
      {children}
    </p>
  );
}

/* ═══════════════════════ Section header ═══════════════════════ */

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={cx(centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl", className)}>
      {eyebrow ? <Eyebrow className={centered ? "justify-center" : ""}>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-tight text-w-cream sm:text-[42px]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cx(
            "mt-4 text-[16px] leading-relaxed text-w-text",
            centered ? "mx-auto max-w-2xl" : ""
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/* ═══════════════════════ Section wrapper ═══════════════════════ */

export function Section({
  id,
  children,
  className = "",
  divider = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}) {
  return (
    <section id={id} className={cx("relative mx-auto max-w-7xl px-6 py-24 sm:py-28", className)}>
      {divider ? <div className="section-divider mb-20 sm:mb-24" /> : null}
      {children}
    </section>
  );
}

/* ═══════════════════════ Animated count-up ═══════════════════════ */

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = usePrefersReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, reduced, to, duration]);

  const display = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(val),
    [val, decimals]
  );

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ═══════════════════════ Pill ═══════════════════════ */

export function Pill({
  children,
  active = false,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all duration-500",
        active
          ? "border-accent/30 bg-accent/[0.06] text-w-cream shadow-[0_1px_10px_rgba(124,58,237,0.12)]"
          : "border-w-border bg-transparent text-w-faint",
        className
      )}
    >
      {children}
    </span>
  );
}
