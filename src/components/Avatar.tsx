import { useMemo } from 'react'
import MersenneTwister from 'mersenne-twister'
import frame from '../assets/images/ui/decor/frame2.png'

const defaultColors = [
  '#bfb8b4',
  '#918d8d',
  '#636167',
  '#353540',
  '#a94949',
  '#ca5954',
  '#e56f4b',
  '#e39347',
  '#eeb551',
  '#e8c65b',
  '#bda351',
  '#8b9150',
  '#557d55',
  '#446350',
  '#3e554c',
  '#8bb0ad',
  '#769fa6',
  '#668da9',
  '#5c699f',
  '#5a5888',
  '#7c6da2',
  '#947a9d',
  '#bc87a5',
  '#d9a6a6',
  '#d4c2b6',
  '#bdaa97',
  '#86735b',
  '#7e674c',
  '#735b42',
  '#604b3d',
  '#4d3f38'
]

interface AvatarProps {
  seed: number
  className?: string
}

function Avatar({ seed, className }: AvatarProps) {
  const svgContent = useMemo(() => {
    const rand = new MersenneTwister(seed)
    const colors = defaultColors.slice()
    const genColor = () => {
      const idx = Math.floor(colors!.length * rand.random())
      return colors!.splice(idx, 1)[0]
    }
    const bgStr = `<rect fill="${genColor()}" width="100" height="100"/>`
    const style = `<style>circle{mix-blend-mode:soft-light;}</style>`
    let shapesStr = ''
    const layers = 3
    const rs = [35, 40, 45, 50, 55, 60]
    const cxs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const cys = [30, 40, 50, 60, 70]
    for (let i = 0; i < layers; i++) {
      const r = rs.splice(Math.floor(rs.length * rand.random()), 1)[0]
      const cx = cxs.splice(Math.floor(cxs.length * rand.random()), 1)[0]
      const cy = cys.splice(Math.floor(cys.length * rand.random()), 1)[0]
      const fill = genColor()
      shapesStr += `<circle r="${r}" cx="${cx}" cy="${cy}" fill="${fill}"/>`
    }
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="rounded-full" width="100%" viewBox="0 0 100 100">${style}${bgStr}${shapesStr}</svg>`
  }, [seed, className])

  return (
    <div className="relative z-10 flex items-center justify-center p-1">
      <img src={frame} className="absolute" />
      <div className="rounded-lg">
        <div
          key={`avatar-${seed}`}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    </div>
  )
}

export default Avatar
