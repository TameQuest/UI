import { useAccount } from 'providers/AccountProvider'
import React from 'react'

export const Footer: React.FC = () => {
  const { round } = useAccount()
  return (
    <footer className="inset-x-0 top-0 z-30 p-2 opacity-50 transition-all md:p-4">
      <div className="container mx-auto flex items-start justify-between space-x-4 px-2 opacity-80 md:px-4">
        <div>
          {!!round && <span className="font-mono text-xs">{round}</span>}
        </div>
        <span>
          Powered by{' '}
          <a
            className="font-bold"
            target="_blank"
            href="https://developer.algorand.org/"
            rel="noreferrer"
          >
            Algorand
          </a>{' '}
          &{' '}
          <a
            className="font-bold"
            target="_blank"
            rel="noreferrer"
            href="https://nodely.io"
          >
            Nodely
          </a>
        </span>
      </div>
    </footer>
  )
}
