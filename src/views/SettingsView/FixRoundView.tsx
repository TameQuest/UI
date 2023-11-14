import Card from 'components/Card'
import React from 'react'
import wood from 'assets/images/ui/backgrounds/wood_vertical.png'
import Button from 'components/Button'
import { useAccount } from 'providers/AccountProvider'

export const FixRoundView: React.FC = () => {
  const { sdk, signTransactions, sendTransactions, player } = useAccount()

  const fixRound = async () => {
    const signed = await signTransactions([
      await sdk.game.PLAYER_prepareAction(
        player.activity.type,
        player.activity.primary,
        player.activity.secondary
      )
    ])
    sendTransactions(
      signed[0],
      'Asking for forgiveness...',
      'The goddess is merciful.'
    )
  }

  return (
    <div className="flex items-center justify-center">
      <Card background={wood}>
        <div className="z-10 w-80 p-4">
          <div className="rounded-lg bg-black bg-opacity-60 p-2 text-center">
            <h1 className="text-xl font-bold">Timed out</h1>
            <span className="font-bold opacity-80">
              Your last action was not finished. The goddess is no longer
              listening to your prayers.
            </span>
          </div>
          <div className="flex flex-col items-center space-y-8 pt-20">
            <Button onClick={fixRound}>Ask for forgiveness</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
