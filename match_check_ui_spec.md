# Match Check - UI Specification

---

## Stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (open source, free, `npm install framer-motion`)
- **Deployment:** Vercel (frontend + serverless function for Notion submission)

---

## Global styles

| Token | Value |
|---|---|
| Background | `#1a1a18` (full bleed, all screens) |
| Primary text | `#faf9f6` |
| Secondary text | `rgba(250,249,246,0.5)` |
| Accent purple | `#7C3AED` |
| Accent terracotta | `#C2563E` |
| Font - headings | DM Serif Display (serif) |
| Font - body/UI | DM Sans (sans-serif) |
| Font source | Google Fonts CDN |

Fully responsive, mobile-first. No external images required.

---

## Screen 1 - Welcome

**Layout:** centered single column, vertically centered in viewport, max-width 560px

**Elements (top to bottom):**

**Wordmark:** "Thomas Euler" - DM Serif Display, 13px, `rgba(250,249,246,0.4)`. Subtle identity anchor, not the hero.

**Hero heading:** "Find out if we're a match." - DM Serif Display, 48px desktop / 36px mobile, `#faf9f6`.

**Sub-line:** DM Sans, 16px, secondary text color. Suggested copy: "Answer a few questions. Get an honest fit score. No fluff."

**Sequential input flow (typeform-style):**

Input 1 appears on load:
- Label: "What's your name?"
- Style: bottom border only (no box, no background), DM Sans 20px, `#faf9f6` text, `rgba(250,249,246,0.3)` placeholder
- Confirmed via Enter key or inline arrow button

After name confirmed - input 1 locks, input 2 slides in below (Framer Motion: slide up + fade in):
- Label: "[Name], what company are we matching Thomas with today?"
- Same input style

After company confirmed - CTA button appears (Framer Motion: fade in):
- Label: "Let's find out →"
- Style: `#7C3AED` background, `#faf9f6` text, DM Sans 500, padding 16px 32px, border-radius 999px
- Hover: subtle box-shadow lift
- Active/press: scale 0.97

---

## Screen 2 - Question

**Layout:** two regions on desktop. Single column on mobile.

---

### Main region (80% width desktop / full width mobile)

**Question text:**
- DM Serif Display, 32px desktop / 26px mobile, `#faf9f6`, line-height 1.3
- This is the hero element of the screen - no cluster label, no category header above it

**Answer area** - adapts by question type:

**Trade-off and single choice:**
- Large pill buttons, full width, stacked, gap 10px
- Default: `rgba(250,249,246,0.06)` background, `0.5px solid rgba(250,249,246,0.15)` border, border-radius 999px, padding 16px 24px
- Hover: `rgba(124,58,237,0.2)` background
- Selected: `#7C3AED` background, no border
- Text: DM Sans 16px, `#faf9f6`

**Slider:**
- Track: 3px height, `rgba(250,249,246,0.15)` background - no dynamic fill, track stays neutral at all positions
- Thumb: 24px circle, `#7C3AED`, no border
- Snaps to 5 positions: 0, 25, 50, 75, 100
- End labels: DM Sans 15px, secondary text color, positioned below track at each end
- Label sides randomized per session: the "preferred" end appears on left or right with equal probability. The score is inverted when flipped so a leftmost position still scores correctly. This prevents the slider from visually cueing which direction is preferred.

**Self-selection (multi-select pills):**
- Same pill style as single choice
- All selected options: `#7C3AED` background regardless of signal value
- Signal (green/red/neutral) affects scoring only - it is never surfaced visually to the user

**Navigation row** (below answer area):
- Left: back button - text only, DM Sans, `rgba(250,249,246,0.4)`, "← back"
- Right: next/confirm CTA - same purple pill style as welcome screen CTA
- Next button disabled (reduced opacity, no pointer) until an answer is given

**Focus management:**
- On question mount: after the 300ms slide animation completes, focus moves programmatically to the first answer element (first button or slider input). This prevents the browser from placing a stray caret elsewhere on screen.
- Single choice and trade-off: after selecting an option, focus moves immediately to the Next button so the user can confirm with Enter without reaching for the mouse.
- Multi-select: focus stays on the toggled pill after selection, allowing the user to continue selecting without losing position.
- Welcome screen: after company input is confirmed, focus moves to the CTA button (matches the same pattern as name - focus always advances to the next actionable element).

**Progress bar:**
- 2px line pinned to very bottom of screen
- Track: `rgba(250,249,246,0.1)` full width
- Fill: `#7C3AED`, animates width on each question advance (Framer Motion, 400ms ease-out)

---

### Sidebar region (desktop only, hidden on mobile)

Vertically centered in the sidebar. Contains only the fit score bar.

**Fit bar:**
- Height: ~60% of viewport height
- Width: 8px
- Track: `rgba(250,249,246,0.08)`, border-radius 999px
- Fill: gradient from `#C2563E` at 0% to `#7C3AED` at 100%, animates height upward (Framer Motion, 600ms ease-out)
- Updates only when advancing to the next question - not real-time during answering
- Label above: "fit score" - DM Sans 9px uppercase, `rgba(250,249,246,0.3)`
- Label below: current percentage - DM Sans 12px, `rgba(250,249,246,0.5)`

---

## Screen 3 - Result

**Layout:** centered single column, vertically centered, max-width 600px

**Entrance:** elements stagger in sequentially via Framer Motion. Score bar animates first, then number counts up, then copy fades in, then CTAs.

**Fit bar (large, central):**
- Same visual language as sidebar bar but rendered tall and prominent, center screen
- Animates from 0 to final score on entrance
- Same gradient: `#C2563E` at bottom to `#7C3AED` at top

**Score number:**
- DM Serif Display, 80px, `#faf9f6`
- Animates counting up from 0 to final score, 1200ms

**Result copy:**
- DM Serif Display, 24px, `#faf9f6`, centered
- Range-dependent sentence (see copy table below)
- Fades in after score animation completes

**Schedule a call button** (displayed only for scores 60+):
- Same purple pill CTA style
- Links to Thomas's calendar URL
- Appears with slight delay after score animation

**Email capture:**
- Small section below, visually secondary to the score reveal
- Heading: DM Sans 14px, secondary color - "Get the full analysis and see how we matched along all dimensions."
- Input field: same minimal bottom-border style as welcome screen inputs
- Submit button: smaller secondary style (outlined rather than filled)
- On submit: fires Notion API write + notification email to Thomas

---

## Result copy by score range

| Range | Copy |
|---|---|
| 90-100 | "A match made in heaven. Seriously, call me." |
| 75-89 | "Strong chemistry. I think we should meet." |
| 60-74 | "There's definitely something here. Worth finding out." |
| 40-59 | "Some sparks, some friction. Honestly - those can go either way." |
| 20-39 | "I like you, but I'm not sure we'd make each other happy." |
| 0-19 | "Not this time. But I respect that you checked." |

---

## Animation reference (Framer Motion)

| Moment | Animation |
|---|---|
| Welcome input 2 reveal | Slide up + fade in |
| Welcome CTA reveal | Fade in |
| Question screen enter | Slide in from right |
| Question screen exit | Slide out to left |
| Back navigation | Slide in from left (reverse) |
| Fit bar update (question screen) | Height tween, 600ms ease-out |
| Progress bar update | Width tween, 400ms ease-out |
| Result screen fit bar | Height from 0 to final, 1000ms ease-out |
| Result score number | Count up, 1200ms |
| Result elements | Staggered fade-in, 150ms between each element |

---

## Responsive behavior

| Breakpoint | Changes |
|---|---|
| Mobile (< 680px) | Sidebar hidden, fit bar removed from question screen, question text 26px, hero heading 36px |
| Desktop (≥ 680px) | Two-region layout on question screen, sidebar with fit bar visible |

---

*Companion documents: `match_check_spec.md` (full app and scoring spec)
