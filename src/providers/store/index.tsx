import algosdk from 'algosdk'
import React, {
  createContext,
  useReducer,
  useContext,
  useLayoutEffect
} from 'react'
import {
  addAccount,
  createBackup,
  getAddress,
  isPasswordSet,
  lock,
  setPassword,
  signTransactions,
  verifyPassword
} from './storage'
import toast from 'react-hot-toast'
import { weakHash } from 'utils'

interface Action {
  type: string
  payload?: any
}

interface State {
  backupDownloaded: boolean
  passwordSet: boolean
  signedIn: boolean
  creatureReceived: boolean
  showBag: boolean
  loading: boolean
  account?: string
}

const initialState: State = {
  backupDownloaded: false,
  passwordSet: false,
  signedIn: false,
  creatureReceived: false,
  showBag: false,
  loading: false
}

export const LocalStorageKeys = {
  ADDRESS_SEED: 'addressSeed',
  ACCOUNT_BACKED_UP: 'accountBackedUp',
  CREATURE_RECEIVED: 'creatureReceived'
}

export const ActionTypes = {
  UPDATE_DATA: 'UPDATE_DATA',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIG_OUT'
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.UPDATE_DATA:
      return { ...state, [action.payload.key]: action.payload.value }
    case ActionTypes.SIGN_IN:
      return {
        ...state,
        account: action.payload,
        passwordSet: true,
        signedIn: true
      }
    case ActionTypes.SIGN_OUT:
      return {
        ...state,
        account: undefined,
        passwordSet: true,
        signedIn: false
      }
    default:
      return state
  }
}

const StoreContext = createContext<{
  state: State
  dispatch: (type: string, payload?: any) => void
}>({
  state: initialState,
  dispatch: () => {}
})

interface StoreProviderProps {
  children: React.ReactNode
}

const initializeStore = (): State => {
  return {
    ...initialState,
    backupDownloaded: !!localStorage.getItem(
      LocalStorageKeys.ACCOUNT_BACKED_UP
    ),
    creatureReceived: !!localStorage.getItem(LocalStorageKeys.CREATURE_RECEIVED)
  }
}

const signIn = async (
  dispatch: (type: string, payload?: any) => void,
  address: string
) => {
  dispatch(ActionTypes.UPDATE_DATA, { key: 'loading', value: true })
  if (address) {
    localStorage.setItem(
      LocalStorageKeys.ADDRESS_SEED,
      weakHash(address).toString()
    )
    dispatch(ActionTypes.SIGN_IN, address)
  }
  dispatch(ActionTypes.UPDATE_DATA, { key: 'loading', value: false })
}

export const StateActions = {
  REGISTER: async (
    dispatch: (type: string, payload?: any) => void,
    password: string,
    account: algosdk.Account
  ) => {
    if (!(await isPasswordSet())) {
      await setPassword(password)
      if (await verifyPassword(password)) {
        await signIn(dispatch, await addAccount(account))
      }
    }
  },
  SIGN_IN: async (
    dispatch: (type: string, payload?: any) => void,
    password: string
  ) => {
    if (await verifyPassword(password)) {
      const address = await getAddress()
      if (address) {
        await signIn(dispatch, address)
      }
    } else {
      toast.error('Password invalid. Try again?')
    }
  },
  SIGN_OUT: async (dispatch: (type: string, payload?: any) => void) => {
    lock().then(() => toast.success('Signed out successfully!'))
    dispatch(ActionTypes.SIGN_OUT)
  },
  BACKUP_CREATE: async (
    dispatch: (type: string, payload?: any) => void,
    password: string
  ) => {
    localStorage.setItem(
      LocalStorageKeys.ACCOUNT_BACKED_UP,
      JSON.stringify(true)
    )
    dispatch(ActionTypes.UPDATE_DATA, {
      key: 'backupDownloaded',
      value: true
    })
    return await createBackup(password)
  },
  SIGN_TRANSACTIONS: async (transactions: algosdk.Transaction[]) => {
    return signTransactions(transactions)
  }
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const initState = initializeStore()
  const [state, dispatchBase] = useReducer(reducer, initState)

  const dispatch = (type: string, payload?: any) => {
    dispatchBase({ type, payload })
  }

  const updateStateAsync = async () => {
    dispatch(ActionTypes.UPDATE_DATA, {
      key: 'passwordSet',
      value: await isPasswordSet()
    })
  }

  useLayoutEffect(() => {
    updateStateAsync()
  }, [])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
