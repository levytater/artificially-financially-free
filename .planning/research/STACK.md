# Stack Research

**Domain:** Canadian Financial Calculator Web Application
**Researched:** 2026-02-24
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 15.x | React framework with App Router | Industry standard for React apps in 2026. App Router provides React Server Components, built-in API routes (for email capture), automatic code splitting, and excellent Vercel deployment integration. Next.js 15 ships with React 19 support, stable Turbopack (10x faster builds), and improved caching defaults. |
| React | 19.x | UI library | React 19 is now stable (released Dec 2024) with Server Components, Actions, async transitions, and the new `use` hook. App Router leverages these features for optimal performance. |
| TypeScript | 5.9.x | Type safety | TypeScript 5.9 (Q1 2026) provides strict inference defaults, improved build performance (10-20% faster), and decorator metadata support. Essential for financial calculations where type safety prevents costly errors. |
| Tailwind CSS | 3.x | Styling framework | Dominant utility-first CSS framework. Built-in animation utilities, dark mode support, and responsive design out of the box. Pairs perfectly with shadcn/ui components. |

### UI Components & Design

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui | Latest | Pre-built accessible components | Use for form inputs, cards, dialogs, tooltips. Installed into codebase (not external dependency), highly customizable. February 2026 release includes visual builder (`npx shadcn create`) with Next.js integration. Supports both Radix UI and Base UI foundations. |
| Radix UI | Latest | Headless UI primitives | Powers shadcn/ui components. Provides accessible, unstyled components (Dialog, Tooltip, Select, etc.) that shadcn/ui wraps with Tailwind styling. |
| Lucide React | Latest | Icon library | Modern, clean icons. Integrates seamlessly with shadcn/ui. Use for UI affordances (info icons for tooltips, chevrons, etc.). |

### Charting & Visualizations

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| Recharts | 3.7.x | Financial charts | **RECOMMENDED**. Best balance of simplicity, performance, and features for financial dashboards. Built-in animations, responsive by default, idiomatic React components (no D3 knowledge required). Perfect for area charts (Net Worth over time), bar charts (Cash Flow comparison), and line charts (Investment growth). LogRocket Blog and multiple 2026 sources rank it #1 for React dashboards. |

**Alternatives Considered:**

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Recharts | Visx | Need complete custom control over chart internals, willing to learn D3.js. Steeper learning curve but maximum flexibility. Best for complex interactive visualizations beyond standard financial charts. |
| Recharts | Nivo | Prioritize visual polish over simplicity. Nivo excels at stunning pre-styled charts with built-in theming. More opinionated than Recharts. |
| Recharts | ApexCharts | Need real-time candlestick charts or advanced financial chart types (not required for rent-vs-buy calculator). Better for stock trading dashboards. |

**Confidence Level:** HIGH. Recharts dominates React financial dashboards in 2026 due to smooth integration, customizable components, and predictable props.

### Animation

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion (Motion) | 11.x | Smooth UI animations | Use for page transitions, chart entrance animations, and interactive elements. Motion v11 (2025) improved React 19 compatibility and concurrent rendering performance. Over 18M monthly npm downloads. Spring-based animations provide natural feedback. |

**Note:** Recharts includes built-in animations for chart transitions. Framer Motion is for UI-level animations (page transitions, tooltip reveals, form interactions).

### Forms & Validation

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| React Hook Form | 7.x | Form state management | **STRONGLY RECOMMENDED**. Superior performance vs Formik (uncontrolled components = fewer re-renders), zero dependencies, smaller bundle size (<50% of Formik), and actively maintained. Formik is no longer actively maintained (last commit 1+ year ago as of 2026). React Hook Form requires less code and supports any validation library. |
| Zod | 3.24.x | Runtime validation + TypeScript inference | TypeScript-first validation library with 40M+ weekly npm downloads (Feb 2026). Define schemas once, get both runtime validation and TypeScript types. Perfect for financial calculator inputs (ensuring down payment % is 0-100, mortgage rate is positive, etc.). |

**Pattern:** Use React Hook Form for form state + Zod for schema validation. This is the standard 2026 pattern for type-safe forms.

### PDF Generation

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| @react-pdf/renderer | Latest | Declarative PDF generation | Build PDFs with React components. Reusable component pattern fits the project's React architecture. Must use dynamic imports in Next.js (disable SSR). **CAUTION:** May require `--legacy-peer-deps` flag with React 19. |

**Alternative Approach:**

| Approach | Tool | When to Use |
|----------|------|-------------|
| HTML-to-PDF | Puppeteer | Need pixel-perfect rendering of existing React components as PDF. Puppeteer renders HTML in headless Chrome. Better for complex layouts but requires server-side execution (Vercel serverless function). |

**Recommendation:** Start with @react-pdf/renderer for v1. If layout complexity becomes a blocker, migrate to Puppeteer-based approach in v2.

**Confidence Level:** MEDIUM. @react-pdf/renderer is widely used but has React 19 compatibility concerns. Puppeteer is more robust but adds deployment complexity.

### Canadian Financial Calculations

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| @houski/canadian-financial-calculations | Latest | Canadian mortgage math | **RECOMMENDED**. Only npm package specifically designed for Canadian mortgage calculations (semi-annual compounding, CMHC insurance, etc.). Alternative is building from scratch. |

**Important:** Verify this package is actively maintained before relying on it. If abandoned, build custom calculation functions using Canadian mortgage formulas (see MDM.ca and HolyPotato spreadsheet as references).

**Fallback Strategy:** If @houski package is insufficient:
1. Build custom calculation utilities in `lib/calculations/`
2. Reference Canadian mortgage formula sources:
   - [WOWA.ca](https://wowa.ca) for semi-annual compounding formulas
   - [MDM.ca](https://mdm.ca) for CMHC insurance tiers
   - HolyPotato spreadsheet for opportunity cost modeling

**No official government APIs exist for land transfer tax, CMHC rates, or provincial tax rates.** Hard-code these values in configuration files and update manually as rates change.

### Email Capture & Sending

| Service | Free Tier | Purpose | Why Recommended |
|---------|-----------|---------|-----------------|
| Resend | 100 emails/day, 3,000/month | Transactional email (PDF delivery) | **RECOMMENDED FOR TRANSACTIONAL**. Developer-focused, React Email support, full API on free tier. Designed for transactional emails (password resets, notifications, PDF reports). Does NOT support marketing emails/campaigns. |
| Kit (formerly ConvertKit) | Up to 10,000 subscribers | Email list building | **RECOMMENDED FOR EMAIL CAPTURE**. Most generous free tier for email marketing (10k subscribers, unlimited emails, forms, landing pages). Use for building mailing list. Free plan lacks visual automations/sequences (broadcasts only). |

**Recommended Setup:**
- **Resend** via Vercel serverless function → Send PDF report after user saves results
- **Kit** forms → Capture email for mailing list, build audience for future products

**Alternative (if Resend limits hit):** SendGrid, Mailgun, or Cloudflare Email Workers (via Vercel Edge Functions). All support REST APIs from serverless functions.

**Confidence Level:** HIGH. Resend is the standard choice for Next.js transactional email in 2026. Kit offers the best free tier for list building.

### Data APIs (Canadian Financial Data)

**Canadian Tax Rates:**

| API | Purpose | Notes |
|-----|---------|-------|
| salestaxapi.ca | GST/HST/PST rates by province | Free API, accepts two-letter province codes. Use for sales tax if needed (likely not required for rent-vs-buy). |
| canada-sale-tax-api (GitHub) | Federal + provincial tax rates | Open-source API option. |

**Land Transfer Tax, Property Tax, CMHC Insurance:**

**NO PUBLIC APIs EXIST.** Hard-code these values in configuration files:

```typescript
// lib/config/canadian-rates.ts
export const LAND_TRANSFER_TAX = {
  ON: { /* Ontario rates */ },
  BC: { /* BC rates */ },
  // ... all provinces
}

export const CMHC_INSURANCE_RATES = {
  // Tiered by down payment %
  '5-9.99': 0.04,
  '10-14.99': 0.031,
  '15-19.99': 0.028,
  '20+': 0
}
```

Update manually when rates change (annually). Consider adding admin interface in v2 for easier updates.

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | Latest | Conditional CSS classes | Combine Tailwind classes dynamically. Often paired with `tailwind-merge` to prevent class conflicts. |
| tailwind-merge | Latest | Merge Tailwind classes intelligently | Prevents duplicate utilities. Use with shadcn/ui's `cn()` utility function. |
| date-fns | Latest | Date manipulation | Calculate mortgage amortization schedules, year-by-year comparisons. Lightweight alternative to moment.js. |
| react-use | Latest | React hooks library | Provides `useLocalStorage`, `useDebounce`, `useWindowSize` for responsive charts. |

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Linting | Next.js includes ESLint config. Add `eslint-config-prettier` to prevent conflicts. |
| Prettier | Code formatting | Standard formatter for React/TypeScript projects. |
| Turbopack | Build tool | Ships with Next.js 15 (stable). Replaces Webpack. 10x faster builds. |
| Vercel CLI | Deployment testing | Test serverless functions locally before deployment. |

## Installation

```bash
# Core framework
npx create-next-app@latest artificially-financially-free --typescript --tailwind --app --use-npm

# UI components (shadcn/ui - install individually as needed)
npx shadcn@latest init
npx shadcn@latest add button card input label slider tooltip

# Charting
npm install recharts

# Forms and validation
npm install react-hook-form zod @hookform/resolvers

# Animation
npm install framer-motion

# PDF generation
npm install @react-pdf/renderer

# Canadian financial calculations
npm install @houski/canadian-financial-calculations

# Email sending (server-side only, in API routes)
npm install resend

# Utilities
npm install clsx tailwind-merge date-fns react-use

# Dev dependencies
npm install -D @types/react @types/node prettier eslint-config-prettier
```

## Alternatives Considered

| Recommended | Alternative | Why Not Alternative |
|-------------|-------------|---------------------|
| Next.js | Remix | Remix is excellent but Next.js has better Vercel integration, larger ecosystem, and more financial dashboard examples. Remix is better for complex nested routing (not needed here). |
| Next.js | Vite + React Router | Would require manual setup for SSR, API routes, deployment optimization. Next.js provides all this out of the box. |
| Recharts | Chart.js | Chart.js is imperative (not React-native). Recharts' declarative API is more idiomatic for React developers. |
| React Hook Form | Formik | Formik is unmaintained (2026). React Hook Form has better performance and active development. |
| Tailwind CSS | Styled Components / Emotion | CSS-in-JS adds runtime overhead. Tailwind generates static CSS at build time. Dark mode and responsive design are simpler with Tailwind. |
| shadcn/ui | MUI / Chakra UI | MUI and Chakra are external dependencies with opinionated styling. shadcn/ui copies code into your project for full control and customization. |
| TypeScript | JavaScript | Financial calculations require type safety. TypeScript catches errors at compile time (e.g., passing string to mortgage calculation expecting number). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Formik | Unmaintained as of 2026. Last commit 1+ year ago. No React 19 support. | React Hook Form |
| Create React App | Deprecated. No longer recommended by React team. | Next.js or Vite |
| Webpack (manual setup) | Next.js 15 ships with Turbopack (10x faster). | Next.js with Turbopack |
| moment.js | Deprecated, large bundle size. | date-fns or native Intl API |
| jQuery | Unnecessary with React. Adds bundle weight. | Native DOM APIs or React refs |
| Class components | React 19 and Next.js 15 favor functional components and hooks. | Functional components + hooks |
| CSS Modules | Works but less flexible than Tailwind for rapid iteration. | Tailwind CSS |

## Stack Patterns by Variant

**If building multi-page calculator suite (v2+):**
- Use Next.js App Router file-based routing for separate calculators (`/rent-vs-buy`, `/home-valuation`, `/mortgage-affordability`)
- Shared layout component for navigation and branding
- Shared calculation utilities in `lib/calculations/`

**If adding authentication (v2+):**
- Use NextAuth.js (now Auth.js) for social login
- Vercel Postgres or Supabase for user data storage
- Middleware for protected routes

**If adding real-time features (v3+):**
- Use Vercel Edge Functions + Server-Sent Events for live mortgage rate updates
- Consider Pusher or Ably for real-time collaboration

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 15 | React 19 | Next.js 15 App Router uses React 19 RC. Pages Router supports React 18 for backwards compatibility. |
| Next.js 15 | TypeScript 5.9 | Fully compatible. Next.js includes TypeScript config. |
| @react-pdf/renderer | React 19 | MAY require `--legacy-peer-deps` flag due to peer dependency constraints. Monitor for updates. |
| Recharts 3.7 | React 19 | Fully compatible. No issues reported. |
| React Hook Form 7 | React 19 | Fully compatible. |
| shadcn/ui (latest) | Next.js 15 + React 19 | Full support as of February 2026 visual builder release. |
| Framer Motion 11 | React 19 | v11 released in 2025 specifically for React 19 concurrent rendering improvements. |

## Deployment Stack

| Service | Purpose | Free Tier | Why |
|---------|---------|-----------|-----|
| Vercel | Hosting + serverless functions | 100GB bandwidth, 100k function invocations, unlimited deployments | Built by Next.js creators. Zero-config deployment, automatic HTTPS, edge network, preview deployments for PRs. |
| Vercel Analytics | Performance monitoring | Free on Hobby plan | Track Web Vitals, page load times, user interactions. |
| GitHub | Version control + CI/CD | Free for public/private repos | Vercel integrates directly with GitHub for automatic deployments on push. |

**Alternative Deployment Options (if outgrow Vercel free tier):**

| Platform | When to Use |
|----------|-------------|
| Netlify | Similar to Vercel, slightly different pricing model. Good alternative. |
| Railway | Need persistent database without separate service. Includes Postgres in free tier. |
| Cloudflare Pages | Need edge functions globally. Cloudflare's network is massive. |
| Self-hosted (VPS) | Full control, cost optimization at scale. Requires DevOps knowledge. |

**Recommended:** Start with Vercel. Migrate only if free tier limits become a blocker (unlikely for v1).

## Confidence Levels by Category

| Category | Confidence | Rationale |
|----------|------------|-----------|
| Core Framework (Next.js, React, TypeScript) | HIGH | Industry standard, official documentation verified, React 19 stable release confirmed, Next.js 15 widely adopted in 2026. |
| Charting (Recharts) | HIGH | Multiple 2026 sources (LogRocket, Syncfusion, comparison articles) rank Recharts #1 for React dashboards. Proven track record. |
| Forms (React Hook Form + Zod) | HIGH | React Hook Form is actively maintained with 2026 releases. Zod has 40M+ weekly downloads. Formik abandonment confirmed by multiple sources. |
| UI Components (shadcn/ui) | HIGH | February 2026 visual builder release confirmed. 100k+ GitHub stars, active development. |
| Animation (Framer Motion) | HIGH | 18M+ monthly downloads, v11 release confirmed for React 19 compatibility. |
| PDF Generation (@react-pdf/renderer) | MEDIUM | Widely used but React 19 peer dependency concerns. Puppeteer is more robust fallback. |
| Canadian Calculations (@houski package) | LOW | Limited documentation on maintenance status. Verify before using or build custom. |
| Email Services (Resend, Kit) | HIGH | Resend is standard for Next.js transactional email in 2026. Kit's 10k free tier confirmed. |
| Canadian Tax APIs | MEDIUM | No official government APIs found. Hard-coded rates are industry practice but require manual updates. |

## Sources

**Next.js & App Router:**
- [Next.js 15 Release Blog](https://nextjs.org/blog/next-15) — Official release notes
- [Next.js App Router Guides](https://nextjs.org/docs/app/guides) — Official documentation
- [Building with Next.js: Best Practices for 2026](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji) — Community best practices
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-15) — Migration guide
- [Next.js Best Practices in 2025: Performance & Architecture](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/) — Performance patterns

**React 19:**
- [React v19 Official Release](https://react.dev/blog/2024/12/05/react-19) — Stable release announcement (Dec 2024)
- [React 19.2 Release](https://react.dev/blog/2025/10/01/react-19-2) — October 2025 update with Partial Pre-rendering
- [What's New in React 19](https://vercel.com/blog/whats-new-in-react-19) — Vercel's comprehensive overview

**Charting Libraries:**
- [Top 5 React Chart Libraries for 2026](https://www.syncfusion.com/blogs/post/top-5-react-chart-libraries) — Industry comparison
- [Best React Chart Libraries 2025 Update](https://blog.logrocket.com/best-react-chart-libraries-2025/) — LogRocket analysis
- [Recharts vs Visx vs Nivo Comparison](https://medium.com/react-courses/react-charts-built-on-d3-what-should-you-pick-rechart-visx-niv-react-vi-or-victory-adc64406caa1) — Detailed comparison
- [Top React Chart Libraries for 2026](https://aglowiditsolutions.com/blog/react-chart-libraries/) — Financial chart focus
- [Recharts npm package](https://www.npmjs.com/package/recharts) — Version 3.7.0 confirmed

**Forms & Validation:**
- [React Hook Form vs Formik 2026](https://blog.logrocket.com/react-hook-form-vs-formik-comparison/) — Performance comparison
- [React Hook Form vs Formik Technical Comparison](https://joyfill.io/blog/react-hook-form-vs-formik-the-good-bad-and-ugly) — Maintenance status
- [Zod Validation TypeScript](https://zod.dev/) — Official documentation
- [How to Validate Data with Zod in TypeScript](https://oneuptime.com/blog/post/2026-01-25-zod-validation-typescript/view) — 2026 guide
- [React Hook Form Official](https://react-hook-form.com/) — Official site

**PDF Generation:**
- [Creating PDF in React/Next.js Complete Guide](https://dominikfrackowiak.com/en/blog/react-pdf-with-next-js) — Implementation patterns
- [Building PDF Generation Service with Next.js](https://03balogun.medium.com/building-a-pdf-generation-service-using-nextjs-and-react-pdf-78d5931a13c7) — Server-side approach
- [Dynamic HTML to PDF with Puppeteer](https://medium.com/front-end-weekly/dynamic-html-to-pdf-generation-in-next-js-a-step-by-step-guide-with-puppeteer-dbcf276375d7) — Alternative approach
- [React-PDF vs jsPDF Comparison](https://blog.react-pdf.dev/6-open-source-pdf-generation-and-modification-libraries-every-react-dev-should-know-in-2025) — Library comparison

**Animation:**
- [Framer Motion Official](https://motion.dev) — Official documentation (renamed from framer-motion to motion)
- [React Animation with Motion](https://motion.dev/docs/react-animation) — Animation patterns
- [Comparing Best React Animation Libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/) — Ecosystem overview
- [Mastering Framer Motion](https://medium.com/@pareekpnt/mastering-framer-motion-a-deep-dive-into-modern-animation-for-react-0e71d86ffdf6) — Advanced guide

**shadcn/ui:**
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) — Official setup guide
- [Shadcn Visual Project Builder](https://www.infoq.com/news/2026/02/shadcn-ui-builder/) — February 2026 release announcement
- [Build Dashboard with shadcn/ui 2026](https://designrevision.com/blog/shadcn-dashboard-tutorial) — Dashboard patterns
- [shadcn/ui Complete Guide](https://designrevision.com/blog/shadcn-ui-guide) — Comprehensive overview

**Email Services:**
- [Kit (ConvertKit) Review 2026](https://www.emailtooltester.com/en/reviews/convertkit/) — Free tier verification
- [9 Best Email Tools with Free Tier 2026](https://www.sequenzy.com/blog/best-email-tools-with-free-tier) — Service comparison
- [Resend with Vercel Functions](https://resend.com/docs/send-with-vercel-functions) — Integration guide
- [Sending Emails from Vercel Apps](https://vercel.com/kb/guide/sending-emails-from-an-application-on-vercel) — Best practices

**Canadian Financial Data:**
- [@houski/canadian-financial-calculations npm](https://www.npmjs.com/package/@houski/canadian-financial-calculations) — Package page
- [Canada Sale Tax API](https://salestaxapi.ca/) — Provincial tax rates API
- [Canadian Tax Brackets 2026](https://waypointbudget.com/blog/tax-brackets-canada-2026) — 2026 rates
- [TaxTips.ca Federal Tax Rates](https://www.taxtips.ca/taxrates/canada.htm) — Official rate reference

**TypeScript:**
- [TypeScript npm](https://www.npmjs.com/package/typescript) — Version 5.9.3 confirmed
- [TypeScript 5.9 New Features](https://www.digitalapplied.com/blog/typescript-5-9-new-features-developer-guide-2026/) — 2026 guide

**Vercel Deployment:**
- [Complete Guide to Deploying Next.js 2026](https://dev.to/zahg_81752b307f5df5d56035/the-complete-guide-to-deploying-nextjs-apps-in-2026-vercel-self-hosted-and-everything-in-between-48ia) — Comprehensive deployment guide
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) — Official documentation
- [Introducing React Best Practices](https://vercel.com/blog/introducing-react-best-practices) — Vercel's optimization knowledge

**Tailwind CSS:**
- [Tailwind Animation](https://tailwindcss.com/docs/animation) — Official animation docs
- [Tailwind Transitions](https://tailwindcss.com/docs/transition-property) — Transition utilities

---
*Stack research for: Canadian Financial Calculator Platform*
*Researched: 2026-02-24*
*Confidence: HIGH (Core stack), MEDIUM (PDF generation), LOW (Canadian calculation library)*
