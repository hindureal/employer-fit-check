import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getResultCopy } from '../data/resultCopy'

interface Props {
  fitScore: number
  userName: string
  companyName: string
  onEmailSubmit: (email: string) => Promise<void>
}

const CALENDAR_URL = import.meta.env.VITE_CALENDAR_URL || '#'

function useCountUp(target: number, duration: number) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return value
}

export default function ResultScreen({ fitScore, onEmailSubmit }: Props) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [barReady, setBarReady] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setBarReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  const displayScore = useCountUp(barReady ? fitScore : 0, 1200)
  const resultCopy = getResultCopy(fitScore)
  const showCallButton = fitScore >= 60

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || submitting) return
    setSubmitting(true)
    await onEmailSubmit(email.trim())
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-svh flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[600px] flex flex-col items-center text-center gap-10">
        {/* Fit bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="relative w-2 rounded-full overflow-hidden" style={{ height: 180, background: 'rgba(250,249,246,0.08)' }}>
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-full"
              style={{ background: 'linear-gradient(to top, #C2563E, #7C3AED)' }}
              initial={{ height: '0%' }}
              animate={{ height: barReady ? `${fitScore}%` : '0%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Score number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span className="font-serif text-[80px] leading-none text-paper">
            {displayScore}
          </span>
          <span className="font-serif text-[40px] text-paper/60">%</span>
        </motion.div>

        {/* Result copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="font-serif text-[24px] text-paper leading-snug"
        >
          {resultCopy}
        </motion.p>

        {/* Schedule call button */}
        {showCallButton && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.4 }}
          >
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-purple text-paper font-sans font-medium px-8 py-4 rounded-full hover:shadow-[0_8px_30px_rgba(124,58,237,0.4)] active:scale-[0.97] transition-all duration-150"
            >
              Schedule a call
            </a>
          </motion.div>
        )}

        {/* Email capture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.4 }}
          className="w-full mt-4"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
              <p className="font-sans text-[14px] text-paper/50">
                Get the full analysis and see how we matched along all dimensions.
              </p>
              <div className="flex w-full max-w-sm gap-3 items-end">
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent border-0 border-b border-paper/30 pb-2 text-paper font-sans text-base outline-none placeholder:text-paper/30 focus:border-paper/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!email.trim() || submitting}
                  className="font-sans text-sm text-paper border border-paper/30 px-4 py-2 rounded-full hover:border-paper/60 disabled:opacity-30 transition-colors"
                >
                  {submitting ? '...' : 'Send'}
                </button>
              </div>
            </form>
          ) : (
            <p className="font-sans text-[14px] text-paper/50">
              Got it. I'll be in touch.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
