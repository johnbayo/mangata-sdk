import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

import { getChain as getChainEntity } from '../entities/rpc/chain'
import { getNodeName as getNodeNameEntity } from '../entities/rpc/name'
import { getNodeVersion as getNodeVersionEntity } from '../entities/rpc/version'
import { calculateBuyPrice as calculateBuyPriceEntity } from '../entities/rpc/calculate_buy_price'
import { calculateSellPrice as calculateSellPriceEntity } from '../entities/rpc/calculate_sell_price'
import { getBurnAmount as getBurnAmountEntity } from '../entities/rpc/get_burn_amount'
import { calculateSellPriceId as calculateSellPriceIdEntity } from '../entities/rpc/calculate_sell_price_id'
import { calculateBuyPriceId as calculateBuyPriceIdEntity } from '../entities/rpc/calculate_buy_price_id'

import { Amount } from '../types/Amount'
import { Reserve } from '../types/Reserve'
import { log } from '../utils/logger'
import { TokensId } from '../types/TokensId'

class Rpc {
  static async getChain(api: ApiPromise): Promise<string> {
    const chain = await getChainEntity(api)
    log.info(`Retrieved chain: ${chain}`)
    return chain.toHuman()
  }

  static async getNodeName(api: ApiPromise): Promise<string> {
    const name = await getNodeNameEntity(api)
    log.info(`Retrieved node name: ${name}`)
    return name.toHuman()
  }
  static async getNodeVersion(api: ApiPromise): Promise<string> {
    const version = await getNodeVersionEntity(api)
    log.info(`Retrieved version: ${version}`)
    return version.toHuman()
  }

  // TODO: need to find out the return type
  static async calculateBuyPrice(api: ApiPromise, reserve: Reserve, amount: Amount): Promise<BN> {
    const result = await calculateBuyPriceEntity(api, reserve, amount)
    return new BN(result.price)
  }

  // TODO: need to find out the return type
  static async calculateSellPrice(api: ApiPromise, reserve: Reserve, amount: Amount): Promise<BN> {
    const result = await calculateSellPriceEntity(api, reserve, amount)
    return new BN(result.price)
  }

  // TODO: Need to figure out the return value from this method
  static async getBurnAmount(api: ApiPromise, tokens: TokensId, amount: Amount) {
    const result = await getBurnAmountEntity(api, tokens, amount)
    return result.toHuman()
  }

  static async calculateSellPriceId(
    api: ApiPromise,
    tokens: TokensId,
    amount: Amount
  ): Promise<BN> {
    const result = await calculateSellPriceIdEntity(api, tokens, amount)
    return new BN(result.price)
  }

  static async calculateBuyPriceId(api: ApiPromise, tokens: TokensId, amount: Amount): Promise<BN> {
    const result = await calculateBuyPriceIdEntity(api, tokens, amount)
    return new BN(result.price)
  }
}

export default Rpc
