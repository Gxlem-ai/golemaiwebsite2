import React from "react";
import Link from "next/link";
import { Lock, Server, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Layout";
import { FooterAnchor } from "@/components/site/FooterAnchor";
import { BRAND, FOOTER } from "@/content/site";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

const ICONS = { approve: ShieldCheck, isolate: Lock, deploy: Server } as const;

const linkClass =
  "text-[14px] text-ink transition-colors duration-300 hover:text-accent";

/**
 * The footer: three standing commitments, the legal line and links, and the
 * wordmark set as wide as the page.
 */
export function SiteFooter() {
  return (
    <footer className="bg-paper">
      <Container>
        <ul className="mx-auto grid max-w-[980px] gap-3 pt-12 md:grid-cols-3">
          {FOOTER.commitments.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <li
                key={c.title}
                className="flex items-center gap-3.5 rounded-[14px] border border-line bg-white px-[18px] py-[17px]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-paper-soft">
                  <Icon aria-hidden="true" className="h-[18px] w-[18px] text-ink" strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium leading-tight text-ink">{c.title}</span>
                  <span className="mt-1 block text-[13px] leading-tight text-muted">{c.sub}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-8 max-w-[1100px] border-t border-line py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-[14px] text-ink">
              Copyright © {new Date().getFullYear()} {BRAND.company}. All rights reserved.
            </p>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {FOOTER.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("#") ? (
                      <FooterAnchor href={l.href} className={linkClass}>
                        {l.label}
                      </FooterAnchor>
                    ) : (
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <a href={CONTACT_MAILTO} className={linkClass}>
                    {CONTACT_EMAIL}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* The wordmark, set as wide as the column and standing on the page's
            bottom edge: the negative margin trims the line box to the baseline. */}
        <div
          aria-hidden="true"
          className="mx-auto max-w-[1100px] select-none overflow-hidden border-t border-line pt-10 [container-type:inline-size] sm:pt-14"
        >
          <div className="-mb-[0.118em] flex items-end justify-center text-[29.5cqw] font-semibold leading-none tracking-[-0.06em] text-line">
            GOLEM
            <span className="mb-[0.118em] ml-[0.05em] inline-block h-[0.2em] w-[0.2em] shrink-0 rounded-full bg-accent" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
