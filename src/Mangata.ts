/* eslint-disable no-console */
import { ApiPromise, WsProvider } from '@polkadot/api'
import { GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import BN from 'bn.js'

import { options } from './utils/options'
import { RPC } from './services/Rpc'
import { TX } from './services/Tx'
import { Query } from './services/Query'
import { txOptions } from './types'

/**
 * The Mangata class defines the `getInstance` method that lets clients access the unique singleton instance. Design pattern Singleton Promise is used.
 */
export class Mangata {
  private static instance: Mangata
  private api: ApiPromise | null
  private uri: string

  /**
   * The Mangata's constructor is private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(uri: string) {
    this.api = null
    this.uri = uri
  }

  /**
   * Initialised via isReady & new with specific provider
   */
  private async connect() {
    if (!this.api) {
      const provider = new WsProvider(this.uri)
      this.api = await ApiPromise.create(options({ provider }))
    }

    return this.api
  }

  /**
   * The static method that controls the access to the Mangata instance.
   */
  public static getInstance(uri: string): Mangata {
    if (!Mangata.instance) {
      Mangata.instance = new Mangata(uri)
    }

    return Mangata.instance
  }

  /**
   * Retrieve the underlying API
   */
  public async getApi(): Promise<ApiPromise> {
    return await this.connect()
  }

  /**
   * Retrieve the chain name
   */

  public async getChain(): Promise<string> {
    const api = await this.connect()
    return RPC.getChain(api)
  }

  /**
   * Retrieve the node name
   */

  public async getNodeName(): Promise<string> {
    const api = await this.connect()
    return RPC.getNodeName(api)
  }

  /**
   * Retrieve the node version
   */

  public async getNodeVersion(): Promise<string> {
    const api = await this.connect()
    return RPC.getNodeVersion(api)
  }

  /**
   * Retrieve the current nonce
   */

  public async getNonce(address: string): Promise<BN> {
    const api = await this.connect()
    return Query.getNonce(api, address)
  }

  /**
   * Disconnect
   */

  public async disconnect(): Promise<void> {
    const api = await this.connect()
    api.disconnect()
  }

  /**
   * Create a pool
   */

  public async createPool(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.createPool(
      api,
      keyRingPair,
      firstAssetId,
      firstAssetAmount,
      secondAssetId,
      secondAssetAmount,
      txOptions
    )
  }

  /**
   * Sell asset
   */
  public async sellAsset(
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.sellAsset(
      api,
      keyRingPair,
      soldAssetId,
      boughtAssetId,
      amount,
      minAmountOut,
      txOptions
    )
  }

  /**
   * Mint liquidity
   */
  public async mintLiquidity(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.mintLiquidity(
      api,
      keyRingPair,
      firstAssetId,
      secondAssetId,
      firstAssetAmount,
      expectedSecondAssetAmount,
      txOptions
    )
  }

  /**
   * Burn liquidity
   */
  public async burnLiquidity(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.burnLiquidity(
      api,
      keyRingPair,
      firstAssetId,
      secondAssetId,
      liquidityAssetAmount,
      txOptions
    )
  }

  /**
   * Buy asset
   */
  public async buyAsset(
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.buyAsset(
      api,
      keyRingPair,
      soldAssetId,
      boughtAssetId,
      amount,
      maxAmountIn,
      txOptions
    )
  }

  /**
   * Calculate buy price
   */
  public async calculateBuyPrice(inputReserve: BN, outputReserve: BN, buyAmount: BN): Promise<BN> {
    const api = await this.connect()
    return await RPC.calculateBuyPrice(api, inputReserve, outputReserve, buyAmount)
  }

  /**
   * Calculate sell price
   */
  public async calculateSellPrice(
    inputReserve: BN,
    outputReserve: BN,
    sellAmount: BN
  ): Promise<BN> {
    const api = await this.connect()
    return await RPC.calculateSellPrice(api, inputReserve, outputReserve, sellAmount)
  }

  /**
   * Create Token
   */
  public async createToken(
    targetAddress: string,
    sudoKeyringPair: KeyringPair,
    currencyValue: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.createToken(api, targetAddress, sudoKeyringPair, currencyValue, txOptions)
  }

  /**
   * Mint Asset
   */
  public async mintAsset(
    sudo: KeyringPair,
    assetId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.mintAsset(api, sudo, assetId, targetAddress, amount, txOptions)
  }

  // TODO: not exposed in NODE: I cannot write test for this method
  /**
   * Get tokens required for minting
   */
  public async getTokensRequiredForMinting(
    liquidityAssetId: BN,
    liquidityAssetAmount: BN
  ): Promise<any> {
    const api = await this.connect()
    return await RPC.getTokensRequiredForMinting(api, liquidityAssetId, liquidityAssetAmount)
  }

  /**
   * Get burn amount
   */
  public async getBurnAmount(
    firstAssetId: BN,
    secondAssetId: BN,
    liquidityAssetAmount: BN
  ): Promise<any> {
    const api = await this.connect()
    return await RPC.getBurnAmount(api, firstAssetId, secondAssetId, liquidityAssetAmount)
  }

  // TODO: return bought asset amount .. why it is called sell price ID
  /**
   * Calculate sell price ID
   */

  public async calculateSellPriceId(
    soldTokenId: BN,
    boughtTokenId: BN,
    sellAmount: BN
  ): Promise<BN> {
    const api = await this.connect()
    return await RPC.calculateSellPriceId(api, soldTokenId, boughtTokenId, sellAmount)
  }

  /**
   * Calculate buy price ID
   */

  public async calculateBuyPriceId(soldTokenId: BN, boughtTokenId: BN, buyAmount: BN): Promise<BN> {
    const api = await this.connect()
    return await RPC.calculateBuyPriceId(api, soldTokenId, boughtTokenId, buyAmount)
  }

  /**
   * Get liquidity asset (NOT EXPOSED: I cannot write test for this function)
   */

  public async getLiquidityAsset(firstTokenId: BN, secondTokenId: BN): Promise<any> {
    const api = await this.connect()
    return await RPC.getLiquidityAsset(api, firstTokenId, secondTokenId)
  }

  /**
   * Get amount of token id in pool
   */
  public async getAmountOfTokenIdInPool(firstTokenId: BN, secondTokenId: BN): Promise<BN> {
    const api = await this.connect()
    return await Query.getAmountOfTokenIdInPool(api, firstTokenId, secondTokenId)
  }

  /**
   * Get liquidity asset id
   */
  public async getLiquidityAssetId(firstTokenId: BN, secondTokenId: BN): Promise<BN> {
    const api = await this.connect()
    return await Query.getLiquidityAssetId(api, firstTokenId, secondTokenId)
  }

  /**
   * Get liquidity pool
   */
  public async getLiquidityPool(liquidityAssetId: BN): Promise<BN[]> {
    const api = await this.connect()
    return await Query.getLiquidityPool(api, liquidityAssetId)
  }

  /**
   * Get treasury
   */
  public async getTreasury(currencyId: BN): Promise<BN> {
    const api = await this.connect()
    return await Query.getTreasury(api, currencyId)
  }

  /**
   * Get treasury burn
   */
  public async getTreasuryBurn(currencyId: BN): Promise<BN> {
    const api = await this.connect()
    return await Query.getTreasuryBurn(api, currencyId)
  }

  /**
   * Extrinsic that transfers TokenId in value amount, from origin to dest
   */

  public async transferToken(
    account: KeyringPair,
    tokenId: BN,
    targetAddress: string,
    amount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.transferToken(api, account, tokenId, targetAddress, amount, txOptions)
  }

  /**
   * Extrinsic that transfers all token_id from origin to dest
   */

  public async transferTokenAll(
    account: KeyringPair,
    tokenId: BN,
    targetAddress: string,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.transferAllToken(api, account, tokenId, targetAddress, txOptions)
  }

  /**
   * Returns total issuance of CurrencyId
   */

  public async getTotalIssuanceOfTokenId(tokenId: BN): Promise<BN> {
    const api = await this.connect()
    return await Query.getTotalIssuanceOfTokenId(api, tokenId)
  }

  /**
   * Returns vec of locked tokenId of an specified account Id Address and tokenId
   */
  public async getLock(address: string, tokenId: BN) {
    const api = await this.connect()
    return await Query.getLock(api, address, tokenId)
  }
}
