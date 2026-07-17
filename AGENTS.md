<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:soulswed-development-rules -->
# SoulsWed — Project Architecture & Development Rules

> All rules below are derived from [`project_analysis.md`](file:///Users/mohan/Developer/Projects/souls-wed/project_analysis.md). Follow them strictly when building or modifying any page, component, or style.

---

## 1. Brand Identity & Design System

- **Brand Positioning**: India's premium wedding marketplace.
- **Core Colors**:
  - `--sw-primary`: `#EE7429` (Primary CTA, accents)
  - `--sw-secondary`: `#FCCB11` (Secondary CTA, buttons)
  - `--sw-navy`: `#1A1A1A` (Text, headings)
  - `--sw-peach`: `#EED9C4` (Hero backgrounds, soft accents)
  - `--sw-steel`: `#000000` (Body text)
  - `--sw-deep-navy`: `#2F3843` (Dark glass backgrounds)
  - `--sw-light-gray`: `#DEE2E6` (Borders)
- **Typography**: 
  - Headings & Body: **Plus Jakarta Sans** (fallback: Geist).
- **Glassmorphism**: Use the established glass utility classes (`.glass`, `.glass-card`, `.glass-input`, `.glass-dark`, `.glass-navbar`, `.btn-glass`). Do not invent new glass effects.
- **UI Kit**: Use **shadcn/ui** components.

---

## 2. Technical Stack & Conventions

- **Framework**: Next.js 16.2.6 (App Router).
- **Styling**: Tailwind CSS 4 + custom CSS design system.
- **Animations**: Framer Motion 12.40. Keep UX animations smooth (transitions, loading states, shake on error). Do not use styled-jsx globally for animations.
- **Database**: MongoDB via Mongoose.
- **State Management**: Zustand 5.0 (for future use: cart/wishlist/session state).
- **Icons**: Lucide React.
- **Components**: Adhere to the established directory structure (`components/home/`, `components/venues/`, `components/shared/`, `components/auth/`).

---

## 3. Security & Best Practices (CRITICAL)

- **Session Security**: Do NOT store sessions as plain JSON in cookies. Ensure sessions are properly signed/encrypted (e.g. using JWT or iron-session).
- **Secrets**: NEVER commit the `.env` file. Do not hardcode secrets (e.g., admin access codes) in the source code.
- **Data Models**: Ensure schemas align with incoming data (e.g., include `businessName` in Vendor schema).
- **Data Fetching**: Optimize database connections using the existing singleton with caching (`lib/mongodb.ts`). 

---

## 4. Performance Guidelines

- **Image Optimization**: Use Next.js `<Image>` with `sizes` and `placeholder="blur"` for LCP images. Do not use wildcard remote image patterns in `next.config.ts`.
- **Client/Server Components**: Move static data (like `venues-data.ts`) to MongoDB or use Server Components. Avoid shipping large data payloads to the client.
- **Session Checks**: Extract a `useSession` hook to prevent duplicate session-check code. Use middleware or server-side session checks to avoid client-side round-trips when possible.

---

## 5. Development Roadmap Priorities

- Prioritize creating missing core routes (`/about`, `/destinations`, `/book`, vendor listing pages).
- Implement robust error boundaries and route-level loading/error files (`loading.tsx`, `error.tsx`).
- Set up proper route protection via `middleware.ts`.

<!-- END:soulswed-development-rules -->
