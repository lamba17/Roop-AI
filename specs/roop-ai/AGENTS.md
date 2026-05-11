# ROOP AI — Agent Briefing

**Feature:** ROOP AI — AI-Powered Skincare Coach  
**Status:** Post-Auth Phase — Core features complete, premium/export features pending  
**Tech Stack:** React 18 + Vite + TS + Tailwind + Anthropic Vision API + Supabase Auth + Razorpay

---

## Quick Start

1. **Understand the project:** Read [ledger.md](./ledger.md) (status + architecture)
2. **Resume from last session:** Read [handoff.md](./handoff.md) (what was done, what's next)
3. **Code conventions:** See [CLAUDE.md](../../CLAUDE.md) in project root
4. **Start dev:** `npm run dev` → http://localhost:5173

---

## What ROOP AI Does

**Flow:**
1. User uploads selfie → compressed to JPEG base64
2. Anthropic Claude Vision API analyzes skin in real-time
3. Returns: Glow Score (0-100), skin metrics, concerns, daily routine, product recs, dermatologist advice
4. UI shows animated score ring, routine checklist, mask calendar, before/after slider
5. Premium unlock: PDF export, detailed product links, unlimited analyses

---

## Critical Rules (Non-Negotiable)

- ✅ Model: `claude-sonnet-4-20250514` (not Opus/Haiku)
- ✅ All localStorage keys: `${userId}:{baseKey}` (user-specific to prevent cross-user leaks)
- ✅ All pages wrapped in `<AppLayout>` for mobile nav consistency
- ✅ Image format: JPEG base64 at 0.8 quality
- ✅ No external UI libraries (custom components only)
- ✅ TypeScript strict — no `any` except API responses
- ✅ One component per file, max 150 lines

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/types/analysis.ts` | Core types: SkinAnalysis, GlowScores, HistoryEntry |
| `src/hooks/useSkinAnalysis.ts` | Anthropic API call + JSON parsing |
| `src/hooks/useLocalStorage.ts` | Persist state with user-specific keys |
| `src/components/GlowRing.tsx` | Animated SVG score ring |
| `src/components/RoutineChecklist.tsx` | Morning/evening steps with checkboxes |
| `src/components/MaskPlan.tsx` | Weekly mask calendar + shopping links |
| `src/components/DermatologistFinder.tsx` | City → doctor lookup |
| `src/data/dermatologists.ts` | City → [Dermatologist] array |
| `src/data/masks.ts` | maskType → MaskRecommendation |
| `src/pages/Home.tsx` | Upload + hero (wrapped in AppLayout) |
| `src/pages/Results.tsx` | Full analysis dashboard |
| `src/pages/Progress.tsx` | History + before/after slider |

---

## Common Tasks

### Add a new city to dermatologist finder
→ Edit `src/data/dermatologists.ts`, add city key. The `<select>` is auto-driven by `Object.keys(DERMATOLOGISTS)`.

### Add a new mask type
→ Update `src/types/analysis.ts` (MaskType), `src/data/masks.ts` (MASK_RECOMMENDATIONS), and the prompt in `useSkinAnalysis.ts`.

### Change the AI model
→ Update only the `model` field in `useSkinAnalysis.ts`. Nothing else.

### Add PDF export
→ Use `jsPDF` + `html2canvas`. Gate behind premium check. Capture Results page DOM → canvas → PDF.

### Fix localStorage issues
→ Ensure all new localStorage calls use `useLocalStorage` hook with pattern `${userId}:{baseKey}`.

---

## Session Continuity

- **Ledger:** Current feature phase, done list, next items, blockers
- **Handoff:** What was completed, critical context, files touched, gotchas
- **This file:** Quick reference for agents picking up the work

Read all three before starting work.

---

## Environment

```bash
npm run dev           # Start dev server
npm run build         # Build for prod
npm run preview       # Preview prod build
npx tsc --noEmit     # Type check
```

**Env vars (in .env.local, never committed):**
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_RAZORPAY_KEY_ID=rzp_live_...
```

---

## Next High-Impact Work

1. **PDF Export** — Premium feature, high value
2. **Push Notifications** — Mask schedule reminders
3. **History Page Polish** — Before/after comparison UX
4. **Product Recommendations** — More context-aware suggestions
5. **Mobile Edge Cases** — Test at 375px, 768px, 1024px breakpoints

