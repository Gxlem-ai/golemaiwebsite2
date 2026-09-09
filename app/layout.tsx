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

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: "%s | GOLEM AI",
  },
  description: DESCRIPTION,
  applicationName: "GOLEM AI",
  metadataBase: new URL("https://golem.ai"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
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
