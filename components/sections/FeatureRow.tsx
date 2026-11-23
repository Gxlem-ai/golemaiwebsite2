import React from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cx } from "@/components/ui/core";

/**
 * A claim beside its proof: a heading and a short paragraph on one side, a
 * product mock-up on the other. Rows alternate sides down the page (`flip`
 * puts the mock-up on the left). On small screens the text always comes first.
 */
export function FeatureRow({
  title,
  body,
  media,
  flip = false,
  children,
  className = "",
}: {
  title: React.ReactNode;
  body: React.ReactNode;
  /** The mock-up. It should fill its box: give it `h-full w-full`. */
  media: React.ReactNode;
  flip?: boolean;
  /** Optional extra content under the paragraph, such as a link. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "grid items-center gap-x-[72px] gap-y-10",
        flip ? "lg:grid-cols-[minmax(0,1.222fr)_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.222fr)]",
        className
      )}
    >
      <Reveal className={cx("max-w-[440px]", flip ? "lg:order-2" : "lg:pl-[72px]")}>
        <h2 className="text-balance text-h3 text-ink">{title}</h2>
        <p className="mt-5 text-pretty text-para text-muted">{body}</p>
        {children ? <div className="mt-6">{children}</div> : null}
      </Reveal>
      <Reveal delay={0.08} className={cx("min-w-0", flip && "lg:order-1")}>
        <div className="h-[420px] sm:h-[460px]">{media}</div>
      </Reveal>
    </div>
  );
}
