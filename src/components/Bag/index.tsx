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
import { PlayerActivity, SummonedCreature } from 'providers/sdk/types'

const gemImages = [gem1, gem2, gem3, gem4, gem5]

export const Bag: React.FC = () => {
  const { state, dispatch } = useStore()
  const { player, signTransactions, sendTransactions, sdk } = useAccount()
  const [selectedSlot, setSelectedSlot] = useState<number | undefined>(0)
  const [selectedCreature, setSelectedCreature] = useState<
    SummonedCreature | undefined
  >()
  const [position, setPosition] = useState({
    x: 50,
    y: window.innerHeight - 650
  })

  const closeDialog = () => {
    dispatch(ActionTypes.UPDATE_DATA, { key: 'showBag', value: false })
  }

  const getFreeSlot = () => {
    return player.bag.findIndex((s) => s === 0)
  }

  const summon = async () => {
    const signedTransactions = await signTransactions([
      await sdk.game.PLAYER_summonCreature(selectedSlot || 0, false)
    ])
    sendTransactions(
      signedTransactions[0],
      'Summoning creature...',
      'Creature has been summoned!'
    )
  }

  const desummon = async () => {
    const signedTransactions = await signTransactions([
      await sdk.game.PLAYER_desummonCreature(getFreeSlot())
    ])
    sendTransactions(
      signedTransactions[0],
      'Desummoning creature...',
      'Creature has been put in your bag!'
    )
  }

  const selectCreature = (slot: number) => (creature: SummonedCreature) => {
    setSelectedSlot(slot)
    setSelectedCreature(creature)
  }

  const creatureSummoned = player.summonedCreature.info.power !== 0

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
                <CreatureCard
                  creature={selectedCreature || player.summonedCreature}
                />
                {(selectedCreature || creatureSummoned) && (
                  <div className="flex w-full justify-center space-x-4 pt-4">
                    <Button
                      disabled={
                        player.activity.type !== PlayerActivity.none ||
                        (selectedCreature && creatureSummoned)
                      }
                      onClick={selectedCreature ? summon : desummon}
                    >
                      {selectedCreature ? 'Summon' : 'Desummon'}
                    </Button>
                    {selectedCreature && (
                      <button
                        className=" transition-all hover:scale-95 active:scale-90"
                        onClick={() => {
                          setSelectedSlot(undefined)
                          setSelectedCreature(undefined)
                        }}
                      >
                        <img src={cross} className="h-8 w-8" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end justify-start space-y-2 p-4">
                <div className="grid grid-cols-4 gap-2 rounded-lg p-2">
                  {player.bag.map((slot, i) => (
                    <BagSlot
                      key={`slot-${i}`}
                      id={i}
                      asset={slot}
                      onSelect={selectCreature(i)}
                    />
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
