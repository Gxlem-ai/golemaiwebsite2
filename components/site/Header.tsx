"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { GolemLogo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { cx, EASE } from "@/components/ui/core";
import { ANNOUNCEMENT, NAV, PRIMARY_CTA } from "@/content/site";

/* ═══════════════════════ Announcement bar ═══════════════════════ */

/** Slim dark bar above the navigation. It scrolls away with the page. */
export function AnnouncementBar() {
  return (
    <div role="region" aria-label="Announcement" className="on-dark bg-band text-white">
      <Container className="flex h-[52px] items-center justify-center gap-3 sm:gap-4">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent/25 py-1 pl-2.5 pr-3 text-[13px] font-medium leading-none text-accent-lav">
          <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-accent-lav" />
          {ANNOUNCEMENT.tag}
        </span>
        <span className="hidden truncate text-[15px] text-white/85 md:inline">{ANNOUNCEMENT.text}</span>
        <span aria-hidden="true" className="hidden h-4 w-px bg-white/20 md:block" />
        <Link
          href={ANNOUNCEMENT.href}
          className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-white"
        >
          <span className="relative">
            {ANNOUNCEMENT.linkLabel}
            <span className="absolute -bottom-1 left-0 h-px w-full bg-white/70 transition-colors duration-300 group-hover:bg-accent-lav" />
          </span>
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
          />
        </Link>
      </Container>
    </div>
  );
}

/* ═══════════════════════ Header ═══════════════════════ */

/**
 * The navigation. At the top of a page it is a plain bar aligned with the
 * content column; once the page moves it gathers into a floating pill. The
 * header's own box stays 72px tall throughout, so nothing below it shifts.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu never survives a navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const floating = scrolled || open;

  return (
    <header className="pointer-events-none sticky top-0 z-50 h-[72px]">
      <div
        className={cx(
          "pointer-events-auto relative mx-auto flex items-center justify-between border transition-all duration-700 ease-out-expo",
          floating
            ? "mt-3 h-[60px] w-[calc(100%-24px)] max-w-[940px] rounded-[30px] border-line bg-white pl-5 pr-2.5 shadow-nav sm:pl-6"
            : "mt-0 h-[72px] w-full max-w-site rounded-none border-transparent bg-transparent px-5 sm:px-6"
        )}
      >
        <Link
          href="/"
          aria-label="GOLEM AI, home"
          className="flex items-center text-ink transition-opacity duration-300 hover:opacity-70"
        >
          <GolemLogo />
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 md:flex"
        >
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative py-2 text-[15px] leading-none transition-colors duration-300",
                  active ? "text-ink" : "text-ink/80 hover:text-ink"
                )}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-dot"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button href={PRIMARY_CTA.href} pill={floating} size="md" className="max-[380px]:px-3.5">
            {PRIMARY_CTA.label}
          </Button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-sunk md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.nav
              id="mobile-menu"
              aria-label="Primary, mobile"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="absolute inset-x-0 top-[calc(100%+8px)] origin-top rounded-[22px] border border-line bg-white p-2 shadow-nav md:hidden"
            >
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] tracking-[-0.01em] transition-colors",
                      active ? "bg-paper-soft text-ink" : "text-ink hover:bg-paper-soft"
                    )}
                  >
                    {item.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-faint" />
                  </Link>
                );
              })}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
