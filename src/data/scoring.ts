import type { AnswerOption } from '../types'
import { weights } from './weights'

export function scoreMultiselect(
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

export function calculateFitScore(answers: Record<string, number>): number {
  const total = Object.entries(answers).reduce((sum, [qId, score]) => {
    return sum + score * (weights[qId] ?? 0)
  }, 0)
  return Math.round(total / 100)
}
