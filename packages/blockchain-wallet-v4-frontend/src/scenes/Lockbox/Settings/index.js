import React, { PureComponent } from 'react'
import styled from 'styled-components'

import DeviceName from './DeviceName'
import DeviceStatus from './DeviceStatus'

const AdvancedContainer = styled.div`
  margin-top: 0 !important;
`

export default class LockboxSettings extends PureComponent {
  render () {
    const { deviceId } = this.props
    return (
      <AdvancedContainer>
        <DeviceName deviceId={deviceId} />
        <DeviceStatus deviceId={deviceId} />
      </AdvancedContainer>
    )
  }
}
