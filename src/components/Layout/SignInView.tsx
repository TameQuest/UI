import algosdk from 'algosdk'
import Avatar from 'components/Avatar'
import Input from 'components/Input'
import React, { useEffect, useMemo, useState } from 'react'
import { FaLock } from 'react-icons/fa'
import Button from 'components/Button'
import { LocalStorageKeys, StateActions, useStore } from '../../providers/store'
import { weakHash } from 'utils'
import paper from 'assets/images/ui/backgrounds/paper_vertical.png'
import Card from 'components/Card'

export const SignInView: React.FC = () => {
  const { state, dispatch } = useStore()
  const [account, setAccount] = useState<algosdk.Account>()
  const [addressHash, setAddressHash] = useState<number>()

  const [formPassword, setFormPassword] = useState<string>('')
  const [confirmFormPassword, setConfirmFormPassword] = useState<string>('')

  const regenerateAccount = async () => {
    if (!state.passwordSet) {
      const account = algosdk.generateAccount()
      setAccount(account)
      setAddressHash(weakHash(account.addr))
    }
  }

  useEffect(() => {
    if (state.passwordSet) {
      setAddressHash(
        Number.parseInt(
          localStorage.getItem(LocalStorageKeys.ADDRESS_SEED) || '0'
        )
      )
    } else {
      regenerateAccount()
    }
  }, [state.passwordSet])

  const checkPassword = () => {
    const regex = new RegExp(
      '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{12,})'
    )
    return [
      regex.test(formPassword) &&
        (state.passwordSet || formPassword === confirmFormPassword),
      formPassword.length >= 12,
      /[a-z]/.test(formPassword),
      /[A-Z]/.test(formPassword),
      /[0-9]/.test(formPassword),
      /[^a-z0-9A-Z]/.test(formPassword)
    ]
  }

  const [
    validPassword,
    longEnough,
    hasLowerCase,
    hasUpperCase,
    hasNumbers,
    hasSpecialCharacters
  ] = useMemo(checkPassword, [formPassword, confirmFormPassword])

  const onSubmit = async () => {
    if (validPassword) {
      if (state.passwordSet) {
        StateActions.SIGN_IN(dispatch, formPassword)
      } else if (account) {
        StateActions.REGISTER(dispatch, formPassword, account)
      }
    }
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-8">
      <div className="flex flex-col items-center justify-center pb-8 text-center">
        <h1 className="font-fantasy select-none text-center text-6xl">
          {state.passwordSet ? (
            'Welcome back!'
          ) : (
            <>
              Welcome to <b>TameQuest</b>
            </>
          )}
        </h1>
      </div>
      <Card className="w-72 shadow-md hover:shadow-lg" background={paper}>
        <div
          className="z-10 flex h-full flex-col items-center justify-between p-8"
          style={{ height: 400 }}
        >
          <div
            className="h-32 w-32 cursor-pointer select-none hover:opacity-90"
            onClick={regenerateAccount}
          >
            {!!addressHash && <Avatar seed={addressHash} />}
          </div>
          <div className="space-y-3">
            <Input
              value={formPassword}
              onChange={setFormPassword}
              type="password"
              Icon={FaLock}
              placeholder="Password"
              onEnter={onSubmit}
            />
            {!state.passwordSet && (
              <Input
                value={confirmFormPassword}
                onChange={setConfirmFormPassword}
                type="password"
                Icon={FaLock}
                placeholder="Confirm password"
                onEnter={onSubmit}
              />
            )}
            <div className="flex justify-center pt-6">
              <Button
                disabled={!validPassword || state.loading}
                onClick={onSubmit}
              >
                {state.passwordSet ? 'Sign in' : 'Create account'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <div className="mt-12 w-80 rounded-lg bg-white bg-opacity-10 p-2 text-center">
        Your password needs{' '}
        <b className={longEnough ? 'text-green-400' : ''}>
          at least 12 characters
        </b>
        , <b className={hasUpperCase ? 'text-green-400' : ''}>uppercase</b> &{' '}
        <b className={hasLowerCase ? 'text-green-400' : ''}>lowercase</b>{' '}
        letters, <b className={hasNumbers ? 'text-green-400' : ''}>numbers</b>{' '}
        and{' '}
        <b className={hasSpecialCharacters ? 'text-green-400' : ''}>
          special characters
        </b>
        .
      </div>
    </div>
  )
}
