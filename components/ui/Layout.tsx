import React from "react";
import { cx } from "@/components/ui/core";

/* ═══════════════════════ Container ═══════════════════════ */

/** The page's content column: 1200px of content with a 24px gutter. */
export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return <Tag className={cx("mx-auto w-full max-w-site px-5 sm:px-6", className)}>{children}</Tag>;
}

/* ═══════════════════════ Section ═══════════════════════ */

const PAD = {
  none: "",
  tight: "py-12 sm:py-16",
  default: "py-16 sm:py-20 lg:py-24",
  loose: "py-20 sm:py-28 lg:py-32",
} as const;

/** A light section. Sets the vertical rhythm and the content column. */
export function Section({
  id,
  children,
  className = "",
  pad = "default",
  contained = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  pad?: keyof typeof PAD;
  /** Set false when the section manages its own width (full-bleed media). */
  contained?: boolean;
}) {
  return (
    <section id={id} className={cx("relative", PAD[pad], className)}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

/* ═══════════════════════ Dark band ═══════════════════════ */

const GLOW = {
  none: "",
  bl: "band-glow-bl",
  bc: "band-glow-bc",
  br: "band-glow-br",
  tl: "band-glow-tl",
} as const;

/**
 * A full-bleed dark section. `glow` chooses where the warm light rises from;
 * `inset` turns it into a rounded panel floating in the page margin.
 */
export function Band({
  id,
  children,
  className = "",
  glow = "none",
  pad = "loose",
  inset = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  glow?: keyof typeof GLOW;
  pad?: keyof typeof PAD;
  inset?: boolean;
}) {
  const band = (
    <div className={cx("band", GLOW[glow], PAD[pad], inset && "rounded-[20px]", className)}>
      <Container>{children}</Container>
    </div>
  );
  return (
    <section id={id} className={cx("relative", inset && "px-3 sm:px-6 lg:px-10")}>
      {band}
    </section>
  );
}

/* ═══════════════════════ Eyebrow ═══════════════════════ */

const EYEBROW_TONE = {
  muted: "text-muted",
  accent: "text-accent",
  light: "text-white/70",
  lav: "text-accent-lav",
} as const;

/**
 * The small label above a heading. `dot` is the monospace line with a leading
 * dot; `plain` is the same without it; `square` is the bolder page label with
 * a filled square that opens the Product and About pages.
 */
export function Eyebrow({
  children,
  kind = "dot",
  tone = "muted",
  className = "",
}: {
  children: React.ReactNode;
  kind?: "dot" | "plain" | "square";
  tone?: keyof typeof EYEBROW_TONE;
  className?: string;
}) {
  if (kind === "square") {
    return (
      <p
        className={cx(
          "inline-flex items-center gap-2.5 text-[14px] font-semibold uppercase leading-none tracking-[0.01em]",
          tone === "light" || tone === "lav" ? "text-white" : "text-ink",
          className
        )}
      >
        <span aria-hidden="true" className="h-[14px] w-[14px] rounded-[4px] bg-accent" />
        {children}
      </p>
    );
  }
  return (
    <p className={cx("inline-flex items-center gap-2.5 font-mono text-label uppercase", EYEBROW_TONE[tone], className)}>
      {kind === "dot" ? <span aria-hidden="true" className="h-[5px] w-[5px] shrink-0 rounded-full bg-accent" /> : null}
      {children}
    </p>
  );
}

/* ═══════════════════════ Two-tone heading ═══════════════════════ */

/**
 * The site's signature heading: a first sentence in full ink and a
 * continuation in a quieter tone. On a dark band pass `onDark`.
 */
export function TwoTone({
  lead,
  rest,
  as: Tag = "h2",
  className = "",
  onDark = false,
}: {
  lead: React.ReactNode;
  rest?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Tag className={cx("text-balance", onDark ? "text-white" : "text-ink", className)}>
      {lead}
      {rest ? (
        <>
          {" "}
          <span className={onDark ? "text-white/50" : "text-faint"}>{rest}</span>
        </>
      ) : null}
    </Tag>
  );
}

/* ═══════════════════════ Highlight ═══════════════════════ */

/**
 * Colours one phrase inside a sentence. `phrase` must be an exact substring of
 * `text`; if it is not, the text is returned untouched rather than mangled.
 */
export function Highlight({
  text,
  phrase,
  className = "text-accent",
}: {
  text: string;
  phrase?: string | string[];
  className?: string;
}) {
  const phrases = (Array.isArray(phrase) ? phrase : phrase ? [phrase] : []).filter((p) => p && text.includes(p));
  if (phrases.length === 0) return <>{text}</>;

  // Split on every phrase, keeping the phrases, in the order they occur.
  const parts: { value: string; hit: boolean }[] = [];
  let rest = text;
  while (rest.length > 0) {
    let next = -1;
    let found = "";
    for (const p of phrases) {
      const i = rest.indexOf(p);
      if (i !== -1 && (next === -1 || i < next)) {
        next = i;
        found = p;
      }
    }
    if (next === -1) {
      parts.push({ value: rest, hit: false });
      break;
    }
    if (next > 0) parts.push({ value: rest.slice(0, next), hit: false });
    parts.push({ value: found, hit: true });
    rest = rest.slice(next + found.length);
  }

  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <span key={i} className={className}>
            {p.value}
          </span>
        ) : (
          <React.Fragment key={i}>{p.value}</React.Fragment>
        )
      )}
    </>
  );
}
