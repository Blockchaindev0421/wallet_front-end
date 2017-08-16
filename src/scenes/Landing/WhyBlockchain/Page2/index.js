import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import sophisticated from 'img/sophisticated.svg'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  @media(min-width: 768px) { flex-direction: row; }
`
const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  min-height: 150px;
  padding: 0 50px;
  text-align: justify;
`
const BlockHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const BlockIconSophisticated = styled.img.attrs({
  src: sophisticated
})`
  height: 50px;
  margin: 15px 0;
`

const Page2 = () => (
  <Page>
    <Block>
      <BlockHeader>
        <BlockIconSophisticated />
        <Text id='scenes.landing.wallet.sophisticated' text='Sophisticated' regular uppercase />
      </BlockHeader>
      <Text id='scenes.landing.wallet.sophisticated_explain' text='Hierarchical deterministic addresses. Dynamic transaction fees. Monitoring and spending from Watch Only addresses.' small lighter />
    </Block>
    <Block>
      <BlockHeader>
        <BlockIconSophisticated />
        <Text id='scenes.landing.wallet.global' text='Global' regular uppercase />
      </BlockHeader>
      <Text id='scenes.landing.wallet.global_explain' text='140+ countries served. 20+ currency conversion rates, including JPY, RUB, SGD, USD, CNY, EUR, GBP, and many more. 25+ languages.' small lighter />
    </Block>
    <Block>
      <BlockHeader>
        <BlockIconSophisticated />
        <Text id='scenes.landing.wallet.supported' text='Always supported' regular uppercase />
      </BlockHeader>
      <Text id='scenes.landing.wallet.supported_explain' text='Should you need help or have a question, our best in class support team will always be there for you.' small lighter />
    </Block>
  </Page>
)

export default Page2
