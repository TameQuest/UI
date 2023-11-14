import React from 'react'
import gold from 'assets/images/gold/4.png'

export const RaffleView: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-fantasy text-4xl">Raffle coming soon!</h1>
      <img src={gold} className="w-[25%]" />
    </div>
  )
}
