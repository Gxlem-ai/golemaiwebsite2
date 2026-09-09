import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const TITLE = "GOLEM AI | Operational intelligence built on the point of sale";
const DESCRIPTION =
  "GOLEM AI connects to the point-of-sale and back-office systems a business already runs, forecasts demand, and prepares ordering, pricing and staffing decisions for human approval. One integration covers any POS and every location.";

/**
 * Canonical site origin, used to resolve Open Graph and canonical URLs.
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL, for an explicit override (e.g. a custom domain)
 *  2. VERCEL_PROJECT_PRODUCTION_URL, set by Vercel to the project's production domain
 *  3. VERCEL_URL, the per-deployment URL for preview builds
 *  4. localhost, for local development
 */
function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
