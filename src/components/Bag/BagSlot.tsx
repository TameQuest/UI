import React, { useState } from 'react'

import slot from 'assets/images/ui/other/slot.png'

type BagSlotProps = {
  id: number
  asset: number
}

export const BagSlot: React.FC<BagSlotProps> = ({ id, asset }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="h-16 w-16">t</div>
      <img src={slot} className="pointer-events-none absolute h-16 w-16" />
    </div>
  )
}
