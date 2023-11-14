import React from 'react'
import badge from 'assets/images/front/badge.png'
import label from 'assets/images/ui/surfaces/label3.png'
import { classNames } from 'utils'

type BadgeProps = {
  image: string
  value: number
  delta: number
}

export const Badge: React.FC<BadgeProps> = ({ image, value, delta }) => {
  return (
    <div className="relative flex overflow-hidden rounded bg-opacity-60">
      <div className="relative flex min-w-max items-center justify-center">
        <img src={badge} className="absolute z-0 h-full" />
        <img src={image} className="z-10 h-full pb-[10%]" />
      </div>
      <div className="font-smooth text-stroke relative flex w-full select-none items-center justify-center space-x-1 rounded-lg p-1 font-bold">
        <img src={label} className="absolute z-0 w-full rounded-lg" />
        <div className="z-20 w-full space-x-1">
          <span className="z-20 text-[100%]">{value}</span>
          {delta !== 0 && (
            <span
              className={classNames(
                'z-20 text-[80%]',
                delta < 0 ? 'text-red-400' : 'text-green-400'
              )}
            >
              {delta < 0 ? '-' : '+'}
              {Math.abs(delta)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
