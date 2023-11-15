import React from 'react'
import { GemCard } from './GemCard'
import { useAccount } from 'providers/AccountProvider'

import coins from 'assets/images/gold/coins.png'
import { formatAmount } from 'utils'

export const AuctionView: React.FC = () => {
  const { player } = useAccount()

  return (
    <div className="flex w-full max-w-screen-xl flex-col items-center justify-center">
      <div className="flex items-center space-x-2 pb-8">
        <img src={coins} className="w-16" />
        <span className="text-2xl">
          You have <b>{formatAmount(player.gold)}</b> gold
        </span>
      </div>
      <div className="grid grid-cols-3 justify-center gap-4">
        <GemCard tier={0} />
        <GemCard tier={1} />
        <GemCard tier={2} />
        <GemCard tier={3} />
        <GemCard tier={4} />
      </div>
    </div>
  )
}
