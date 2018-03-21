import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import ui from 'redux-ui'
import { getData, getMediums } from './selectors'
import { path } from 'ramda'
import Success from './template.success'

class PaymentContainer extends Component {
  constructor (props) {
    super(props)
    this.getAccounts = this.getAccounts.bind(this)
    this.toConfirmStep = this.toConfirmStep.bind(this)
    this.state = {}
  }

  toConfirmStep () {
    this.props.coinifyActions.coinifyNextStep('confirm')
  }

  render () {
    const { data } = this.props
    console.log('render payment', this.props)
    return data.cata({
      Success: (value) =>
        <Success
          value={value}
          getAccounts={this.getAccounts}
          toConfirmStep={this.toConfirmStep}
        />,
      Failure: (msg) => <div>{msg}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div>Not asked...</div>
    })
  }
}

PaymentContainer.propTypes = {
  ui: PropTypes.object,
  updateUI: PropTypes.function,
  smsVerified: PropTypes.number.isRequired,
  emailVerified: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  data: getData(state),
  userQuote: path(['coinify', 'quote'], state)
})

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: {} })
)

export default enhance(PaymentContainer)
