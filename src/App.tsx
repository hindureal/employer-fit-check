import { useState, useCallback } from 'react'
import type { Screen, SessionState } from './types'
import { questions, shuffleArray } from './data/questions'
import { calculateFitScore } from './data/scoring'
import WelcomeScreen from './components/WelcomeScreen'
import QuestionScreen from './components/QuestionScreen'
import ResultScreen from './components/ResultScreen'

const INITIAL_SESSION: SessionState = {
  userName: '',
  companyName: '',
  answers: {},
  rawAnswers: {},
  sliderFlips: {},
  currentQuestionIndex: 0,
  questionOrder: [],
  runningFitScore: 0,
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION)

  const handleWelcomeComplete = useCallback((userName: string, companyName: string) => {
    const questionOrder = shuffleArray(questions.map(q => q.id))
    const sliderFlips: Record<string, boolean> = {}
    for (const q of questions) {
      if (q.type === 'slider') sliderFlips[q.id] = Math.random() > 0.5
    }
    setSession({
      ...INITIAL_SESSION,
      userName,
      companyName,
      questionOrder,
      sliderFlips,
    })
    setScreen('questions')
  }, [])

  const handleAnswer = useCallback((questionId: string, score: number, raw: string | string[]) => {
    setSession(prev => {
      const answers = { ...prev.answers, [questionId]: score }
      const rawAnswers = { ...prev.rawAnswers, [questionId]: raw }
      const runningFitScore = calculateFitScore(answers)
      return { ...prev, answers, rawAnswers, runningFitScore }
    })
  }, [])

  const handleNext = useCallback(() => {
    setSession(prev => {
      const nextIndex = prev.currentQuestionIndex + 1
      if (nextIndex >= prev.questionOrder.length) {
        return prev
      }
      return { ...prev, currentQuestionIndex: nextIndex }
    })
  }, [])

  const handleBack = useCallback(() => {
    setSession(prev => {
      if (prev.currentQuestionIndex === 0) {
        return prev
      }
      return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }
    })
  }, [])

  const handleLastQuestion = useCallback(() => {
    setScreen('result')
  }, [])

  const handleEmailSubmit = useCallback(async (email: string) => {
    const payload = {
      userName: session.userName,
      companyName: session.companyName,
      email,
      fitScore: session.runningFitScore,
      answers: session.answers,
      submittedAt: new Date().toISOString(),
    }
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {
      // silently fail - result is already shown
    }
  }, [session])

  const currentQuestionId = session.questionOrder[session.currentQuestionIndex]
  const currentQuestion = questions.find(q => q.id === currentQuestionId) ?? null
  const progress = session.questionOrder.length > 0
    ? session.currentQuestionIndex / session.questionOrder.length
    : 0
  const isLastQuestion = session.currentQuestionIndex === session.questionOrder.length - 1

  return (
    <div className="min-h-svh bg-ink font-sans">
      {screen === 'welcome' && (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      )}
      {screen === 'questions' && currentQuestion && (
        <QuestionScreen
          question={currentQuestion}
          userName={session.userName}
          companyName={session.companyName}
          currentAnswer={session.answers[currentQuestion.id]}
          rawAnswer={session.rawAnswers[currentQuestion.id]}
          sliderFlipped={session.sliderFlips[currentQuestion.id] ?? false}
          progress={progress}
          fitScore={session.runningFitScore}
          questionIndex={session.currentQuestionIndex}
          isLastQuestion={isLastQuestion}
          onAnswer={handleAnswer}
          onNext={isLastQuestion ? handleLastQuestion : handleNext}
          onBack={session.currentQuestionIndex === 0 ? undefined : handleBack}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          fitScore={session.runningFitScore}
          userName={session.userName}
          companyName={session.companyName}
          onEmailSubmit={handleEmailSubmit}
        />
      )}
    </div>
  )
}
