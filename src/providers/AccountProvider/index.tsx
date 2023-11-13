import algosdk from 'algosdk'
import React, { createContext, useContext, useState, useEffect } from 'react'
import TameQuestSDK from '../sdk'
import { PlayerState } from 'providers/sdk/types'
import { GauntletState } from 'providers/sdk/GauntletContract'
import { GameState } from 'providers/sdk/GameContract'
import { ActionTypes, StateActions, useStore } from 'providers/store'
import toast from 'react-hot-toast'

type AccountContextType = {
  sdk: TameQuestSDK
  client: algosdk.Algodv2
  round?: number
  playerBalance: Record<number, number>
  playerExists?: boolean
  player: PlayerState
  game: GameState
  gauntlet: GauntletState
  signTransactions: (
    transactions: algosdk.Transaction[][]
  ) => Promise<{ txID: string; blob: Uint8Array }[][]>
  sendTransactions: (
    signedTransactions: { txID: string; blob: Uint8Array }[],
    loadingMessage: string,
    successMessage: string,
    callback?: () => void
  ) => Promise<void>
}

function getDefaultAccountContext(): AccountContextType {
  const sdk = new TameQuestSDK('')
  return {
    sdk,
    client: sdk.client,
    playerBalance: { 0: 0 },
    player: sdk.game.playerState,
    game: sdk.game.state,
    gauntlet: sdk.gauntlet.state,
    signTransactions: async () => {
      return []
    },
    sendTransactions: async () => {}
  }
}

const AccountContext = createContext<AccountContextType>(
  getDefaultAccountContext()
)

interface AccountProviderProps {
  children: React.ReactNode
}

export type SignTransactionModalData = {
  transactions: algosdk.Transaction[][]
  promptMessage: string
  successMessage: string
  loadingMessage: string
  callback: (signedTransactions: { txID: string; blob: Uint8Array }[][]) => void
}

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children
}) => {
  const { state, dispatch } = useStore()
  const [round, setRound] = useState<number>()
  const [sdk, setSdk] = useState<TameQuestSDK>(new TameQuestSDK(''))
  const [client, setClient] = useState<algosdk.Algodv2>(sdk.client)
  const [playerExists, setPlayerExists] = useState<boolean>()
  const [playerState, setPlayerState] = useState<PlayerState>(
    sdk.game.playerState
  )
  const [playerBalance, setPlayerBalance] = useState<Record<number, number>>({
    0: 0
  })
  const [gameState, setGameState] = useState<GameState>(sdk.game.state)
  const [gauntletState, setGauntletState] = useState<GauntletState>(
    sdk.gauntlet.state
  )

  function updatePlayerBalance(asset: number, amount: number) {
    setPlayerBalance({ ...playerBalance, [asset]: amount })
  }

  async function updateBalance(address: string) {
    client
      .accountInformation(address)
      .do()
      .then((account) => {
        updatePlayerBalance(
          0,
          Math.max(0, account.amount - account['min-balance'])
        )
        setRound(account['round'])
      })
      .catch(() => {
        updatePlayerBalance(0, 0)
      })
  }

  function update(_sdk: TameQuestSDK, address?: string) {
    if (address) {
      updateBalance(address)
    }
    _sdk.game.updatePlayerState().then(() => setPlayerExists(true))
    _sdk.game.updateState()
    _sdk.gauntlet.updateState()
  }

  function periodicalUpdates(
    _sdk: TameQuestSDK,
    address: string
  ): NodeJS.Timeout[] {
    update(_sdk, address)
    return [
      setInterval(() => updateBalance(address), 5000),
      setInterval(_sdk.game.updatePlayerState, 10000),
      setInterval(_sdk.game.updateState, 30000),
      setInterval(_sdk.gauntlet.updateState, 60000)
    ]
  }

  useEffect(() => {
    if (state.account) {
      const _sdk = new TameQuestSDK(state.account, {
        onPlayerStateUpdate: setPlayerState,
        onGameStateUpdate: setGameState,
        onGauntletStateUpdate: setGauntletState
      })
      const intervals = periodicalUpdates(_sdk, state.account)
      setSdk(_sdk)
      setClient(_sdk.client)
      _sdk
        .playerExists()
        .then((exists) => {
          setPlayerExists(exists)
          if (exists) _sdk.game.updatePlayerState()
        })
        .catch()
      _sdk.game.updateState()
      _sdk.gauntlet.updateState()
      return () => intervals.forEach(clearInterval)
    }
  }, [state.account])

  async function sendTransactions(
    signedTransactions: { txID: string; blob: Uint8Array }[],
    loadingMessage: string,
    successMessage: string,
    callback?: () => void
  ): Promise<void> {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        client
          .sendRawTransaction(signedTransactions.map((tx) => tx.blob))
          .do()
          .catch(reject)
          .then(() => {
            algosdk
              .waitForConfirmation(client, signedTransactions[0].txID, 30)
              .then(() => {
                if (callback) callback()
                update(sdk, state.account || '')
                resolve()
              })
              .catch(reject)
          })
      }),
      {
        success: successMessage,
        error: (e: any) => e.toString(),
        loading: loadingMessage
      }
    )
  }

  async function signTransactions(transactions: algosdk.Transaction[][]) {
    const signedGroups = []
    if (transactions.length > 0) {
      for (const group of transactions) {
        const signed = await StateActions.SIGN_TRANSACTIONS(group)
        signedGroups.push(signed)
      }
    }
    return signedGroups
  }

  return (
    <AccountContext.Provider
      value={{
        round,
        sdk,
        client,
        playerBalance,
        playerExists,
        player: playerState,
        game: gameState,
        gauntlet: gauntletState,
        signTransactions,
        sendTransactions
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider')
  }
  return context
}
