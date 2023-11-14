import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast'
import { Footer } from './Footer'
import { useStore } from '../../providers/store'
import { SignInView } from './SignInView'
import wood from '../../assets/images/ui/backgrounds/paper_inverted.png'
import { Bag } from 'components/Bag'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useStore()

  const [display, setDisplay] = useState(false)

  useEffect(() => {
    if (state.signedIn && !state.loading) {
      setDisplay(true)
    }
  }, [state.loading, state.signedIn])

  return (
    <div
      className="absolute min-h-full w-full"
      style={{
        backgroundImage: `url(${wood})`
      }}
    >
      <div
        className="flex min-w-[320px] flex-col bg-black bg-opacity-60"
        style={{
          minHeight: 'clamp(568px, 100vh, 100vh)'
        }}
      >
        <Toaster position="bottom-right" />
        <Bag />
        {!!state.account && <Navbar />}
        <div className="flex grow">
          <div className="flex w-full justify-center">
            {state.account ? display ? children : <></> : <SignInView />}
          </div>
        </div>
        {!!state.account && <Footer />}
      </div>
    </div>
  )
}
