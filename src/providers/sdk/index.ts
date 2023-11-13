import algosdk from 'algosdk'
import GameContract, { GameState } from './GameContract'
import GauntletContract, { GauntletState } from './GauntletContract'
import * as GameABI from './ABI/TQGame.abi.json'
import * as GauntletABI from './ABI/TQGauntlet.abi.json'
import { PlayerState } from './types'

const DEFAULT_NODE_HOST = 'https://testnet-api.algonode.cloud'
const DEFAULT_NODE_PORT = 443
export const DEFAULT_GAME_APP_ID = 468475198
export const DEFAULT_GAUNTLET_APP_ID = 468342034

export type TameQuestSDKConfig = {
  client?: algosdk.Algodv2
  onPlayerStateUpdate?: (playerState: PlayerState) => void
  game?: number
  onGameStateUpdate?: (gameState: GameState) => void
  gauntlet?: number
  onGauntletStateUpdate?: (gauntletState: GauntletState) => void
}

export default class TameQuestSDK {
  player: string
  client: algosdk.Algodv2

  game: GameContract
  gauntlet: GauntletContract

  constructor(player: string, config: TameQuestSDKConfig = {}) {
    this.player = player
    this.client =
      config.client ||
      new algosdk.Algodv2('', DEFAULT_NODE_HOST, DEFAULT_NODE_PORT)

    this.game = new GameContract(
      this.client,
      config.game || DEFAULT_GAME_APP_ID,
      GameABI,
      player,
      config.onPlayerStateUpdate,
      config.onGameStateUpdate
    )
    this.gauntlet = new GauntletContract(
      this.client,
      config.gauntlet || DEFAULT_GAUNTLET_APP_ID,
      GauntletABI,
      player,
      config.onGauntletStateUpdate
    )
  }

  async playerExists(): Promise<boolean> {
    return new Promise((resolve, reject) =>
      this.client
        .getApplicationBoxByName(
          this.game.application,
          algosdk.decodeAddress(this.player).publicKey
        )
        .do()
        .then(() => {
          resolve(true)
        })
        .catch((e) => {
          if (e.status === 404) return resolve(false)
          else reject('Something went wrong while looking up player box.')
        })
    )
  }
}
