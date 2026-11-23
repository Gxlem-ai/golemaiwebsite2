"use client";

import React, { useMemo, useRef } from "react";
import { cubicBezier, motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cx } from "@/components/ui/core";
import { usePrefersReducedMotion } from "@/components/ui/hooks";

/**
 * The scroll-driven text reveal: a section that pins to the viewport while its
 * words come into focus one after another as the page moves.
 *
 * Three pieces, so that different sections can share the engine:
 *   <PinnedScroll>     pins its content and hands out scroll progress (0 to 1)
 *   <RevealWords>      a passage whose words sharpen in sequence
 *   <RevealProgress>   the short rule beneath that fills as you go
 *
 * For reduced-motion visitors nothing pins: the content is simply shown.
 */

const settle = cubicBezier(0.33, 0, 0.2, 1);

/** How many words are mid-reveal at once: the width of the soft front. */
const FRONT = 3.2;

const TONE = {
  light: { ink: "#1b1a18", accent: "#7c3aed", terra: "#b24f2c" },
  dark: { ink: "#ffffff", accent: "#cbb0f7", terra: "#eba58c" },
} as const;

export type MarkTone = "accent" | "terra";

/**
 * The slice of scroll progress over which word `i` of `count` resolves, given
 * the slice the whole passage occupies. Exported so that other animation in a
 * pinned section can be tied to the moment a particular word arrives.
 */
export function wordWindow(i: number, count: number, from: number, to: number) {
  const step = (to - from) / (count - 1 + FRONT);
  return { start: from + i * step, end: from + (i + FRONT) * step };
}

/** Splits a passage into the words RevealWords animates. */
export const splitWords = (text: string) => text.split(/\s+/).filter(Boolean);

/* ═══════════════════════ Pin ═══════════════════════ */

export function PinnedScroll({
  children,
  id,
  className = "",
  /** Total height of the section in viewport heights; the pin lasts for this minus one. */
  screens = 2.1,
}: {
  children: (progress: MotionValue<number>, pinned: boolean) => React.ReactNode;
  id?: string;
  className?: string;
  screens?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  if (reduced) {
    return (
      <section id={id} className={cx("relative py-24 sm:py-32", className)}>
        {children(scrollYProgress, false)}
      </section>
    );
  }

  return (
    <section ref={ref} id={id} className={cx("relative", className)} style={{ height: `${screens * 100}vh` }}>
      {/* The top padding keeps the content clear of the floating header. */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden pb-6 pt-[76px] supports-[height:100svh]:h-[100svh]">
        {children(scrollYProgress, true)}
      </div>
    </section>
  );
}

/* ═══════════════════════ Words ═══════════════════════ */

function Word({
  children,
  progress,
  start,
  end,
  from,
  to,
}: {
  children: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  /** Colour while the word is still out of focus, and once it has landed. */
  from: string;
  to: string;
}) {
  const opacity = useTransform(progress, [start, end], [0.12, 1], { ease: settle });
  const blur = useTransform(progress, [start, end], [6, 0], { ease: settle });
  const y = useTransform(progress, [start, end], ["0.18em", "0em"], { ease: settle });
  // A word takes its colour only as it lands, not while it is still a blur.
  const color = useTransform(progress, [start + (end - start) * 0.7, end], [from, to]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.span style={{ opacity, filter, y, color }} className="inline-block [will-change:opacity,filter,transform]">
      {children}
    </motion.span>
  );
}

/**
 * A passage revealed word by word against scroll progress.
 *
 * `accent` colours a closing clause (an exact substring at the end of `text`);
 * `marks` colours phrases anywhere in it. Assistive technology is given the
 * passage whole, once; the animated words are hidden from it.
 */
export function RevealWords({
  text,
  accent,
  marks,
  progress,
  pinned,
  from = 0.03,
  to = 0.84,
  className = "",
  onDark = false,
  as: Tag = "h2",
}: {
  text: string;
  accent?: string;
  marks?: readonly { phrase: string; tone: MarkTone }[];
  progress: MotionValue<number>;
  /** False under reduced motion: the passage is rendered plainly. */
  pinned: boolean;
  /** The part of the pin, as progress, over which the words arrive. */
  from?: number;
  to?: number;
  className?: string;
  onDark?: boolean;
  as?: React.ElementType;
}) {
  const tone = onDark ? TONE.dark : TONE.light;

  const { words, tones } = useMemo(() => {
    const all = splitWords(text);
    const map: (MarkTone | null)[] = all.map(() => null);

    const paint = (phrase: string, t: MarkTone, fromEnd: boolean) => {
      const target = splitWords(phrase);
      if (target.length === 0 || target.length > all.length) return;
      const last = all.length - target.length;
      for (let n = 0; n <= last; n++) {
        const i = fromEnd ? last - n : n;
        if (target.every((w, k) => all[i + k] === w)) {
          for (let k = 0; k < target.length; k++) map[i + k] = t;
          return;
        }
      }
    };

    for (const m of marks ?? []) paint(m.phrase, m.tone, false);
    if (accent) paint(accent, "accent", true);
    return { words: all, tones: map };
  }, [text, accent, marks]);

  if (!pinned) {
    return (
      <Tag className={className} style={{ color: tone.ink }}>
        {words.map((w, i) => (
          <React.Fragment key={`${w}-${i}`}>
            {tones[i] ? <span style={{ color: tone[tones[i] as MarkTone] }}>{w}</span> : w}
            {i < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          const { start, end } = wordWindow(i, words.length, from, to);
          const t = tones[i];
          return (
            <React.Fragment key={`${w}-${i}`}>
              <Word progress={progress} start={start} end={end} from={tone.ink} to={t ? tone[t] : tone.ink}>
                {w}
              </Word>
              {i < words.length - 1 ? " " : null}
            </React.Fragment>
          );
        })}
      </span>
    </Tag>
  );
}

/* ═══════════════════════ Progress rule ═══════════════════════ */

export function RevealProgress({
  progress,
  pinned,
  from = 0.03,
  to = 0.84,
  onDark = false,
  className = "",
}: {
  progress: MotionValue<number>;
  pinned: boolean;
  from?: number;
  to?: number;
  onDark?: boolean;
  className?: string;
}) {
  const scaleX = useTransform(progress, [from, to], [0, 1]);
  if (!pinned) return null;
  return (
    <div
      aria-hidden="true"
      className={cx("relative h-0.5 w-[120px] shrink-0 overflow-hidden rounded-full", onDark ? "bg-white/20" : "bg-ink/15", className)}
    >
      <motion.div
        style={{ scaleX }}
        className={cx("absolute inset-0 origin-left rounded-full", onDark ? "bg-accent-lav" : "bg-accent")}
      />
    </div>
  );
}
