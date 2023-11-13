import algosdk, { SuggestedParams, Transaction } from 'algosdk'
import { StateKeyValue } from './types'

export function chunks(data: string | Uint8Array, size: number) {
  const numChunks = Math.ceil(data.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0; i < numChunks; i += 1) {
    chunks[i] = data.slice(i * size, (i + 1) * size)
  }

  return chunks
}

export const decodeNumber = (kv: StateKeyValue): number => {
  if (kv.value.type === 2) return kv.value.uint
  return 0
}

export const decodeNumberArray = (kv: StateKeyValue): number[] => {
  const parts = chunks(Buffer.from(kv.value.bytes, 'base64'), 8)
  const values: number[] = []
  parts.forEach((part) => values.push(algosdk.decodeUint64(part, 'safe')))
  return values
}

export const decodeAddress = (kv: StateKeyValue): string => {
  return algosdk.encodeAddress(Buffer.from(kv.value.bytes, 'base64'))
}

export abstract class Contract<StateType> {
  client: algosdk.Algodv2
  application: number
  address: string
  player: string
  stateKeys: Record<string, [keyof StateType, (kv: StateKeyValue) => any]>
  state: StateType
  abi: algosdk.ABIContract
  onContractStateUpdate?: (contractState: StateType) => void

  constructor(
    client: algosdk.Algodv2,
    applicationId: number,
    abi: algosdk.ABIContractParams,
    player: string,
    onContractStateUpdate?: (contractState: StateType) => void
  ) {
    this.client = client
    this.application = applicationId
    this.address = algosdk.getApplicationAddress(applicationId)
    this.abi = new algosdk.ABIContract(abi)
    this.player = player
    this.stateKeys = {}
    this.state = {} as StateType
    this.onContractStateUpdate = onContractStateUpdate
  }

  compileProgram = async (program: string): Promise<Uint8Array> => {
    const response = await this.client.compile(program).do()
    return new Uint8Array(Buffer.from(response.result, 'base64'))
  }

  getSuggestedParams = async (): Promise<algosdk.SuggestedParams> => {
    return this.client.getTransactionParams().do()
  }

  makeMethodCall = async (config: {
    method: algosdk.ABIMethod
    methodArgs?: algosdk.ABIArgument[]
    appAccounts?: string[]
    appForeignApps?: number[]
    appForeignAssets?: number[]
    boxes?: algosdk.BoxReference[]
    note?: Uint8Array
    suggestedParams: SuggestedParams
  }): Promise<Transaction[]> => {
    const atc = new algosdk.AtomicTransactionComposer()
    atc.addMethodCall({
      ...config,
      appID: this.application,
      signer: algosdk.makeEmptyTransactionSigner(),
      sender: this.player
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return atc.transactions.map((tx) => tx.txn)
  }

  update = async (approval: string, clear: string): Promise<Transaction> => {
    return algosdk.makeApplicationUpdateTxnFromObject({
      appIndex: this.application,
      from: this.address,
      approvalProgram: await this.compileProgram(approval),
      clearProgram: await this.compileProgram(clear),
      suggestedParams: await this.getSuggestedParams()
    })
  }

  updateState = async (): Promise<void> => {
    if (this.stateKeys) {
      const application = await this.client
        .getApplicationByID(this.application)
        .do()
      const state: StateType = {} as never
      application['params']['global-state'].forEach((kv: StateKeyValue) => {
        const key = Buffer.from(kv['key'], 'base64').toString()
        const trueKey = this.stateKeys[key][0]
        const value = this.stateKeys[key][1](kv)
        state[trueKey] = value
      })
      this.state = state
      if (this.onContractStateUpdate) this.onContractStateUpdate(state)
    }
  }
}
