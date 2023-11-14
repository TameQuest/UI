import React from 'react'
import gauntlet from 'assets/images/icons/gauntlet.png'

export const GauntletView: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-fantasy text-4xl">Gauntlet coming soon!</h1>
      <img src={gauntlet} />
    </div>
  )
}
