import { motion } from 'framer-motion'

interface Props {
  fitScore: number
  answeredCount: number
}

export default function FitBar({ fitScore, answeredCount }: Props) {
  const fillPercent = answeredCount === 0 ? 0 : fitScore

  return (
    <div className="hidden sm:flex flex-col items-center justify-center h-full gap-3 px-6">
      <span className="font-sans text-[9px] uppercase tracking-widest text-paper/30">
        fit score
      </span>
      <div className="relative w-2 rounded-full overflow-hidden" style={{ height: '60vh', background: 'rgba(250,249,246,0.08)' }}>
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{
            background: 'linear-gradient(to top, #C2563E, #7C3AED)',
          }}
          initial={{ height: '0%' }}
          animate={{ height: `${fillPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="font-sans text-[12px] text-paper/50">
        {answeredCount === 0 ? '-' : `${fillPercent}%`}
      </span>
    </div>
  )
}
