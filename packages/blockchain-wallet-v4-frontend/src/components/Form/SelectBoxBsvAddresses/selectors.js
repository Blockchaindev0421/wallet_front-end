import {
  assoc,
  curry,
  assocPath,
  compose,
  concat,
  filter,
  has,
  isNil,
  lift,
  map,
  not,
  path,
  prop,
  prepend,
  sequence,
  reduce
} from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const allWallets = {
  label: 'All',
  options: [
    {
      label: 'All Bitcoin SV Wallets',
      value: 'all'
    }
  ]
}

const allImportedAddresses = {
  label: 'Imported Addresses',
  options: [
    {
      label: 'All Imported Bitcoin SV Addresses',
      value: 'allImportedAddresses'
    }
  ]
}

export const getData = (state, ownProps) => {
  const {
    coin,
    exclude = [],
    excludeHDWallets,
    excludeImported,
    excludeWatchOnly,
    includeAll = true
  } = ownProps
  const buildDisplay = wallet => {
    if (has('balance', wallet)) {
      let bsvDisplay = Exchange.displayBsvToBsv({
        value: wallet.balance,
        fromUnit: 'SAT',
        toUnit: 'BSV'
      })
      return wallet.label + ` (${bsvDisplay})`
    }
    return wallet.label
  }
  const isActive = filter(x => !x.archived)
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])

  const formatAddress = addressData => {
    const formattedAddress = {}
    return compose(
      a => assoc('label', prop('addr', addressData), a),
      a => assocPath(['value', 'type'], ADDRESS_TYPES.LEGACY, a),
      a =>
        assocPath(
          ['value', 'balance'],
          path(['info', 'final_balance'], addressData),
          a
        ),
      a => assocPath(['value', 'coin'], coin, a),
      a => assocPath(['value', 'address'], prop('addr', addressData), a),
      a => assoc('value', prop('info', addressData), a)
    )(formattedAddress)
  }

  const formatImportedAddressesData = addressesData => {
    return map(formatAddress, addressesData)
  }

  const getAddressesData = () => {
    const importedAddresses = selectors.core.common.bsv.getActiveAddresses(
      state
    )
    const filterRelevantAddresses = addrs =>
      excludeWatchOnly
        ? filter(addr => not(isNil(prop('priv', addr))), addrs)
        : addrs
    const relevantAddresses = lift(filterRelevantAddresses)(importedAddresses)

    return sequence(Remote.of, [
      selectors.core.common.bsv
        .getAccountsBalances(state)
        .map(isActive)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      excludeImported
        ? Remote.of([])
        : lift(formatImportedAddressesData)(relevantAddresses).map(
            toGroup('Imported Addresses')
          ),
      Remote.of([])
    ]).map(([b1, b2, b3]) => {
      const data = reduce(concat, [], [b1, b2, b3])
      if (includeAll) {
        return { data: prepend(allWallets, data) }
      } else if (excludeHDWallets) {
        return { data: [allImportedAddresses] }
      } else {
        return { data }
      }
    })
  }

  return getAddressesData()
}
