interface Props {
  label: string
  selected: boolean
  onClick: () => void
}

export default function PillButton({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left font-sans text-base text-paper px-6 py-4 rounded-full transition-all duration-150 ${
        selected
          ? 'bg-purple border border-transparent'
          : 'bg-paper/[0.06] border border-paper/15 hover:bg-purple/20'
      }`}
    >
      {label}
    </button>
  )
}
