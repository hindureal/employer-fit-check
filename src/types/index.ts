export type QuestionType = 'tradeoff' | 'single' | 'slider' | 'multiselect'

export interface AnswerOption {
  id: string
  text: string
  score: number
  signal?: 'green' | 'red' | 'neutral'
}

export interface Question {
  id: string
  cluster: 1 | 2 | 3 | 4
  type: QuestionType
  text: string
  sliderLeftLabel?: string
  sliderRightLabel?: string
  options?: AnswerOption[]
}

export interface SessionState {
  userName: string
  companyName: string
  answers: Record<string, number>
  rawAnswers: Record<string, string | string[]>
  sliderFlips: Record<string, boolean>
  currentQuestionIndex: number
  questionOrder: string[]
  runningFitScore: number
}

export type Screen = 'welcome' | 'questions' | 'result'
