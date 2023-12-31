import algosdk from 'algosdk'
import { Contract, decodeAddress, decodeNumber } from './common'
import { StateKeyValue } from './types'

export type GauntletState = {
  manager: string
  beacon: number
  game: number
  id: number
  timestamp: number
  stage: number
  match: number
  drawRound: number
}

const GauntletStateKeys: Record<
  string,
  [keyof GauntletState, (kv: StateKeyValue) => any]
> = {
  mm: ['manager', decodeAddress],
  mr: ['beacon', decodeNumber],
  mg: ['game', decodeNumber],
  gi: ['id', decodeNumber],
  gt: ['timestamp', decodeNumber],
  gs: ['stage', decodeNumber],
  gm: ['match', decodeNumber],
  gd: ['drawRound', decodeNumber]
}

const defaultGauntletState: GauntletState = {
  manager: '',
  beacon: 0,
  game: 0,
  id: 0,
  timestamp: 0,
  stage: 0,
  match: 0,
  drawRound: 0
}

export default class GauntletContract extends Contract<GauntletState> {
  constructor(
    client: algosdk.Algodv2,
    applicationId: number,
    abi: algosdk.ABIContractParams,
    player: string,
    onGauntletStateUpdate?: (gauntletState: GauntletState) => void
  ) {
    super(client, applicationId, abi, player, onGauntletStateUpdate)

    this.stateKeys = GauntletStateKeys
    this.state = defaultGauntletState
  }
}
