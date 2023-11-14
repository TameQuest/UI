import React, { useState } from 'react'
import Draggable from 'react-draggable'
import wood from 'assets/images/ui/backgrounds/bg.png'
import cross from 'assets/images/icons/cross.png'
import { ActionTypes, useStore } from 'providers/store'
import { useAccount } from 'providers/AccountProvider'
import { BagSlot } from './BagSlot'
import { GemSlot } from './GemSlot'

import gem1 from 'assets/images/gems/mini/1.png'
import gem2 from 'assets/images/gems/mini/2.png'
import gem3 from 'assets/images/gems/mini/3.png'
import gem4 from 'assets/images/gems/mini/4.png'
import gem5 from 'assets/images/gems/mini/5.png'

import paper from 'assets/images/ui/backgrounds/paper_vertical.png'
import coins from 'assets/images/gold/coins.png'
import Card from 'components/Card'
import Button from 'components/Button'
import { formatAmount } from 'utils'
import { CreatureCard } from 'components/CreatureCard'

const gemImages = [gem1, gem2, gem3, gem4, gem5]

export const Bag: React.FC = () => {
  const { state, dispatch } = useStore()
  const { player } = useAccount()
  const [position, setPosition] = useState({
    x: 50,
    y: window.innerHeight - 650
  })

  const closeDialog = () => {
    dispatch(ActionTypes.UPDATE_DATA, { key: 'showBag', value: false })
  }

  return (
    <div className="pointer-events-none absolute z-50 h-full w-full">
      {state.showBag && (
        <Draggable
          bounds="parent"
          onStop={(_, p) => setPosition({ x: p.x, y: p.y })}
          defaultPosition={position}
        >
          <div className="pointer-events-auto relative flex aspect-[7/5] max-w-max cursor-pointer items-center justify-center">
            <div className="z-10 flex items-start justify-between space-x-4 p-8">
              <div className="items-start justify-start">
                <CreatureCard creature={player.summonedCreature} />
                <div className="flex w-full justify-center pt-4">
                  <Button>Desummon</Button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-start space-y-2 p-4">
                <div className="grid grid-cols-4 gap-2 rounded-lg p-2">
                  {player.bag.map((slot, i) => (
                    <BagSlot key={`slot-${i}`} id={i} asset={slot} />
                  ))}
                </div>
                <div className="grid w-full grid-cols-5 gap-2 rounded-lg p-2">
                  {player.gems.map((amount, i) => (
                    <GemSlot
                      key={`gem-${i}`}
                      image={gemImages[i]}
                      amount={amount}
                    />
                  ))}
                </div>
                <div
                  className="flex items-center space-x-2 rounded-lg bg-black bg-opacity-50 p-2"
                  style={{ minWidth: 160 }}
                >
                  <img src={coins} className="h-8 w-8" />
                  <div className="flex w-full justify-end font-bold">
                    {formatAmount(player.gold)}
                  </div>
                </div>
              </div>
            </div>
            <img
              src={wood}
              className="pointer-events-none absolute z-0 rounded-lg"
            />
            <img
              src={cross}
              onClick={closeDialog}
              className="pointer-events-auto absolute z-10 cursor-pointer transition-all hover:scale-95 active:scale-90"
              style={{ width: 48, top: -8, right: -16 }}
            />
          </div>
        </Draggable>
      )}
    </div>
  )
}
