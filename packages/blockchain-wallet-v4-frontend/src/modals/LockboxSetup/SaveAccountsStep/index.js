import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ConfirmRecoveryStep from './template'
import { actions } from 'data'

class ConfirmRecoveryStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleStorageChoice = this.handleStorageChoice.bind(this)
  }

  handleStorageChoice (storeXpubs) {
    this.props.lockboxActions.storeDeviceAccounts(storeXpubs)
  }

  render () {
    return <ConfirmRecoveryStep handleStorageChoice={this.handleStorageChoice} />
  }
}
const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ConfirmRecoveryStepContainer)
