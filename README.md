# GOLEM AI — Website

Corporate website for GOLEM AI, the agentic operations platform for businesses that run on a point of sale.

Three pages: the home page (`/`), Product (`/product`) and About Us (`/about`).

## Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS 3
- Framer Motion for motion, Lenis for smooth scrolling, Lucide for icons

## Development

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm run start
```

## Editing the wording

All copy lives in `content/`, one file per page (`home.ts`, `product.ts`, `about.ts`) plus `site.ts` for the navigation, announcement bar, footer and demo band. Change a string there and the page follows; no layout code needs touching. `content/demo.ts` holds the illustrative business and figures that every product mock-up draws on, so a number changed there changes everywhere it appears.

## Typeface

Headings and body text are set in [Switzer](https://www.fontshare.com/fonts/switzer) (Indian Type Foundry, via Fontshare); labels use IBM Plex Mono. Switzer's licence allows self-hosting but not redistribution through a public repository, so the font file is **not committed**: `scripts/fetch-fonts.mjs` downloads it from Fontshare into `public/fonts/` before `npm run dev` and `npm run build`. If Fontshare cannot be reached the build still succeeds and the site falls back to a metric-matched system font. Run `npm run fonts` to fetch it by hand.

## Deployment

The site deploys on Vercel and owns the **https://golemai.pro** domain. Production is served from the `main` branch; other branches receive preview deployments.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional. Canonical origin for Open Graph and canonical URLs (set to `https://golemai.pro` in production). When unset, the Vercel production domain is used automatically. |
| `SMTP_PASS` | Password of the mailbox that sends demo requests to `contact@golemai.pro`. Setting it turns on email delivery. Keep it a Vercel secret. |
| `SMTP_USER` | Optional. SMTP login. Defaults to `contact@golemai.pro`. |
| `SMTP_HOST` | Optional. Defaults to `smtp.purelymail.com`. |
| `SMTP_PORT` | Optional. Defaults to `465` (implicit TLS). |
| `DEMO_REQUEST_WEBHOOK_URL` | HTTPS endpoint that receives each demo request as a JSON `POST` (CRM intake, Zapier/Make hook, Slack incoming webhook, etc.). |
| `CANNABIS_ORIGIN` | Optional (the old name `CONTROLLED_RETAIL_ORIGIN` still works), read at build time. Vercel URL of the `golem-intelligence` project. Defaults to `https://golem-intelligence-wheat.vercel.app`. |
| `HARD_QUESTIONS_ORIGIN` | Optional, read at build time. Vercel URL of the `golem-hq` project. Defaults to `https://golem-hq.vercel.app`. |

### Sibling sites served under golemai.pro paths

A Vercel domain attaches to a whole project, so other projects are served under paths of this domain through rewrites in `next.config.mjs` (the request is proxied server-side; the `golemai.pro` URL stays in the address bar). Each sibling project deploys on its own.

| Path | Project | Notes |
| --- | --- | --- |
| `/cannabis` | `Gxlem-ai/golem-intelligence` (old `/controlled-retail` URLs redirect here) | Built with `basePath: "/cannabis"`, so its pages and `/_next` assets are proxied with the prefix intact. |
| `/hard-questions` | `Gxlem-ai/golem-hq` | Single self-contained page; no basePath needed. |

Rewrites are evaluated at build time, so changing either `*_ORIGIN` variable needs a redeploy. The target project must not have Vercel Deployment Protection enabled on production, or the proxied requests get a 401.

## Demo request form

The form in the contact section posts to `app/api/demo/route.ts`, which validates the submission, emails it to `contact@golemai.pro` over SMTP when `SMTP_PASS` is set, and also forwards it to `DEMO_REQUEST_WEBHOOK_URL` when that is set. Each payload has the shape `{ source, submittedAt, name, email, company, pos }`. When neither channel is configured, submissions are written to the server log and the form shows the visitor a prefilled email to `contact@golemai.pro` instead (the address lives in `lib/contact.ts`), so no enquiry is lost.

## Structure

```
app/
  layout.tsx            Metadata, fonts, header, footer, smooth scrolling
  page.tsx              Home
  product/page.tsx      Product
  about/page.tsx        About Us
  api/demo/route.ts     Demo request endpoint
  sitemap.ts, robots.ts
content/                All wording, and the shared illustrative data
components/
  ui/                   Design-system primitives (buttons, layout, mock-up parts, hooks)
  site/                 Header, footer, demo form, smooth scrolling
  sections/             Page sections, grouped by page
  mocks/                Animated product mock-ups
  brand/                Logo
scripts/fetch-fonts.mjs Fetches Switzer at build time
```

Design tokens (colours, type scale, shadows) are in `tailwind.config.ts`; the textured surfaces and dark bands are in `app/globals.css`.
