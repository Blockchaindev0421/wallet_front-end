import React from 'react'

import ImportedAddresses from './ImportedAddresses'
import Wallets from './Wallets'

export default class BchAddressesContainer extends React.PureComponent {
  render () {
    return (
      <React.Fragment>
        <Wallets />
        <ImportedAddresses />
      </React.Fragment>
    )
  }
}
