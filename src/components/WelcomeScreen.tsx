import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: (userName: string, companyName: string) => void
}

export default function WelcomeScreen({ onComplete }: Props) {
  const [userName, setUserName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [step, setStep] = useState<'name' | 'company' | 'ready'>('name')
  const companyInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (step === 'company') {
      setTimeout(() => companyInputRef.current?.focus(), 350)
    } else if (step === 'ready') {
      setTimeout(() => ctaRef.current?.focus(), 420)
    }
  }, [step])

  const confirmName = () => {
    if (userName.trim()) setStep('company')
  }

  const confirmCompany = () => {
    if (companyName.trim()) setStep('ready')
  }

  const inputClass =
    'w-full bg-transparent border-0 border-b border-paper/30 pb-2 text-paper text-xl font-sans outline-none placeholder:text-paper/30 focus:border-paper/60 transition-colors'

  return (
    <div className="min-h-svh flex items-center justify-center px-6">
      <div className="w-full max-w-[560px]">
        <p className="font-serif text-[13px] text-paper/40 mb-10 tracking-wide">
          Thomas Euler
        </p>

        <h1 className="font-serif text-[48px] leading-tight text-paper mb-3 max-sm:text-[36px]">
          Find out if we're a match.
        </h1>
        <p className="font-sans text-base text-paper/50 mb-12">
          Answer a few questions. Get an honest fit score. No fluff.
        </p>

        <div className="space-y-10">
          {/* Input 1 - Name */}
          <div>
            <label className="block font-sans text-sm text-paper/50 mb-3">
              What's your name?
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={nameInputRef}
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmName()}
                placeholder="Your name"
                disabled={step !== 'name'}
                className={`${inputClass} ${step !== 'name' ? 'opacity-40' : ''}`}
              />
              {step === 'name' && (
                <button
                  onClick={confirmName}
                  disabled={!userName.trim()}
                  className="text-paper/50 hover:text-paper disabled:opacity-30 transition-colors text-xl shrink-0"
                  aria-label="Confirm name"
                >
                  →
                </button>
              )}
            </div>
          </div>

          {/* Input 2 - Company */}
          <AnimatePresence>
            {(step === 'company' || step === 'ready') && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <label className="block font-sans text-sm text-paper/50 mb-3">
                  {userName.trim()}, what company are we matching Thomas with today?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={companyInputRef}
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && confirmCompany()}
                    placeholder="Company name"
                    disabled={step !== 'company'}
                    className={`${inputClass} ${step === 'ready' ? 'opacity-40' : ''}`}
                  />
                  {step === 'company' && (
                    <button
                      onClick={confirmCompany}
                      disabled={!companyName.trim()}
                      className="text-paper/50 hover:text-paper disabled:opacity-30 transition-colors text-xl shrink-0"
                      aria-label="Confirm company"
                    >
                      →
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <AnimatePresence>
            {step === 'ready' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <button
                  ref={ctaRef}
                  onClick={() => onComplete(userName.trim(), companyName.trim())}
                  className="inline-flex items-center bg-purple text-paper font-sans font-medium px-8 py-4 rounded-full hover:shadow-[0_8px_30px_rgba(124,58,237,0.4)] active:scale-[0.97] transition-all duration-150"
                >
                  Let's find out →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
