import { motion } from 'framer-motion'

interface Props {
  progress: number
}

export default function ProgressBar({ progress }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[4px] bg-paper/10">
      <motion.div
        className="h-full bg-purple"
        initial={{ width: '0%' }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}
