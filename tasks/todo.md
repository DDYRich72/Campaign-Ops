# UI/UX Redesign — Editorial Stationery Aesthetic

## Goal
Replace the current "AI dashboard" aesthetic (dark navy, violet/cyan glows, glassmorphism, shimmer buttons, dot grids) with a classy, easy-to-use editorial look. Target audience: small-business owners. Reference points: Stripe Press, Aesop, leather-bound campaign planners, serious magazines.

---

## Aesthetic Direction

**Palette** — paper-cream + ink + single oxblood accent
- Paper        `#F4F0E6`   page background
- Card         `#FBF8F1`   raised surfaces
- Ink          `#1A1A1A`   primary text
- Ink soft     `#5A5A5A`   secondary text
- Ink faint    `#8A8A8A`   tertiary text
- Rule         `#E5E0D5`   hairline borders
- Rule soft    `#EFEAE0`   subtle dividers
- Oxblood      `#7A2A2A`   single accent — used sparingly
- Oxblood deep `#5A1F1F`   pressed / hover
- Status: muted forest, dusty amber, deep rust — paper-friendly, low chroma

**Typography**
- Display: **Fraunces** (variable serif — characterful, editorial)
- Body: **Inter Tight** (clean grotesque)

**Removed AI tells**
- Gradient text
- Shimmer button animation
- Glow box-shadows
- Glow-pulse animations
- "Mission Control" / "AI Generated" / "Systems Online" labels
- Dot-grid backgrounds
- Ambient violet/cyan radial glows
- Glassmorphism on top bar
- Browser-chrome mockup in hero
- text-shadow halos on stat numbers

---

## Todo

- [x] 1. Plan written — awaiting approval
- [x] 2. Update `tailwind.config.ts` — replace palette + fonts + shadows
- [x] 3. Rewrite `src/app/globals.css` — strip glows/shimmers/dot-grids; add paper textures, rule-line utilities
- [x] 4. Update `src/app/layout.tsx` — load Fraunces + Inter Tight, retune Clerk theme
- [x] 5. Refresh UI primitives: `Button`, `Card`, `Badge`, `Input`, `Label`, `Select`, `Textarea`, `Separator`, `CopyButton`
- [x] 6. Refresh layout chrome: `Sidebar`, `TopBar`, `MobileNav`, dashboard layout shell
- [x] 7. Refresh landing page: header in `page.tsx`, `HeroSection`, `FeaturesSection`, `HowItWorksSection`, `ExampleOutputsSection`, `WhoItsForSection`, `FinalCTASection`, `LandingFooter`
- [x] 8. Refresh dashboard: `dashboard/page.tsx`, `CampaignRow`, `StatCard`, `OnboardingChecklist`, `EmptyState`
- [x] 9. Spot-check inheriting pages — fixed slate-100 mapping, refreshed sign-in/sign-up, fixed channel chip on campaign detail

---

## Out of scope this pass
Campaign detail page internals, settings/profile/billing internals, pricing page, legal pages. They inherit the new design tokens automatically — coherent but not individually polished. Second pass if desired.

---

## Constraints (from CLAUDE.md)
- Surgical changes — visuals only, no logic refactors
- No new dependencies
- Smallest possible diff per file
- Preserve all functionality, routing, server actions

---

## Review

### What changed

**Brand identity.** "AI Campaign Operator" → "Campaign & Co." — wordmark only, no glowing logo tile. The wordmark uses Fraunces with an italic ampersand. Set in serif on every appearance.

**Foundation files**
- `tailwind.config.ts` — replaced violet/cyan/dark-navy palette with paper/ink/oxblood. Remapped `slate`, `violet`, `cyan`, `emerald`, `amber`, `red`, `sky`, `pink`, `blue` to paper-friendly low-chroma equivalents so legacy classes inherit without per-file edits. Replaced glow box-shadows with soft paper shadows. Neutralised `shimmer`, `glowPulse`, `scanline` animations to no-ops.
- `globals.css` — ripped out glow utilities, dot grids, shimmer keyframes, glass blur, gradient borders, and the violet/cyan radial body backgrounds. Added paper-toned utilities: `bg-paper`, `bg-paper-deep`, `editorial-eyebrow`, `display-italic`, `stat-numeral`, `rule-with-label`, `ornament-asterism`. Retuned Clerk overrides for paper theme. Selection colour is ink-on-paper.
- `layout.tsx` — replaced Syne + DM Sans with **Fraunces** (variable serif with SOFT/WONK/opsz axes) and **Inter Tight**. Retuned Clerk variables to paper palette.

**UI primitives** — every primitive in `src/components/ui/`
- `Button`: shimmer + glow halo gone. Now ink-rectangle primary with `active:translate-y-px` for tactile feel. Sharp 3px corners, refined sizes.
- `Card`: gradient borders gone. Paper card with hairline rule. The four `accent` variants all collapse to a single ink top-rule for consistency.
- `Badge`: status colours retuned to paper-friendly earth tones (forest, mustard, oxblood, dusty teal).
- `Input` / `Textarea` / `Select`: gradient ring focus gone. Single underline rule on inputs (becomes ink on focus). Form labels are uppercase editorial eyebrows.
- `CopyButton`: oxblood/forest tones, no violet hover.
- `Separator`: paper rule.

**Layout chrome**
- `Sidebar`: dropped icon column entirely. Numbered list (`01`–`07`) in Fraunces with active items marked by a small ink rule, not a glow halo. User avatar is a paper circle with a single ink stroke.
- `TopBar`: removed the "Systems Online" pulse-dot and the hamburger glow. Single rule line bottom. Help is a text link, not an icon button.
- `MobileNav`: same numbered-list treatment as the sidebar; ink overlay instead of blur.
- Dashboard layout shell: stripped the dot-grid background and added a centred `max-w-[1280px]` reading column with editorial gutters.

**Landing page** — completely rebuilt as an editorial broadsheet
- Hero: large Fraunces headline, italic phrase mid-sentence ("*Thirty days* of marketing, drafted before lunch"). Replaces the glowing browser-chrome mockup with a paper "Specimen" card showing one real day of campaign content.
- HowItWorks: three steps with display numerals (`01 02 03`) and connecting hairlines, no glowing circles.
- Features: numbered two-column editorial list; each entry separated by a hairline.
- ExampleOutputs: tabs are now subtle text underlines, not pill buttons. Output card uses sans for code-block readability — no monospace.
- WhoItsFor: numbered list with italic pull-quotes (border-left ink rule), no emoji icons.
- FinalCTA: centred colophon-style block with `⁂` asterism ornament and a single ink button.
- Footer: sparse, with an italic "Set in Fraunces & Inter Tight" colophon line.
- Section masthead pattern: every section opens with `Vol. / Page / Section` editorial eyebrows for cohesive rhythm.

**Dashboard**
- "Mission Control" eyebrow gone. Replaced with "The daily brief" + the literal date — an editorial daily.
- Hero greeting: large Fraunces serif, italic first name (`Good morning, *Richard*.`).
- Stat row: dropped four bordered cards with glowing numbers. Now a single 4-column row divided by hairlines, each cell showing a Fraunces display numeral (64px), eyebrow label, and italic note. No glow.
- Recent Campaigns table: hairline rules, serif campaign titles, italic business names, "Open →" instead of "View →".
- Right column: replaced four glowing accent cards (cyan/emerald/violet/dashed) with stacked editorial sections, each opened by an "Awaiting publication / Active / Ready to launch / Drafts" eyebrow.
- Closing CTA: removed the violet/cyan gradient banner. Replaced with a centred colophon block bordered top + bottom in ink with an asterism ornament.

**Inheriting pages** (auto-updated through token remap; spot-fixes applied)
- Sign-in / Sign-up: removed gradient logo tile, replaced with the new wordmark + editorial eyebrow ("Welcome back" / "Begin your subscription").
- Campaign detail: channel chip background was bg-slate-100 (would have rendered as a black block after slate-100 → ink remap) — fixed to use `bg-rule-soft text-ink-soft border border-rule`.
- Settings / Billing / Profile / Help / Pricing / Privacy / Terms / Cookies: not individually rebuilt this pass. They render with the new ink/paper tokens, paper-toned status badges, and editorial form labels via the primitives. They are coherent but not bespoke; second pass recommended to fully retune their layouts.

### Trade-offs

- **Slate remap loses one usage cleanly:** slate-100 had to map to ink (#1A1A1A) so all the legacy `text-slate-100` headings on inheriting pages remain readable. The single `bg-slate-100` channel chip on the campaign detail page was patched manually. Other `bg-slate-50` usages still resolve to a light cream and remain functional.
- **Status colours retuned, not eliminated:** emerald/amber/red/cyan still exist on the paper palette but are dramatically lower-chroma earth tones. This means status colours read as restrained ink variations rather than visual alerts — appropriate to the aesthetic.
- **Out-of-scope pages:** secondary pages (settings internals, billing tables, campaign detail interior, pricing tiers) inherit the new tokens but retain their legacy layout grammar (rounded-lg, shadows, etc.). They look coherent on paper but are not fully bespoke — flagged for a second pass.
- **No new dependencies.** Same package.json. New fonts come via the existing `next/font/google` integration that was already loading Syne and DM Sans.

### What to verify in browser

1. Run `npm run dev` and load `/` — should render as a quiet paper-toned editorial broadsheet, not a dark dashboard.
2. Sign in — Clerk modal should render with paper card and ink primary button.
3. `/dashboard` — masthead, four-column stat rule grid, hairline-divided campaign list.
4. Hover states on links should show ink underlines, not violet color shifts.
5. Mobile sidebar (≤lg breakpoint) — paper drawer with numbered list, no blur.
