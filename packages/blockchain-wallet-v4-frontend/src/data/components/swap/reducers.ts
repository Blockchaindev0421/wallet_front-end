import * as AT from './actionTypes'
import { SwapActionTypes, SwapState } from './types'

const INITIAL_STATE: SwapState = {
  side: 'BASE',
  step: 'INIT_SWAP'
}

export function swapReducer (
  state = INITIAL_STATE,
  action: SwapActionTypes
): SwapState {
  switch (action.type) {
    case AT.SET_STEP:
      switch (action.payload.step) {
        case 'INIT_SWAP':
          return {
            ...state,
            step: action.payload.step
          }
        case 'COIN_SELECTION':
          return {
            ...state,
            step: action.payload.step,
            side: action.payload.options.side
          }
      }
      break
    default:
      return state
  }
}
