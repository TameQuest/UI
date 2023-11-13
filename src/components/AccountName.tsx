import React, { useState } from 'react'
import nfdIcon from '../assets/nfd-icon.png'
import { classNames } from 'utils'
import algosdk from 'algosdk'

interface AccountNameProps {
  account?: string
  nfd?: { name: string }
}

const AccountName: React.FC<AccountNameProps> = ({ account, nfd }) => {
  const [copied, setCopied] = useState(false)

  const address = account || ''

  const copy = () => {
    setCopied(true)
    navigator.clipboard.writeText(address || '')
    setTimeout(() => setCopied(false), 500)
  }

  return (
    <div className="relative flex flex-col items-center">
      {nfd && (
        <div className="flex items-center space-x-2 px-4 pt-4">
          <img
            src={nfdIcon}
            className="pointer-events-none select-none rounded-lg"
          />
          <span className="text-xl font-bold md:text-3xl">{nfd?.name}</span>
        </div>
      )}
      <div
        className={classNames(
          'flex font-mono cursor-pointer items-center pt-2 text-xs',
          copied ? 'opacity-10 hover:opacity-10' : 'hover:opacity-80'
        )}
        onClick={copy}
      >
        <b>{address.slice(0, 4)}</b>
        <span className="opacity-80">{address.slice(4, 6)}</span>
        <span className="opacity-50">
          {address.slice(6, 8)}⋯{address.slice(50, 52)}
        </span>
        <span className="opacity-80">{address.slice(52, 54)}</span>
        <b>{address.slice(54)}</b>
      </div>
      <span
        className={classNames(
          'pointer-events-none text-xs absolute pt-2 flex items-center justify-center',
          copied ? 'opacity-80' : 'opacity-0'
        )}
      >
        Copied!
      </span>
      <span className="pb-2 text-xs opacity-80">Click to copy</span>
    </div>
  )
}

export default AccountName
