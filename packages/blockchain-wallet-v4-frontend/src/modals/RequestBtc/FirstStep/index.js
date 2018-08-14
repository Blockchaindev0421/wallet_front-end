import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, prop } from 'ramda'

import { actions } from 'data'
import { getData, getInitialValues } from './selectors'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { Remote } from 'blockchain-wallet-v4/src'

class FirstStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClickQRCode = this.handleClickQRCode.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidMount () {
    this.init()
  }

  componentDidUpdate (prevProps) {
    prevProps.data.map(x => {
      if (equals(prop('coin', x), 'ETH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestEther')
      } else if (equals(prop('coin', x), 'BCH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestBch')
      }
    })
  }

  componentDidUpdate (prevProps) {
    if (
      !Remote.Success.is(prevProps.initialValues) &&
      Remote.Success.is(this.props.initialValues)
    ) {
      this.init()
    }
  }

  init () {
    this.props.initialValues.map(x => {
      this.props.formActions.initialize('requestBitcoin', x)
    })
  }

  handleClickQRCode (value) {
    this.props.modalActions.showModal('QRCode', { value })
  }

  handleSubmit (e) {
    e.preventDefault()
    const {
      accountIdx,
      addressIdx,
      message,
      receiveAddress
    } = this.props.data.getOrElse({})
    this.props.requestBtcActions.firstStepSubmitClicked({
      accountIdx,
      addressIdx,
      message
    })
    this.props.setReceiveAddress(receiveAddress)
    this.props.nextStep()
  }

  handleRefresh () {
    const { bitcoinDataActions, initialValues } = this.props
    if (!Remote.Success.is(initialValues)) return bitcoinDataActions.fetchData()

    this.init()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: value => (
        <Success
          message={value.message}
          addressIdx={value.addressIdx}
          accountIdx={value.accountIdx}
          receiveAddress={value.receiveAddress}
          handleClickQRCode={() => this.handleClickQRCode(value)}
          handleSubmit={this.handleSubmit}
        />
      ),
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  initialValues: getInitialValues(state),
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  requestBtcActions: bindActionCreators(
    actions.components.requestBtc,
    dispatch
  ),
  bitcoinDataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStepContainer)
