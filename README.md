# GOLEM AI — Website

Corporate website for GOLEM AI, the agentic operations platform for businesses that run on a point of sale.

## Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS 3
- Framer Motion for motion, Lucide for icons

## Development

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm run start
```

## Deployment

The site deploys on Vercel and owns the **https://golemai.pro** domain. Production is served from the `main` branch; other branches receive preview deployments.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional. Canonical origin for Open Graph and canonical URLs (set to `https://golemai.pro` in production). When unset, the Vercel production domain is used automatically. |
| `DEMO_REQUEST_WEBHOOK_URL` | HTTPS endpoint that receives each demo request as a JSON `POST` (CRM intake, Zapier/Make hook, Slack incoming webhook, etc.). |
| `CONTROLLED_RETAIL_ORIGIN` | Optional, read at build time. Vercel URL of the `golem-intelligence` project. Defaults to `https://golem-intelligence-wheat.vercel.app`. |
| `HARD_QUESTIONS_ORIGIN` | Optional, read at build time. Vercel URL of the `golem-hq` project. Defaults to `https://golem-hq.vercel.app`. |

### Sibling sites served under golemai.pro paths

A Vercel domain attaches to a whole project, so other projects are served under paths of this domain through rewrites in `next.config.mjs` (the request is proxied server-side; the `golemai.pro` URL stays in the address bar). Each sibling project deploys on its own.

| Path | Project | Notes |
| --- | --- | --- |
| `/controlled-retail` | `Gxlem-ai/golem-intelligence` | Built with `basePath: "/controlled-retail"`, so its pages and `/_next` assets are proxied with the prefix intact. |
| `/hard-questions` | `Gxlem-ai/golem-hq` | Single self-contained page; no basePath needed. |

Rewrites are evaluated at build time, so changing either `*_ORIGIN` variable needs a redeploy. The target project must not have Vercel Deployment Protection enabled on production, or the proxied requests get a 401.

## Demo request form

The form in the contact section posts to `app/api/demo/route.ts`, which validates the submission and forwards it to `DEMO_REQUEST_WEBHOOK_URL`. Each payload has the shape `{ source, submittedAt, name, email, company, pos }`. When the variable is not set, submissions are written to the server log and the form shows the visitor a prefilled email to `contact@golemai.pro` instead (the address lives in `lib/contact.ts`), so no enquiry is lost.

## Structure

```
app/
  layout.tsx          Metadata, fonts, viewport
  page.tsx            Renders the landing page
  icon.svg            Favicon
  api/demo/route.ts   Demo request endpoint
components/
  GolemLanding.tsx    Page composition
  site/               Section components and shared primitives
```
