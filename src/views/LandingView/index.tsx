import AccountName from 'components/AccountName'
import Button from 'components/Button'
import { useAccount } from 'providers/AccountProvider'
import { useStore } from 'providers/store'
import React, { useState } from 'react'
import { FaBolt, FaFeatherAlt, FaLightbulb, FaShieldAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const LandingView: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useStore()
  const { sdk, signTransactions, sendTransactions, playerBalance } =
    useAccount()

  const fund = async () => {
    const signedTxns = await signTransactions([
      await sdk.game.fund(state.account || '', 100000)
    ])
    sendTransactions(signedTxns[0], 'Funding account...', 'Account funded!')
  }

  return (
    <div className="text-center">
      <div className="flex flex-col items-center justify-center space-y-2 py-8">
        <div className="space-y-16 pb-8">
          <AccountName account={state.account} />
          <div>{playerBalance[0]}</div>
          <Button onClick={fund}>Sign</Button>
        </div>
      </div>
    </div>
  )
}
