import React, { useEffect, useState } from 'react'

import slot from 'assets/images/ui/other/slot.png'
import { classNames } from 'utils'
import { SummonedCreature } from 'providers/sdk/types'
import { useAccount } from 'providers/AccountProvider'
import algosdk from 'algosdk'

type BagSlotProps = {
  id: number
  asset: number
  onSelect: (creature: SummonedCreature) => void
}

import back1 from 'assets/images/back/1.png'
import back2 from 'assets/images/back/2.png'
import back3 from 'assets/images/back/3.png'
import back4 from 'assets/images/back/4.png'
import back5 from 'assets/images/back/5.png'

const backs = [back1, back2, back3, back4, back5]

export const BagSlot: React.FC<BagSlotProps> = ({ id, asset, onSelect }) => {
  const { sdk, client } = useAccount()
  const [assetData, setAssetData] = useState<SummonedCreature>()

  useEffect(() => {
    if (asset) {
      client
        .getAssetByID(asset)
        .do()
        .then((asa) => {
          setAssetData(
            sdk.game.parseCreatureMemory(
              algosdk.decodeAddress(asa['params']['reserve']).publicKey
            )
          )
        })
    }
  }, [asset])

  return (
    <button
      className={classNames(
        'relative flex items-center justify-center hover:opacity-80',
        asset === 0 && 'opacity-50'
      )}
      disabled={asset === 0}
      onClick={() => {
        if (assetData) onSelect(assetData)
      }}
    >
      <div className="z-20 h-16 w-16">
        {asset !== 0 && assetData && (
          <img
            className="absolute bottom-0 px-2"
            src={backs[assetData.info.tier]}
          />
        )}
      </div>
      <img src={slot} className="pointer-events-none absolute h-16 w-16" />
    </button>
  )
}
