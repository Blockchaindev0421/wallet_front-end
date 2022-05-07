import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'
import { Row, Value } from 'components/Flyout/model'
import { useRemote } from 'hooks'

import { AssetDesc, CTARow, FullAssetImage, StickyCTA } from '../../components'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import CancelListingFees from './fees'

const CancelListing: React.FC<Props> = (props) => {
  const { close, nftActions, openSeaAssetR, orderFlow } = props
  const { listingToCancel } = orderFlow

  const disabled = Remote.Loading.is(orderFlow.fees) || props.orderFlow.isSubmitting

  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader />
  if (openSeaAsset.error || !openSeaAsset.hasData) return <Text>{openSeaAsset.error}</Text>

  const val = openSeaAsset.data

  if (!val) return <Text>No data</Text>

  return (
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
        <FullAssetImage cropped backgroundImage={val?.image_url.replace(/=s\d*/, '')} />
      </div>
      <AssetDesc>
        <Text size='16px' color='grey900' weight={600}>
          {val?.collection?.name}
        </Text>
        <Text style={{ marginTop: '4px' }} size='20px' color='grey900' weight={600}>
          {val?.name}
        </Text>
      </AssetDesc>
      <Row>
        <Title>
          <FormattedMessage id='copy.description' defaultMessage='Description' />
        </Title>
        <Value>
          {val?.description || (
            <FormattedMessage id='copy.none_found' defaultMessage='None found.' />
          )}
        </Value>
      </Row>
      <StickyCTA>
        <CTARow>
          <Title style={{ display: 'flex' }}>
            <FormattedMessage id='copy.listing' defaultMessage='Listing Price' />
          </Title>
          <Value>
            <div style={{ display: 'flex' }}>
              <CoinDisplay
                size='14px'
                color='black'
                weight={600}
                coin={listingToCancel?.payment_token_contract?.symbol}
              >
                {listingToCancel?.base_price}
              </CoinDisplay>
              &nbsp;-&nbsp;
              <FiatDisplay
                size='12px'
                color='grey600'
                weight={600}
                coin={listingToCancel?.payment_token_contract?.symbol}
              >
                {listingToCancel?.base_price}
              </FiatDisplay>
            </div>
          </Value>
        </CTARow>
        <CancelListingFees {...props} />
        {orderFlow.fees.cata({
          Failure: () => (
            <Text size='14px' weight={600}>
              <FormattedMessage
                id='copy.no_active_offers_listings'
                defaultMessage='Error. You may not have any active listings for this asset.'
              />
            </Text>
          ),
          Loading: () => null,
          NotAsked: () => null,
          Success: (val) =>
            listingToCancel ? (
              <Button
                jumbo
                nature='primary'
                fullwidth
                data-e2e='cancelListingNft'
                disabled={disabled}
                onClick={() => nftActions.cancelListing({ gasData: val, order: listingToCancel })}
              >
                {props.orderFlow.isSubmitting ? (
                  <HeartbeatLoader color='blue100' height='20px' width='20px' />
                ) : (
                  <FormattedMessage id='copy.cancel_listing' defaultMessage='Cancel Listing' />
                )}
              </Button>
            ) : (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='copy.no_active_listings'
                  defaultMessage='Error. You may not have any active listings for this asset.'
                />
              </Text>
            )
        })}
      </StickyCTA>
    </>
  )
}

type Props = OwnProps

export default CancelListing
