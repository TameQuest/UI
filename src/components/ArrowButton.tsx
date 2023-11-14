import React from 'react'
import { classNames } from 'utils'
import buttonFrame from '../assets/images/ui/buttons/b3_f.png'
import button from '../assets/images/ui/buttons/b3.png'
import { useStore } from 'providers/store'

interface ArrowButtonProps {
  disabled?: boolean
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  disabled,
  onClick,
  className,
  children
}) => {
  const { state } = useStore()

  const _disabled = disabled || state.loading

  return (
    <button
      disabled={_disabled}
      onClick={onClick}
      className={classNames(
        'flex relative items-center w-12 justify-center text-white rounded p-3 pb-2',
        className
      )}
    >
      <div
        className={classNames(
          'font-fantasy absolute z-20 flex items-center justify-center text-xl transition-all duration-100',
          _disabled
            ? 'opacity-30 cursor-not-allowed scale-95'
            : 'hover:scale-95 active:scale-90 active:opacity-60'
        )}
      >
        <img src={button} className="opacity-70" />
        <span className="text-stroke pointer-events-none absolute z-20 select-none">
          {children}
        </span>
      </div>
      <img src={buttonFrame} className="absolute z-10 shadow-lg" />
    </button>
  )
}

export default ArrowButton
