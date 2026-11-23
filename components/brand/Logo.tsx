import React from "react";
import { cx } from "@/components/ui/core";

/** The GOLEM mark: an open ring closing on a single point. */
export function GolemMark({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className={cx("block", className)}>
      <path d="M21.5 7.5 A9 9 0 1 0 21.5 15 H14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2.3" className="fill-accent" />
    </svg>
  );
}

/** Mark and wordmark together, as used in the header and footer. */
export function GolemLogo({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <GolemMark size={size} />
      <span className="text-[18px] font-semibold leading-none tracking-[-0.035em]">GOLEM AI</span>
    </span>
  );
}
