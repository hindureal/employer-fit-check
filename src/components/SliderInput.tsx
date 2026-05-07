interface Props {
  value: number
  onChange: (value: number) => void
  leftLabel: string
  rightLabel: string
}

export default function SliderInput({ value, onChange, leftLabel, rightLabel }: Props) {
  return (
    <div className="w-full py-6">
      <div className="relative">
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
