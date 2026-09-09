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

The site deploys on Vercel. Production is served from the `main` branch; other branches receive preview deployments.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional. Canonical origin for Open Graph and canonical URLs (for example `https://www.example.com` once a custom domain is attached). When unset, the Vercel production domain is used automatically. |
| `DEMO_REQUEST_WEBHOOK_URL` | HTTPS endpoint that receives each demo request as a JSON `POST` (CRM intake, Zapier/Make hook, Slack incoming webhook, etc.). |

## Demo request form

The form in the contact section posts to `app/api/demo/route.ts`, which validates the submission and forwards it to `DEMO_REQUEST_WEBHOOK_URL`. Each payload has the shape `{ source, submittedAt, name, email, company, pos }`. When the variable is not set, submissions are accepted and written to the server log rather than forwarded.

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
