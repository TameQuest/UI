import algosdk from 'algosdk'
import {
  Contract,
  chunks,
  decodeAddress,
  decodeNumber,
  decodeNumberArray
} from './common'
import {
  CreatureInfo,
  PlayerActivity,
  PlayerState,
  StateKeyValue,
  SummonedCreature
} from './types'
import { LOGIC_SIG_ADDRESS } from '.'

export type GameState = {
  manager: string
  claimer: string
  helper: string
  lastClaimed: number
  beacon: number
  gauntlet: number
  raffleAsset: number
  raffleAmount: number
  goldAsset: number
  cardsReserves: number[]
  cardsLiquidity: number[]
  backgroundsAmount: number
  creaturesAmounts: number[]
  donations: number[]
  gauntletBonus: number
  totalFunds: number
  totalGold: number
  totalBattles: number
}

const GameStateKeys: Record<
  string,
  [keyof GameState, (kv: StateKeyValue) => any]
> = {
  mm: ['manager', decodeAddress],
  mc: ['claimer', decodeAddress],
  mh: ['helper', decodeAddress],
  mt: ['lastClaimed', decodeNumber],
  mr: ['beacon', decodeNumber],
  mg: ['gauntlet', decodeNumber],
  gg: ['goldAsset', decodeNumber],
  gr: ['cardsReserves', decodeNumberArray],
  gl: ['cardsLiquidity', decodeNumberArray],
  gd: ['donations', decodeNumberArray],
  gb: ['gauntletBonus', decodeNumber],
  gs: ['backgroundsAmount', decodeNumber],
  gc: ['creaturesAmounts', decodeNumberArray],
  rt: ['raffleAsset', decodeNumber],
  ra: ['raffleAmount', decodeNumber],
  tf: ['totalFunds', decodeNumber],
  tg: ['totalGold', decodeNumber],
  tb: ['totalBattles', decodeNumber]
}

const parseNumber = (
  boxValue: Uint8Array,
  index: number,
  length: number
): number => {
  return algosdk.decodeUint64(boxValue.subarray(index, index + length), 'safe')
}

const parseNumberArray = (
  boxValue: Uint8Array,
  index: number,
  length: number,
  size: number
): number[] => {
  return chunks(boxValue.subarray(index, index + length * size), size).map(
    (arr) => parseNumber(arr, 0, size)
  )
}

const parsePlayerActivity = (
  boxArray: Uint8Array,
  index: number
): PlayerActivity => {
  const memory = boxArray.subarray(index, index + 11)
  return {
    drawRound: parseNumber(memory, 0, 8),
    type: parseNumber(memory, 8, 1),
    primary: parseNumber(memory, 9, 1),
    secondary: parseNumber(memory, 10, 1)
  }
}

const parseCreatureInfo = (
  boxArray: Uint8Array,
  index: number
): CreatureInfo => {
  const memory = boxArray.subarray(index, index + 16)
  return {
    difficulty: parseNumber(memory, 0, 1),
    tier: parseNumber(memory, 1, 1),
    background: parseNumber(memory, 2, 1),
    creature: parseNumber(memory, 3, 1),
    power: parseNumber(memory, 4, 3),
    agility: parseNumber(memory, 7, 3),
    guard: parseNumber(memory, 10, 3),
    insight: parseNumber(memory, 13, 3)
  }
}

const createHelperTransaction = (
  suggestedParams: algosdk.SuggestedParams
): algosdk.Transaction => {
  return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: LOGIC_SIG_ADDRESS,
    to: LOGIC_SIG_ADDRESS,
    amount: 0,
    suggestedParams: {
      ...suggestedParams,
      flatFee: true,
      fee: 2000
    }
  })
}

const defaultGameState: GameState = {
  manager: '',
  claimer: '',
  helper: '',
  lastClaimed: 0,
  beacon: 0,
  gauntlet: 0,
  raffleAsset: 0,
  raffleAmount: 0,
  goldAsset: 0,
  cardsReserves: [0, 0, 0, 0, 0],
  cardsLiquidity: [0, 0, 0, 0, 0],
  backgroundsAmount: 0,
  creaturesAmounts: [0, 0, 0, 0, 0],
  donations: [0, 0, 0, 0],
  gauntletBonus: 0,
  totalFunds: 0,
  totalGold: 0,
  totalBattles: 0
}

const defaultPlayerState: PlayerState = {
  society: 0,
  activity: {
    type: 0,
    drawRound: 0,
    primary: 0,
    secondary: 0
  },
  totalBattles: 0,
  funds: 0,
  gold: 0,
  donations: 0,
  summonedCreature: {
    info: {
      difficulty: 0,
      tier: 0,
      background: 0,
      creature: 0,
      power: 0,
      agility: 0,
      guard: 0,
      insight: 0
    },
    id: 0,
    stage: 0,
    battles: 0,
    points: 0,
    bonus: 0,
    penalty: 0,
    gauntlet: {
      id: 0,
      place: 0
    }
  },
  battleCreature: {
    difficulty: 0,
    tier: 0,
    background: 0,
    creature: 0,
    power: 0,
    agility: 0,
    guard: 0,
    insight: 0
  },
  gems: [0, 0, 0, 0, 0],
  bag: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

export default class GameContract extends Contract<GameState> {
  playerState: PlayerState
  onPlayerStateUpdate?: (playerState: PlayerState) => void

  constructor(
    client: algosdk.Algodv2,
    applicationId: number,
    abi: algosdk.ABIContractParams,
    player: string,
    onPlayerStateUpdate?: (playerState: PlayerState) => void,
    onGameStateUpdate?: (gameState: GameState) => void
  ) {
    super(client, applicationId, abi, player, onGameStateUpdate)

    this.stateKeys = GameStateKeys
    this.state = defaultGameState
    this.playerState = defaultPlayerState
    this.onPlayerStateUpdate = onPlayerStateUpdate
  }

  parseCreatureMemory = (memory: Uint8Array): SummonedCreature => {
    return {
      info: parseCreatureInfo(memory, 0),
      id: parseNumber(memory, 16, 8),
      stage: parseNumber(memory, 24, 1),
      battles: parseNumber(memory, 25, 1),
      points: parseNumber(memory, 26, 1),
      bonus: parseNumber(memory, 27, 1),
      penalty: parseNumber(memory, 28, 1),
      gauntlet: {
        id: parseNumber(memory, 29, 2),
        place: parseNumber(memory, 31, 1)
      }
    }
  }

  parsePlayerMemory = (memory: Uint8Array): PlayerState => {
    return {
      activity: parsePlayerActivity(memory, 0),
      society: parseNumber(memory, 11, 1),
      totalBattles: parseNumber(memory, 12, 4),
      funds: parseNumber(memory, 16, 8),
      gold: parseNumber(memory, 24, 8),
      donations: parseNumber(memory, 32, 8),
      battleCreature: parseCreatureInfo(memory, 40),
      summonedCreature: this.parseCreatureMemory(memory.subarray(56, 56 + 32)),
      gems: parseNumberArray(memory, 88, 5, 2),
      bag: parseNumberArray(memory, 98, 12, 8)
    }
  }

  updatePlayerState = async () => {
    const box = await this.client
      .getApplicationBoxByName(
        this.application,
        algosdk.decodeAddress(this.player).publicKey
      )
      .do()
    const playerState = this.parsePlayerMemory(box.value)
    this.playerState = playerState
    if (this.onPlayerStateUpdate) this.onPlayerStateUpdate(playerState)
  }

  MANAGER_updateAdminData = async (
    manager: string,
    claimer: string,
    helper: string,
    beacon: number,
    gauntlet: number,
    backgrounds: number,
    creaturesT1: number,
    creaturesT2: number,
    creaturesT3: number,
    creaturesT4: number,
    creaturesT5: number
  ): Promise<algosdk.Transaction[]> => {
    return await this.makeMethodCall({
      method: this.abi.getMethodByName('MANAGER_updateAdminData'),
      methodArgs: [
        algosdk.decodeAddress(manager).publicKey,
        algosdk.decodeAddress(claimer).publicKey,
        algosdk.decodeAddress(helper).publicKey,
        beacon,
        gauntlet,
        backgrounds,
        creaturesT1,
        creaturesT2,
        creaturesT3,
        creaturesT4,
        creaturesT5
      ],
      suggestedParams: {
        ...(await this.getSuggestedParams()),
        flatFee: true,
        fee: 2000
      }
    })
  }

  CLAIMER_updateEarnings = async (
    raffleAsset: number,
    raffleAmount: number
  ): Promise<algosdk.Transaction[]> => {
    return await this.makeMethodCall({
      method: this.abi.getMethodByName('CLAIMER_updateEarnings'),
      methodArgs: [raffleAsset, raffleAmount],
      suggestedParams: {
        ...(await this.getSuggestedParams()),
        flatFee: true,
        fee: 3000
      }
    })
  }

  fund = async (
    address: string,
    amount: number
  ): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 1000
    }
    return [
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: this.player,
        to: this.address,
        amount: amount,
        suggestedParams
      }),
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('fund'),
        methodArgs: [algosdk.decodeAddress(address).publicKey],
        boxes: [
          {
            name: algosdk.decodeAddress(address).publicKey,
            appIndex: this.application
          }
        ],
        suggestedParams
      }))
    ]
  }

  PLAYER_donate = async (amount: number): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 0
    }
    return [
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('PLAYER_donate'),
        methodArgs: [amount],
        boxes: [
          {
            name: algosdk.decodeAddress(this.player).publicKey,
            appIndex: this.application
          }
        ],
        suggestedParams
      })),
      createHelperTransaction(suggestedParams)
    ]
  }

  // eGjvZw==
  PLAYER_prepareAction = async (
    type: number,
    primary: number,
    secondary: number
  ): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 0
    }
    return [
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('PLAYER_prepareAction'),
        methodArgs: [type, primary, secondary],
        boxes: [
          {
            name: algosdk.decodeAddress(this.player).publicKey,
            appIndex: this.application
          }
        ],
        suggestedParams
      })),
      createHelperTransaction(suggestedParams)
    ]
  }

  // YOZugQ==
  PLAYER_commenceAction = async (
    choice: number
  ): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 0
    }
    await this.updateState()
    const boxes = [
      {
        name: algosdk.decodeAddress(this.player).publicKey,
        appIndex: this.application
      }
    ]
    await this.updatePlayerState()
    if (this.playerState.activity.type === PlayerActivity.societyChoice) {
      boxes.push(
        {
          name: new Uint8Array([0]),
          appIndex: this.application
        },
        {
          name: new Uint8Array([0]),
          appIndex: this.application
        }
      )
    } else if (this.playerState.activity.type === PlayerActivity.taming) {
      boxes.push(
        {
          name: new Uint8Array([this.playerState.battleCreature.tier]),
          appIndex: this.application
        },
        {
          name: new Uint8Array([this.playerState.battleCreature.tier]),
          appIndex: this.application
        }
      )
    }
    return [
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('PLAYER_commenceAction'),
        methodArgs: [choice],
        boxes,
        appForeignApps: [this.state.beacon],
        suggestedParams
      })),
      createHelperTransaction(suggestedParams)
    ]
  }

  // nH/E4A==
  PLAYER_spendCreaturePoints = async (
    bonusPower: number,
    bonusAgility: number,
    bonusGuard: number,
    bonusInsight: number
  ): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 0
    }
    return [
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('PLAYER_spendCreaturePoints'),
        methodArgs: [bonusPower, bonusAgility, bonusGuard, bonusInsight],
        boxes: [
          {
            name: algosdk.decodeAddress(this.player).publicKey,
            appIndex: this.application
          }
        ],
        suggestedParams
      })),
      createHelperTransaction(suggestedParams)
    ]
  }

  PLAYER_summonCreature = async (
    slot: number,
    destroy: boolean
  ): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 0
    }
    await this.updatePlayerState()
    return [
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('PLAYER_summonCreature'),
        methodArgs: [slot, destroy],
        boxes: [
          {
            name: algosdk.decodeAddress(this.player).publicKey,
            appIndex: this.application
          }
        ],
        appForeignAssets: [this.playerState.bag[slot]],
        suggestedParams
      })),
      createHelperTransaction(suggestedParams)
    ]
  }

  PLAYER_desummonCreature = async (
    slot: number
  ): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 0
    }
    return [
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('PLAYER_desummonCreature'),
        methodArgs: [slot],
        boxes: [
          {
            name: algosdk.decodeAddress(this.player).publicKey,
            appIndex: this.application
          }
        ],
        suggestedParams
      })),
      createHelperTransaction(suggestedParams)
    ]
  }

  PLAYER_tradeGems = async (
    buy: boolean,
    tier: number,
    amount: number
  ): Promise<algosdk.Transaction[]> => {
    const suggestedParams = {
      ...(await this.getSuggestedParams()),
      flatFee: true,
      fee: 0
    }
    return [
      ...(await this.makeMethodCall({
        method: this.abi.getMethodByName('PLAYER_tradeGems'),
        methodArgs: [buy, tier, amount],
        boxes: [
          {
            name: algosdk.decodeAddress(this.player).publicKey,
            appIndex: this.application
          }
        ],
        suggestedParams
      })),
      createHelperTransaction(suggestedParams)
    ]
  }
}
