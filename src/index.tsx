import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import './index.css'
import { FC } from 'react'

import { StoreProvider } from './providers/store'
import { AccountProvider } from 'providers/AccountProvider'
import { BrowserRouter } from 'react-router-dom'
import Routes from 'Routes'

export const App: FC = () => {
  return (
    <StoreProvider>
      <AccountProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </AccountProvider>
    </StoreProvider>
  )
}

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(<App />)
