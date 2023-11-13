import React, { useState } from 'react'
import wood from '../../assets/images/ui/backgrounds/wood_horizontal.png'
import Button from 'components/Button'
import AccountName from 'components/AccountName'
import { useStore } from 'providers/store'
import { useAccount } from 'providers/AccountProvider'
import QRCode from 'react-qr-code'
import { FaBolt, FaCoins, FaEquals, FaExternalLinkAlt } from 'react-icons/fa'
import Input from 'components/Input'

export const FundAccountView: React.FC = () => {
  const { state } = useStore()
  const { playerBalance, sdk, signTransactions, sendTransactions } =
    useAccount()

  const [amount, setAmount] = useState('')

  const maxAmount = Math.max(0, (playerBalance[0] - 2000) / Math.pow(10, 6))

  const fundPlayer = async () => {
    const signedTransactions = await signTransactions([
      await sdk.game.fund(
        state.account || '',
        Number.parseFloat(amount) * Math.pow(10, 6)
      )
    ])
    setAmount('')
    sendTransactions(
      signedTransactions[0],
      'Funding account...',
      'Account funded!'
    )
  }

  return (
    <div className="relative flex items-center justify-center">
      <div className="z-10 flex items-center justify-around space-x-8 p-8">
        <div>
          <span className="flex flex-col items-center rounded-lg bg-black p-4">
            <QRCode
              value={state.account || ''}
              size={160}
              className="rounded-lg border-4 border-white"
            />
            <AccountName account={state.account} />
            <div>
              Balance: <b>{playerBalance[0] / Math.pow(10, 6)} ALGO</b>
            </div>
            <a
              href="https://bank.testnet.algorand.network/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-center space-x-1 rounded-lg bg-blue-600 bg-opacity-80 px-2 py-1"
            >
              <FaExternalLinkAlt className="inline" />
              <b>Open faucet</b>
            </a>
          </span>
        </div>
        <div>
          <div className="w-80 rounded-lg bg-black bg-opacity-60 p-2 text-center">
            <h1 className="text-xl font-bold">Fund your account</h1>
            <span className="font-bold opacity-80">
              {
                "TameQuest keeps track of your funds internally: you won't pay any network fees while playing."
              }
            </span>
            <div className="pt-2 font-bold">
              10 battles <FaEquals className="inline text-xs opacity-80" /> 10{' '}
              <FaBolt className="inline text-yellow-400" />{' '}
              <FaEquals className="inline text-xs opacity-80" /> 1 ALGO
            </div>
          </div>
          <div className="flex flex-col items-center space-y-8 pt-12">
            <div className="flex items-center space-x-2">
              <Input
                value={amount}
                onChange={setAmount}
                placeholder="How many ALGOs?"
                type="number"
                Icon={FaCoins}
              />
              <button
                onClick={() => setAmount(maxAmount.toString())}
                className="font-cinzel rounded bg-black px-2 py-1 font-mono font-bold transition-all hover:scale-95 active:scale-90"
              >
                max
              </button>
            </div>
            <Button
              onClick={fundPlayer}
              disabled={
                state.loading ||
                Number.isNaN(Number.parseFloat(amount)) ||
                Number.parseFloat(amount) > maxAmount ||
                maxAmount <= 0.002
              }
            >
              Fund account
            </Button>
          </div>
        </div>
      </div>
      <img src={wood} className="absolute z-0" />
    </div>
  )
}
