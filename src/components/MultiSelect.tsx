import { AnimatePresence, motion } from 'framer-motion'
import type { AnswerOption } from '../types'

interface Props {
  options: AnswerOption[]
  selectedIds: string[]
  onToggle: (option: AnswerOption) => void
}

export default function MultiSelect({ options, selectedIds, onToggle }: Props) {
  return (
    <div className="flex flex-col gap-[10px]">
      {options.map(option => {
        const isSelected = selectedIds.includes(option.id)

        return (
          <button
            key={option.id}
            onClick={() => onToggle(option)}
            className={`w-full text-left font-sans text-base text-paper px-6 py-4 rounded-full transition-all duration-150 flex items-center justify-between gap-4 ${
              isSelected
                ? 'bg-purple border-transparent'
                : 'bg-paper/[0.06] border border-paper/15 hover:bg-purple/20'
            }`}
          >
            <span>{option.text}</span>
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="shrink-0 text-paper/80 text-sm"
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </div>
  )
}
