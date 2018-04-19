import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class BalancesChartContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleCoinDisplay = this.handleCoinDisplay.bind(this)
  }

  handleCoinDisplay () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  render () {
    const { data, history, modalsActions } = this.props

    return data.cata({
      Success: (value) => <Success
        balances={value}
        handleCoinDisplay={this.handleCoinDisplay}
        history={history}
        modalsActions={modalsActions}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataMiscActions: bindActionCreators(actions.core.data.misc, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BalancesChartContainer))
