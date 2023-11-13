import React, { FC, useEffect } from 'react'
import { Routes as BrowserRoutes, Route, useNavigate } from 'react-router-dom'
import { LandingView } from 'views/LandingView'
import { BattleResultView } from 'views/BattleView/Result'
import { BattleView } from 'views/BattleView'
import StageView from 'views/StagingView'
import { StageResultView } from 'views/StagingView/Result'
import { RaffleView } from 'views/RaffleView'
import { RaffleResultView } from 'views/RaffleView/Result'
import { AuctionAssetView } from 'views/AuctionView/Asset'
import { Layout } from 'components/Layout'
import { SettingsView } from 'views/SettingsView'
import { AuctionView } from 'views/AuctionView'
import { GauntletView } from 'views/GauntletView'
import { useStore } from 'providers/store'
import { ExportBackupView } from './views/SettingsView/ExportBackupView'
import { useAccount } from 'providers/AccountProvider'
import { FundAccountView } from 'views/SettingsView/FundAccountView'
import { GoddessSelectionView } from 'views/GoddessSelectionView'

const Routes: FC = () => {
  const { state } = useStore()
  const { playerExists, player } = useAccount()
  const navigate = useNavigate()

  useEffect(() => {}, [])

  return (
    <Layout>
      <BrowserRoutes>
        {!state.backupDownloaded ? (
          <Route path="*" element={<ExportBackupView />} />
        ) : playerExists === undefined ? (
          <></>
        ) : !playerExists ? (
          <Route path="*" element={<FundAccountView />} />
        ) : player.society === 4 ? (
          <Route path="*" element={<GoddessSelectionView />} />
        ) : (
          <>
            <Route index element={<LandingView />} />
            <Route path="/battle" element={<BattleView />} />
            <Route path="/battle/:tx" element={<BattleResultView />} />
            <Route path="/staging" element={<StageView />} />
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
