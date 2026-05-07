import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Question, AnswerOption } from '../types'
import { interpolateText, shuffleArray } from '../data/questions'
import { scoreMultiselect } from '../data/scoring'
import PillButton from './PillButton'
import SliderInput from './SliderInput'
import MultiSelect from './MultiSelect'
import FitBar from './FitBar'
import ProgressBar from './ProgressBar'

interface Props {
  question: Question
  userName: string
  companyName: string
  currentAnswer: number | undefined
  rawAnswer: string | string[] | undefined
  progress: number
  fitScore: number
  questionIndex: number
  isLastQuestion: boolean
  onAnswer: (questionId: string, score: number, raw: string | string[]) => void
  onNext: () => void
  onBack: (() => void) | undefined
}

const SLIDER_DEFAULT = 50

export default function QuestionScreen({
  question,
  userName,
  companyName,
  currentAnswer,
  rawAnswer,
  progress,
  fitScore,
  questionIndex,
  isLastQuestion,
  onAnswer,
  onNext,
  onBack,
}: Props) {
  const [sliderValue, setSliderValue] = useState<number>(currentAnswer ?? SLIDER_DEFAULT)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [direction, setDirection] = useState<1 | -1>(1)
  const [committedFitScore, setCommittedFitScore] = useState(fitScore)
  const [committedAnsweredCount, setCommittedAnsweredCount] = useState(
    currentAnswer !== undefined ? questionIndex + 1 : questionIndex
  )
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const answerAreaRef = useRef<HTMLDivElement>(null)

  const shuffledOptions = useMemo(() => {
    if (!question.options) return []
    return shuffleArray(question.options)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  useEffect(() => {
    if (question.type === 'slider') {
      const val = currentAnswer ?? SLIDER_DEFAULT
      setSliderValue(val)
      onAnswer(question.id, val, String(val))
    } else if (question.type === 'multiselect') {
      const ids = Array.isArray(rawAnswer) ? rawAnswer : []
      setSelectedOptionIds(ids)
      setSelectedOptionId(null)
    } else {
      const id = typeof rawAnswer === 'string' ? rawAnswer : null
      setSelectedOptionId(id)
      setSelectedOptionIds([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  useEffect(() => {
    if (question.type === 'slider') {
      onAnswer(question.id, sliderValue, String(sliderValue))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderValue])

  // Focus first answer element after slide animation to prevent stray caret
  useEffect(() => {
    const timer = setTimeout(() => {
      answerAreaRef.current?.querySelector<HTMLElement>('button, input')?.focus()
    }, 320)
    return () => clearTimeout(timer)
  }, [question.id])

  const hasAnswer =
    question.type === 'slider'
      ? true
      : question.type === 'multiselect'
      ? selectedOptionIds.length > 0
      : selectedOptionId !== null

  const handlePillSelect = (option: AnswerOption) => {
    setSelectedOptionId(option.id)
    onAnswer(question.id, option.score, option.id)
    nextButtonRef.current?.focus()
  }

  const handleMultiToggle = (option: AnswerOption) => {
    const allOptions = question.options ?? []
    let next: string[]
    if (selectedOptionIds.includes(option.id)) {
      next = selectedOptionIds.filter(id => id !== option.id)
    } else {
      next = [...selectedOptionIds, option.id]
    }
    setSelectedOptionIds(next)
    const selectedOptions = allOptions.filter(o => next.includes(o.id))
    const score = scoreMultiselect(selectedOptions, allOptions)
    onAnswer(question.id, score, next)
  }

  const handleNext = () => {
    setDirection(1)
    setCommittedFitScore(fitScore)
    setCommittedAnsweredCount(questionIndex + 1)
    onNext()
  }

  const handleBack = () => {
    setDirection(-1)
    onBack?.()
  }

  const questionText = interpolateText(question.text, userName, companyName)

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="min-h-svh flex">
      {/* Main region */}
      <div className="flex-1 flex flex-col min-h-svh pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col px-6 sm:px-12 pt-16 pb-4"
          >
            <div className="max-w-2xl w-full mx-auto flex flex-col flex-1">
              {/* Question text */}
              <h2 className="font-serif text-[32px] max-sm:text-[26px] leading-[1.3] text-paper mb-10">
                {questionText}
              </h2>

              {/* Answer area */}
              <div ref={answerAreaRef} className="flex-1">
                {(question.type === 'tradeoff' || question.type === 'single') && (
                  <div className="flex flex-col gap-[10px]">
                    {shuffledOptions.map(option => (
                      <PillButton
                        key={option.id}
                        label={option.text}
                        selected={selectedOptionId === option.id}
                        onClick={() => handlePillSelect(option)}
                      />
                    ))}
                  </div>
                )}

                {question.type === 'slider' && (
                  <SliderInput
                    value={sliderValue}
                    onChange={setSliderValue}
                    leftLabel={question.sliderLeftLabel ?? ''}
                    rightLabel={question.sliderRightLabel ?? ''}
                  />
                )}

                {question.type === 'multiselect' && (
                  <MultiSelect
                    options={shuffledOptions}
                    selectedIds={selectedOptionIds}
                    onToggle={handleMultiToggle}
                  />
                )}
              </div>

              {/* Navigation row */}
              <div className="flex justify-between items-center mt-10">
                <div>
                  {onBack && (
                    <button
                      onClick={handleBack}
                      className="font-sans text-paper/40 hover:text-paper/70 transition-colors"
                    >
                      - back
                    </button>
                  )}
                </div>
                <button
                  ref={nextButtonRef}
                  onClick={handleNext}
                  disabled={!hasAnswer}
                  className={`font-sans font-medium px-8 py-4 rounded-full transition-all duration-150 ${
                    hasAnswer
                      ? 'bg-purple text-paper hover:shadow-[0_8px_30px_rgba(124,58,237,0.4)] active:scale-[0.97]'
                      : 'bg-purple/30 text-paper/40 cursor-not-allowed'
                  }`}
                >
                  {isLastQuestion ? 'See results' : 'Next'} →
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sidebar fit bar (desktop only) */}
      <div className="hidden sm:block w-24 shrink-0">
        <FitBar fitScore={committedFitScore} answeredCount={committedAnsweredCount} />
      </div>

      <ProgressBar progress={progress} />
    </div>
  )
}
