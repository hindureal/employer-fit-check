import type { Question } from '../types'

export const questions: Question[] = [
  // Cluster 1 - Structure and ambiguity
  {
    id: 'C1Q1',
    cluster: 1,
    type: 'tradeoff',
    text: '{companyName} is scaling fast. Which problem would concern you more?',
    options: [
      { id: 'C1Q1A', text: 'Things are moving so fast that we\'re making avoidable mistakes', score: 0 },
      { id: 'C1Q1B', text: 'We\'re adding process and structure faster than we actually need it', score: 100 },
    ],
  },
  {
    id: 'C1Q2',
    cluster: 1,
    type: 'slider',
    text: 'Where does your organization sit?',
    sliderLeftLabel: 'Decisions flow up',
    sliderRightLabel: 'Decisions happen where the knowledge is',
  },
  {
    id: 'C1Q3',
    cluster: 1,
    type: 'multiselect',
    text: 'Be honest {userName}, which of these phrases would your colleagues most likely use to describe how your org handles uncertainty?',
    options: [
      { id: 'C1Q3A', text: 'We move and adjust', score: 0, signal: 'green' },
      { id: 'C1Q3B', text: 'People just figure it out', score: 0, signal: 'green' },
      { id: 'C1Q3C', text: 'We align before we act', score: 0, signal: 'red' },
      { id: 'C1Q3D', text: 'We\'re working on it', score: 0, signal: 'neutral' },
      { id: 'C1Q3E', text: 'It depends who you ask', score: 0, signal: 'neutral' },
      { id: 'C1Q3F', text: 'Honestly, it\'s a bit chaotic', score: 0, signal: 'neutral' },
    ],
  },
  {
    id: 'C1Q4',
    cluster: 1,
    type: 'single',
    text: 'Imagine: a talented new hire acts on their own initiative and gets a good result - but didn\'t follow the established process - what typically happens in your organization?',
    options: [
      { id: 'C1Q4A', text: 'It\'s celebrated, even if it caused some friction', score: 100 },
      { id: 'C1Q4B', text: 'The result is recognized but the process issue gets addressed', score: 60 },
      { id: 'C1Q4C', text: 'It\'s a mixed reaction depending on who\'s involved', score: 30 },
      { id: 'C1Q4D', text: 'Process adherence matters regardless of outcome', score: 0 },
    ],
  },

  // Cluster 2 - Culture and psychological safety
  {
    id: 'C2Q2',
    cluster: 2,
    type: 'slider',
    text: '{userName}, how would you describe your organization\'s relationship with being wrong?',
    sliderLeftLabel: 'Mistakes are costly and visibility around them is managed carefully',
    sliderRightLabel: 'Mistakes are expected, shared openly, and treated as information',
  },
  {
    id: 'C2Q3',
    cluster: 2,
    type: 'multiselect',
    text: 'Which of these would you actually find in {companyName}?',
    options: [
      { id: 'C2Q3A', text: 'People challenge their manager\'s decisions openly in meetings', score: 0, signal: 'green' },
      { id: 'C2Q3B', text: 'Postmortems happen without blame', score: 0, signal: 'green' },
      { id: 'C2Q3C', text: '"I don\'t know" is an acceptable answer from senior people', score: 0, signal: 'green' },
      { id: 'C2Q3D', text: 'Strong opinions are common but rarely personal', score: 0, signal: 'green' },
      { id: 'C2Q3E', text: 'Disagreement usually gets resolved by whoever has the most authority', score: 0, signal: 'red' },
      { id: 'C2Q3F', text: 'We tend to avoid topics that could create tension', score: 0, signal: 'red' },
    ],
  },
  {
    id: 'C2Q4',
    cluster: 2,
    type: 'single',
    text: 'You\'re in a meeting. A senior leader presents a direction you think is clearly flawed. What most closely reflects what would typically happen in your org?',
    options: [
      { id: 'C2Q4A', text: 'Someone would push back directly, in the room', score: 100 },
      { id: 'C2Q4B', text: 'There\'d be some polite probing but not direct challenge', score: 60 },
      { id: 'C2Q4C', text: 'The challenge would happen in side conversations afterward', score: 20 },
      { id: 'C2Q4D', text: 'Most people would go along and raise concerns privately later, if at all', score: 0 },
    ],
  },
  {
    id: 'C2Q5',
    cluster: 2,
    type: 'tradeoff',
    text: 'When a complex problem has no clean answer, what does your org tend to do?',
    options: [
      { id: 'C2Q5A', text: 'Keep discussing until there\'s consensus or a clear answer emerges', score: 0 },
      { id: 'C2Q5B', text: 'Acknowledge the ambiguity, make a bet, and stay open to adjusting', score: 100 },
    ],
  },

  // Cluster 3 - Motivation and trust
  {
    id: 'C3Q2',
    cluster: 3,
    type: 'tradeoff',
    text: 'When onboarding a new senior hire, what\'s {companyName}\'s default stance?',
    options: [
      { id: 'C3Q2A', text: 'We give them access and autonomy and see what they do with it', score: 100 },
      { id: 'C3Q2B', text: 'We have a structured onboarding that defines expectations before expanding scope', score: 40 },
    ],
  },
  {
    id: 'C3Q3',
    cluster: 3,
    type: 'single',
    text: 'A strong performer makes an independent call that fails visibly. What most accurately describes what happens next in your org, {userName}?',
    options: [
      { id: 'C3Q3A', text: 'It\'s treated as data - discussed openly and learned from without career implications', score: 100 },
      { id: 'C3Q3B', text: 'It\'s handled constructively but the person\'s judgment gets more scrutiny going forward', score: 55 },
      { id: 'C3Q3C', text: 'The outcome matters more than the intent - failure has consequences regardless', score: 10 },
      { id: 'C3Q3D', text: 'It depends heavily on the political context around the person', score: 0 },
    ],
  },
  {
    id: 'C3Q4',
    cluster: 3,
    type: 'multiselect',
    text: 'Which of these statements would your team genuinely agree with?',
    options: [
      { id: 'C3Q4A', text: 'We trust people to manage their own time and output', score: 0, signal: 'green' },
      { id: 'C3Q4B', text: 'People here are driven by the work itself, not just the comp', score: 0, signal: 'green' },
      { id: 'C3Q4C', text: 'Failure is expected at the frontier of what we\'re trying to do', score: 0, signal: 'green' },
      { id: 'C3Q4D', text: 'We have strong performance management to keep standards high', score: 0, signal: 'red' },
      { id: 'C3Q4E', text: 'Compensation and incentives are central to how we retain top people', score: 0, signal: 'red' },
      { id: 'C3Q4F', text: 'Accountability usually means someone senior is watching', score: 0, signal: 'red' },
    ],
  },
  {
    id: 'C3Q5',
    cluster: 3,
    type: 'tradeoff',
    text: 'Which failure mode would concern you more in your organization?',
    options: [
      { id: 'C3Q5A', text: 'Someone acts too independently and creates a problem nobody saw coming', score: 0 },
      { id: 'C3Q5B', text: 'People wait for direction instead of acting on their own judgment', score: 100 },
    ],
  },

  // Cluster 4 - Leadership philosophy
  {
    id: 'C4Q1',
    cluster: 4,
    type: 'tradeoff',
    text: 'At {companyName}, when a critical project needs a leader, what typically happens?',
    options: [
      { id: 'C4Q1A', text: 'The most senior available person takes ownership', score: 0 },
      { id: 'C4Q1B', text: 'The person with the most relevant expertise or drive steps up, regardless of level', score: 100 },
    ],
  },
  {
    id: 'C4Q2',
    cluster: 4,
    type: 'slider',
    text: 'How is accountability primarily maintained in your organization, {userName}?',
    sliderLeftLabel: 'A senior person is ultimately responsible and enforces standards',
    sliderRightLabel: 'Accountability is built into how teams operate - processes, visibility, shared ownership',
  },
  {
    id: 'C4Q3',
    cluster: 4,
    type: 'multiselect',
    text: 'Which of these would you genuinely say about leadership in your org?',
    options: [
      { id: 'C4Q3A', text: 'People lead topics and projects regardless of their title', score: 0, signal: 'green' },
      { id: 'C4Q3B', text: 'We invest seriously in developing people\'s leadership capacity', score: 0, signal: 'green' },
      { id: 'C4Q3C', text: 'Our best leaders see their job as creating conditions for others to succeed', score: 0, signal: 'green' },
      { id: 'C4Q3D', text: 'Strong individual contributors who drive results are our leadership model', score: 0, signal: 'red' },
      { id: 'C4Q3E', text: 'Leadership accountability means clear ownership at the top', score: 0, signal: 'red' },
      { id: 'C4Q3F', text: 'Decisions get made fastest when the right senior person is in the room', score: 0, signal: 'red' },
    ],
  },
  {
    id: 'C4Q5',
    cluster: 4,
    type: 'tradeoff',
    text: 'What would concern you more in a leadership team?',
    options: [
      { id: 'C4Q5A', text: 'Leaders who are too hands-off and leave people without enough direction', score: 0 },
      { id: 'C4Q5B', text: 'Leaders who are too directive and crowd out their team\'s judgment', score: 100 },
    ],
  },
]

export function interpolateText(text: string, userName: string, companyName: string): string {
  return text
    .replace(/\{userName\}/g, userName)
    .replace(/\{companyName\}/g, companyName)
    .replace(/\{yourCompany\}/g, companyName)
    .replace(/\{yourName\}/g, userName)
}

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
