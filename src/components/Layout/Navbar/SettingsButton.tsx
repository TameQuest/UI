import React from 'react'
import { classNames, formatAmount } from 'utils'
import settings from '../../../assets/images/icons/settings.png'
import label from '../../../assets/images/ui/surfaces/label4.png'
import { FaBolt } from 'react-icons/fa'
import { useAccount } from 'providers/AccountProvider'

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
  const { player } = useAccount()
  return (
    <div>
      <button
        onClick={onClick}
        className={classNames(
          'relative flex w-full justify-center items-center hover:scale-95 active:scale-90',
          className
        )}
      >
        <span className="z-10 flex h-full items-center space-x-1 px-2 font-bold">
          <FaBolt className="inline text-yellow-400" />
          <span>{formatAmount(player.funds, 5)}</span>
        </span>
        <img src={label} className="absolute z-0 w-full" />
      </button>
    </div>
  )
}

export default SettingsButton
