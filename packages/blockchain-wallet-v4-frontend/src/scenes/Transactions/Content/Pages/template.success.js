import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import TransactionListItem from 'components/TransactionListItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`

const Success = props => {
  const minConfirms = props.coin === 'ETH' ? 12 : 3
  return (
    <Wrapper>
      {props.transactions.map(transaction => (
        <TransactionListItem
          key={transaction.hash}
          transaction={transaction}
          coin={props.coin}
          minConfirmations={minConfirms}
          currency={props.currency}
          buySellPartner={props.buySellPartner}
        />
      ))}
    </Wrapper>
  )
}

Success.propTypes = {
  transactions: PropTypes.array.isRequired
}

export default Success
