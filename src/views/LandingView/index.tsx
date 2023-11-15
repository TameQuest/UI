import Button from 'components/Button'
import Goddess from 'components/Goddess'
import Input from 'components/Input'
import { useAccount } from 'providers/AccountProvider'
import React, { useState } from 'react'
import { FaCoins } from 'react-icons/fa'
import { formatAmount, getGoddessName } from 'utils'

export const LandingView: React.FC = () => {
  const { sdk, signTransactions, sendTransactions, player, game } = useAccount()

  const [amount, setAmount] = useState('5000')
  const realAmount = Number.parseFloat(amount) || 0

  const average = game.donations.reduce((a, b) => a + b, 0) / 4
  const goddessAveragePct =
    (100 * (game.donations[player.society] - average)) / (average || 1)

  const goddessName = getGoddessName(player.society)

  const donate = async () => {
    const signedTxns = await signTransactions([
      await sdk.game.PLAYER_donate(Math.floor(realAmount * Math.pow(10, 6)))
    ])
    sendTransactions(
      signedTxns[0],
      'Donating gold...',
      `${goddessName} smiles upon you.`
    )
  }

  return (
    <div className="flex w-full max-w-screen-xl items-start justify-between space-y-2 py-8">
      <div className="aspect-[8/5] h-full w-[70%] flex-col items-center justify-center rounded-lg p-4 text-center">
        <h1 className="font-fantasy z-10 text-4xl">Welcome to TameQuest!</h1>
        <div className="z-10 text-lg font-bold">
          Head to the battling grounds to send your creature on an adventure!
        </div>
        <div className="mx-auto max-w-md pt-8 opacity-30">
          TameQuest is currently in <b>ALPHA</b> stage and all game mechanics
          are subject to change. The game will continue to improve over time.
          Report any issues to{' '}
          <a
            href="https://discord.gg/fMqSB5vRX2"
            target="_blank"
            rel="noreferrer"
            className="font-bold !text-blue-400"
          >
            grzracz on Discord
          </a>
          .
        </div>
      </div>
      <div
        className="h-max space-y-8 rounded-lg bg-gray-900 bg-opacity-30 pb-8 opacity-80 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
        style={{ minWidth: 360 }}
      >
        <Goddess id={player.society} />
        <div className="flex flex-col items-center gap-8 p-4">
          <div className="text-center">
            <h1 className="font-fantasy text-3xl font-bold">
              Donate gold to {goddessName}
            </h1>
            <span>
              Donations can convince {goddessName} to act in your favor.
            </span>
          </div>
          <span className="text-center">
            You have <b>{formatAmount(player.gold)}</b> gold.
            <br />{' '}
            {player.donations > 0 && (
              <span>
                You have recently donated{' '}
                <b>{formatAmount(player.donations)}</b> gold.
                <br />
              </span>
            )}{' '}
            Lumina received{' '}
            <b>{formatAmount(game.donations[player.society])}</b> gold this
            period <br />(
            <b>
              {formatAmount(Math.abs(goddessAveragePct), 0, 0)}%{' '}
              {goddessAveragePct >= 0 ? 'higher' : 'lower'}
            </b>{' '}
            than average).
          </span>
          <Input
            value={amount}
            onChange={setAmount}
            Icon={FaCoins}
            type="number"
            placeholder="How much?"
          />
          <Button
            disabled={
              realAmount === 0 || player.gold / Math.pow(10, 6) < realAmount
            }
            onClick={donate}
          >
            Donate
          </Button>
        </div>
      </div>
    </div>
  )
}
