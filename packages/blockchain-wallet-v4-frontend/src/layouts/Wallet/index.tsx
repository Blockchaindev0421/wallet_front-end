import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { selectors } from 'data'

import WalletLayout from './template'

class WalletLayoutContainer extends React.PureComponent<Props> {
  render() {
    const { component: Component, computedMatch, isAuthenticated, path, ...rest } = this.props

    let isValid = true
    let coin
    if (path.includes('/transactions')) {
      coin = computedMatch.params.coin
      if (!window.coins[coin]) isValid = false
    }

    return isAuthenticated && isValid ? (
      <Route
        path={path}
        render={(props) => (
          <WalletLayout location={props.location} coin={coin}>
            <Component computedMatch={computedMatch} {...rest} coin={coin} />
          </WalletLayout>
        )}
      />
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: '' } }} />
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & {
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  path: string
}

export default connector(WalletLayoutContainer)
