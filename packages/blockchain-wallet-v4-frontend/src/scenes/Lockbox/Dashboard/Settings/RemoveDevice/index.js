import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DeviceStatus from './template'
import React from 'react'

class RemoveDeviceContainer extends React.PureComponent {
  deleteDevice = () => {
    this.props.lockboxActions.deleteDevice(this.props.deviceIndex)
  }

  render() {
    const { deviceName } = this.props
    return (
      <DeviceStatus deleteDevice={this.deleteDevice} deviceName={deviceName} />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  deviceName: selectors.core.kvStore.lockbox
    .getDeviceName(state, ownProps.deviceIndex)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RemoveDeviceContainer)
