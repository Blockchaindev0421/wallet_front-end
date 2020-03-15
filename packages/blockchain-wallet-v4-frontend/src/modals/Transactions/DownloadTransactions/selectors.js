import { assoc, curry, map, prop } from 'ramda'
import { createSelector } from 'reselect'
import { selectors } from 'data'
import { TXNotes, Wallet } from 'blockchain-wallet-v4/src/types'

import { formatTxData, reportHeaders } from './model'

export const getData = (state, coin) => {
  switch (coin) {
    case 'BCH':
      return getBchData(state)
    case 'PAX':
      return getPaxData(state)
    case 'ETH':
      return getEthData(state)
    default:
      return getBtcData(state)
  }
}

const getPaxData = createSelector(
  [state => selectors.core.data.eth.getErc20TransactionHistory(state, 'pax')],
  dataR => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'USD-D'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getEthData = createSelector(
  [selectors.core.data.eth.getTransactionHistory],
  dataR => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'ETH'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getBtcData = createSelector(
  [
    selectors.core.wallet.getWallet,
    selectors.core.data.btc.getTransactionHistory
  ],
  (wallet, dataR) => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'BTC'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR
        .map(assocBTCNotes(wallet))
        .map(transform)
        .getOrElse([])
    }
  }
)

const getBchData = createSelector(
  [
    selectors.core.kvStore.bch.getBchTxNotes,
    selectors.core.data.bch.getTransactionHistory
  ],
  (notesR, dataR) => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'BCH'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR
        .map(assocBCHNotes(notesR.getOrElse({})))
        .map(transform)
        .getOrElse([])
    }
  }
)

const assocBTCNotes = curry((wallet, transactions) => {
  return transactions.map(transaction => {
    const hash = prop('tx', transaction)
    const note = TXNotes.selectNote(hash, Wallet.selectTxNotes(wallet))
    return note ? assoc('note', note, transaction) : transaction
  })
})

const assocBCHNotes = curry((notes, transactions) => {
  return transactions.map(transaction => {
    const hash = prop('tx', transaction)
    const note = notes && notes[hash]
    return note ? assoc('note', note, transaction) : transaction
  })
})
