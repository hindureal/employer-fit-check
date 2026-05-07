# Match Check - Personal Fit Assessment App

A playful, conviction-driven fit assessment tool you can deploy as your own. Potential employers answer a sequence of questions and receive a weighted fit score against your actual preferences on culture, leadership, and working style.

Built with Vite + React + TypeScript + Tailwind + Framer Motion. Results write to a Notion database. Notification emails via Resend.

---

## How to make this yours

This repo is a template. The questions, scoring, and copy are currently configured for the person who built it. To rebuild it around your own convictions, fill in the prompt below and paste it to Claude (claude.ai or Claude Code).

Claude will read your answers, propose changes to the three specification files, and wait for your approval before touching any code.

---

## Your setup prompt

Copy everything below this line, fill in your answers, and paste it to Claude.

---

I want to rebuild the Match Check app for myself. The repo contains three specification files:

- `match_check_spec.md` - questions, scoring model, weights, and backend logic
- `match_check_ui_spec.md` - visual design, layout, and animation spec
- `match_check_claude_code_instructions.md` - implementation instructions

Please read all three files first. Then read my answers to the seven dimensions below. Based on my answers, propose the specific changes you would make to each spec file before writing any code. Wait for my confirmation before making any changes.

---

### About me

**Name:**
**Role / what I do:**
**Who is the intended audience for this app?** (e.g. potential employers, clients, collaborators)
**Calendar / scheduling link:**
**Email address for result notifications:**

---

### Dimension 1 - Values alignment

What do you prioritize? For each pair, indicate which you lean toward and say a few words about why.

- Growth vs. stability
- Impact vs. recognition
- Autonomy vs. belonging

Your answer:

---

### Dimension 2 - Power distance and hierarchy

How do you relate to authority, decision-making, and org structure? Do you believe in flat structures, distributed authority, or something else? How does this show up in how you work day to day?

Your answer:

---

### Dimension 3 - Psychological safety expectations

What kind of intellectual culture do you thrive in? How do you handle disagreement and criticism? What does a healthy debate culture look like to you?

Your answer:

---

### Dimension 4 - Pace and ambiguity tolerance

How do you relate to structure, process, and uncertainty? Do you build process as a default or as a last resort? How do you think about structure in fast-moving organizations?

Your answer:

---

### Dimension 5 - Intrinsic motivation profile

What actually drives you - and what do you want from the people around you? How do you think about extrinsic incentives like bonuses and titles?

Your answer:

---

### Dimension 6 - Leadership and followership philosophy

How do you think about leadership - as a role or a function? How should accountability work in a team? What does good leadership look like to you in practice?

Your answer:

---

### Dimension 7 - Collaboration and communication style

How do you prefer to work with others? Async vs. sync, written vs. verbal, meeting-heavy vs. documentation-first? What does good information flow look like in an organization?

Your answer:

---

### Visual preferences

**Primary accent color:** (hex or description - the current default is purple `#7C3AED`)
**Any other visual preferences or changes from the current design?**

---

### Relative importance

Once you have read my answers above, suggest which four or five dimensions seem most distinctive and important for filtering fit in my specific case. I will confirm or adjust before you propose question changes.

---

## What Claude will do with your answers

After receiving your filled-in prompt, Claude will:

1. Read the three spec files in full
2. Identify every place in the spec files that is specific to the original author (questions, copy, result sentences, weights, color, name, calendar URL, Notion schema, email config)
3. Propose a revised question bank based on your seven dimension answers - including question text, answer options, and signal logic (green/red)
4. Propose updated result copy, welcome screen copy, and visual accent color
5. Flag any implementation details that need your input (e.g. Notion setup, Resend account, calendar link)
6. Wait for your confirmation before modifying any file or writing any code

---

## External services you will need

Before deploying, set up the following and add their credentials to `.env.local`:

| Service | Purpose | Cost |
|---|---|---|
| Notion | Results database | Free |
| Resend (resend.com) | Notification emails | Free up to 3k/month |
| Vercel | Hosting + serverless function | Free |

See `match_check_claude_code_instructions.md` for the full environment variable reference and Notion database schema.

---

## Repo structure

```
src/
  components/       # React components
  data/             # Questions, weights, scoring logic, result copy
  types/            # Shared TypeScript types
  App.tsx           # Screen state machine
api/
  submit.ts         # Vercel serverless function (Notion + email)
match_check_spec.md
match_check_ui_spec.md
match_check_claude_code_instructions.md
```
