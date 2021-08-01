import React from 'react'
import styled from 'styled-components'

import { BlockchainLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const Loading = () => (
  <Wrapper>
    <BlockchainLoader width='80px' height='80px' />
    <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
      Loading Wallet Connect
    </Text>
  </Wrapper>
)

export default Loading
