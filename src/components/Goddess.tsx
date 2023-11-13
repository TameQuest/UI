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
    <div className="h-full w-full overflow-hidden max-h-full max-w-full">
      <img
        src={goddessMapping[id]}
        className="h-auto pointer-events-none w-full overflow-hidden"
      />
    </div>
  )
}

export default Goddess
