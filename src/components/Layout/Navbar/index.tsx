import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'components/Avatar'
import SettingsButton from './SettingsButton'
import banner from '../../../assets/images/ui/decor/banner3.png'
import IconButton from 'components/IconButton'
import home from '../../../assets/images/icons/home.png'
import battle from '../../../assets/images/icons/battle.png'
import staging from '../../../assets/images/icons/stage.png'
import auctions from '../../../assets/images/icons/auctions.png'
import raffle from '../../../assets/images/icons/raffle.png'
import gauntlet from '../../../assets/images/icons/gauntlet.png'
import { FaLock } from 'react-icons/fa'
import { useStore, StateActions, ActionTypes } from 'providers/store'
import { weakHash } from 'utils'
import { useAccount } from 'providers/AccountProvider'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useStore()
  const { playerExists, player } = useAccount()
  const signOut = () => {
    StateActions.SIGN_OUT(dispatch)
  }

  const validPlayer = playerExists && player.society !== 4

  const toggleBag = () => {
    dispatch(ActionTypes.UPDATE_DATA, { key: 'showBag', value: !state.showBag })
  }

  return (
    <nav className="pointer-events-none z-30 p-2 transition-all md:p-4">
      <div className="container mx-auto flex items-start justify-between space-x-4 px-2 py-4 md:px-4">
        <div className="flex h-20 items-start space-x-2">
          <Link to="/" className="pointer-events-auto">
            <span className="font-fantasy text-4xl font-bold">TameQuest</span>
          </Link>
          <span className="rounded-lg bg-yellow-400 px-2 py-1 font-bold text-black">
            TestNet
          </span>
        </div>
        {validPlayer && (
          <div className="pointer-events-auto flex space-x-8">
            <IconButton
              className="h-20 w-20"
              icon={home}
              onClick={() => navigate('/')}
              selected={location.pathname === '/'}
            />
            <IconButton
              className="h-20 w-20"
              icon={battle}
              onClick={() => navigate('/battle')}
              selected={location.pathname === '/battle'}
            />
            <IconButton
              className="h-20 w-20"
              icon={staging}
              onClick={() => navigate('/staging')}
              selected={location.pathname === '/staging'}
            />
            <IconButton
              className="h-20 w-20"
              icon={auctions}
              onClick={() => navigate('/auctions')}
              selected={location.pathname === '/auctions'}
            />
            <IconButton
              className="h-20 w-20"
              icon={raffle}
              onClick={() => navigate('/raffle')}
              selected={location.pathname === '/raffle'}
            />
            <IconButton
              className="h-20 w-20"
              icon={gauntlet}
              onClick={() => navigate('/gauntlet')}
              selected={location.pathname === '/gauntlet'}
            />
          </div>
        )}
        <div className="pointer-events-auto top-4 flex items-start space-x-4">
          <IconButton className="h-16 w-16" onClick={signOut}>
            <FaLock className="text-black opacity-60" />
          </IconButton>
          {validPlayer && state.account && (
            <>
              <div className="w-24 py-4">
                <SettingsButton onClick={() => navigate('/settings')} />
              </div>
              <button
                onClick={toggleBag}
                className="relative w-20 cursor-pointer transition-all hover:scale-95 active:scale-90"
              >
                <Avatar seed={weakHash(state.account)} />
                <img className="absolute top-6 z-0 scale-75" src={banner} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
