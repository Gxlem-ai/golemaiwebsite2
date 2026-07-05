"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cx, GolemLogo, btnPrimary, type ScrollTo } from "@/components/site/primitives";

/* ═══════════════════════ Navbar ═══════════════════════ */

export function Navbar({ scrollTo }: { scrollTo: ScrollTo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Platform", id: "platform" },
    { label: "How it works", id: "how" },
    { label: "Results", id: "results" },
  ];

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-w-border bg-w-bg/90 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5"
        >
          <GolemLogo />
          <span className="text-[17px] font-semibold tracking-tight text-w-cream">GOLEM AI</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[14px] text-w-muted transition-colors duration-200 hover:text-w-cream"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => scrollTo("cta")} className={btnPrimary}>
            Book a demo
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-w-muted hover:text-w-cream md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-w-border bg-w-bg md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollTo(item.id);
                    setMobileOpen(false);
                  }}
                  className="text-left text-[14px] text-w-muted transition hover:text-w-cream"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  scrollTo("cta");
                  setMobileOpen(false);
                }}
                className="mt-2 rounded-lg bg-w-cream px-4 py-2.5 text-[14px] font-medium text-w-bg"
              >
                Book a demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
