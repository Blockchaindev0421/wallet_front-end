import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Donation from './template.js'

class DonationContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleBack = this.handleBack.bind(this)
  }

  handleBack () {
    this.props.modalActions.closeModal()
  }

  render () {
    return <Donation {...this.props} handleBack={this.handleBack} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(DonationContainer)
