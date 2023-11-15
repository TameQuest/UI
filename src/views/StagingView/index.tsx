import React from 'react'
import stage from 'assets/images/icons/stage.png'

export const StagingView: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-fantasy text-4xl">Staging coming soon!</h1>
      <img src={stage} className="w-[10%]" />
    </div>
  )
}
