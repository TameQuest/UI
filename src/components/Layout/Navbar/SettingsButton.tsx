import React from 'react'
import { classNames } from 'utils'
import settings from '../../../assets/images/icons/settings.png'

interface SettingsButtonProps {
  onClick?: () => void
  className?: string
  icon?: string
  children?: React.ReactNode
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
  onClick,
  className
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames('relative flex w-full', className)}
    >
      <img
        src={settings}
        className="absolute z-10 transition-all hover:scale-95 active:scale-90"
      />
    </button>
  )
}

export default SettingsButton
