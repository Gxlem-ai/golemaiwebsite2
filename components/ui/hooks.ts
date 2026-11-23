"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * True when the visitor has asked for reduced motion. Starts false so the
 * server and the first client render agree, then settles in an effect.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True only after hydration. Guards anything that would differ between server and client. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Tracks a media query. Starts false so server and client markup agree. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

type SequenceOptions = {
  /** Fraction of the element that must be visible before the sequence starts. */
  amount?: number;
  /** Start again from the first step each time the element re-enters the viewport. */
  replay?: boolean;
  /** Start again automatically this many milliseconds after the last step. */
  loopAfter?: number;
  /** Hold the sequence where it is. */
  paused?: boolean;
};

/**
 * Drives a product mock-up through a timed sequence of states.
 *
 * `durations[i]` is how long step `i` is shown before step `i + 1` begins, so
 * the returned `step` runs from 0 to `durations.length` and then holds. The
 * sequence starts when the element scrolls into view, stops costing anything
 * when it leaves, and jumps straight to its final state for visitors who have
 * asked for reduced motion.
 */
export function useSequence(
  ref: React.RefObject<Element>,
  durations: readonly number[],
  { amount = 0.35, replay = true, loopAfter, paused = false }: SequenceOptions = {}
) {
  const last = durations.length;
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { amount });
  const onScreen = useInView(ref, { amount: 0 });
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  // The durations array is usually written inline; key the effect on its
  // contents so a new array with the same values does not restart the timers.
  const key = durations.join(",");
  const saved = useRef(durations);
  saved.current = durations;

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  // Leaving the viewport entirely rewinds the sequence so it plays again on return.
  useEffect(() => {
    if (!onScreen && replay && !reduced) {
      setStarted(false);
      setStep(0);
    }
  }, [onScreen, replay, reduced]);

  useEffect(() => {
    if (reduced) {
      setStep(last);
      return;
    }
    if (!started || paused) return;
    if (step >= last) {
      if (loopAfter === undefined) return;
      const id = setTimeout(() => setStep(0), loopAfter);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setStep((s) => Math.min(last, s + 1)), saved.current[step]);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, paused, step, reduced, last, loopAfter, key]);

  const restart = useCallback(() => {
    setStep(0);
    setStarted(true);
  }, []);

  return { step, done: step >= last, started, restart, reduced };
}

/**
 * Runs `tick` on an interval, but only while the element is on screen and the
 * visitor has not asked for reduced motion. Keeps ambient animation from
 * burning cycles in background tabs and off-screen sections.
 */
export function useLiveTicker(ref: React.RefObject<Element>, tick: () => void, ms: number, enabled = true) {
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
