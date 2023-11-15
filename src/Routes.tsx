import React, { FC, useEffect, useState } from 'react'
import { Routes as BrowserRoutes, Route, useNavigate } from 'react-router-dom'
import { LandingView } from 'views/LandingView'
import { BattleView } from 'views/BattleView'
import { StageResultView } from 'views/StagingView/Result'
import { RaffleView } from 'views/RaffleView'
import { RaffleResultView } from 'views/RaffleView/Result'
import { AuctionAssetView } from 'views/AuctionView/Asset'
import { Layout } from 'components/Layout'
import { SettingsView } from 'views/SettingsView'
import { AuctionView } from 'views/AuctionView'
import { GauntletView } from 'views/GauntletView'
import { ActionTypes, LocalStorageKeys, useStore } from 'providers/store'
import { ExportBackupView } from './views/SettingsView/ExportBackupView'
import { useAccount } from 'providers/AccountProvider'
import { FundAccountView } from 'views/SettingsView/FundAccountView'
import { GoddessSelectionView } from 'views/GoddessSelectionView'
import { FixRoundView } from 'views/SettingsView/FixRoundView'
import Modal from 'components/Modal'
import { CreatureCard } from 'components/CreatureCard'
import { getGoddessName } from 'utils'
import Card from 'components/Card'
import wood from 'assets/images/ui/backgrounds/wood_vertical.png'
import Button from 'components/Button'
import { StagingView } from 'views/StagingView'

const Routes: FC = () => {
  const { state, dispatch } = useStore()
  const { playerExists, player, round } = useAccount()

  const [modalOpen, setModalOpen] = useState(
    !localStorage.getItem(LocalStorageKeys.CREATURE_RECEIVED)
  )

  const closeModal = () => {
    setModalOpen(false)
    localStorage.setItem(
      LocalStorageKeys.CREATURE_RECEIVED,
      JSON.stringify(true)
    )
    dispatch(ActionTypes.UPDATE_DATA, { key: 'creatureReceived', value: true })
  }

  return (
    <Layout>
      {!state.loading && playerExists && player.society !== 4 && (
        <Modal open={modalOpen}>
          <Card
            background={wood}
            className="flex aspect-[5/8] flex-col space-y-4"
          >
            <div className="z-10 mx-2 rounded-lg bg-black bg-opacity-80 p-2 text-center">
              <h1 className="font-fantasy z-10 text-2xl">
                {getGoddessName(player.society)} appreciates your allegiance
              </h1>
              <p className="z-10 max-w-md p-2 text-center">
                You have received a gift: this creature did not play well with
                others, so it's best to give it to newbies like you. <br />
                <b>Welcome to TameQuest and best of luck on your adventures!</b>
              </p>
            </div>
            <CreatureCard creature={player.summonedCreature} />
            <Button onClick={closeModal}>Thanks</Button>
          </Card>
        </Modal>
      )}
      <BrowserRoutes>
        {!state.backupDownloaded ? (
          <Route path="*" element={<ExportBackupView />} />
        ) : playerExists === undefined ? (
          <></>
        ) : !playerExists || player.funds < 100000 ? (
          <Route path="*" element={<FundAccountView />} />
        ) : player.activity.type !== 0 &&
          player.activity.drawRound < (round || 0) - 1512 ? (
          <Route path="*" element={<FixRoundView />} />
        ) : player.society === 4 ? (
          <Route path="*" element={<GoddessSelectionView />} />
        ) : (
          <>
            <Route index element={<LandingView />} />
            <Route path="/battle" element={<BattleView />} />
            <Route path="/battle/:tx" element={<BattleView />} />
            <Route path="/staging" element={<StagingView />} />
            <Route path="/staging/:tx" element={<StageResultView />} />
            <Route path="/raffle" element={<RaffleView />} />
            <Route path="/raffle/:tx" element={<RaffleResultView />} />
            <Route path="/auctions" element={<AuctionView />} />
            <Route path="/auction/:asset" element={<AuctionAssetView />} />
            <Route path="/gauntlet" element={<GauntletView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route
              path="/settings/backup/export"
              element={<ExportBackupView />}
            />
            <Route path="/settings/fund" element={<FundAccountView />} />
          </>
        )}
      </BrowserRoutes>
    </Layout>
  )
}

export default Routes
