# Mantis AI — Website

Marketing site for **Mantis AI**, the agentic operating system that connects to your POS and runs demand forecasting, ordering, pricing, labour, and margin protection — every action human-approved.

Built with **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## Local development
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

## Production build
```bash
npm run build
npm run start
```

## Lint & type-check
```bash
npm run lint
npx tsc --noEmit
```

## Deploy
This is a standard Next.js app and deploys with zero configuration.

**Vercel (recommended)**
- Push this repo to GitHub and import it at https://vercel.com/new, or
- From this folder run `npx vercel` for a preview and `npx vercel --prod` for production.

**Any Node host (Netlify, Render, Fly, a VM, etc.)**
- Build: `npm run build`
- Start: `npm run start` (serves on `$PORT`, default 3000)

## Project structure
```
app/                 # Next.js App Router (layout, page, global styles, SEO)
components/
  MantisAILanding.tsx   # page composition
  site/                 # section components
    Nav.tsx  Hero.tsx  Platform.tsx  HowItWorks.tsx  Investor.tsx  CTA.tsx  primitives.tsx
public/              # static assets (logo)
tailwind.config.ts   # design tokens (light theme)
```

## Notes
- The contact form and footer links are placeholders — wire them to your backend / real URLs before launch.
