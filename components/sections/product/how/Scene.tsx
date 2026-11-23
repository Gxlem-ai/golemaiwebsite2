"use client";

import React from "react";
import { MockFigure } from "@/components/ui/Mock";

/**
 * The frame every "How GOLEM works" scene shares: a figure that fills the
 * stage, with its contents in a centred column no wider than a product window.
 */
export const Scene = React.forwardRef<HTMLDivElement, { label: string; children: React.ReactNode }>(
  function Scene({ label, children }, ref) {
    return (
      <MockFigure ref={ref} texture="none" label={label} className="h-full w-full">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 p-4 sm:p-5">
          <div className="flex w-full max-w-[400px] flex-col items-stretch gap-3.5">{children}</div>
        </div>
      </MockFigure>
    );
  }
);

/** A row that resolves with a tick when its turn comes. */
export function CheckRow({ children, on, className = "" }: { children: React.ReactNode; on: boolean; className?: string }) {
  return (
    <li className={`flex h-[38px] items-center justify-between gap-3 text-[13px] leading-none transition-opacity duration-500 ${on ? "text-ink" : "text-ink opacity-35"} ${className}`}>
      <span className="min-w-0 truncate">{children}</span>
      <span
        className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
          on ? "scale-100 bg-ok-wash text-ok-deep" : "scale-90 border border-dashed border-line-strong"
        }`}
      >
        {on ? (
          <svg viewBox="0 0 12 12" className="h-[9px] w-[9px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2 5 8.6 9.5 3.6" />
          </svg>
        ) : null}
      </span>
    </li>
  );
}
