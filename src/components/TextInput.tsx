import { forwardRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onConfirm?: () => void
  placeholder?: string
  disabled?: boolean
  type?: string
}

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, onConfirm, placeholder, disabled, type = 'text' }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onConfirm?.()}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-transparent border-0 border-b border-paper/30 pb-2 text-paper font-sans text-xl outline-none placeholder:text-paper/30 focus:border-paper/60 transition-colors disabled:opacity-40"
      />
    )
  }
)

TextInput.displayName = 'TextInput'
export default TextInput
