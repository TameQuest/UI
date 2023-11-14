import { useAccount } from 'providers/AccountProvider'
import React, { useState } from 'react'
import { getBackgroundImage, getCreatureImage } from 'utils'

import paperAlt from 'assets/images/ui/backgrounds/paper_alt_vertical.png'
import paper from 'assets/images/ui/backgrounds/paper_horizontal.png'
import { Badge } from 'components/CreatureCard/Badge'
import ArrowButton from 'components/ArrowButton'
import Star from './Star'
import Button from 'components/Button'
import Card from 'components/Card'

export const BattleView: React.FC = () => {
  const { player } = useAccount()
  const [difficulty, setDifficulty] = useState(0)

  return (
    <div className="grid w-full max-w-screen-2xl grid-cols-12 gap-2 py-8">
      <div className="relative col-span-5 flex aspect-[1/1] items-center justify-center overflow-hidden">
        <img
          className="absolute rounded-lg"
          src={getBackgroundImage(player.summonedCreature.info.background)}
        />
        <img
          className="absolute h-[100%] rounded-lg"
          src={getCreatureImage(
            player.summonedCreature.info.tier,
            player.summonedCreature.info.creature
          )}
        />
        <Badge image={''} value={0} delta={0} />
      </div>
      <div className="col-span-2 p-2">
        <h1 className="font-fantasy text-center text-6xl font-bold !text-yellow-300">
          vs
        </h1>
        <img className="rounded-lg" src={paperAlt} />
      </div>
      <div className="relative col-span-5">
        <img
          className="absolute rounded-lg opacity-20"
          src={getBackgroundImage(player.battleCreature.background)}
        />
        <div className="absolute flex h-[75%] w-full flex-col items-center justify-center space-y-16">
          <div>
            <div>Creature strength</div>
            <div>Creature points</div>
            <div>Gold</div>
            <div>Win chance</div>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowButton
              className="-scale-x-100 transform"
              onClick={() => setDifficulty(Math.max(difficulty - 1, 0))}
            />
            <div className="flex items-center space-x-1">
              <Star filled={difficulty >= 0} />
              <Star filled={difficulty >= 1} />
              <Star filled={difficulty >= 2} />
              <Star filled={difficulty >= 3} />
              <Star filled={difficulty >= 4} />
            </div>
            <ArrowButton
              onClick={() => setDifficulty(Math.min(difficulty + 1, 4))}
            />
          </div>
          <Button>Start adventure</Button>
        </div>
      </div>
    </div>
  )
}
