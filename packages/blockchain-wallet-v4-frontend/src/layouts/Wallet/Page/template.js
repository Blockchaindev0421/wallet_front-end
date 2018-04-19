import React from 'react'
import styled from 'styled-components'

const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  height: calc(100% - 115px);
  width: 100%;
  overflow-y: auto;
`

const Page = (props) => (
  <PageContainer>
    {props.children}
  </PageContainer>
)

export default Page
