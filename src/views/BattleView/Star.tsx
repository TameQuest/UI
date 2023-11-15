import React from 'react'
import { classNames } from 'utils'
import emptyStar from '../../assets/images/ui/other/start_empty.png'
import star from '../../assets/images/ui/other/star.png'

interface StarProps {
  className?: string
  filled?: boolean
}

const Star: React.FC<StarProps> = ({ className, filled }) => {
  return (
    <div
      className={classNames(
        'flex relative items-center w-16 justify-center text-white rounded p-3 pb-2',
        !filled && 'opacity-50'
      )}
    >
      <div
        className={classNames(
          'absolute z-20 flex items-center justify-center text-xl transition-all duration-100',
          !filled && 'opacity-25'
        )}
      >
        <img src={star} className="p-2" />
      </div>
      <img src={emptyStar} className="absolute z-10" />
    </div>
  )
}

export default Star
