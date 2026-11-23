import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { AnnouncementBar, SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

/* Labels, eyebrows and the small code-like text in product mock-ups. The
   display and body face, Switzer, is declared in globals.css. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

const TITLE = "GOLEM AI | Operational intelligence built on the point of sale";
const DESCRIPTION =
  "GOLEM connects to the point-of-sale and back-office systems a business already runs, forecasts demand, and prepares ordering, pricing and staffing decisions for human approval. One integration covers any POS and every location.";

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s | GOLEM AI",
  },
  description: DESCRIPTION,
  applicationName: "GOLEM AI",
  metadataBase: siteUrl(),
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "GOLEM AI",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fcfcfc",
  width: "device-width",
  initialScale: 1,
};

/* Switzer is fetched at build time. Preload it only when the file is really
   there, so a build that could not reach Fontshare does not ship a dead link. */
const SWITZER = "/fonts/Switzer-Variable.woff2";
const hasSwitzer = existsSync(join(process.cwd(), "public", SWITZER));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={plexMono.variable}>
      <head>
        {hasSwitzer ? (
          <link rel="preload" href={SWITZER} as="font" type="font/woff2" crossOrigin="anonymous" />
        ) : null}
      </head>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-lg bg-ink px-4 py-2.5 text-[14px] font-medium text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <AnnouncementBar />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
