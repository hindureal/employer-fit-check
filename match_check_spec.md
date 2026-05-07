# Match Check - Full App Specification

A playful, conviction-driven fit assessment tool for potential employers. The user answers a sequence of questions; the app calculates and displays a weighted fit score against Thomas's actual preferences on culture, leadership, and org design.

---

## Concept and purpose

The app sits downstream of a CV or application. By the time a user arrives, they already have context on Thomas's hard skills and experience. The app therefore focuses exclusively on soft fit: values, culture, leadership philosophy, and working style. It is designed to run a mutual filter - not to sell Thomas, but to honestly assess alignment in both directions.

Tone: bold, playful, direct. Personality and edge. Aesthetically closer to a stylish game than a recruiting tool.

---

## App flow

### 1. Welcome screen

Sequential typeform-style reveal:

1. Greeting + brief explanation of what the user is about to experience. Simple, warm, tongue-in-cheek.
2. Input field: "What's your name?"
3. After name entered, new field appears: "[Name], you're about to find out how well Thomas would fit in your company. Btw - what company are we matching him with today?"
4. CTA button to begin.

Data captured: `userName`, `companyName`

---

### 2. Question sequence

- Each question is its own full screen
- Question order is randomized on each session
- For multiple choice and self-selection questions: answer option order is also randomized
- Back button available on every question screen (returns to previous question, restores previous answer)
- Progress indicator: minimal horizontal bar at the bottom of the screen (no numbers, purely visual)
- Fit score bar: vertical bar on the side of the screen, 0% at bottom to 100% at top. Red at 0, green at 100. Updates after each answer is confirmed and user moves to next question (not real-time during answering)

---

### 3. Result screen

- Fit bar displayed prominently at center of screen with final score
- Score-dependent result copy displayed below (see ranges below)
- For scores 60+: prominent "Schedule a call" button (in the app UI only - the results email always includes the booking button regardless of score)
- Email capture: "Get the full analysis and see how we matched along all dimensions" - input field for email address
- On submission: results written to Notion database + results email sent to user + notification email sent to author

---

## Question bank

### Cluster 1 - Structure and ambiguity

**C1Q1 - Trade-off choice**
[companyName] is scaling fast. Which problem would concern you more?
- A: Things are moving so fast that we're making avoidable mistakes `[score: 0]`
- B: We're adding process and structure faster than we actually need it `[score: 100]`

**C1Q2 - Slider (5-point snap: 0, 25, 50, 75, 100)**
Where does your organization sit?
Scale: `Decisions flow up` → `Decisions happen where the knowledge is`
Score = slider position (0-100)

**C1Q3 - Self-selection (pick all that apply)**
Be honest [userName], which of these phrases would your colleagues most likely use to describe how your org handles uncertainty?
- "We move and adjust" `[green]`
- "People just figure it out" `[green]`
- "We align before we act" `[red]`
- "We're working on it" `[neutral - excluded from scoring]`
- "It depends who you ask" `[neutral - excluded from scoring]`
- "Honestly, it's a bit chaotic" `[neutral - excluded from scoring]`

**C1Q4 - Single choice**
Imagine: a talented new hire acts on their own initiative and gets a good result - but didn't follow the established process - what typically happens in your organization?
- A: It's celebrated, even if it caused some friction `[score: 100]`
- B: The result is recognized but the process issue gets addressed `[score: 60]`
- C: It's a mixed reaction depending on who's involved `[score: 30]`
- D: Process adherence matters regardless of outcome `[score: 0]`

---

### Cluster 2 - Culture and psychological safety

**C2Q2 - Slider (5-point snap)**
[userName], how would you describe your organization's relationship with being wrong?
Scale: `Mistakes are costly and visibility around them is managed carefully` → `Mistakes are expected, shared openly, and treated as information`
Score = slider position (0-100)

**C2Q3 - Self-selection (pick all that apply)**
Which of these would you actually find in [yourCompany]?
- People challenge their manager's decisions openly in meetings `[green]`
- Postmortems happen without blame `[green]`
- "I don't know" is an acceptable answer from senior people `[green]`
- Strong opinions are common but rarely personal `[green]`
- Disagreement usually gets resolved by whoever has the most authority `[red]`
- We tend to avoid topics that could create tension `[red]`

**C2Q4 - Single choice**
You're in a meeting. A senior leader presents a direction you think is clearly flawed. What most closely reflects what would typically happen in your org?
- A: Someone would push back directly, in the room `[score: 100]`
- B: There'd be some polite probing but not direct challenge `[score: 60]`
- C: The challenge would happen in side conversations afterward `[score: 20]`
- D: Most people would go along and raise concerns privately later, if at all `[score: 0]`

**C2Q5 - Trade-off choice**
When a complex problem has no clean answer, what does your org tend to do?
- A: Keep discussing until there's consensus or a clear answer emerges `[score: 0]`
- B: Acknowledge the ambiguity, make a bet, and stay open to adjusting `[score: 100]`

---

### Cluster 3 - Motivation and trust

**C3Q2 - Trade-off choice**
When onboarding a new senior hire, what's [yourCompany]'s default stance?
- A: We give them access and autonomy and see what they do with it `[score: 100]`
- B: We have a structured onboarding that defines expectations before expanding scope `[score: 40]`

**C3Q3 - Single choice**
A strong performer makes an independent call that fails visibly. What most accurately describes what happens next in your org, [userName]?
- A: It's treated as data - discussed openly and learned from without career implications `[score: 100]`
- B: It's handled constructively but the person's judgment gets more scrutiny going forward `[score: 55]`
- C: The outcome matters more than the intent - failure has consequences regardless `[score: 10]`
- D: It depends heavily on the political context around the person `[score: 0]`

**C3Q4 - Self-selection (pick all that apply)**
Which of these statements would your team genuinely agree with?
- "We trust people to manage their own time and output" `[green]`
- "People here are driven by the work itself, not just the comp" `[green]`
- "Failure is expected at the frontier of what we're trying to do" `[green]`
- "We have strong performance management to keep standards high" `[red]`
- "Compensation and incentives are central to how we retain top people" `[red]`
- "Accountability usually means someone senior is watching" `[red]`

**C3Q5 - Trade-off choice**
Which failure mode would concern you more in your organization?
- A: Someone acts too independently and creates a problem nobody saw coming `[score: 0]`
- B: People wait for direction instead of acting on their own judgment `[score: 100]`

---

### Cluster 4 - Leadership philosophy

**C4Q1 - Trade-off choice**
At [yourCompany], when a critical project needs a leader, what typically happens?
- A: The most senior available person takes ownership `[score: 0]`
- B: The person with the most relevant expertise or drive steps up, regardless of level `[score: 100]`

**C4Q2 - Slider (5-point snap)**
How is accountability primarily maintained in your organization, [yourName]?
Scale: `A senior person is ultimately responsible and enforces standards` → `Accountability is built into how teams operate - processes, visibility, shared ownership`
Score = slider position (0-100)

**C4Q3 - Self-selection (pick all that apply)**
Which of these would you genuinely say about leadership in your org?
- "People lead topics and projects regardless of their title" `[green]`
- "We invest seriously in developing people's leadership capacity" `[green]`
- "Our best leaders see their job as creating conditions for others to succeed" `[green]`
- "Strong individual contributors who drive results are our leadership model" `[red]`
- "Leadership accountability means clear ownership at the top" `[red]`
- "Decisions get made fastest when the right senior person is in the room" `[red]`

**C4Q5 - Trade-off choice**
What would concern you more in a leadership team?
- A: Leaders who are too hands-off and leave people without enough direction `[score: 0]`
- B: Leaders who are too directive and crowd out their team's judgment `[score: 100]`

---

## Scoring model

### Overall fit score

```
fit = Σ (question_score × question_weight) / 100
```

Result is a value between 0 and 100.

### Binary / trade-off questions
Green = 100, Red = 0

### Single choice questions
Each option has a manually assigned score as defined in the question bank above.

### Slider questions
Continuous value snapped to 5 points: 0, 25, 50, 75, 100.
Score = slider position directly.

### Self-selection questions
```
step = 50 / max(greenOptions, redOptions)
score = clamp(50 + (greenCount - redCount) × step, 0, 100)
```

Selecting only greens pushes toward 100. Selecting only reds pushes toward 0. Mixed selections cancel out proportionally. Neutral options (where defined) are excluded from scoring entirely.

---

## Question weights

| Question | Description | Weight |
|---|---|---|
| C1Q1 | Fast scaling failure mode | 5 |
| C1Q2 | Decision flow slider | 8 |
| C1Q3 | How org handles uncertainty | 7 |
| C1Q4 | Initiative without process | 6 |
| C2Q2 | Relationship with being wrong | 6 |
| C2Q3 | What you'd find in your org | 5 |
| C2Q4 | Senior leader challenged | 8 |
| C2Q5 | Complex problem, no clean answer | 7 |
| C3Q2 | Default stance on new hire | 5 |
| C3Q3 | Strong performer fails visibly | 6 |
| C3Q4 | What your team would agree with | 6 |
| C3Q5 | Independence failure mode | 7 |
| C4Q1 | Critical project needs a leader | 4 |
| C4Q2 | Accountability slider | 6 |
| C4Q3 | Leadership in your org | 6 |
| C4Q5 | Leadership team failure mode | 8 |
| **Total** | | **100** |

*Note: weights to be filled in from the interactive weighting table before handoff to Claude Code.*

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

For scores 60+: display a prominent "Schedule a call" button.

---

## Data and backend

### Runtime state (browser only)
All session state (answers, running score, name, company) lives in JavaScript memory during the session. No backend reads or writes during the question sequence.

### On result submission
A single API call fires on email submission that:
1. Writes the full result record to a Notion database
2. Sends a results email to the user (their score, result copy, fit bar, booking link)
3. Sends a notification email to the author (name, company, score, Notion link)

Both emails are sent in parallel via Resend. The results email has `Reply-To` set to the author's address so the user can reply directly. The notification email has `Reply-To` set to the user's email so the author can reply directly to them.

### Notion database schema
Each submission is one row with the following fields:

| Field | Type |
|---|---|
| Name | Text |
| Company | Text |
| Email | Text |
| Overall fit score | Number |
| Submission date | Date |
| C1Q1 answer | Number (score 0-100) |
| C1Q2 answer | Number |
| C1Q3 answer | Number |
| C1Q4 answer | Number |
| C2Q2 answer | Number |
| C2Q3 answer | Number |
| C2Q4 answer | Number |
| C2Q5 answer | Number |
| C3Q2 answer | Number |
| C3Q3 answer | Number |
| C3Q4 answer | Number |
| C3Q5 answer | Number |
| C4Q1 answer | Number |
| C4Q2 answer | Number |
| C4Q3 answer | Number |
| C4Q5 answer | Number |

### Results email (to user)
Sent from the author's sending address. Contains: personalized greeting by name, fit bar visualization (vertical gradient bar matching the app), score number, result copy, booking button (always shown regardless of score). `Reply-To` is set to the author's inbox address.

### Notification email (to author)
Sent on each submission. Contains: name, company, email, overall fit score, submission timestamp, and a direct link to the Notion database entry. `Reply-To` is set to the user's submitted email address so the author can reply directly to them.

### Infrastructure
No dedicated backend server required. Submission handled via a serverless function (e.g. Vercel edge function). Notion API used directly for database writes. Email notification via a transactional email service (e.g. Resend or similar).

---

