import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { Title } from 'components/Flyout'
import { Row, Value } from 'components/Flyout/model'
import { useRemote } from 'hooks'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import CancelOfferFees from './fees'

const CancelOffer: React.FC<Props> = (props) => {
  const { close, nftActions, openSeaAssetR, orderFlow } = props
  const { offerToCancel } = orderFlow

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
        <CancelOfferFees {...props} />
        {orderFlow.fees.cata({
          Failure: () => (
            <Text size='14px' weight={600}>
              <FormattedMessage
                id='copy.no_active_offers'
                defaultMessage='Error. You may have already cancelled this offer, or it has expired.'
              />
            </Text>
          ),
          Loading: () => null,
          NotAsked: () => null,
          Success: (gasData) =>
            offerToCancel ? (
              <Button
                jumbo
                nature='primary'
                fullwidth
                data-e2e='cancelOfferNft'
                disabled={disabled}
                onClick={() =>
                  nftActions.cancelOffer({
                    asset: val,
                    gasData,
                    order: offerToCancel
                  })
                }
              >
                {props.orderFlow.isSubmitting ? (
                  <HeartbeatLoader color='blue100' height='20px' width='20px' />
                ) : (
                  <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
                )}
              </Button>
            ) : (
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='copy.no_active_offers'
                  defaultMessage='Error. You may have already cancelled this offer, or it has expired.'
                />
              </Text>
            )
        })}
      </StickyCTA>
    </>
  )
}

type Props = OwnProps

export default CancelOffer
