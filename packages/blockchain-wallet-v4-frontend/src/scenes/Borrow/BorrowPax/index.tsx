import { Box } from 'components/Box'
import { Button, Icon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Props, State } from '..'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const CustomBox = styled(Box)`
  background-image: url('/img/buy-sell-learn-more.png');
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/buy-sell-learn-more.png') 1x,
    url('/img/buy-sell-learn-more@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

class BorrowPax extends PureComponent<Props & State> {
  render () {
    return (
      <CustomBox>
        <div>
          <Icon name='borrow' color='blue600' size='32px' />
          <Text
            size='20px'
            color='grey800'
            weight={600}
            style={{ marginTop: '16px' }}
          >
            <FormattedMessage
              id='scenes.borrow.borrowusd'
              defaultMessage='Borrow USD Pax Today'
            />
          </Text>
          <Text
            size='14px'
            color='grey600'
            weight={500}
            style={{ marginTop: '4px', lineHeight: 1.5 }}
          >
            <FormattedMessage
              id='scenes.borrow.getusdpax'
              defaultMessage='Get USD Pax directly from your Blockchain Wallet, use your bitcoin as collateral. You need to be Gold level to benefit from this new offering.'
            />
          </Text>
        </div>
        {this.props.isDisabled ? (
          <Button
            nature='primary'
            data-e2e='verifyIdentityBorrow'
            onClick={() =>
              this.props.identityVerificationActions.verifyIdentity(2)
            }
          >
            <FormattedMessage
              id='scenes.borrow.verifyid'
              defaultMessage='Upgrade Now'
            />
          </Button>
        ) : (
          <Button
            style={{ marginTop: '16px' }}
            nature='light'
            fullwidth
            data-e2e='paxLearnMore'
          >
            <FormattedMessage
              id='scenes.borrow.learnmore'
              defaultMessage='Learn More'
            />
          </Button>
        )}
      </CustomBox>
    )
  }
}

export default BorrowPax
