import React from 'react'
import { SummonedCreature } from 'providers/sdk/types'

import front from 'assets/images/front/front.png'
import stage from 'assets/images/icons/stage.png'

import power from 'assets/images/icons/power.png'
import agility from 'assets/images/icons/agility.png'
import guard from 'assets/images/icons/guard.png'
import insight from 'assets/images/icons/insight.png'
import { Badge } from './Badge'
import { Traits } from './Traits'
import { classNames, getBackgroundImage, getCreatureImage } from 'utils'

import gem1 from 'assets/images/gems/full/1.png'
import gem2 from 'assets/images/gems/full/2.png'
import gem3 from 'assets/images/gems/full/3.png'
import gem4 from 'assets/images/gems/full/4.png'
import gem5 from 'assets/images/gems/full/5.png'

const gems = [gem1, gem2, gem3, gem4, gem5]

type CreatureCardProps = {
  creature: SummonedCreature
  enemy?: boolean
}

export const CreatureCard: React.FC<CreatureCardProps> = ({
  creature,
  enemy
}) => {
  const backgroundImage = getBackgroundImage(creature.info.background)
  const creatureImage = getCreatureImage(
    creature.info.tier,
    creature.info.creature
  )

  const stats = [
    creature.info.power,
    creature.info.agility,
    creature.info.guard,
    creature.info.insight
  ]

  const bonusStat = creature.bonus % 5
  const penaltyStat = creature.penalty % 5

  const bonusPercentage = Math.floor(creature.bonus / 5)
  const penaltyPercentage = Math.floor(creature.penalty / 5)

  const calculateStatDelta = (stat: number) => {
    const baseStat = stats[stat]
    if (bonusStat === stat) {
      return Math.floor((bonusPercentage * baseStat) / 100)
    } else if (penaltyStat === stat) {
      return -Math.floor((penaltyPercentage * baseStat) / 100)
    }
    return 0
  }

  return (
    <div
      className={classNames(
        'relative z-10 inline-flex aspect-[2/3] items-center justify-center rounded transition-all',
        stats[0] === 0 && 'grayscale opacity-30'
      )}
      style={{ width: 320 }}
    >
      <img className="absolute z-20" src={front} />
      <div
        className={classNames(
          'absolute -top-[5%] z-10 flex w-full items-center justify-center',
          enemy && '-scale-x-100'
        )}
      >
        <img src={creatureImage} />
      </div>
      <div
        className={classNames(
          'absolute flex w-[40%] items-center justify-center',
          enemy ? '-top-[5%] z-20' : 'bottom-[33%] z-10'
        )}
      >
        {enemy ? (
          <img src={gems[creature.info.tier]} className="w-16" />
        ) : (
          <span className="absolute rounded bg-black px-2 pb-1 text-sm font-bold opacity-80">
            #{creature.id}
          </span>
        )}
      </div>
      <img className="absolute top-[3%] z-0 rounded-lg" src={backgroundImage} />
      <Traits bonus={creature.bonus} penalty={creature.penalty} />
      <div className="absolute bottom-[4%] z-20 flex h-[30%] w-full justify-center p-[5%]">
        <div className="grid h-full max-h-full w-full grid-cols-2 gap-2 p-2">
          <Badge
            image={power}
            value={creature.info.power}
            delta={calculateStatDelta(0)}
          />
          <Badge
            image={agility}
            value={creature.info.agility}
            delta={calculateStatDelta(1)}
          />
          <Badge
            image={guard}
            value={creature.info.guard}
            delta={calculateStatDelta(2)}
          />
          <Badge
            image={insight}
            value={creature.info.insight}
            delta={calculateStatDelta(3)}
          />
        </div>
      </div>
      <div className="absolute bottom-[3%] z-20 flex w-[10%] max-w-full justify-center gap-2">
        {new Array(creature.stage).fill(0).map((_, i) => (
          <img src={stage} key={`star-${i}`} />
        ))}
      </div>
      <div></div>
    </div>
  )
}
