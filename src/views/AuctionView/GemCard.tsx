import React from 'react'
import { useAccount } from 'providers/AccountProvider'

import gem1 from 'assets/images/gems/mini/1.png'
import gem2 from 'assets/images/gems/mini/2.png'
import gem3 from 'assets/images/gems/mini/3.png'
import gem4 from 'assets/images/gems/mini/4.png'
import gem5 from 'assets/images/gems/mini/5.png'
import paper from 'assets/images/ui/backgrounds/paper_horizontal.png'
import Card from 'components/Card'
import Button from 'components/Button'
import { formatAmount } from 'utils'

const gems = [gem1, gem2, gem3, gem4, gem5]

type GemCardProps = {
  tier: number
}

export const GemCard: React.FC<GemCardProps> = ({ tier }) => {
  const { game, player, signTransactions, sendTransactions, sdk } = useAccount()

  const buy = async () => {
    const signedTransactions = await signTransactions([
      await sdk.game.PLAYER_tradeGems(true, tier, 1)
    ])
    sendTransactions(
      signedTransactions[0],
      `Buying one tier ${tier + 1} soul stone...`,
      `One tier ${tier + 1} soul stone bought!`
    )
  }

  const sell = async () => {
    const signedTransactions = await signTransactions([
      await sdk.game.PLAYER_tradeGems(false, tier, 1)
    ])
    sendTransactions(
      signedTransactions[0],
      `Selling one tier ${tier + 1} soul stone...`,
      `One tier ${tier + 1} soul stone sold!`
    )
  }

  const assetReserve = game.cardsReserves[tier]
  const assetLiquidity = game.cardsLiquidity[tier]

  const buyPrice =
    Math.floor((assetReserve * assetLiquidity) / (assetReserve - 1)) -
    assetLiquidity
  const sellPrice = Math.floor(
    (99 *
      (assetLiquidity -
        Math.floor((assetReserve * assetLiquidity) / (assetReserve + 1)))) /
      100
  )

  return (
    <Card background={paper} className="mx-2 flex aspect-[3/2]">
      <div className="z-10 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-black bg-opacity-60 p-2">
          <img src={gems[tier]} className="w-[25%]" />
          <div>
            <div className="font-bold">
              Buy price: {formatAmount(buyPrice)} gold
            </div>
            <div className="font-bold">
              Sell price: {formatAmount(sellPrice)} gold
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 pt-8">
          <Button onClick={buy} disabled={player.gold < buyPrice}>
            Buy one
          </Button>
          <Button onClick={sell} disabled={player.gems[tier] === 0}>
            Sell one
          </Button>
        </div>
      </div>
    </Card>
  )
}
