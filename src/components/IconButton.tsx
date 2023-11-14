import React from 'react'
import { classNames } from 'utils'
import buttonFrame from '../assets/images/ui/buttons/b2_f.png'
import button from '../assets/images/ui/buttons/b2.png'
import decor from 'assets/images/ui/decor/decor9.png'

interface IconButtonProps {
  disabled?: boolean
  onClick?: () => void
  className?: string
  icon?: string
  children?: React.ReactNode
  selected?: boolean
}

const IconButton: React.FC<IconButtonProps> = ({
  disabled,
  onClick,
  className,
  icon,
  children,
  selected
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        'flex relative text-white dark:text-neutral-200 min-w-max rounded',
        className
      )}
    >
      <div
        className={classNames(
          'font-fantasy absolute z-20 flex items-center justify-center text-2xl transition-all duration-100',
          disabled
            ? 'opacity-30 cursor-not-allowed scale-95'
            : 'hover:scale-95 active:scale-90'
        )}
      >
        <img src={button} className="opacity-70" />
        {icon && <img src={icon} className="absolute mb-4" />}
        <div className="absolute">{children}</div>
      </div>
      <img src={buttonFrame} className="absolute z-10 " />
      <img
        src={decor}
        className={classNames(
          'absolute z-0 pointer-events-none transform transition-all duration-200 rotate-180 scale-75 z-0',
          !selected ? 'top-0 scale-0 opacity-0' : 'top-[68px]'
        )}
      />
    </button>
  )
}

export default IconButton
