import CryptoJS from 'crypto-js'
import { CryptoStorage } from './webcrypto/storage'
import algosdk from 'algosdk'
import { Buffer } from 'buffer'
import toast from 'react-hot-toast'

let storage: CryptoStorage | null = null

export const StorageKeys = {
  passwordHash: 'passwordHash',
  address: 'address'
}

interface PasswordHash {
  hash: string
  salt: string
  iterations: number
}

async function setLocalStorage<T>(name: string, value: T): Promise<void> {
  localStorage.setItem(name, JSON.stringify(value))
}

async function getLocalStorage<T>(name: string): Promise<T | null> {
  try {
    const storedValue: T = JSON.parse(localStorage.getItem(name) || 'err')
    return storedValue || null
  } catch (e) {
    return null
  }
}

async function set<T>(name: string, value: T): Promise<void> {
  if (storage) {
    const data = JSON.stringify(value)
    await storage.set(name, data)
  } else {
    toast.error('Storage not available.')
  }
}

async function remove(name: string): Promise<void> {
  if (storage) {
    await storage.delete(name)
  } else {
    toast.error('Storage not available.')
  }
}

async function get<T>(name: string): Promise<T | null> {
  if (storage) {
    const data = await storage.get(name)
    if (data) {
      return JSON.parse(data)
    }
  } else {
    toast.error('Storage not available.')
  }
  return null
}

export async function isPasswordSet(): Promise<boolean> {
  try {
    const passwordHash = await getLocalStorage<PasswordHash>(
      StorageKeys.passwordHash
    )
    return !!passwordHash
  } catch {
    return false
  }
}

function getPasswordHash(password: string): PasswordHash {
  const salt = CryptoJS.lib.WordArray.random(128 / 8)
  const iterations = 5000
  const keySize = 256 / 32
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize,
    iterations: iterations
  })
  const passwordHash: PasswordHash = {
    hash: hash.toString(),
    salt: salt.toString(),
    iterations: iterations
  }
  return passwordHash
}

export async function setPassword(password: string): Promise<void> {
  const passwordSet = await isPasswordSet()
  if (!passwordSet) {
    const passwordHash = getPasswordHash(password)
    await setLocalStorage(StorageKeys.passwordHash, passwordHash)
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const passwordHash = await getLocalStorage<PasswordHash>(
    StorageKeys.passwordHash
  )
  if (!passwordHash) return false
  const { salt, iterations, hash: storedHash } = passwordHash
  const computedHash = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: iterations
  })
  if (computedHash.toString() === storedHash) {
    storage = new CryptoStorage(password)
    return true
  }
  return false
}

export async function getAddress(): Promise<string | null> {
  return await get(StorageKeys.address)
}

export async function setAddress(address: string): Promise<void> {
  await set(StorageKeys.address, address)
}

export async function addAccount(account: algosdk.Account): Promise<string> {
  const address = await getAddress()
  if (!address) {
    await set(account.addr, Buffer.from(account.sk).toString('base64'))
    setAddress(account.addr)
    return account.addr
  }
  return address
}

export async function removeAccount(): Promise<void> {
  const address = await getAddress()
  if (address) {
    await remove(address)
    await remove(StorageKeys.address)
  }
}

export async function lock(): Promise<void> {
  storage = null
}

export async function createBackup(password: string): Promise<string> {
  if (!(await verifyPassword(password))) {
    toast.error('Invalid password.')
    return ''
  }
  const address = await getAddress()
  if (address) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8)
    const iterations = 5000
    const keySize = 256
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: keySize / 32,
      iterations: iterations
    })
    return Buffer.from(
      JSON.stringify({
        salt: salt,
        iterations: iterations,
        keySize: keySize,
        key: CryptoJS.AES.encrypt(
          JSON.stringify([await get(address)]),
          key.toString()
        ).toString()
      }),
      'utf8'
    ).toString('base64')
  }
  return ''
}

export async function importBackup(
  backup: string,
  backupPassword: string
): Promise<string | null> {
  const address = await getAddress()
  if (address) remove(address)

  try {
    const backupData = JSON.parse(
      Buffer.from(backup, 'base64').toString('utf8')
    )

    const key = CryptoJS.PBKDF2(
      backupPassword,
      CryptoJS.enc.Hex.parse(backupData.salt),
      {
        keySize: backupData.keySize / 32,
        iterations: backupData.iterations
      }
    )

    const decryptedData = CryptoJS.AES.decrypt(
      backupData.key,
      key.toString()
    ).toString(CryptoJS.enc.Utf8)

    if (!decryptedData) {
      toast.error('Decryption failed.')
    }

    const keys = JSON.parse(decryptedData)

    try {
      const account = algosdk.mnemonicToSecretKey(
        algosdk.secretKeyToMnemonic(new Uint8Array(Object.values(keys[0])))
      )
      await set(account.addr, account.sk)
      await setAddress(account.addr)
      return account.addr
    } catch (e) {
      toast.error('Malformed private key.')
    }
  } catch (e) {
    toast.error('Invalid backup password.')
  }
  return null
}

export async function signTransactions(
  group: algosdk.Transaction[]
): Promise<{ txID: string; blob: Uint8Array }[]> {
  const address = await getAddress()
  if (address) {
    const sk = Buffer.from((await get<string>(address)) || '', 'base64')
    if (!sk) {
      toast.error('Account not found.')
    }
    return group.map((txn: algosdk.Transaction) =>
      algosdk.signTransaction(txn, sk)
    )
  }
  return []
}
