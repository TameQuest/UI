import { useAccount } from 'providers/AccountProvider'
import React, { useEffect, useMemo, useState } from 'react'
import { classNames, formatAmount, getBackgroundImage } from 'utils'

import wood from 'assets/images/ui/backgrounds/wood_horizontal.png'
import ArrowButton from 'components/ArrowButton'
import Star from './Star'
import Button from 'components/Button'
import {
  CreatureInfo,
  PlayerActivity,
  PlayerState,
  SummonedCreature
} from 'providers/sdk/types'
import algosdk from 'algosdk'
import Card from 'components/Card'

import power from 'assets/images/icons/power.png'
import agility from 'assets/images/icons/agility.png'
import guard from 'assets/images/icons/guard.png'
import insight from 'assets/images/icons/insight.png'
import { CreatureCard } from 'components/CreatureCard'
import { useNavigate, useParams } from 'react-router-dom'
import { GameState } from 'providers/sdk/GameContract'

import gem1 from 'assets/images/gems/mini/1.png'
import gem2 from 'assets/images/gems/mini/2.png'
import gem3 from 'assets/images/gems/mini/3.png'
import gem4 from 'assets/images/gems/mini/4.png'
import gem5 from 'assets/images/gems/mini/5.png'

const gems = [gem1, gem2, gem3, gem4, gem5]

const resolveStrikes = (
  strikes: number,
  attackerPower: number,
  attackerAgility: number,
  attackerInsight: number,
  defenderGuard: number,
  defenderInsight: number
): number => {
  if (defenderInsight > attackerInsight) {
    return Math.floor(
      (attackerPower * attackerAgility * strikes) /
        ((127 + 8 * (defenderInsight - attackerInsight)) * defenderGuard)
    )
  }
  const insightBonus = 8 * (attackerInsight - defenderInsight)
  return Math.floor(
    (attackerPower * attackerAgility * strikes) /
      ((insightBonus >= 126 ? 1 : 127 - insightBonus) * defenderGuard)
  )
}

const boostCreature = (baseCreature: SummonedCreature): SummonedCreature => {
  const creature = { ...baseCreature, info: { ...baseCreature.info } }
  const attackerBonus = creature.bonus
  const attackerBonusStat = attackerBonus % 5
  const statKeys = [
    'power',
    'agility',
    'guard',
    'insight'
  ] as (keyof CreatureInfo)[]
  if (attackerBonusStat !== 4) {
    creature.info[statKeys[attackerBonusStat]] = Math.floor(
      ((100 + Math.floor(attackerBonus / 5)) *
        creature.info[statKeys[attackerBonusStat]]) /
        100
    )
  }
  const attackerPenalty = creature.penalty
  const attackerPenaltyStat = attackerPenalty % 5
  if (attackerPenaltyStat !== 4) {
    creature.info[statKeys[attackerPenaltyStat]] = Math.floor(
      ((100 - Math.floor(attackerPenalty / 5)) *
        creature.info[statKeys[attackerPenaltyStat]]) /
        100
    )
  }
  return creature
}

const resolveBattle = (
  randomNumbers: number[],
  _attacker: SummonedCreature,
  _defender: SummonedCreature,
  defenderMultiplier: number
): [number[], number[], number, number] => {
  const attacker = boostCreature(_attacker)
  const defender = boostCreature(_defender)

  const attackerPower = attacker.info.power
  const attackerAgility = attacker.info.agility
  const attackerGuard = attacker.info.guard
  const attackerInsight = attacker.info.insight

  const defenderPower = defenderMultiplier * defender.info.power
  const defenderAgility = defenderMultiplier * defender.info.agility
  const defenderGuard = defenderMultiplier * defender.info.guard
  const defenderInsight = defenderMultiplier * defender.info.insight

  const attackerStrikes = [
    randomNumbers[25],
    randomNumbers[23],
    randomNumbers[21],
    randomNumbers[19],
    randomNumbers[17]
  ]

  const defenderStrikes = [
    randomNumbers[24],
    randomNumbers[22],
    randomNumbers[20],
    randomNumbers[18],
    randomNumbers[16]
  ]

  if (attackerAgility > defenderAgility) {
    attackerStrikes.push(randomNumbers[15])
  } else if (defenderAgility > attackerAgility) {
    defenderStrikes.push(randomNumbers[15])
  }

  return [
    attackerStrikes,
    defenderStrikes,
    resolveStrikes(
      attackerStrikes.reduce((a, b) => a + b, 0),
      attackerPower,
      attackerAgility,
      attackerInsight,
      defenderGuard,
      defenderInsight
    ),
    resolveStrikes(
      defenderStrikes.reduce((a, b) => a + b, 0),
      defenderPower,
      defenderAgility,
      defenderInsight,
      attackerGuard,
      attackerInsight
    )
  ]
}

const extract_uint16 = (numbers: number[], index: number) => {
  return algosdk.decodeUint64(
    Uint8Array.from([numbers[index], numbers[index + 1]]),
    'safe'
  )
}

const getRandomNumbers = () => {
  const numbers: number[] = [0, 0]
  for (let i = 0; i < 32; ++i) {
    numbers.push(Math.floor(Math.random() * 1000000000) % 256)
  }
  return numbers
}

const closestValue = (divider: number, value: number): number => {
  const values = [6554, 16384, 29491, 45875, 65536]
  for (let i = 0; i < 5; i = i + 1) {
    if (value < values[i] / divider) return 4 - i
  }
  return 0
}

const getBattle = (
  game: GameState,
  randomNumbers: number[],
  difficulty: number,
  creature: SummonedCreature
): [SummonedCreature, number[], number[], number, number] => {
  const enemyTier = closestValue(
    1,
    Math.floor(((10 - difficulty) * extract_uint16(randomNumbers, 32)) / 10)
  )
  const tierBattles = (creature.info.tier + 1) * 10
  const battleScaling = tierBattles - creature.battles
  const enemyBase =
    (1 + difficulty) * 10 + Math.floor(((difficulty + 1) * battleScaling) / 4)
  const trueBase = Math.floor(((60 + enemyTier * 10) * enemyBase) / 100)
  const trueVariance = Math.floor((40 * enemyBase) / 100)

  const enemyCreature: SummonedCreature = {
    info: {
      difficulty,
      tier: enemyTier,
      background: randomNumbers[31] % game.backgroundsAmount,
      creature: randomNumbers[30] % game.creaturesAmounts[enemyTier],
      power: trueBase + Math.floor((trueVariance * randomNumbers[29]) / 255),
      agility: trueBase + Math.floor((trueVariance * randomNumbers[28]) / 255),
      guard: trueBase + Math.floor((trueVariance * randomNumbers[27]) / 255),
      insight: trueBase + Math.floor((trueVariance * randomNumbers[26]) / 255)
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
  }

  return [
    enemyCreature,
    ...resolveBattle(randomNumbers, creature, enemyCreature, 1)
  ]
}

const getRandomBattleOutcome = (
  game: GameState,
  difficulty: number,
  creature: SummonedCreature
) => {
  const randomNumbers = getRandomNumbers()
  const [
    enemyCreature,
    attackerStrikes,
    defenderStrikes,
    attackerDamage,
    defenderDamage
  ] = getBattle(game, randomNumbers, difficulty, creature)
  return attackerDamage > defenderDamage
}

const calculateWinChance = (
  game: GameState,
  difficulty: number,
  creature: SummonedCreature
) => {
  let won = 0
  const total = 50000
  for (let i = 0; i < total; i += 1) {
    if (getRandomBattleOutcome(game, difficulty, creature)) won += 1
  }
  return (100 * won) / total
}

type BattleData = {
  player: PlayerState
  enemyCreature: SummonedCreature
  allyStrikes: number[]
  enemyStrikes: number[]
  gold: number
  gemTier: number
  gemAmount: number
  allyDamage: number
  enemyDamage: number
}

type TamingData = {
  player: PlayerState
  successful: boolean
  creature: SummonedCreature
}

export const BattleView: React.FC = () => {
  const navigate = useNavigate()
  const { tx } = useParams()
  const { player, signTransactions, sendTransactions, sdk, game, round } =
    useAccount()
  const [difficulty, setDifficulty] = useState(0)
  const [pointSpec, setPointSpec] = useState([0, 0, 0, 0])
  const [battleData, setBattleData] = useState<BattleData | undefined>()
  const [tamingData, setTamingData] = useState<TamingData | undefined>()
  const [txId, setTxId] = useState(tx)

  const boostRoll = (player: PlayerState, roll: number) => {
    let playerDonations = player.donations
    let boosts = Math.floor(playerDonations / 25000_000000)
    if (boosts > 10) {
      boosts = 10
    }
    playerDonations = playerDonations - 25000_000000 * boosts
    return Math.floor(((20 - boosts) * roll) / 20)
  }

  console.log(tamingData)

  const getBattleData = (tx: any): void => {
    const playerMemory = sdk.game.parsePlayerMemory(tx['logs'][0])
    const randomNumbers: number[] = Array.from(
      tx['inner-txns'][0]['logs'][0]
    ).slice(4) as number[]

    if (playerMemory.activity.type === PlayerActivity.battle) {
      const trueAllyDamage = algosdk.decodeUint64(tx['logs'][1], 'safe')
      const trueEnemyDamage = algosdk.decodeUint64(tx['logs'][2], 'safe')

      const [
        enemyCreature,
        attackerStrikes,
        defenderStrikes,
        attackerDamage,
        defenderDamage
      ] = getBattle(
        game,
        randomNumbers,
        playerMemory.activity.primary,
        playerMemory.summonedCreature
      )

      let gold = 500 + (extract_uint16(randomNumbers, 13) % 1000)
      const gemRoll = extract_uint16(randomNumbers, 11)
      let gemAmount = 0

      if (attackerDamage > defenderDamage) {
        gold += 500 * (difficulty + 1)
        if (gemRoll < Math.floor(65536 / 5)) {
          gemAmount = 1
        }
      }

      setBattleData({
        player: playerMemory,
        enemyCreature: enemyCreature,
        allyStrikes: attackerStrikes,
        enemyStrikes: defenderStrikes,
        gold,
        gemTier: closestValue(5, gemRoll),
        gemAmount,
        allyDamage: attackerDamage,
        enemyDamage: defenderDamage
      })
      setTamingData(undefined)
    } else if (playerMemory.activity.type === PlayerActivity.taming) {
      const battleCreature = playerMemory.battleCreature
      const battleTier = battleCreature.tier
      const roll = boostRoll(playerMemory, extract_uint16(randomNumbers, 32))
      const successful = roll < 52428 / 2 ** battleTier
      let bonus = randomNumbers[31] + battleTier * 50
      if (bonus > 254) {
        bonus = 250 + (bonus % 5)
      }
      let penalty = randomNumbers[30] + battleTier * 50
      if (penalty > 254) {
        penalty = 250 + (penalty % 5)
      }
      penalty = 254 - penalty
      if (bonus % 5 === penalty % 5 && penalty > 0) {
        penalty = penalty - 1
      }
      setTamingData({
        player: playerMemory,
        successful,
        creature: {
          info: battleCreature,
          id: 0,
          stage: 1,
          battles: (battleTier + 1) * 10,
          points: 0,
          bonus,
          penalty,
          gauntlet: {
            id: 0,
            place: 0
          }
        }
      })
      setBattleData(undefined)
    }
  }

  const fetchBattleData = (tx: string) => {
    sdk.client
      .pendingTransactionInformation(tx)
      .do()
      .then((data) => {
        try {
          getBattleData(data)
        } catch {
          setTimeout(fetchBattleData, 1000)
        }
      })
  }

  useEffect(() => {
    if (txId && game.backgroundsAmount) {
      fetchBattleData(txId)
    } else {
      setBattleData(undefined)
    }
  }, [txId, game.backgroundsAmount])

  const resolve = async () => {
    const signedTxn = await signTransactions([
      await sdk.game.PLAYER_commenceAction(0)
    ])
    sendTransactions(
      signedTxn[0],
      '',
      '',
      (tx) => {
        setTxId(tx)
        navigate(`/battle/${tx}`)
      },
      () => {},
      true
    )
  }

  useEffect(() => {
    if (
      [PlayerActivity.battle, PlayerActivity.taming].includes(
        player.activity.type
      )
    ) {
      resolve()
    }
  }, [round])

  const isOnAdventure = player.activity.type === PlayerActivity.battle
  const isTaming = player.activity.type === PlayerActivity.taming

  const displayCreatureInfo: SummonedCreature | undefined = isTaming
    ? {
        info: player.battleCreature,
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
      }
    : battleData?.enemyCreature

  const allyCreature =
    battleData?.player.summonedCreature || player.summonedCreature

  const stats = [
    allyCreature.info.power + pointSpec[0],
    allyCreature.info.agility + pointSpec[1],
    allyCreature.info.guard + pointSpec[2],
    allyCreature.info.insight + pointSpec[3]
  ]

  const summonedCreature = {
    ...allyCreature,
    points: allyCreature.points - pointSpec.reduce((a, b) => a + b, 0),
    info: {
      ...allyCreature.info,
      power: stats[0],
      agility: stats[1],
      guard: stats[2],
      insight: stats[3]
    }
  }

  const [creaturesMin, creaturesMax, creaturePoints, goldMin, goldMax, chance] =
    useMemo(() => {
      const tierBattles = (summonedCreature.info.tier + 1) * 10
      const battleScaling = tierBattles - summonedCreature.battles
      const enemyBase =
        (1 + difficulty) * 10 + ((difficulty + 1) * battleScaling) / 4
      const minBase = Math.floor((60 * enemyBase) / 100)
      const maxBase = Math.floor(((60 + 4 * 10) * enemyBase) / 100)
      const trueVariance = Math.floor((40 * enemyBase) / 100)
      const goldMin = 500 + (difficulty + 1) * 500
      const goldVariance = 1000
      return [
        minBase,
        maxBase + trueVariance,
        difficulty + 2,
        goldMin,
        goldMin + goldVariance,
        calculateWinChance(game, difficulty, summonedCreature)
      ]
    }, [difficulty, pointSpec])

  const spendPoint = (stat: number, amount: number) => {
    const newPointSpec = [...pointSpec]
    newPointSpec[stat] += amount
    setPointSpec(newPointSpec)
  }

  const tame = async () => {
    const signedTxn = await signTransactions([
      await sdk.game.PLAYER_prepareAction(
        PlayerActivity.taming,
        player.bag.findIndex((s) => s === 0),
        0
      )
    ])
    sendTransactions(
      signedTxn[0],
      'Taming attempt starting...',
      'Creature is being tamed!'
    )
  }

  const startAdventure = async () => {
    if (player.summonedCreature.points > 0) {
      const creatureUpgradeTxn = await signTransactions([
        await sdk.game.PLAYER_spendCreaturePoints(
          pointSpec[0],
          pointSpec[1],
          pointSpec[2],
          pointSpec[3]
        )
      ])
      sendTransactions(
        creatureUpgradeTxn[0],
        'Training creature...',
        'Creature improved!',
        () => setPointSpec([0, 0, 0, 0])
      )
    }

    const signedTxn = await signTransactions([
      await sdk.game.PLAYER_prepareAction(PlayerActivity.battle, difficulty, 0)
    ])
    sendTransactions(
      signedTxn[0],
      'Adventure is starting...',
      'Adventure begins!'
    )
  }

  return (
    <div className="grid w-full max-w-screen-2xl grid-cols-12 gap-2 py-8">
      <div className="col-span-5 flex flex-col items-center justify-start gap-8">
        <CreatureCard creature={summonedCreature} />
        {!txId &&
          (summonedCreature.battles > 0 ||
            player.summonedCreature.points > 0) && (
            <Card background={wood}>
              <div className="z-10 rounded-lg bg-black bg-opacity-60 p-4 font-bold">
                {player.summonedCreature.battles > 0 && (
                  <div>Battles until mature: {summonedCreature.battles}</div>
                )}
                <div>Unspent points: {summonedCreature.points}</div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ArrowButton
                      disabled={summonedCreature.points === 0}
                      className="w-6 rotate-90 -scale-x-100"
                      onClick={() => spendPoint(0, 1)}
                    />
                    <img src={power} className="w-10" />
                    <ArrowButton
                      disabled={pointSpec[0] === 0}
                      className="w-6 rotate-90"
                      onClick={() => spendPoint(0, -1)}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ArrowButton
                      disabled={summonedCreature.points === 0}
                      className="w-6 rotate-90 -scale-x-100"
                      onClick={() => spendPoint(1, 1)}
                    />
                    <img src={agility} className="w-10" />
                    <ArrowButton
                      className="w-6 rotate-90"
                      disabled={pointSpec[1] === 0}
                      onClick={() => spendPoint(1, -1)}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ArrowButton
                      disabled={summonedCreature.points === 0}
                      className="w-6 rotate-90 -scale-x-100"
                      onClick={() => spendPoint(2, 1)}
                    />
                    <img src={guard} className="w-10" />
                    <ArrowButton
                      className="w-6 rotate-90"
                      disabled={pointSpec[2] === 0}
                      onClick={() => spendPoint(2, -1)}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ArrowButton
                      disabled={summonedCreature.points === 0}
                      className="w-6 rotate-90 -scale-x-100"
                      onClick={() => spendPoint(3, 1)}
                    />
                    <img src={insight} className="w-10" />
                    <ArrowButton
                      className="w-6 rotate-90"
                      disabled={pointSpec[3] === 0}
                      onClick={() => spendPoint(3, -1)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
      </div>
      <div className="col-span-2 p-2">
        <h1 className="font-fantasy text-center text-6xl font-bold !text-yellow-300">
          vs
        </h1>
        {battleData && (
          <div className="flex flex-col items-center">
            <div className="font-bold">
              Enemy took {battleData.allyDamage} damage.
            </div>
            <div className="font-bold">
              Ally took {battleData.enemyDamage} damage.
            </div>
            <div className="py-2 text-xl font-bold">
              {battleData.allyDamage > battleData.enemyDamage
                ? 'Victory!'
                : 'Defeat.'}
            </div>
            <div className="font-bold">You got {battleData.gold} gold!</div>
            {battleData.gemAmount > 0 && (
              <div className="font-bold">
                You found a{' '}
                <img className="inline w-8" src={gems[battleData.gemTier]} />{' '}
                soul stone!
              </div>
            )}
            <div></div>
          </div>
        )}
        {player.activity.type === PlayerActivity.none &&
          (battleData || tamingData) && (
            <div className="flex flex-col items-center">
              <Button
                className="pt-12"
                onClick={() => {
                  navigate('/battle')
                  setTxId(undefined)
                  setTamingData(undefined)
                  setBattleData(undefined)
                }}
              >
                Return
              </Button>
            </div>
          )}
      </div>
      <div className="relative col-span-5 h-full">
        {!battleData && !isTaming && (
          <img
            className="absolute rounded-lg opacity-20"
            src={getBackgroundImage(0)}
          />
        )}
        {isTaming ? (
          <div className="flex h-full flex-col items-center justify-start space-y-8">
            <CreatureCard
              creature={displayCreatureInfo || player.summonedCreature}
              enemy
            />
            <div className="animate-pulse opacity-80">
              Creature is being tamed...
            </div>
          </div>
        ) : txId ? (
          battleData ? (
            <div className="flex h-full flex-col items-center justify-start space-y-8">
              <CreatureCard creature={battleData.enemyCreature} enemy />
              {battleData.allyDamage > battleData.enemyDamage && (
                <div>
                  <Button
                    disabled={
                      player.gems[battleData.enemyCreature.info.tier] === 0
                    }
                    onClick={tame}
                  >
                    Tame
                  </Button>
                  <div className="pt-8 text-center opacity-80">
                    Taming chance:{' '}
                    {formatAmount(
                      (100 * 52428) /
                        2 ** battleData.enemyCreature.info.tier /
                        65535,
                      0
                    )}
                    %
                  </div>
                  {player.gems[battleData.enemyCreature.info.tier] === 0 && (
                    <div className="pt-8 text-center opacity-80">
                      You need a{' '}
                      <img
                        src={gems[battleData.enemyCreature.info.tier]}
                        className="inline w-8"
                      />{' '}
                      soul stone!
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : tamingData ? (
            <div
              className={classNames(
                'flex h-full flex-col items-center justify-start space-y-8',
                tamingData.successful ? '' : 'grayscale'
              )}
            >
              <CreatureCard creature={tamingData.creature} />{' '}
              <div>
                {tamingData.successful
                  ? 'Taming successful! Creature added to your bag.'
                  : 'Taming failed.'}
              </div>
            </div>
          ) : (
            <div className="flex h-full animate-pulse items-center justify-center text-lg opacity-80">
              Loading adventure report...
            </div>
          )
        ) : isOnAdventure ? (
          <div className="flex h-full animate-pulse items-center justify-center text-lg opacity-80">
            Searching for opponent...
          </div>
        ) : (
          <div className="absolute flex h-[75%] w-full flex-col items-center justify-center">
            <div className="flex h-[50%] flex-col items-center justify-center">
              <div className="absolute z-10 min-w-max rounded-lg bg-black bg-opacity-60 p-4 font-bold">
                <div>
                  Creature strength: {creaturesMin} - {creaturesMax}
                </div>
                <div>Win chance: ~{formatAmount(chance, 0)}%</div>
                <div className="flex gap-8">
                  <div>
                    <div className="pt-1 text-lg">Victory rewards:</div>
                    <div>Skill points: {creaturePoints}</div>
                    <div>
                      Gold: {goldMin} - {goldMax}
                    </div>
                  </div>
                  <div>
                    <div className="pt-1 text-lg">Defeat rewards:</div>
                    <div>Skill points: 1</div>
                    <div>Gold: 500 - 1500</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowButton
                className="-scale-x-100 transform"
                onClick={() => setDifficulty(Math.max(difficulty - 1, 0))}
              />
              <div className="flex items-center space-x-1">
                <Star filled={difficulty >= 0} />
                <Star filled={difficulty >= 1} />
                <Star filled={difficulty >= 2} />
                <Star filled={difficulty >= 3} />
                <Star filled={difficulty >= 4} />
              </div>
              <ArrowButton
                onClick={() => setDifficulty(Math.min(difficulty + 1, 4))}
              />
            </div>
            <div className="pt-16">
              <Button
                disabled={
                  summonedCreature.info.power === 0 ||
                  summonedCreature.points !== 0
                }
                onClick={startAdventure}
              >
                Start adventure
              </Button>
            </div>
            {summonedCreature.points !== 0 && (
              <div className="pt-8 opacity-80">
                Spend your creature points first!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
