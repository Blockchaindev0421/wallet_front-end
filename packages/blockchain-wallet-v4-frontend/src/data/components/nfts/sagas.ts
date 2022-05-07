import { NftFilterFormValuesType } from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/NftFilter'
import { addDays, addMinutes, getUnixTime } from 'date-fns'
import { ethers, Signer } from 'ethers'
import { all, call, put, select } from 'redux-saga/effects'

import { Exchange } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { APIType } from '@core/network/api'
import { GasCalculationOperations, GasDataI, RawOrder } from '@core/network/api/nfts/types'
import {
  calculateGasFees,
  cancelNftOrder,
  executeWrapEth,
  fulfillNftOrder,
  fulfillNftSellOrder,
  fulfillTransfer,
  getNftBuyOrder,
  getNftMatchingOrders,
  getNftSellOrder
} from '@core/redux/payment/nfts'
import { NULL_ADDRESS } from '@core/redux/payment/nfts/constants'
import { Await } from '@core/types'
import { errorHandler } from '@core/utils'
import { getPrivateKey } from '@core/utils/eth'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { Analytics } from 'data/types'
import { promptForSecondPassword } from 'services/sagas'

import { actions as A } from './slice'
import { NftOrderStatusEnum, NftOrderStepEnum } from './types'
import { nonTraitFilters } from './utils'

export const logLocation = 'components/nfts/sagas'
export const WALLET_SIGNER_ERR = 'Error getting eth wallet signer.'
const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))
const INSUFFICIENT_FUNDS = 'insufficient funds'

export default ({ api }: { api: APIType }) => {
  const IS_TESTNET = api.ethProvider.network?.name === 'rinkeby'

  const fetchOpenSeaAsset = function* (action: ReturnType<typeof A.fetchOpenSeaAsset>) {
    try {
      yield put(A.fetchOpenSeaAssetLoading())
      const res: ReturnType<typeof api.getOpenSeaAsset> = yield call(
        api.getOpenSeaAsset,
        action.payload.asset_contract_address,
        action.payload.token_id
      )
      yield put(A.fetchOpenSeaAssetSuccess(res))
    } catch (e) {
      yield put(A.fetchOpenSeaAssetFailure(e))
    }
  }

  const fetchOpenseaStatus = function* () {
    try {
      yield put(A.fetchOpenseaStatusLoading())
      const res: ReturnType<typeof api.getOpenSeaStatus> = yield call(api.getOpenSeaStatus)
      yield put(A.fetchOpenseaStatusSuccess(res))
    } catch (e) {
      yield put(A.fetchOpenseaStatusFailure(e))
    }
  }

  const getEthSigner = function* () {
    try {
      const password = yield call(promptForSecondPassword)
      const getMnemonic = (state) => selectors.core.wallet.getMnemonic(state, password)
      const mnemonicT = yield select(getMnemonic)
      const mnemonic = yield call(() => taskToPromise(mnemonicT))
      const privateKey = getPrivateKey(mnemonic)
      const wallet = new ethers.Wallet(privateKey, api.ethProvider)
      return wallet
    } catch (e) {
      throw new Error(WALLET_SIGNER_ERR)
    }
  }

  // This is a very important function. Not only is it used to fetch fees
  // it is also used to create matching orders for the order/offer passed in
  // and then those matching orders are put on state.
  const fetchFees = function* (action: ReturnType<typeof A.fetchFees>) {
    try {
      yield put(A.fetchFeesLoading())
      const signer: Signer = yield call(getEthSigner)
      let fees

      if (action.payload.operation === GasCalculationOperations.Buy) {
        try {
          yield put(A.fetchMatchingOrderLoading())
          const { buy, sell }: Await<ReturnType<typeof getNftMatchingOrders>> = yield call(
            getNftMatchingOrders,
            action.payload.order,
            signer,
            undefined,
            IS_TESTNET ? 'rinkeby' : 'mainnet',
            action.payload.paymentTokenAddress
          )
          fees = yield call(
            calculateGasFees,
            GasCalculationOperations.Buy,
            signer,
            undefined,
            buy,
            sell
          )
          yield put(A.fetchMatchingOrderSuccess({ buy, sell }))
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchMatchingOrderFailure(error))
          throw e
        }
      } else if (action.payload.operation === GasCalculationOperations.CreateOffer) {
        const buy: Await<ReturnType<typeof getNftBuyOrder>> = yield call(
          getNftBuyOrder,
          action.payload.asset,
          signer,
          undefined,
          Number(action.payload.offer),
          action.payload.paymentTokenAddress,
          IS_TESTNET ? 'rinkeby' : 'mainnet'
        )

        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.CreateOffer,
          signer,
          undefined,
          buy
        )
      } else if (action.payload.operation === GasCalculationOperations.AcceptOffer) {
        const { order } = action.payload
        yield put(A.fetchMatchingOrderLoading())
        try {
          const { buy, sell }: Await<ReturnType<typeof getNftMatchingOrders>> = yield call(
            getNftMatchingOrders,
            order,
            signer,
            undefined,
            IS_TESTNET ? 'rinkeby' : 'mainnet'
          )
          fees = yield call(
            calculateGasFees,
            GasCalculationOperations.AcceptOffer,
            signer,
            undefined,
            buy,
            sell
          )
          yield put(A.fetchMatchingOrderSuccess({ buy, sell }))
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchMatchingOrderFailure(error))
          throw e
        }
      } else if (action.payload.operation === GasCalculationOperations.Cancel) {
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Cancel,
          signer,
          action.payload.order as RawOrder
        )
      } else if (action.payload.operation === GasCalculationOperations.Sell) {
        const listingTime = getUnixTime(addMinutes(new Date(), 5))
        const expirationTime = getUnixTime(addDays(new Date(), action.payload.expirationDays))
        const order: Await<ReturnType<typeof getNftSellOrder>> = yield call(
          getNftSellOrder,
          action.payload.asset,
          signer,
          listingTime,
          expirationTime,
          action.payload.startPrice,
          action.payload.endPrice,
          IS_TESTNET ? 'rinkeby' : 'mainnet',
          action.payload.waitForHighestBid,
          action.payload.paymentTokenAddress
        )
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Sell,
          signer,
          undefined,
          undefined,
          order
        )
      } else if (action.payload.operation === GasCalculationOperations.Transfer) {
        fees = yield call(
          calculateGasFees,
          GasCalculationOperations.Transfer,
          signer,
          undefined,
          undefined,
          undefined,
          action.payload.asset,
          action.payload.to
        )
      } else {
        throw new Error('Invalid gas operation')
      }

      yield put(A.fetchFeesSuccess(fees as GasDataI))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      const error = errorHandler(e)
      yield put(A.fetchFeesFailure(error))
    }
  }

  const fetchFeesWrapEth = function* () {
    try {
      yield put(A.fetchFeesWrapEthLoading())
      const signer: Signer = yield call(getEthSigner)
      const fees = yield call(calculateGasFees, GasCalculationOperations.WrapEth, signer)
      yield put(A.fetchFeesWrapEthSuccess(fees as GasDataI))
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
      const error = errorHandler(e)
      yield put(A.fetchFeesWrapEthFailure(error))
    }
  }

  const acceptOffer = function* (action: ReturnType<typeof A.acceptOffer>) {
    // TODO: get coin from paymentToken
    const coin = action.payload.sell.paymentToken === NULL_ADDRESS ? 'ETH' : 'WETH'
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value: action?.payload?.buy?.basePrice?.toString() || ''
      })
    )
    const usdPrice = yield call(api.getPriceIndex, coin, 'USD', new Date().getTime())
    const amount_usd = usdPrice.price * Number(amount)
    try {
      yield put(A.setOrderFlowIsSubmitting(true))
      const signer: Signer = yield call(getEthSigner)
      const { buy, gasData, sell } = action.payload
      yield call(fulfillNftOrder, { buy, gasData, sell, signer })
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully accepted offer!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_ACCEPT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_ACCEPT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to accept this offer.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createOffer = function* (action: ReturnType<typeof A.createOffer>) {
    const currency = action?.payload?.coin || ''
    const amount = Number(action?.payload?.amount)
    const usdPrice = yield call(api.getPriceIndex, currency, 'USD', new Date().getTime())
    const amount_usd = usdPrice.price * Number(amount)
    try {
      yield put(A.setOrderFlowIsSubmitting(true))
      const signer = yield call(getEthSigner)
      if (!action.payload.coin) throw new Error('No coin selected for offer.')
      const { coinfig } = window.coins[action.payload.coin]
      if (!coinfig.type.erc20Address) throw new Error('Offers must use an ERC-20 token.')
      const { expirationTime } = action.payload

      if (action.payload.amtToWrap && action.payload.wrapFees) {
        yield put(A.setNftOrderStatus(NftOrderStatusEnum.WRAP_ETH))
        const amount = Exchange.convertCoinToCoin({
          baseToStandard: false,
          coin: 'WETH',
          value: action.payload.amtToWrap
        })
        yield call(executeWrapEth, signer, amount, action.payload.wrapFees)
        yield put(actions.core.data.eth.fetchData())
        yield put(actions.core.data.eth.fetchErc20Data())
      }

      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.STATUS }))
      const buy: Await<ReturnType<typeof getNftBuyOrder>> = yield call(
        getNftBuyOrder,
        action.payload.asset,
        signer,
        expirationTime,
        Number(action.payload.amount || '0'),
        coinfig.type.erc20Address,
        IS_TESTNET ? 'rinkeby' : 'mainnet'
      )
      const gasData = action.payload.offerFees
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_OFFER))
      const order = yield call(fulfillNftOrder, { buy, gasData, signer })
      yield call(api.postNftOrder, order)
      yield put(A.setNftOrderStatus(NftOrderStatusEnum.POST_OFFER_SUCCESS))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      yield put(A.setOrderFlowStep({ step: NftOrderStepEnum.MAKE_OFFER }))
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to create this offer.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createOrder = function* (action: ReturnType<typeof A.createOrder>) {
    // TODO: get coin from paymentToken
    const coin = action.payload.sell.paymentToken === NULL_ADDRESS ? 'ETH' : ('WETH' as string)
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value:
          action?.payload?.buy?.basePrice?.toString() ||
          action?.payload?.sell?.basePrice?.toString()
      })
    )
    const usdPrice = yield call(api.getPriceIndex, coin, 'USD', new Date().getTime())
    const amount_usd = usdPrice.price * Number(amount)

    try {
      yield put(A.setOrderFlowIsSubmitting(true))
      const { buy, gasData, sell } = action.payload
      const signer = yield call(getEthSigner)
      yield call(fulfillNftOrder, { buy, gasData, sell, signer })
      yield put(actions.modals.closeAllModals())
      yield put(
        actions.alerts.displaySuccess(
          `Successfully created order! It may take a few minutes to appear in your collection.`
        )
      )
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_SELL_ITEM_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)

      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_SELL_ITEM_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to create this order.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createSellOrder = function* (action: ReturnType<typeof A.createSellOrder>) {
    const isTimedAuction = !!action.payload.endPrice
    const coin = isTimedAuction ? 'WETH' : 'ETH'
    const startPrice = action?.payload?.startPrice
    const endPrice = action?.payload?.endPrice || 0
    const usdPrice = yield call(api.getPriceIndex, coin, 'USD', new Date().getTime())
    const start_usd = startPrice * usdPrice
    const end_usd = endPrice * usdPrice
    try {
      const listingTime = getUnixTime(addMinutes(new Date(), 5))
      const expirationTime = getUnixTime(addDays(new Date(), action.payload.expirationDays))
      yield put(A.setOrderFlowIsSubmitting(true))
      const signer = yield call(getEthSigner)
      const signedOrder: Await<ReturnType<typeof getNftSellOrder>> = yield call(
        getNftSellOrder,
        action.payload.asset,
        signer,
        listingTime,
        expirationTime,
        action.payload.startPrice,
        action.payload.endPrice,
        IS_TESTNET ? 'rinkeby' : 'mainnet',
        action.payload.waitForHighestBid,
        action.payload.paymentTokenAddress
      )
      const order = yield call(fulfillNftSellOrder, signedOrder, signer, action.payload.gasData)
      yield call(api.postNftOrder, order)
      yield put(A.clearAndRefetchAssets())
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess('Sell order created!'))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_LISTING_SUCCESS_FAIL,
          properties: {
            currency: coin,
            end_price: isTimedAuction ? Number(endPrice) : undefined,
            end_usd: isTimedAuction ? end_usd : undefined,
            start_price: Number(startPrice),
            start_usd,
            type: 'SUCCESS'
          }
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_LISTING_SUCCESS_FAIL,
          properties: {
            currency: coin,
            end_price: isTimedAuction ? Number(endPrice) : undefined,
            end_usd: isTimedAuction ? end_usd : undefined,
            error_message: error,
            start_price: Number(startPrice),
            start_usd,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to sell this asset.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const createTransfer = function* (action: ReturnType<typeof A.createTransfer>) {
    try {
      yield put(A.setOrderFlowIsSubmitting(true))
      const signer = yield call(getEthSigner)
      const order = yield call(fulfillTransfer, action.payload.asset, signer, action.payload.to, {
        gasLimit: action.payload.gasData.gasFees.toString(),
        gasPrice: action.payload.gasData.gasPrice.toString()
      })
      yield call(api.postNftOrder, order)
      yield put(A.clearAndRefetchAssets())
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess('Transfer successful!'))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_SEND_SUCCESS_FAIL,
          properties: {
            type: 'SUCCESS'
          }
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_SEND_SUCCESS_FAIL,
          properties: {
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to transfer this asset.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const cancelListing = function* (action: ReturnType<typeof A.cancelListing>) {
    try {
      const signer = yield call(getEthSigner)
      yield put(A.setOrderFlowIsSubmitting(true))
      yield call(cancelNftOrder, action.payload.order, signer, action.payload.gasData)
      yield put(A.clearAndRefetchAssets())
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled listing!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_LISTING_SUCCESS_FAIL,
          properties: {
            type: 'SUCCESS'
          }
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_LISTING_SUCCESS_FAIL,
          properties: {
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to cancel this listing.'
      yield put(actions.logs.logErrorMessage(error))
      yield put(actions.alerts.displayError(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  // https://etherscan.io/tx/0x4ba256c46b0aff8b9ee4cc2a7d44649bc31f88ebafd99190bc182178c418c64a
  const cancelOffer = function* (action: ReturnType<typeof A.cancelOffer>) {
    const coin = action?.payload?.order?.payment_token_contract?.symbol || ''
    const usdPrice = yield call(api.getPriceIndex, coin, 'USD', new Date().getTime())
    const amount = Number(
      convertCoinToCoin({
        baseToStandard: true,
        coin,
        value: action?.payload?.order?.base_price?.toString() || ''
      })
    )
    const amount_usd = usdPrice.price * Number(amount)
    try {
      if (!action.payload.order) {
        throw new Error('No offer found. It may have expired already!')
      }
      const signer = yield call(getEthSigner)
      yield put(A.setOrderFlowIsSubmitting(true))
      yield call(cancelNftOrder, action.payload.order, signer, action.payload.gasData)
      yield put(actions.modals.closeAllModals())
      yield put(actions.alerts.displaySuccess(`Successfully cancelled offer!`))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            type: 'SUCCESS'
          }
        })
      )
      yield put(
        A.fetchOpenSeaAsset({
          asset_contract_address: action.payload.asset.asset_contract.address,
          token_id: action.payload.asset.token_id
        })
      )
    } catch (e) {
      let error = errorHandler(e)
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.NFT_CANCEL_OFFER_SUCCESS_FAIL,
          properties: {
            amount,
            amount_usd,
            currency: coin,
            error_message: error,
            type: 'FAILED'
          }
        })
      )
      if (error.includes(INSUFFICIENT_FUNDS))
        error = 'You do not have enough funds to cancel this offer.'
      yield put(actions.alerts.displayError(error))
      yield put(actions.logs.logErrorMessage(error))
    }

    yield put(A.setOrderFlowIsSubmitting(false))
  }

  const formChanged = function* (action) {
    if (action.meta.form === 'nftFilter') {
      if (['min', 'max'].includes(action.meta.field)) {
        const formValues = selectors.form.getFormValues('nftFilter')(
          yield select()
        ) as NftFilterFormValuesType
        if (formValues?.min || formValues?.max) {
          yield put(actions.form.change('nftFilter', 'forSale', true))
        }
      }

      // GET CURRENT URL
      const url = new URL(window.location.href)
      const [hash, query] = url.href.split('#')[1].split('?')
      // @ts-ignore
      const params = Object.fromEntries(new URLSearchParams(query))
      // NON-TRAITS
      if (nonTraitFilters.includes(action.meta.field)) {
        params[action.meta.field] = action.payload
      }
      // TRAITS
      if (!nonTraitFilters.includes(action.meta.field)) {
        const traits = params.traits ? JSON.parse(params.traits) : []
        if (action.payload) {
          if (traits.includes(action.meta.field)) return
          params.traits = JSON.stringify([...traits, action.meta.field])
        } else {
          params.traits = JSON.stringify(traits.filter((t) => t !== action.meta.field))
        }
      }

      // MODIFY URL
      const newHash = `${hash}?${Object.entries(params)
        .filter(([_, v]) => v)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`

      url.hash = newHash

      window.history.pushState(null, '', url.toString())
    }
  }

  const nftOrderFlowOpen = function* () {
    yield put(actions.modals.showModal(ModalName.NFT_ORDER, { origin: 'Unknown' }))
  }

  const nftOrderFlowClose = function* () {
    yield put(actions.modals.closeAllModals())
  }

  // watch router change so we know if we need to reset nft trait filter form
  const handleRouterChange = function* (action) {
    if (action.payload.location.pathname.includes('/nfts/')) {
      const url = new URL(window.location.href)
      const [hash, query] = url.href.split('#')[1].split('?')
      // @ts-ignore
      const params = Object.fromEntries(new URLSearchParams(query))

      yield put(actions.form.reset('nftFilter'))

      yield all(
        Object.keys(params).map(function* (key) {
          if (nonTraitFilters.includes(key)) {
            yield put(actions.form.change('nftFilter', key, params[key]))
          }
        })
      )
      if (params.traits !== undefined) {
        const traits = JSON.parse(params.traits)
        yield all(
          traits.map(function* (trait) {
            yield put(actions.form.change('nftFilter', trait, true))
          })
        )
      }
    }
  }

  const nftSearch = function* (action: ReturnType<typeof A.nftSearch>) {
    try {
      yield put(A.nftSearchLoading())
      const search: ReturnType<typeof api.searchNfts> = yield call(
        api.searchNfts,
        action.payload.search
      )
      yield put(A.nftSearchSuccess(search))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.nftSearchFailure(error))
    }
  }

  return {
    acceptOffer,
    cancelListing,
    cancelOffer,
    createOffer,
    createOrder,
    createSellOrder,
    createTransfer,
    fetchFees,
    fetchFeesWrapEth,
    fetchOpenSeaAsset,
    fetchOpenseaStatus,
    formChanged,
    handleRouterChange,
    nftOrderFlowClose,
    nftOrderFlowOpen,
    nftSearch
  }
}
