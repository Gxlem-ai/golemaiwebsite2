"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import {
  cx,
  GolemLogo,
  ScrollProgress,
  ShinyButton,
  type ScrollTo,
} from "@/components/site/primitives";

/* ═══════════════════════ Navbar ═══════════════════════ */

export const NAV_ITEMS = [
  { label: "Platform", id: "platform" },
  { label: "Forecasting", id: "forecast" },
  { label: "Approvals", id: "approvals" },
  { label: "How it works", id: "how" },
  { label: "Outcomes", id: "outcomes" },
];

/**
 * Tracks which section owns the viewport. Rather than firing on every scroll
 * event, an observer reports intersecting sections and the one closest to the
 * top of the viewport wins.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.set(id, entry.boundingClientRect.top);
          else visible.delete(id);
        }
        // Nothing in the band means the hero or the closing panel owns the
        // viewport, so no nav item should stay lit from an earlier scroll.
        if (visible.size === 0) {
          setActive(null);
          return;
        }
        const nearest = [...visible.entries()].sort(
          (a, b) => Math.abs(a[1] - 80) - Math.abs(b[1] - 80)
        )[0];
        setActive(nearest[0]);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Navbar({ scrollTo }: { scrollTo: ScrollTo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV_ITEMS.map((i) => i.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-all duration-500 ease-out-expo",
        scrolled || mobileOpen ? "glass shadow-[0_1px_0_rgba(231,227,220,1)]" : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-2.5"
          aria-label="GOLEM AI, back to top"
        >
          <span className="text-w-cream transition-transform duration-500 ease-out-expo group-hover:rotate-[-12deg]">
            <GolemLogo animated />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-w-cream">GOLEM AI</span>
        </button>

        {/* Desktop nav with a sliding active pill */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cx(
                  "relative rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors duration-300",
                  isActive ? "text-w-cream" : "text-w-muted hover:text-w-cream"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full border border-w-border bg-w-bg-secondary"
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <ShinyButton onClick={() => scrollTo("contact")}>
            Request a demo
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </ShinyButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-1.5 text-w-muted transition-colors hover:bg-w-bg-secondary hover:text-w-cream lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Reading progress */}
      <ScrollProgress />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-w-border bg-w-bg lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Primary, mobile">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  onClick={() => {
                    scrollTo(item.id);
                    setMobileOpen(false);
                  }}
                  className={cx(
                    "flex items-center justify-between rounded-md px-2 py-2.5 text-left text-[15px] transition",
                    active === item.id
                      ? "bg-w-bg-secondary text-w-cream"
                      : "text-w-muted hover:bg-w-bg-secondary hover:text-w-cream"
                  )}
                >
                  {item.label}
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </motion.button>
              ))}
              <button
                onClick={() => {
                  scrollTo("contact");
                  setMobileOpen(false);
                }}
                className="mt-3 rounded-lg bg-w-cream px-4 py-3 text-[14px] font-medium text-w-bg"
              >
                Request a demo
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
