import React from 'react'
import wood from '../../assets/images/ui/backgrounds/wood_horizontal.png'

export const SettingsView: React.FC = () => {
  return (
    <div className="relative flex w-full max-w-screen-lg items-center justify-around">
      <div>settings</div>
      <img src={wood} className="absolute z-0" />
    </div>
  )
}
