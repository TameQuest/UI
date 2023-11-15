import bonusBg from 'assets/images/front/bonus.png'
import penaltyBg from 'assets/images/front/penalty.png'
import power from 'assets/images/icons/power.png'
import agility from 'assets/images/icons/agility.png'
import guard from 'assets/images/icons/guard.png'
import insight from 'assets/images/icons/insight.png'
import { classNames } from 'utils'

type TraitsProps = {
  bonus: number
  penalty: number
}

const stats = [power, agility, guard, insight]
const bonusNames = ['Strong', 'Swift', 'Tough', 'Wise']
const penaltyNames = ['Weak', 'Slow', 'Fragile', 'Foolish']

type LabelProps = {
  name: string
  stat: number
  percentage: number
  positive?: boolean
}

const Label: React.FC<LabelProps> = ({ positive, name, stat, percentage }) => {
  return (
    <div className="relative flex aspect-[5/1] w-[50%] select-none items-center justify-center">
      <div className="z-10 flex h-full w-full items-center justify-between px-2 font-bold text-black">
        <span className="max-h-min rounded-lg px-2 text-[80%]">{name}</span>
        <div className="relative flex h-full w-full items-center justify-end">
          <span
            className={classNames(
              'max-h-min w-full text-right pr-[35%] rounded-lg px-2 text-[80%]',
              positive ? 'text-green-800' : 'text-red-800'
            )}
          >
            {positive ? '+' : '-'}
            {percentage}%
          </span>
          <img src={stats[stat]} className="absolute h-[90%] " />
        </div>
      </div>
      <img
        src={positive ? bonusBg : penaltyBg}
        className="absolute z-0 w-full"
      />
    </div>
  )
}

export const Traits: React.FC<TraitsProps> = ({ bonus, penalty }) => {
  const bonusStat = bonus % 5
  const penaltyStat = penalty % 5

  const bonusName = bonusStat !== 4 ? bonusNames[bonusStat] : ''
  const penaltyName = penaltyStat !== 4 ? penaltyNames[penaltyStat] : ''

  const bonusPercentage = Math.floor(bonus / 5)
  const penaltyPercentage = Math.floor(penalty / 5)

  return (
    <div className="absolute top-[5%] z-20 flex w-[80%] justify-center rounded-lg">
      {bonus > 4 && bonusStat !== 4 && (
        <Label
          stat={bonusStat}
          name={bonusName}
          percentage={bonusPercentage}
          positive
        />
      )}
      {penalty > 4 && penaltyStat !== 4 && (
        <Label
          stat={penaltyStat}
          name={penaltyName}
          percentage={penaltyPercentage}
        />
      )}
    </div>
  )
}
