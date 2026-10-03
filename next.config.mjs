/**
 * Origins of the sibling Vercel projects served under paths of golemai.pro.
 *
 * This project owns the golemai.pro domain. A Vercel domain attaches to a
 * whole project rather than a path, so the only way to serve another project
 * at golemai.pro/<path> is to proxy it from here. These are rewrites, not
 * redirects: the request is fetched server-side and the golemai.pro URL stays
 * in the address bar. Each sibling project keeps deploying independently.
 *
 * Override either origin with an env var in Vercel if a project's URL changes.
 */
const CANNABIS_ORIGIN =
  process.env.CANNABIS_ORIGIN ??
  process.env.CONTROLLED_RETAIL_ORIGIN ?? // legacy name, still honoured
  "https://golem-intelligence-wheat.vercel.app";
const HARD_QUESTIONS_ORIGIN =
  process.env.HARD_QUESTIONS_ORIGIN ?? "https://golem-hq.vercel.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The cannabis site used to live at /controlled-retail. Keep old links alive.
  async redirects() {
    return [
      { source: "/controlled-retail", destination: "/cannabis", permanent: true },
      { source: "/controlled-retail/:path*", destination: "/cannabis/:path*", permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Gxlem-ai/golem-intelligence — the cannabis-retail product site. It is
      // built with `basePath: "/cannabis"`, so the full path is passed
      // through: its pages and /_next assets all live under that prefix.
      {
        source: "/cannabis",
        destination: `${CANNABIS_ORIGIN}/cannabis`,
      },
      {
        source: "/cannabis/:path*",
        destination: `${CANNABIS_ORIGIN}/cannabis/:path*`,
      },

      // Gxlem-ai/golem-hq — a single self-contained index.html whose assets are
      // inline or absolute, so it needs no basePath.
      { source: "/hard-questions", destination: HARD_QUESTIONS_ORIGIN },
      {
        source: "/hard-questions/:path*",
        destination: `${HARD_QUESTIONS_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
