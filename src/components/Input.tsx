import React, { FC, KeyboardEventHandler } from 'react'
import stone from '../assets/images/ui/surfaces/label9.png'
import { IconType } from 'react-icons'

interface InputProps {
  value?: string
  onChange: (value: string) => void
  onEnter?: () => void
  className?: string
  placeholder?: string
  Icon?: IconType
  type?: string
  disableMaxWidth?: boolean
  onFocus?: string
  disabled?: boolean
}

const Input: FC<InputProps> = ({
  value,
  onChange,
  className,
  placeholder,
  Icon,
  type,
  onEnter,
  disableMaxWidth,
  onFocus,
  disabled
}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (onEnter && event.key === 'Enter') onEnter()
  }

  return (
    <div
      className={`relative flex w-full items-center justify-center rounded-full p-2 font-semibold ${className}`}
      style={{
        maxWidth: disableMaxWidth ? '100%' : '16rem'
      }}
    >
      <div className="z-10 flex w-full max-w-full items-center space-x-2 overflow-hidden rounded-lg bg-black bg-opacity-30 px-1 text-gray-300 hover:bg-opacity-50">
        {Icon && <Icon className="mb-1 ml-2" />}
        <input
          className={`w-full max-w-full bg-transparent outline-none placeholder:text-gray-500`}
          value={value}
          onChange={(event) => onChange(event.target.value || '')}
          placeholder={placeholder}
          type={type}
          onKeyDown={handleKeyDown as unknown as KeyboardEventHandler}
          onFocus={onFocus as unknown as never}
          disabled={disabled}
        />
      </div>
      <img src={stone} className="pointer-events-none absolute z-0 shadow-lg" />
    </div>
  )
}

export default Input
