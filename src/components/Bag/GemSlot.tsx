import React, { useState } from 'react'

import slot from 'assets/images/ui/other/slot.png'
import { classNames } from 'utils'

type GemSlotProps = {
  image: string
  amount: number
}

export const GemSlot: React.FC<GemSlotProps> = ({ image, amount }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="z-10 flex h-16 w-16 items-center justify-center">
        <img
          src={image}
          className={classNames(
            'pointer-events-none h-10',
            amount === 0 && 'grayscale opacity-50'
          )}
        />
      </div>
      <img src={slot} className="pointer-events-none absolute h-16 w-16" />
    </div>
  )
}
