import { assoc, assocPath } from 'ramda'
import * as AT from './actionTypes.js'

const INITIAL_STATE = {
  adverts: [],
  captcha: {},
  charts: {
    price_index_series: []
  },
  logs: [],
  reports: {
    transactions: []
  }
}

const miscReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_ADVERTS: {
      return assoc('adverts', payload, state)
    }
    case AT.SET_CAPTCHA: {
      return assoc('captcha', payload, state)
    }
    case AT.DELETE_CAPTCHA: {
      return assoc('captcha', {}, state)
    }
    case AT.SET_PRICE_INDEX_SERIES: {
      const { data } = payload
      return assocPath(['charts', 'price_index_series'], data, state)
    }
    case AT.SET_LOGS: {
      return assoc('logs', payload, state)
    }
    case AT.DELETE_LOGS: {
      return assoc('logs', {}, state)
    }
    case AT.SET_TRANSACTION_HISTORY: {
      const { data } = payload
      return assocPath(['reports', 'transactions'], data, state)
    }
    default:
      return state
  }
}

export default miscReducer
