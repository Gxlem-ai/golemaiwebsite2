import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GOLEM AI: Agentic infrastructure for SMEs. Connect your POS.",
  description:
    "GOLEM AI is the agentic layer that plugs into the POS every small and medium business already runs. A crew of AI agents predicts demand, automates ordering and pricing, plans labour, and protects margin, with every action human-approved. One integration, any POS, any SME.",
  metadataBase: new URL("https://golem.ai"),
  openGraph: {
    title: "GOLEM AI: Agentic infrastructure for every SME",
    description:
      "Connect your POS. Let AI run the rest. The agentic operating system for small and medium businesses, human-approved by design.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
