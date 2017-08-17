import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/shared/CoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding-left: 15px;
  box-sizing: border-box;
`
const Header = styled.div`
  width: 100%;
  padding: 10px 0;
`
const Content = styled.div`
  width: 100%;
  border: 1px solid #D2CED0;
  padding: 10px;
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #D2CED0;
  padding: 10px 0;
`
const LastRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`

const BalanceSummary = (props) => {
  return (
    <Wrapper>
      <Header>
        <FormattedMessage id='scenes.home.balancesummary.title' defaultMessage='Balance summary' />
      </Header>
      <Content>
        { props.balances.map(function (balance, index) {
          return (
            <Row key={index}>
              <Text size='12px'>{balance.title}</Text>
              { props.coinDisplayed
                ? <CoinDisplay small light>{balance.amount}</CoinDisplay>
                : <CurrencyDisplay small light>{balance.amount}</CurrencyDisplay>
              }
            </Row>
          )
        })}
        <LastRow>
          <FormattedMessage id='scenes.home.balancesummary.total' defaultMessage='Total' />
          { props.coinDisplayed
            ? <CoinDisplay small>{props.total}</CoinDisplay>
            : <CurrencyDisplay small>{props.total}</CurrencyDisplay>
          }
        </LastRow>
      </Content>
    </Wrapper>
  )
}

BalanceSummary.propTypes = {
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number
    })
  ),
  total: PropTypes.number.isRequired
}

export default BalanceSummary
