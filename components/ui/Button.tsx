"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cx } from "@/components/ui/core";
import { scrollToId } from "@/components/site/SmoothScroll";

type Variant = "primary" | "ink" | "light" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-deep",
  ink: "bg-ink text-white hover:bg-ink-soft",
  light: "bg-white text-ink hover:bg-paper-soft",
  outline: "border border-line bg-white text-ink hover:border-line-strong hover:bg-paper-soft",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-4 text-[13.5px]",
  md: "h-10 px-[18px] text-[14px]",
  lg: "h-12 px-7 text-[14.5px]",
};

type Props = {
  children: React.ReactNode;
  /** Internal route ("/product"), in-page anchor ("#contact") or external URL. */
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  /** Fully rounded, as used in the floating navigation and in forms. */
  pill?: boolean;
  arrow?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

/**
 * The site's button. The label is rendered twice in a clipped box so that it
 * rolls upward on hover; the copy that slides in is hidden from assistive
 * technology. In-page anchors go through the smooth scroller.
 */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  pill = false,
  arrow = false,
  type = "button",
  disabled = false,
  className = "",
}: Props) {
  const classes = cx(
    "group relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-[background-color,border-color,border-radius,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    pill ? "rounded-full" : "rounded-lg",
    VARIANT[variant],
    SIZE[size],
    className
  );

  const inner = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[110%] motion-reduce:transform-none">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-[110%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0 motion-reduce:hidden"
        >
          {children}
        </span>
      </span>
      {arrow ? (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  if (href?.startsWith("#")) {
    return (
      <a
        href={href}
        className={classes}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(href.slice(1));
          onClick?.();
        }}
      >
        {inner}
      </a>
    );
  }

  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {inner}
    </button>
  );
}

/** Quiet inline link with an arrow, for secondary actions beside a button. */
export function TextLink({
  href,
  children,
  tone = "ink",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "light" | "accent";
  className?: string;
}) {
  const classes = cx(
    "group inline-flex items-center gap-1.5 text-[14.5px] font-medium transition-colors duration-300",
    tone === "ink" && "text-ink hover:text-accent",
    tone === "light" && "text-white hover:text-accent-lav",
    tone === "accent" && "text-accent hover:text-accent-deep",
    className
  );
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
      </span>
      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
    </>
  );

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        className={classes}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(href.slice(1));
        }}
      >
        {inner}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {inner}
    </a>
  );
}
