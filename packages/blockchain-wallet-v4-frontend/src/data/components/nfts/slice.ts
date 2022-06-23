/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Remote } from '@core'
import {
  ExplorerGatewaySearchType,
  GasCalculationOperations,
  GasDataI,
  NftAsset,
  NftAssetsType,
  NftOrder,
  NftUserPreferencesReturnType,
  NftUserPreferencesType,
  OpenSeaAsset,
  OpenSeaStatus,
  RawOrder,
  SeaportOffer,
  SeaportOffersResponseType,
  SeaportRawOrder,
  UnsignedOrder
} from '@core/network/api/nfts/types'
import { calculateGasFees } from '@core/redux/payment/nfts'
import { Await } from '@core/types'

import { NftOrderStatusEnum, NftOrderStepEnum, NftsStateType } from './types'

const initialState: NftsStateType = {
  activeTab: 'explore',
  assets: {
    atBound: false,
    collection: 'all',
    isFailure: false,
    isLoading: false,
    list: [],
    page: 0
  },
  collection: Remote.NotAsked,
  collections: Remote.NotAsked,
  openSeaAsset: Remote.NotAsked,
  openSeaSeaportOffers: Remote.NotAsked,
  openSeaStatus: Remote.NotAsked,
  orderFlow: {
    fees: Remote.NotAsked,
    isSubmitting: false,
    matchingOrder: Remote.NotAsked,
    orderToMatch: null,
    prevStep: null,
    seaportOffer: null,
    seaportOrder: null,
    status: null,
    step: null,
    userHasPendingTxR: Remote.NotAsked,

    wrapEthFees: Remote.NotAsked
  },
  search: Remote.NotAsked,
  userPreferences: Remote.NotAsked
}

const nftsSlice = createSlice({
  initialState,
  name: 'nfts',
  reducers: {
    acceptOffer: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        buy: UnsignedOrder
        gasData: GasDataI
        sell: UnsignedOrder
      }>
    ) => {},
    cancelListing: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        gasData: GasDataI
        order: SeaportRawOrder
      }>
    ) => {},
    cancelOffer: (
      state,
      action: PayloadAction<{ asset: NftAsset; gasData: GasDataI; offer: SeaportOffer | null }>
    ) => {},
    createOffer: (
      state,
      action: PayloadAction<{
        amount?: string
        amtToWrap?: string
        asset: NftAsset
        coin?: string
        expirationTime: number
        offerFees: GasDataI
        order?: NftOrder
        wrapFees?: GasDataI
      }>
    ) => {},
    createOrder: (
      state,
      action: PayloadAction<{
        asset: NftAsset
        buy: UnsignedOrder
        gasData: GasDataI
        sell: UnsignedOrder
      }>
    ) => {},
    createSellOrder: (
      state,
      action: PayloadAction<{
        asset: NftAssetsType[0]
        endPrice: number | null
        expirationMinutes: number
        paymentTokenAddress: string | undefined
        reservePrice: number | undefined
        startPrice: number
        waitForHighestBid: boolean | undefined
      }>
    ) => {},
    createTransfer: (
      state,
      action: PayloadAction<{
        asset: NftAssetsType[0]
        gasData: GasDataI
        to: string
      }>
    ) => {},
    fetchFees: (
      state,
      action: PayloadAction<
        | {
            operation: GasCalculationOperations.AcceptOffer
            order: NftOrder
          }
        | {
            asset: NftAsset
            offer: string
            operation: GasCalculationOperations.CreateOffer
            order?: NftOrder
            paymentTokenAddress: string
          }
        | {
            operation: GasCalculationOperations.Buy
            order: NftOrder
            paymentTokenAddress?: string
          }
        | {
            asset: NftAsset
            operation: GasCalculationOperations.Transfer
            to: string
          }
        | {
            operation: GasCalculationOperations.CancelOrder
            order: SeaportRawOrder
          }
        | {
            offer: SeaportOffer
            operation: GasCalculationOperations.CancelOffer
          }
      >
    ) => {},
    fetchFeesFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.fees = Remote.Failure(action.payload)
    },
    fetchFeesLoading: (state) => {
      state.orderFlow.fees = Remote.Loading
    },
    fetchFeesSuccess: (
      state,
      action: PayloadAction<Await<ReturnType<typeof calculateGasFees>>>
    ) => {
      state.orderFlow.fees = Remote.Success(action.payload)
    },
    fetchFeesWrapEth: (
      state,
      action: PayloadAction<{ operation: GasCalculationOperations.WrapEth }>
    ) => {},
    fetchFeesWrapEthFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.wrapEthFees = Remote.Failure(action.payload)
    },
    fetchFeesWrapEthLoading: (state) => {
      state.orderFlow.wrapEthFees = Remote.Loading
    },
    fetchFeesWrapEthSuccess: (
      state,
      action: PayloadAction<Await<ReturnType<typeof calculateGasFees>>>
    ) => {
      state.orderFlow.wrapEthFees = Remote.Success(action.payload)
    },
    fetchLatestPendingTxsFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.userHasPendingTxR = Remote.Failure(action.payload)
    },
    fetchLatestPendingTxsLoading: (state) => {
      state.orderFlow.userHasPendingTxR = Remote.Loading
    },
    fetchLatestPendingTxsSuccess: (state, action: PayloadAction<boolean>) => {
      state.orderFlow.userHasPendingTxR = Remote.Success(action.payload)
    },
    fetchMatchingOrder: (state) => {},
    fetchMatchingOrderFailure: (state, action: PayloadAction<string>) => {
      state.orderFlow.matchingOrder = Remote.Failure(action.payload)
    },
    fetchMatchingOrderLoading: (state) => {
      state.orderFlow.matchingOrder = Remote.Loading
    },
    fetchMatchingOrderSuccess: (
      state,
      action: PayloadAction<{ buy: NftOrder; sell: NftOrder }>
    ) => {
      state.orderFlow.matchingOrder = Remote.Success(action.payload)
    },
    fetchNftOrderAsset: () => {},
    fetchNftUserPreferences: (state) => {},
    fetchNftUserPreferencesFailure: (state, action: PayloadAction<string>) => {
      state.userPreferences = Remote.Failure(action.payload)
    },
    fetchNftUserPreferencesLoading: (state) => {
      state.userPreferences = Remote.Loading
    },
    fetchNftUserPreferencesSuccess: (
      state,
      action: PayloadAction<NftUserPreferencesReturnType>
    ) => {
      state.userPreferences = Remote.Success(action.payload)
    },
    fetchOpenSeaAsset: (
      state,
      action: PayloadAction<{
        asset_contract_address: string
        defaultEthAddr: string | undefined
        token_id: string
      }>
    ) => {},
    fetchOpenSeaAssetFailure: (state, action: PayloadAction<string>) => {
      state.openSeaAsset = Remote.Failure(action.payload)
    },
    fetchOpenSeaAssetLoading: (state) => {
      state.openSeaAsset = Remote.Loading
    },
    fetchOpenSeaAssetSuccess: (state, action: PayloadAction<NftAsset>) => {
      state.openSeaAsset = Remote.Success(action.payload)
    },
    fetchOpenSeaSeaportOffers: (
      state,
      action: PayloadAction<{
        asset_contract_address: string
        token_id: string
      }>
    ) => {},
    fetchOpenSeaSeaportOffersFailure: (state, action: PayloadAction<string>) => {
      state.openSeaSeaportOffers = Remote.Failure(action.payload)
    },
    fetchOpenSeaSeaportOffersLoading: (state) => {
      state.openSeaSeaportOffers = Remote.Loading
    },
    fetchOpenSeaSeaportOffersSuccess: (state, action: PayloadAction<SeaportOffersResponseType>) => {
      state.openSeaSeaportOffers = Remote.Success(action.payload)
    },
    fetchOpenseaStatus: () => {},
    fetchOpenseaStatusFailure: (state, action: PayloadAction<OpenSeaStatus>) => {
      state.openSeaStatus = Remote.Failure(action.payload)
    },
    fetchOpenseaStatusLoading: (state) => {
      state.openSeaStatus = Remote.Loading
    },
    fetchOpenseaStatusSuccess: (state, action: PayloadAction<OpenSeaStatus>) => {
      state.openSeaStatus = Remote.Success(action.payload)
    },
    handleRouterChange: (state, action: PayloadAction<{ location: { pathname: string } }>) => {},
    nftOrderFlowClose: (state) => {
      state.orderFlow = initialState.orderFlow
    },
    nftOrderFlowOpen: (
      state,
      action: PayloadAction<
        | {
            asset_contract_address: string
            offer?: never
            order?: never
            seaportOffer: SeaportOffer
            seaportOrder?: never
            step: NftOrderStepEnum.CANCEL_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            offer?: never
            order?: never
            seaportOffer: SeaportOffer
            seaportOrder?: never
            step: NftOrderStepEnum.ACCEPT_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            offer?: never
            order: RawOrder
            seaportOffer?: never
            seaportOrder?: never
            step: NftOrderStepEnum.BUY
            token_id: string
          }
        | {
            asset_contract_address: string
            offer?: never
            order?: never
            seaportOffer?: never
            seaportOrder: SeaportRawOrder
            step: NftOrderStepEnum.CANCEL_LISTING
            token_id: string
          }
        | {
            asset_contract_address: string
            offer?: never
            order?: RawOrder
            seaportOffer?: never
            seaportOrder?: never
            step: NftOrderStepEnum.MAKE_OFFER
            token_id: string
          }
        | {
            asset_contract_address: string
            offer?: never
            order?: never
            seaportOffer?: never
            seaportOrder?: never
            step: NftOrderStepEnum
            token_id: string
          }
      >
    ) => {
      state.orderFlow.step = action.payload.step

      if (action.payload.seaportOffer) {
        state.orderFlow.seaportOffer = action.payload.seaportOffer
      } else if (action.payload.seaportOrder) {
        state.orderFlow.seaportOrder = action.payload.seaportOrder
      } else if (action.payload.order) {
        state.orderFlow.orderToMatch = action.payload.order
      }
    },
    nftSearch: (state, action: PayloadAction<{ search: string }>) => {},
    nftSearchFailure: (state, action: PayloadAction<string>) => {
      state.search = Remote.Failure(action.payload)
    },
    nftSearchLoading: (state) => {
      state.search = Remote.Loading
    },
    nftSearchSuccess: (state, action: PayloadAction<ExplorerGatewaySearchType>) => {
      state.search = Remote.Success(action.payload)
    },
    resetNftAssets: (state) => {
      state.assets.atBound = false
      state.assets.page = 0
      state.assets.isLoading = false
      state.assets.list = []
    },
    resetNftFees: (state) => {
      state.orderFlow.fees = Remote.NotAsked
    },
    setActiveSlug: (state, action: PayloadAction<{ slug: string }>) => {
      state.activeSlug = action.payload.slug
    },
    setAssetBounds: (state, action: PayloadAction<{ atBound: boolean }>) => {
      state.assets.atBound = action.payload.atBound
    },
    setAssetData: (state, action: PayloadAction<{ collection?: string; page?: number }>) => {
      state.assets.collection = action.payload.collection || 'all'
      state.assets.page = action.payload.page || 0
    },
    setNftOrderStatus: (state, action: PayloadAction<NftOrderStatusEnum>) => {
      state.orderFlow.status = action.payload
    },
    setOrderFlowIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.orderFlow.isSubmitting = action.payload
    },
    setOrderFlowPrevStep: (state, action: PayloadAction<{ prevStep: NftOrderStepEnum }>) => {
      state.orderFlow.prevStep = action.payload.prevStep
    },
    setOrderFlowStep: (state, action: PayloadAction<{ step: NftOrderStepEnum }>) => {
      state.orderFlow.step = action.payload.step
    },
    setOrderToMatch: (state, action: PayloadAction<{ order: RawOrder }>) => {
      state.orderFlow.orderToMatch = action.payload.order
    },
    updateUserPreferences: (
      state,
      action: PayloadAction<{ userPrefs: NftUserPreferencesType }>
    ) => {}
  }
})

const { actions } = nftsSlice
const nftsReducer = nftsSlice.reducer
export { actions, nftsReducer }
