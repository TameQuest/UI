import React from 'react'

export const BattleView: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <h1 className="font-fantasy text-2xl">Choose a dungeon</h1>
      <div className="w-full space-y-2 px-4">
        <div className="font-fantasy grid w-full grid-cols-8 pb-2 font-bold">
          <div className="flex justify-center">Tier</div>
          <div className="col-span-2 flex justify-center">
            Creature strength
          </div>
          <div className="col-span-2 flex justify-center">Taming chance</div>
          <div className="col-span-2 flex justify-center">
            Reward multiplier
          </div>
          <div className="flex justify-center">Action</div>
        </div>
      </div>
    </div>
  )
}
