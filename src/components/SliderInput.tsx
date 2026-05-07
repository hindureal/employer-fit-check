interface Props {
  value: number
  onChange: (value: number) => void
  leftLabel: string
  rightLabel: string
}

export default function SliderInput({ value, onChange, leftLabel, rightLabel }: Props) {
  const fillPercent = value

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Filled track overlay */}
        <div
          className="absolute top-1/2 left-0 h-[3px] bg-purple rounded-full pointer-events-none -translate-y-1/2 transition-all duration-150"
          style={{ width: `${fillPercent}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={25}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="relative w-full"
        />
      </div>
      <div className="flex justify-between mt-4 gap-4">
        <span className="font-sans text-[15px] text-paper/50 max-w-[40%]">{leftLabel}</span>
        <span className="font-sans text-[15px] text-paper/50 max-w-[40%] text-right">{rightLabel}</span>
      </div>
    </div>
  )
}
