import Card from 'components/Card'
import React, { useState } from 'react'
import wood from 'assets/images/ui/backgrounds/wood_vertical.png'
import Button from 'components/Button'
import Input from 'components/Input'
import { FaLock } from 'react-icons/fa'
import { StateActions, useStore } from 'providers/store'

export const ExportBackupView: React.FC = () => {
  const { dispatch } = useStore()
  const [password, setPassword] = useState<string>('')

  const downloadBackup = async () => {
    const backup = await StateActions.BACKUP_CREATE(dispatch, password)
    if (backup) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + backup)
      element.setAttribute('download', 'tamequest-backup.bak')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      setPassword('')
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card background={wood}>
        <div className="z-10 w-80 p-4">
          <div className="rounded-lg bg-black bg-opacity-60 p-2 text-center">
            <h1 className="text-xl font-bold">Secure your account</h1>
            <span className="font-bold opacity-80">
              Your account key will be encrypted with your password. Keep it
              safe!
            </span>
          </div>
          <div className="flex flex-col items-center space-y-8 pt-20">
            <Input
              value={password}
              onChange={setPassword}
              type="password"
              Icon={FaLock}
              placeholder="Password"
              onEnter={downloadBackup}
            />
            <Button disabled={!password} onClick={downloadBackup}>
              Download backup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
