import React from 'react'
import {connect} from 'react-redux'
import { prop, mapAccum, head } from 'ramda'

import { selectors } from 'data'
import BalanceSummary from './template.js'

console.log(selectors)

class BalanceSummaryContainer extends React.Component {
  render () {
    const adder = (acc, value) => [acc + (prop('amount', value) || 0), (acc + prop('amount', value) || 0)]
    const total = head(mapAccum(adder, 0, this.props.bitcoinBalances))
    return (
      <BalanceSummary bitcoinBalances={this.props.bitcoinBalances} total={total} coinDisplayed={this.props.coinDisplayed} />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const accountsBalances = selectors.core.common.bitcoin.getAccountsBalances(state)
  const aggregatedLegacyAddressesBalances = selectors.core.common.bitcoin.getAggregatedAddressesBalances(state)
  return {
    bitcoinBalances: [...accountsBalances, aggregatedLegacyAddressesBalances],
    coinDisplayed: selectors.preferences.getCoinDisplayed(state)
  }
}

export default connect(mapStateToProps)(BalanceSummaryContainer)
