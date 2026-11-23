"use client";

import React from "react";
import { scrollToId } from "@/components/site/SmoothScroll";

/** An in-page anchor that goes through the smooth scroller. */
export function FooterAnchor({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(href.slice(1));
      }}
    >
      {children}
    </a>
  );
}
