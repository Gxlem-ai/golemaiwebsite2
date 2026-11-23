"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cx, EASE } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";

/**
 * Building blocks for the product mock-ups.
 *
 * A mock-up is an illustration, not an interface: nothing in it is focusable
 * and the whole figure is exposed to assistive technology as one image with a
 * sentence describing what it shows (see MockFigure).
 */

/* ═══════════════════════ Figure ═══════════════════════ */

const TEXTURE = {
  lav: "tx tx-lav",
  clay: "tx tx-clay",
  dusk: "tx tx-dusk",
  cream: "tx tx-cream",
  ruled: "tx-ruled",
  stage: "stage",
  none: "",
} as const;

export type Texture = keyof typeof TEXTURE;

/** Class names for a textured surface, for cards that hold real, usable UI. */
export const textureClass = (texture: Texture) => TEXTURE[texture];

/**
 * The illustrated card a mock-up sits on. `label` is the text alternative for
 * the whole figure and is required: write one sentence saying what the
 * animation demonstrates.
 */
export const MockFigure = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    texture?: Texture;
    children: React.ReactNode;
    className?: string;
  }
>(function MockFigure({ label, texture = "ruled", children, className = "" }, ref) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cx("relative select-none rounded-card", TEXTURE[texture], className)}
    >
      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </div>
  );
});

/* ═══════════════════════ Window ═══════════════════════ */

/** A product window: three dots, a centred title, the wordmark, then content. */
export function Window({
  title,
  children,
  className = "",
  bodyClassName = "",
  brand = true,
  chrome = true,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Show the small GOLEM wordmark at the right of the title bar. */
  brand?: boolean;
  /** Set false for a bare card with no title bar. */
  chrome?: boolean;
}) {
  return (
    <div className={cx("overflow-hidden rounded-window border border-line bg-white shadow-window", className)}>
      {chrome ? (
        <div className="flex h-9 items-center gap-2 border-b border-line px-3.5">
          <div className="flex gap-[5px]">
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
            <span className="h-[7px] w-[7px] rounded-full bg-line-strong" />
          </div>
          <div className="min-w-0 flex-1 truncate text-center text-[10.5px] leading-none text-faint">{title}</div>
          {brand ? (
            <div className="flex items-center gap-[3px] text-[10.5px] font-semibold leading-none tracking-[-0.02em] text-ink">
              GOLEM
              <span className="h-[3px] w-[3px] translate-y-[2px] rounded-full bg-accent" />
            </div>
          ) : (
            <div className="w-[38px]" />
          )}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

/* ═══════════════════════ Chips and pills ═══════════════════════ */

const DOT = {
  ink: "bg-ink",
  accent: "bg-accent",
  ok: "bg-ok",
  terra: "bg-terra",
  faint: "bg-dim",
} as const;

/** The white status chip that floats above a window ("Checking line 2 of 4"). */
export function FloatChip({
  children,
  tone = "ink",
  pulse = false,
  className = "",
}: {
  children: React.ReactNode;
  tone?: keyof typeof DOT;
  /** Ring that pulses around the dot while something is in progress. */
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-white py-[7px] pl-3 pr-3.5 text-[12.5px] leading-none text-ink shadow-float",
        className
      )}
    >
      <span className="relative flex h-[7px] w-[7px]">
        {pulse ? <span className={cx("absolute inset-0 animate-pulse-ring rounded-full", DOT[tone])} /> : null}
        <span className={cx("relative h-[7px] w-[7px] rounded-full", DOT[tone])} />
      </span>
      {children}
    </span>
  );
}

const PILL = {
  ok: "bg-ok-wash text-ok-deep",
  flag: "bg-terra-wash text-terra-deep",
  accent: "bg-accent-wash text-accent-ink",
  neutral: "bg-paper-sunk text-copy",
  solid: "bg-accent text-white",
  ink: "bg-ink text-white",
} as const;

export type PillTone = keyof typeof PILL;

/** Small rounded status label inside a window ("Approved", "Held", "Pending"). */
export function StatusPill({
  children,
  tone = "neutral",
  icon,
  className = "",
}: {
  children: React.ReactNode;
  tone?: PillTone;
  icon?: "check" | "cross";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-[10.5px] font-medium leading-none",
        PILL[tone],
        className
      )}
    >
      {icon === "check" ? <Check className="h-[9px] w-[9px]" strokeWidth={3} /> : null}
      {icon === "cross" ? <X className="h-[9px] w-[9px]" strokeWidth={3} /> : null}
      {children}
    </span>
  );
}

/** Round tick or cross at the end of a checked row. */
export function ResultMark({ ok, className = "" }: { ok: boolean; className?: string }) {
  return (
    <span
      className={cx(
        "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full",
        ok ? "bg-ok-wash text-ok-deep" : "bg-terra-wash text-terra-deep",
        className
      )}
    >
      {ok ? <Check className="h-[9px] w-[9px]" strokeWidth={3.2} /> : <X className="h-[9px] w-[9px]" strokeWidth={3.2} />}
    </span>
  );
}

/** Tiny monospace label inside a window ("PLAN_0611", "§ ORDERING"). */
export function MockLabel({
  children,
  className = "",
  tone = "faint",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "faint" | "accent" | "terra" | "ok" | "ink";
}) {
  return (
    <span
      className={cx(
        "font-mono text-[10px] uppercase leading-none tracking-[0.05em]",
        tone === "faint" && "text-faint",
        tone === "accent" && "text-accent",
        tone === "terra" && "text-terra-deep",
        tone === "ok" && "text-ok-deep",
        tone === "ink" && "text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Grey bar standing in for a line of text nobody needs to read. */
export function SkeletonLine({ w = "60%", className = "" }: { w?: string | number; className?: string }) {
  return <span className={cx("block h-[5px] rounded-full bg-line", className)} style={{ width: w }} />;
}

/** Highlighted phrase in a document or sentence mock-up. */
export function Marked({
  children,
  on = true,
  tone = "accent",
}: {
  children: React.ReactNode;
  /** Animate the highlight in by flipping this to true. */
  on?: boolean;
  tone?: "accent" | "terra";
}) {
  return (
    <span
      className={cx(
        "-mx-[2px] rounded-[4px] px-[2px] transition-colors duration-500",
        on && tone === "accent" && "bg-accent-wash text-accent-ink",
        on && tone === "terra" && "bg-terra-wash text-terra-deep"
      )}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════ Cursor ═══════════════════════ */

/**
 * The pointer that operates a mock-up. Position is given in percentages of
 * the nearest positioned ancestor, so it tracks at any width. Flip `press` to
 * true for a click: the pointer dips and a ring spreads from its tip.
 */
export function MockCursor({
  x,
  y,
  visible = true,
  press = false,
  duration = 0.9,
}: {
  x: number;
  y: number;
  visible?: boolean;
  press?: boolean;
  /** Seconds the pointer takes to travel to a new position. */
  duration?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%`, opacity: visible ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration, ease: EASE, opacity: { duration: 0.25 } }}
    >
      {press && !reduced ? (
        <motion.span
          key="ring"
          className="absolute -left-2 -top-2 h-5 w-5 rounded-full border border-accent/60"
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ) : null}
      <motion.svg
        width="17"
        height="21"
        viewBox="0 0 17 21"
        fill="none"
        animate={{ scale: press ? 0.86 : 1 }}
        transition={{ duration: 0.14 }}
        style={{ transformOrigin: "2px 2px", filter: "drop-shadow(0 2px 3px rgba(27,26,24,0.28))" }}
      >
        <path
          d="M1.2 1.3 L1.2 16.2 L5.3 12.6 L8 18.9 L10.8 17.7 L8.1 11.6 L13.6 11.3 Z"
          fill="#1b1a18"
          stroke="#ffffff"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

/* ═══════════════════════ Animated number ═══════════════════════ */

/**
 * A figure that counts to its value whenever the value changes. Use it for
 * totals that build up as a sequence runs; under reduced motion it simply
 * shows the value.
 */
export function CountTo({
  value,
  format,
  duration = 0.9,
  className = "",
}: {
  value: number;
  /** Turns the animating number into text, e.g. pounds with two decimals. */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduced) {
      from.current = value;
      setShown(value);
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        from.current = v;
        setShown(v);
      },
    });
    return () => controls.stop();
  }, [value, duration, reduced]);

  const text = format ? format(shown) : Math.round(shown).toLocaleString("en-GB");
  return <span className={cx("tabular-nums", className)}>{text}</span>;
}

/** £1,240 or £1,240.50. */
export const pounds = (n: number, decimals = 0) =>
  `£${n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

/* ═══════════════════════ Scan line ═══════════════════════ */

/**
 * The glowing line that sweeps down a table as rows are checked. Place it
 * inside a relatively positioned table body and give it the row to sit on.
 */
export function ScanLine({ top, visible }: { top: string; visible: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-10 h-px"
      initial={false}
      animate={{ top, opacity: visible ? 1 : 0 }}
      transition={{ top: { duration: 0.55, ease: EASE }, opacity: { duration: 0.3 } }}
    >
      <div className="h-px w-full bg-accent" />
      <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-accent/[0.14] to-transparent" />
    </motion.div>
  );
}
