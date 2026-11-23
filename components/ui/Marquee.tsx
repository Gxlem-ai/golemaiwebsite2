import React from "react";
import { cx } from "@/components/ui/core";

/**
 * A row that scrolls sideways for ever. The items are rendered twice so the
 * loop has no seam; the second copy is hidden from assistive technology. The
 * animation pauses on hover and stops under reduced motion.
 */
export function Marquee({
  items,
  reverse = false,
  className = "",
  itemClassName = "",
  gapClassName = "gap-14",
}: {
  items: React.ReactNode[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  gapClassName?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={cx("marquee-track mask-fade-x overflow-hidden", className)}>
      <div
        className={cx(
          "marquee-row flex w-max items-center pr-14",
          gapClassName,
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
      >
        {row.map((item, i) => (
          <span key={i} aria-hidden={i >= items.length} className={cx("whitespace-nowrap", itemClassName)}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
