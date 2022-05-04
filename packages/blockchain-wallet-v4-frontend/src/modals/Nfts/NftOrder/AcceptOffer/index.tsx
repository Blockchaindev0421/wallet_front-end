import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'
import { Row, Value } from 'components/Flyout/model'
import { RootState } from 'data/rootReducer'

import { AssetDesc, CTARow, FullAssetImage, StickyCTA } from '../../components'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import AcceptOfferFees from './fees'
import { getData } from './selectors'

const AcceptOffer: React.FC<Props> = (props) => {
  const { close, data, nftActions } = props

  return (
    <>
      {data.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => <NftFlyoutLoader />,
        NotAsked: () => <NftFlyoutLoader />,
        Success: (val) => (
          <>
            <div style={{ position: 'relative' }}>
              <Icon
                onClick={() => close()}
                name='arrow-left'
                cursor
                role='button'
                style={{ left: '40px', position: 'absolute', top: '40px' }}
              />
              <Icon
                onClick={() => close()}
                name='close'
                cursor
                role='button'
                style={{ position: 'absolute', right: '40px', top: '40px' }}
              />
              <FullAssetImage cropped backgroundImage={val.asset.image_url.replace(/=s\d*/, '')} />
            </div>
            <AssetDesc>
              <Text size='16px' color='grey900' weight={600}>
                {val.asset.collection?.name}
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='grey900' weight={600}>
                {val.asset.name}
              </Text>
            </AssetDesc>
            <Row>
              <Title>
                <FormattedMessage id='copy.description' defaultMessage='Description' />
              </Title>
              <Value>
                {val.asset.description || (
                  <FormattedMessage id='copy.none_found' defaultMessage='None found.' />
                )}
              </Value>
            </Row>
            <StickyCTA>
              <CTARow>
                <Title style={{ display: 'flex' }}>
                  <FormattedMessage id='copy.offer' defaultMessage='Offer' />
                </Title>
                <Value>
                  <div style={{ display: 'flex' }}>
                    <CoinDisplay
                      size='14px'
                      color='black'
                      weight={600}
                      coin={val.matchingOrder.buy.paymentTokenContract?.symbol}
                    >
                      {val.matchingOrder.buy.basePrice}
                    </CoinDisplay>
                    &nbsp;-&nbsp;
                    <FiatDisplay
                      size='12px'
                      color='grey600'
                      weight={600}
                      coin={val.matchingOrder.buy.paymentTokenContract?.symbol}
                    >
                      {val.matchingOrder.buy.basePrice}
                    </FiatDisplay>
                  </div>
                </Value>
              </CTARow>
              <AcceptOfferFees {...props} />
              {props.orderFlow.fees.cata({
                Failure: (e) => (
                  <>
                    <Text
                      size='14px'
                      weight={600}
                      style={{ marginBottom: '8px', maxHeight: '200px' }}
                    >
                      {e}
                    </Text>
                    <Button jumbo nature='sent' fullwidth data-e2e='n/a' disabled>
                      <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
                    </Button>
                  </>
                ),
                Loading: () => (
                  <Button jumbo nature='primary' fullwidth data-e2e='n/a' disabled>
                    <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
                  </Button>
                ),
                NotAsked: () => null,
                Success: (fees) => (
                  <Button
                    jumbo
                    nature='primary'
                    fullwidth
                    data-e2e='acceptNftOffer'
                    disabled={props.orderFlow.isSubmitting}
                    type='submit'
                    onClick={() =>
                      nftActions.acceptOffer({
                        gasData: fees,
                        ...val.matchingOrder
                      })
                    }
                  >
                    {props.orderFlow.isSubmitting ? (
                      <HeartbeatLoader color='blue100' height='20px' width='20px' />
                    ) : (
                      <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
                    )}
                  </Button>
                )
              })}
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AcceptOffer)
