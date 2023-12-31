import Button from 'components/Button'
import React, { useEffect, useState } from 'react'
import { FaVolumeMute, FaVolumeOff, FaVolumeUp } from 'react-icons/fa'
import useSound from 'use-sound'
import { classNames } from 'utils'
import paper from 'assets/images/ui/backgrounds/paper.png'

type GoddessColumnProps = {
  image: string
  name: string
  title: string
  selected?: string
  onSelect?: () => void
  onChoice?: () => void
  paragraphs: string[]
  sound: string
}

export const GoddessColumn: React.FC<GoddessColumnProps> = ({
  image,
  name,
  title,
  selected,
  onSelect,
  onChoice,
  paragraphs,
  sound
}) => {
  const audioTag = `audio_${name}`
  const audio = document.getElementById(audioTag)
  const [play, setPlay] = useState(false)
  const hide = selected !== undefined && selected !== name

  const togglePlay = () => {
    if (play) {
      setPlay(false)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      audio?.pause()
    } else {
      setPlay(true)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      audio?.play()
    }
  }

  useEffect(() => {
    if (!selected && play) {
      togglePlay()
    }
  }, [selected])

  return (
    <div
      className={classNames(
        'group/goddess flex flex-col h-full items-center transition-all hover:w-[133%]',
        selected === name
          ? ''
          : 'grayscale hover:grayscale-0 opacity-80 hover:opacity-100',
        hide ? 'w-0 pointer-events-none opacity-0' : 'w-full'
      )}
    >
      <audio id={audioTag} src={sound} loop />
      <img src={image} style={{ maxWidth: 500 }} />
      <div
        className={classNames(
          'text-center transition-all',
          selected === name ? '' : 'opacity-0 group-hover/goddess:opacity-100'
        )}
      >
        <h1 className="font-fantasy text-5xl">{name}</h1>
        <h2 className="font-fantasy text-2xl font-bold opacity-80 transition-all">
          {title}
        </h2>
      </div>
      {!selected && (
        <div className="pt-8 opacity-0 transition-all group-hover/goddess:opacity-100">
          <Button onClick={onSelect}>Learn more</Button>
        </div>
      )}
      {selected === name && (
        <div className="flex max-w-screen-md flex-col items-center justify-center gap-4 py-8 text-lg">
          <div className="flex items-center space-x-8 pb-8 text-4xl">
            <button className="hover:opacity-80" onClick={togglePlay}>
              {play ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
            <Button onClick={onChoice}>Choose {name}</Button>
          </div>
          {paragraphs.map((text, i) => (
            <p key={`p-${i}`} className="font-smooth indent-8">
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
