"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { HEADER_OFFSET } from "@/components/ui/core";

let instance: Lenis | null = null;

/**
 * Scrolls to an element by id, stopping below the sticky header. Uses the
 * smooth scroller when it is running and the browser's own scrolling when it
 * is not (reduced motion, or before hydration).
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) {
    // Lenis subtracts the page's scroll-padding-top itself, which is what
    // keeps the target clear of the header; no further offset is needed.
    instance.scrollTo(el, { duration: 1.1 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

/**
 * Mounts the page's smooth scroller. Wheel input is eased; touch scrolling is
 * left native, because phones already scroll with inertia and second-guessing
 * it only feels worse. Lenis itself stands down for reduced-motion visitors.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    instance = lenis;
    return () => {
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  // A new page starts at the top, unless the URL asks for a section.
  useEffect(() => {
    if (!instance) return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Wait a frame so the new page has laid out before measuring the target.
      const id = requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) instance?.scrollTo(el, { immediate: true, force: true });
      });
      return () => cancelAnimationFrame(id);
    }
    instance.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
