import React from 'react'

interface CardProps {
  title?: string
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
  className?: string
  background?: string
}

const Card: React.FC<CardProps> = ({
  title,
  disabled,
  onClick,
  children,
  className,
  background
}) => {
  return (
    <div
      title={title}
      onClick={onClick}
      className={
        'inline-flex justify-center items-center relative transition-all rounded disabled:cursor-not-allowed disabled:opacity-60 z-10' +
        (!disabled && onClick ? ' cursor-pointer' : '') +
        ` ${className || ''}`
      }
    >
      <img className="absolute z-0" src={background} />
      {children}
    </div>
  )
}

export default Card
