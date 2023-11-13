import React from 'react'
import { classNames } from 'utils'
import buttonFrame from '../assets/images/ui/buttons/b4_f.png'
import button from '../assets/images/ui/buttons/b4.png'

interface ButtonProps {
  disabled?: boolean
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  disabled,
  onClick,
  className,
  children
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        'flex relative items-center w-48 justify-center text-white rounded p-3 pb-2',
        className
      )}
    >
      <div
        className={classNames(
          'font-fantasy absolute z-10 flex items-center justify-center text-xl transition-all duration-100',
          disabled
            ? 'opacity-30 cursor-not-allowed scale-95'
            : 'hover:opacity-80 active:scale-95 active:opacity-60'
        )}
      >
        <img src={button} className="p-3 opacity-70" />
        <span className="pointer-events-none absolute z-20 select-none">
          {children}
        </span>
      </div>
      <img src={buttonFrame} className="absolute z-0 shadow-lg" />
    </button>
  )
}

export default Button
