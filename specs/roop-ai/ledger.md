# ROOP AI — Feature Ledger

**Feature:** ROOP AI Skin Coach Web App  
**Phase:** Authentication & Core Features (Post-Auth Work)  
**Last Updated:** 2026-05-09  
**Status:** Clean (no uncommitted changes)

---

## Done
- ✅ Anthropic Claude Vision API integration (`useSkinAnalysis` hook)
- ✅ SkinAnalysis type system and data structures
- ✅ GlowScore ring component with animated SVG
- ✅ Daily routine checklist with localStorage persistence
- ✅ Weekly mask calendar with shopping links
- ✅ Dermatologist finder (city-based lookup)
- ✅ 7-day Glow Challenge tracker
- ✅ Before/After slider component
- ✅ Razorpay integration (premium unlock)
- ✅ Auth flow: Supabase email/password + OAuth (Google/GitHub)
- ✅ AuthCallback component with token handling
- ✅ Dashboard with empty state
- ✅ AppLayout wrapper for mobile navigation consistency
- ✅ localStorage key standardization (user-specific keys)
- ✅ Error handling and logging improvements

## Next
- [ ] Premium features: PDF export, detailed product recommendations
- [ ] Push notifications for mask schedule reminders
- [ ] History/progress page with before/after slider
- [ ] Product recommendation refinement (context-aware based on skin analysis)
- [ ] Image compression for localStorage thumbnails
- [ ] Additional cities in dermatologist database
- [ ] Mobile UI polish and responsive edge cases
- [ ] Analytics/tracking (optional)

## In Progress
- None — working branch is clean

## Blocked
- None

---

## Context

### Architecture
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (dark theme, no external UI libraries)
- **State:** React hooks + `useLocalStorage` custom hook
- **API:** Anthropic Claude Sonnet 4 (Vision) + Supabase Auth
- **Payments:** Razorpay (optional premium tier)

### Key Files
- `src/types/analysis.ts` — SkinAnalysis, GlowScores, HistoryEntry types
- `src/hooks/useSkinAnalysis.ts` — Anthropic API call + JSON parsing
- `src/data/masks.ts` — Mask recommendations by type
- `src/data/dermatologists.ts` — City → doctor list
- `src/components/` — GlowRing, RoutineChecklist, MaskPlan, etc.
- `src/pages/Home.tsx`, `Results.tsx`, `Progress.tsx`
- `src/utils/imageUtils.ts` — File → base64 conversion

### Recent Work (Last 5 commits)
1. **6203c51** — Update supabase.ts (auth client config)
2. **7f3965d** — Update SignIn.tsx (auth UI refinements)
3. **74ec16d** — Update SignIn.tsx (continued refinements)
4. **1a0f780** — fix: wrap Home page in AppLayout for mobile nav consistency
5. **e36c3fd** — fix: standardize localStorage keys to user-specific pattern

### Environment
- `.env.local` (not committed — template: `VITE_ANTHROPIC_API_KEY=sk-ant-...`, `VITE_RAZORPAY_KEY_ID=rzp_...`)
- Dev: `npm run dev` → http://localhost:5173
- Build: `npm run build` → `dist/`

### Important Constraints
- **API Key Exposure:** Anthropic key is in browser bundle. For production scale, add Netlify Function proxy.
- **Score Formula:** AI-driven only — do not add post-processing adjustments.
- **Image Format:** Always JPEG base64 at 0.8 quality for API calls.
- **localStorage Limit:** ~5MB per origin. History can grow — consider compression or URL-only storage.
- **CORS:** Browser-to-Anthropic works on localhost + production (Anthropic allows direct calls).

---

## Non-Negotiable Rules
- ✅ Always use `claude-sonnet-4-20250514` (not Opus or Haiku)
- ✅ TypeScript strict mode — no `any` except API responses
- ✅ One component per file, max ~150 lines
- ✅ Custom hooks for all API calls (`useSkinAnalysis`, `useLocalStorage`)
- ✅ No external UI libraries (no MUI, Chakra, shadcn) — custom components
- ✅ Mobile-first — min 375px width support
- ✅ All localStorage via `useLocalStorage` hook
- ✅ Never commit `.env.local`

