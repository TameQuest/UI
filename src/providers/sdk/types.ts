export type StateKeyValue = {
  key: string
  value: {
    bytes: string
    type: number
    uint: number
  }
}

export type GauntletBox = number[]

export type BattleBoxKey = {
  tier: number
  creature: number
}

export type CreatureInfo = {
  difficulty: number
  tier: number
  background: number
  creature: number
  power: number
  agility: number
  guard: number
  insight: number
}

export type SummonedCreature = {
  info: CreatureInfo
  id: number
  stage: number
  battles: number
  points: number
  bonus: number
  penalty: number
  gauntlet: {
    id: number
    place: number
  }
}

export type PlayerActivity = {
  type: number
  drawRound: number
  primary: number
  secondary: number
}

export const CARD_SLOTS = 12

export const PlayerActivity = {
  none: 0,
  battle: 1,
  taming: 2,
  staging: 3,
  raffle: 4,
  societyChoice: 5
}

export type PlayerState = {
  society: number
  activity: PlayerActivity
  totalBattles: number
  funds: number
  gold: number
  donations: number
  summonedCreature: SummonedCreature
  battleCreature: CreatureInfo
  gems: number[]
  bag: number[]
}

export type CreatureBox = {
  owner: string
  gauntlet: number
  value: number
}
