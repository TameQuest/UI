import React, { FC } from 'react'
import { classNames } from '../utils'
import electra from '../assets/goddesses/electra.svg'
import lumina from '../assets/goddesses/lumina.svg'
import sonus from '../assets/goddesses/sonus.svg'
import chronis from '../assets/goddesses/chronis.svg'

interface GoddessProps {
  id: number
  animated?: boolean
}

const goddessMapping = [electra, lumina, sonus, chronis]

const Goddess: FC<GoddessProps> = ({ id, animated }) => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <img
        src={goddessMapping[id]}
        className="pointer-events-none h-auto w-full overflow-hidden"
      />
    </div>
  )
}

export default Goddess
