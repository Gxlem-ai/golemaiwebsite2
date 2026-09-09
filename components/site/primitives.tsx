"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useSpring, type Variants } from "framer-motion";

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

/** True only after hydration. Guards anything that would differ between server and client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Runs `tick` on an interval, but only while the element is on screen and the
 * viewer has not asked for reduced motion. Keeps the page's ambient animations
 * from burning cycles in background tabs and off-screen sections.
 */
export function useLiveTicker(
  ref: React.RefObject<Element>,
  tick: () => void,
  ms: number,
  enabled = true
) {
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduced = usePrefersReducedMotion();
  const saved = useRef(tick);
  saved.current = tick;

  useEffect(() => {
    if (!enabled || reduced || !inView) return;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [enabled, reduced, inView, ms]);
}

/* ═══════════════════════ Brand mark ═══════════════════════ */

export function GolemLogo({
  size = 26,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const spin = animated && !reduced;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={cx("block", className)}
    >
      {spin ? (
        <motion.circle
          cx="14"
          cy="14"
          r="12.4"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1"
          strokeDasharray="2 5"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "14px 14px" }}
        />
      ) : null}
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
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-w-cream px-5 py-2.5 text-[14px] font-medium text-w-bg transition-all duration-300 ease-out-expo hover:shadow-lift active:scale-[0.98]";
export const btnSecondary =
  "group inline-flex items-center justify-center gap-2 rounded-lg border border-w-border bg-w-bg-secondary px-5 py-2.5 text-[14px] font-medium text-w-cream transition-all duration-300 ease-out-expo hover:border-w-border-light hover:bg-w-card hover:shadow-card active:scale-[0.98]";

/**
 * Primary button with a sheen that sweeps across on hover. The sweep is a child
 * span rather than a background animation so it composites on the GPU.
 */
export function ShinyButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cx(btnPrimary, className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}

/**
 * Wraps children in a subtle cursor-follow translation. The pull is capped at a
 * few pixels so it reads as responsiveness rather than a toy.
 */
export function Magnetic({
  children,
  strength = 8,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    setOffset({ x: dx * strength, y: dy * strength });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
      className={cx("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════ Scroll reveal ═══════════════════════ */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Reveals its children once, when scrolled into view. Set `stagger` on a parent
 * and wrap each child in `RevealItem` to cascade them.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className = "",
  stagger,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  stagger?: number;
  as?: "div" | "section" | "li" | "ul";
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={
        stagger
          ? { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }
          : { hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0 } }
      }
      transition={stagger ? undefined : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  if (reduced) {
    const Tag = as as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* ═══════════════════════ Spotlight card ═══════════════════════ */

/**
 * Card that tracks the cursor, feeding --mx/--my to the .spotlight CSS layer.
 * Pointer maths runs on the element's own rect, so no layout is read per frame
 * beyond the one bounding box.
 */
export function SpotlightCard({
  children,
  className = "",
  border = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      ref.current.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    },
    [reduced]
  );

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={cx("spotlight", border && "spotlight-border", className)}
    >
      {children}
    </Tag>
  );
}

/* ═══════════════════════ Scroll progress ═══════════════════════ */

export function ScrollProgress({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: width }}
      className={cx(
        "h-px origin-left bg-gradient-to-r from-accent-terra via-accent to-accent-lav",
        className
      )}
    />
  );
}

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
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent/60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent-terra to-accent" />
      </span>
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
    <Reveal className={cx(centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl", className)}>
      {eyebrow ? <Eyebrow className={centered ? "justify-center" : ""}>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-balance text-[30px] font-semibold leading-[1.1] tracking-tight text-w-cream sm:text-[40px]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cx(
            "mt-4 text-[15px] leading-relaxed text-w-text sm:text-[16px]",
            centered ? "mx-auto max-w-2xl" : ""
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}

/* ═══════════════════════ Section wrapper ═══════════════════════ */

/**
 * Sections carry a scroll margin equal to the sticky header height so that
 * in-page navigation lands the heading below the header rather than beneath it.
 * The optional divider sits on the section's top edge; vertical rhythm is
 * applied to the inner wrapper so the divider never doubles the spacing.
 */
export function Section({
  id,
  children,
  className = "",
  contentClassName = "",
  divider = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  divider?: boolean;
}) {
  return (
    <section id={id} className={cx("relative mx-auto max-w-7xl scroll-mt-16 px-6", className)}>
      {divider ? <div className="section-divider" /> : null}
      <div className={cx("py-14 sm:py-16", contentClassName)}>{children}</div>
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
      ease: [0.16, 1, 0.3, 1],
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

/* ═══════════════════════ Ambient backdrop ═══════════════════════ */

/**
 * Drifting colour wash used behind the hero and the closing panel. Pure CSS
 * animation on three blurred blobs; it pauses under reduced motion via the
 * global media query in globals.css.
 */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute left-[8%] top-[-18%] h-[520px] w-[520px] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.16),transparent)] blur-[70px]" />
      <div className="absolute right-[6%] top-[-8%] h-[440px] w-[440px] animate-aurora-slow rounded-full bg-[radial-gradient(closest-side,rgba(217,119,87,0.14),transparent)] blur-[80px]" />
      <div className="absolute left-1/2 top-[12%] h-[380px] w-[720px] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(closest-side,rgba(15,155,142,0.09),transparent)] blur-[90px] [animation-delay:-8s]" />
    </div>
  );
}

/* ═══════════════════════ Status dot ═══════════════════════ */

export function LiveDot({ className = "", label }: { className?: string; label?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      {label ? <span className="text-[11px] font-medium text-accent">{label}</span> : null}
    </span>
  );
}
