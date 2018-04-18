import React, { Fragment } from 'react'
import { Text, Icon, Button } from 'blockchain-info-components'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { StepTransition } from 'components/Utilities/Stepper'
import QuoteInput from './QuoteInput'
import FundingSource from 'components/BuySell/FundingSource'
import { MethodContainer } from 'components/BuySell/styled.js'

const quoteInputSpec = {
  method: 'buy',
  input: 'usd',
  output: 'btc'
}

const BuyCheckout = ({ quoteR, account, onFetchQuote, reason, finishAccountSetup, limits }) => {
  const limitsHelper = (quoteR, limits) => {
    if (quoteR.error) return true
    return quoteR.map(q => {
      if (q.baseCurrency === 'USD') return +q.baseAmount > limits.buy.max || +q.baseAmount < limits.buy.min
      if (q.baseCurrency === 'BTC') return +q.quoteAmount > limits.buy.max || q.quoteAmount < limits.buy.min
    }).data
  }

  const submitButtonHelper = () => (
    reason === 'has_remaining_buy_limit'
      ? <StepTransition next Component={Button} style={spacing('mt-45')} nature='primary' fullwidth disabled={!Remote.Success.is(quoteR) || limitsHelper(quoteR, limits)}>
        <FormattedMessage id='review_order' defaultMessage='Review Order' />
      </StepTransition>
      : <div style={{ ...flex('col'), ...spacing('mt-15') }}>
        <Text size='14px' weight={300}>
          You need to finish setting up your account before you can buy and sell.
        </Text>
        <Button style={spacing('mt-15')} nature='primary' onClick={finishAccountSetup}>
          Continue Where You Left Off
        </Button>
      </div>
  )

  return (
    <ExchangeCheckoutWrapper>
      <Text style={spacing('ml-10')} size='16px' weight={600}>
        <FormattedMessage id='buy.output_method.title' defaultMessage='I want to buy' />
      </Text>
      <MethodContainer>
        <Icon name='bitcoin-in-circle-filled' color='bitcoin-orange' size='30px' />
        <div style={{ ...flex('col'), ...spacing('ml-20') }}>
          <Text size='14px' weight={300} uppercase>Bitcoin</Text>
          <Text size='12px' weight={300}>
            {'@ '}
            {quoteR
              .map((quote) => '$' + quote.rate)
              .getOrElse(
                <Fragment>
                  <FormattedMessage id='loading' defaultMessage='Loading' />
                  {'...'}
                </Fragment>
              )}
          </Text>
        </div>
      </MethodContainer>
      <Text style={spacing('ml-10')} size='16px' weight={600}>
        <FormattedMessage id='buy.input_method.title' defaultMessage='I will pay with' />
      </Text>
      <MethodContainer>
        <Icon name='bank-filled' size='30px' />
        <FundingSource account={account} />
      </MethodContainer>
      <Text style={spacing('ml-10')} size='16px' weight={600}>
        <FormattedMessage id='amount' defaultMessage='Amount' />
      </Text>
      <div style={spacing('mt-15')}>
        <QuoteInput
          quoteR={quoteR}
          initialAmount='250.00'
          debounce={500}
          spec={quoteInputSpec}
          onFetchQuote={onFetchQuote}
          disabled={reason}
          limits={limits}
        />
      </div>
      { submitButtonHelper() }
    </ExchangeCheckoutWrapper>
  )
}

export default BuyCheckout
