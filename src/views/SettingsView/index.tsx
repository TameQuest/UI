import React from 'react'
import wood from '../../assets/images/ui/backgrounds/wood_vertical.png'
import { useNavigate } from 'react-router-dom'
import Button from 'components/Button'
import Card from 'components/Card'

export const SettingsView: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="relative flex">
      <Card background={wood}>
        <div className="flex flex-col space-y-12 p-8">
          <Button onClick={() => navigate('/settings/fund')}>
            Fund account
          </Button>

          <Button onClick={() => navigate('/settings/backup/export')}>
            Export backup
          </Button>
        </div>
      </Card>
    </div>
  )
}
