/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'

import * as T from './types'

const INITIAL_STATE: T.WalletConnectState = {
  sessionDetails: undefined,
  step: Remote.NotAsked
}

const walletConnectSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'walletConnect',
  reducers: {
    handleSessionCallRequest: (state, action: PayloadAction<T.RequestMessagePayload>) => {},
    handleSessionDisconnect: (state, action) => {},
    handleSessionRequest: (state, action) => {},
    initWalletConnect: (state, action: PayloadAction<string>) => {},
    respondToSessionRequest: (state, action: PayloadAction<T.RespondToSessionRequestPayload>) => {
      state.sessionDetails = action.payload.sessionDetails
    },
    respondToTxSendRequest: (state, action: PayloadAction<T.RespondToTxSendRequestPayload>) => {},
    setSessionDetails: (state, action: PayloadAction<T.SessionDetailsType>) => {},
    setStep: (state, action: PayloadAction<T.WalletConnectStepPayload>) => {
      const { payload } = action
      state.step = Remote.Success({
        data: payload.data,
        error: payload.error,
        name: payload.name
      })
    }
  }
})

export const { initWalletConnect } = walletConnectSlice.actions
const { actions } = walletConnectSlice
const walletConnectReducer = walletConnectSlice.reducer
export { actions, walletConnectReducer }
