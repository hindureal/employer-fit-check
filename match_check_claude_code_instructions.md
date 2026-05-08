# Match Check - Claude Code Instructions

> Read all three companion documents before writing any code:
> - `match_check_spec.md` - full app logic, questions, scoring model, weights
> - `match_check_ui_spec.md` - visual design, layout, animation spec

---

## What you are building

A single-page web app called "Match Check." A potential employer answers 11 questions. The app calculates a weighted fit score (0-100) against the author's actual preferences on culture, leadership, and org design. The result screen shows the score, a comment, and optionally a call-to-action. On email submission, results are written to a Notion database, a results email is sent to the user, and a notification email is sent to the author.

---

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS**
- **Framer Motion** (`npm install framer-motion`)
- **Deployment:** Vercel
- **Notion API** for result persistence
- **Resend** (or equivalent transactional email service) for notification email

---

## Project setup

```bash
npm create vite@latest match-check -- --template react-ts
cd match-check
npm install
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add to `tailwind.config.js`:
```js
content: ["./index.html", "./src/**/*.{ts,tsx}"]
```

Add to `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add custom tokens to `tailwind.config.js` theme:
```js
extend: {
  colors: {
    ink: '#1a1a18',
    paper: '#faf9f6',
    purple: '#7C3AED',
    terracotta: '#C2563E',
  },
  fontFamily: {
    serif: ['"DM Serif Display"', 'serif'],
    sans: ['"DM Sans"', 'sans-serif'],
  }
}
```

---

## File structure

```
src/
  components/
    WelcomeScreen.tsx
    QuestionScreen.tsx
    ResultScreen.tsx
    FitBar.tsx
    ProgressBar.tsx
    PillButton.tsx
    SliderInput.tsx
    MultiSelect.tsx
    TextInput.tsx
  data/
    questions.ts       # full question bank with answer options and scores
    scoring.ts         # scoring logic functions
    weights.ts         # question weights (must total 100)
    resultCopy.ts      # score range to copy mapping
  types/
    index.ts           # shared TypeScript types
  App.tsx              # screen state machine, session state
  main.tsx
api/
  submit.ts            # Vercel serverless function - Notion write + email
```

---

## Types

Define in `src/types/index.ts`:

```ts
type QuestionType = 'tradeoff' | 'single' | 'slider' | 'multiselect'

interface AnswerOption {
  id: string
  text: string
  score: number
  signal?: 'green' | 'red' | 'neutral'  // only for multiselect
}

interface Question {
  id: string
  cluster: 1 | 2 | 3 | 4
  type: QuestionType
  text: string
  sliderLeftLabel?: string  // slider only
  sliderRightLabel?: string // slider only
  options?: AnswerOption[]  // tradeoff, single, multiselect
}

interface SessionState {
  userName: string
  companyName: string
  answers: Record<string, number>           // questionId -> score (0-100)
  rawAnswers: Record<string, string | string[]>  // questionId -> selected option ID(s), used to restore UI state on back navigation
  currentQuestionIndex: number
  questionOrder: string[]                   // randomized question IDs
  runningFitScore: number                   // recalculated after each answer
}
```

---

## App state machine

Manage in `App.tsx`. Three screens, linear flow:

```
'welcome' -> 'questions' -> 'result'
```

State:
- `screen: 'welcome' | 'questions' | 'result'`
- `session: SessionState`

On welcome complete: initialize `questionOrder` as a shuffled array of all question IDs. Store `userName` and `companyName`.

On each question answer confirmed: store answer score, recalculate `runningFitScore`, advance `currentQuestionIndex`.

On back button: decrement `currentQuestionIndex`, restore previous answer.

On last question confirmed: transition to `'result'` screen.

---

## Data - questions.ts

Implement the full question bank exactly as defined in `match_check_spec.md`. Each question has an `id` matching the spec notation (e.g. `'C1Q1'`, `'C2Q4'`).

For multiselect questions, each option must have a `signal` value of `'green'`, `'red'`, or `'neutral'`. Neutral options are displayed but excluded from scoring.

**Randomize answer option order at runtime** for all question types except sliders. Do not hardcode display order - shuffle options when the question is rendered.

---

## Data - weights.ts

```ts
export const weights: Record<string, number> = {
  C1Q2: [value],
  C1Q4: [value],
  C2Q3: [value],
  C2Q4: [value],
  C2Q5: [value],
  C3Q3: [value],
  C3Q4: [value],
  C3Q5: [value],
  C4Q2: [value],
  C4Q3: [value],
  C4Q5: [value],
}
```

> Fill in values from `match_check_spec.md` weights table. Must total 100.

---

## Scoring logic - scoring.ts

Implement four scoring functions:

**Binary / trade-off / single choice:**
Score is read directly from the selected `AnswerOption.score`. No calculation needed.

**Slider:**
Score = slider position directly (0, 25, 50, 75, or 100).

**Multiselect:**
```ts
function scoreMultiselect(
  selected: AnswerOption[],
  allOptions: AnswerOption[]
): number {
  const greenOptions = allOptions.filter(o => o.signal === 'green')
  const redOptions = allOptions.filter(o => o.signal === 'red')
  const maxPool = Math.max(greenOptions.length, redOptions.length)
  const step = 50 / maxPool
  const greenCount = selected.filter(o => o.signal === 'green').length
  const redCount = selected.filter(o => o.signal === 'red').length
  const raw = 50 + (greenCount - redCount) * step
  return Math.min(100, Math.max(0, raw))
}
```

**Overall fit score:**
```ts
// weights is imported from weights.ts - do not pass as a parameter
function calculateFitScore(answers: Record<string, number>): number {
  const total = Object.entries(answers).reduce((sum, [qId, score]) => {
    return sum + score * (weights[qId] ?? 0)
  }, 0)
  return Math.round(total / 100)
}
```

Recalculate running fit score after every answer using only answered questions so far (partial score during session is fine - it creates engagement).

---

## Components

### WelcomeScreen.tsx
- Sequential typeform-style reveal using Framer Motion `AnimatePresence` and `motion.div`
- Input 1 (name) appears on mount
- Input 2 (company) slides up after name confirmed (Enter or inline button)
- CTA button fades in after company confirmed
- On CTA click: call `onComplete(userName, companyName)` prop

### QuestionScreen.tsx
- Receives current question, current answer (if returning via back), `onAnswer`, `onNext`, `onBack` props
- Screen transitions: slide from right on advance, slide from left on back (Framer Motion `AnimatePresence` with `mode="wait"`)
- Renders appropriate input component based on `question.type`
- Next button disabled until answer registered
- Progress bar and fit bar receive `progress` (0-1) and `fitScore` (0-100) as props

### FitBar.tsx
- Vertical bar, fixed in sidebar on desktop, hidden on mobile
- Track + animated fill using Framer Motion `motion.div` with `height` animation
- Fill: CSS linear-gradient from `#C2563E` (bottom) to `#7C3AED` (top)
- Animates only when `fitScore` prop changes (i.e. on question advance, not during answering)
- Shows percentage label below

### ProgressBar.tsx
- 4px horizontal bar pinned to top of screen
- Framer Motion `motion.div` animating `width` as percentage of questions answered

### PillButton.tsx
- Reusable for single choice and trade-off questions
- Props: `label`, `selected`, `onClick`
- Full width, border-radius 999px
- States: default / hover / selected (purple fill)

### SliderInput.tsx
- Custom range input, snaps to 5 positions (0, 25, 50, 75, 100)
- Use `step={25}` on the native range input
- Styled track and thumb via CSS (Tailwind + custom CSS as needed)
- Track has no dynamic fill - it stays a flat neutral color at all positions. Only the thumb is purple.
- End labels passed as props: `leftLabel`, `rightLabel`

### MultiSelect.tsx
- Same pill style as PillButton but multi-select
- Each option is `flex justify-between` to accommodate the checkmark
- All selected options: purple fill (`#7C3AED`) regardless of signal value; an animated `✓` appears on the right (scale + fade, 150ms ease-out, `AnimatePresence` for exit animation)
- Signal (green/red/neutral) is used only in scoring - it is never surfaced visually
- After toggling an option, focus stays on that button (do not advance focus to Next)
- In `QuestionScreen.tsx`, render a small ghost chip "select all that apply" between the question `<h2>` and the answer area for multiselect questions only

### ResultScreen.tsx
- Receives `fitScore`, `userName`, `companyName`, `onEmailSubmit` props
- Staggered entrance animation: fit bar first, then score count-up, then copy, then CTAs
- Score count-up: animate from 0 to `fitScore` over 1200ms (use Framer Motion `useMotionValue` + `useTransform` or a simple `useEffect` counter)
- Result copy: look up from `resultCopy.ts` based on score range
- Schedule a call button: visible only if `fitScore >= 60` in the app UI (the email always includes the booking button regardless of score)
- Calendar URL: read from `import.meta.env.VITE_CALENDAR_URL`
- Email input + submit: on submit call `onEmailSubmit(email)`

---

## API - Vercel serverless function

File: `api/submit.ts`

Receives POST request with:
```ts
{
  userName: string
  companyName: string
  email: string
  fitScore: number
  answers: Record<string, number>
  submittedAt: string  // ISO timestamp
}
```

**Notion write:**
- Use Notion API (`@notionhq/client`)
- Database ID stored in environment variable `NOTION_DATABASE_ID`
- Auth token in `NOTION_API_KEY`
- Create a new page in the database with all fields as defined in `match_check_spec.md` Notion schema

**Emails - send both in parallel via `Promise.all`:**

Email 1 - Results to user:
- `from`: `FROM_NAME <FROM_EMAIL>` (e.g. "Thomas Euler <noreply@mail.yourdomain.com>")
- `to`: the email the user submitted
- `replyTo`: `NOTIFICATION_EMAIL` (author's inbox - so user replies land with you)
- Subject: `[userName], here's your Match Check result`
- Body: personalized greeting, fit bar visualization, score, result copy, booking button (always shown)

Email 2 - Notification to author:
- `from`: `Match Check <FROM_EMAIL>`
- `to`: `NOTIFICATION_EMAIL`
- `replyTo`: user's submitted email (so you can reply directly to them)
- Subject: `New Match Check result: [companyName] - [fitScore]%`
- Body: name, company, email, score, submission timestamp, link to Notion entry

The `getResultCopy` function should be inlined in `api/submit.ts` rather than imported from `src/data/resultCopy.ts` to keep the serverless function self-contained.

**Environment variables needed:**
```
NOTION_API_KEY
NOTION_DATABASE_ID
RESEND_API_KEY
NOTIFICATION_EMAIL     (author's inbox address - used as reply-to on user email)
FROM_EMAIL             (sending address, e.g. noreply@mail.yourdomain.com)
FROM_NAME              (display name on user-facing email and email headers)
VITE_AUTHOR_NAME       (name shown as wordmark on the welcome screen)
VITE_CALENDAR_URL      (scheduling link, used in both frontend and email)
```

Note: `VITE_CALENDAR_URL` is available to serverless functions as `process.env.VITE_CALENDAR_URL` - Vercel exposes all env vars to API routes regardless of the `VITE_` prefix.

---

## Notion setup (manual, before first deploy)

1. Create a Notion database with the schema defined in `match_check_spec.md`
2. Create a Notion integration at notion.so/my-integrations
3. Share the database with the integration
4. Copy the integration token and database ID into Vercel environment variables

---

## Deployment

1. Push to GitHub
2. Import repo in Vercel
3. Set all environment variables in Vercel project settings
4. Vercel auto-detects Vite + the `api/` folder for serverless functions
5. Deploy

---

## Implementation order

Build and verify in this sequence:

1. Project setup, Tailwind config, fonts, color tokens
2. `types/index.ts`
3. `data/questions.ts` - full question bank
4. `data/weights.ts` and `data/scoring.ts`
5. `data/resultCopy.ts`
6. `App.tsx` - screen state machine, session state, no UI yet
7. `WelcomeScreen.tsx` - static first, then add Framer Motion
8. `QuestionScreen.tsx` + all input sub-components
9. `FitBar.tsx` + `ProgressBar.tsx`
10. `ResultScreen.tsx`
11. Wire all screens together in `App.tsx`
12. `api/submit.ts` - Notion write + email
13. Connect result screen email submit to API
14. End-to-end test: full session, verify Notion entry created, verify email received
15. Deploy to Vercel

---

## Things to get right

- Question order randomized fresh on every session start
- Answer option order randomized on every question render (not just once)
- Fit bar does not update while user is selecting an answer - only after advancing
- Back button restores the previously selected answer for that question. This requires storing `rawAnswers` (selected option ID or IDs) in session state alongside the numeric `answers`. The numeric score alone is not enough to restore UI state.
- Slider snaps strictly to 5 positions - no free values
- Slider label sides are randomized per session. Generate a `sliderFlips: Record<string, boolean>` map at session start (alongside `questionOrder`) with a random boolean per slider question. When flipped, swap `leftLabel`/`rightLabel` in the render and invert the score (`100 - sliderValue`). Store the raw thumb position (not the score) in `rawAnswers` so back navigation restores the correct visual position.
- Slider track has no directional fill - the track stays neutral. Only the thumb is colored.
- Multiselect requires at least one selection before Next is enabled
- All selected multi-select options show purple (`#7C3AED`) regardless of their signal value. Signal is scoring-only and must never be surfaced as a color difference to the user.
- Focus management: (1) on question mount, after the slide animation, focus the first answer element to prevent stray browser carets; (2) after selecting a single/tradeoff option, move focus to the Next button; (3) after company confirmed on welcome screen, move focus to the CTA button. Use `setTimeout` with ~320-420ms delay to wait for animations before focusing.
- All environment variables via `.env.local` locally, Vercel env vars in production - never hardcoded
- No em dashes anywhere in copy or code comments - use hyphens

---

*Companion documents: `match_check_spec.md`, `match_check_ui_spec.md`
