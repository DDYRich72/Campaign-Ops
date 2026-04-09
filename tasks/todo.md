# Bolt.new Button on Landing Page Copy

## Goal
Add a "Build in Bolt.new" link button with the Bolt.new logo to the Landing Page Copy card,
visible only for paying customers (not free/trial users).

## Approach
- Single file change: `LandingPageSection.tsx`
- Add button next to "Copy All" in the card header — only renders when `!isFree`
- Button links to `https://bolt.new` with the landing page copy pre-filled as a URL prompt param
- Inline Bolt.new lightning bolt SVG logo (no external image dependency)

## Todo

- [x] 1. Plan written and approved
- [x] 2. Add Bolt.new button to `LandingPageSection.tsx` header (paid users only)
- [x] 3. Review section

---

## Files Changed
- `src/components/campaigns/LandingPageSection.tsx`

## Review

Added `buildBoltUrl()` — builds a `bolt.new/?prompt=...` URL with the full landing page copy as a prompt.
Added `BoltLogo()` — inline lightning bolt SVG, no external assets.
Added the button in the card header, wrapped alongside `CopyButton` in a flex div.
Button only renders inside the `!isFree` block — free/trial users never see it.

