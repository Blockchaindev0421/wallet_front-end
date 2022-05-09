import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { useRemote } from 'hooks'

import { NftOrderStatusEnum } from '../../../../data/components/nfts/types'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'

const Wrapper = styled(Text)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-style: normal;
  height: 100%;
  font-weight: 600;
  font-size: 24px;
`

const ButtonWrapper = styled.div`
  display: block;
  padding: 0 40px;
  position: absolute;
  bottom: 2em;
  width: 100%;
  box-sizing: border-box;
`

const NftOrderStatus: React.FC<Props> = (props) => {
  const { openSeaAssetR } = props

  const returnToMarketPlace = () => {
    props.close()
  }

  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader />
  if (openSeaAsset.error || !openSeaAsset.hasData) return <Text>{openSeaAsset.error}</Text>

  const val = openSeaAsset.data

  if (!val) return <Text>No data</Text>

  return (
    <div style={{ height: '100%' }}>
      {props.orderFlow.status === NftOrderStatusEnum.WRAP_ETH ? (
        <Wrapper>
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        </Wrapper>
      ) : props.orderFlow.status === NftOrderStatusEnum.POST_OFFER ? (
        <Wrapper>
          <img
            style={{
              borderRadius: '8px',
              height: '64px',
              marginRight: '12px',
              padding: '1em',
              width: 'auto'
            }}
            alt='nft-asset'
            src={val.image_url}
          />
          <div>Submitting Offer For</div>
          <div>{val.name}</div>
          <SpinningLoader height='14px' width='14px' borderWidth='3px' />
        </Wrapper>
      ) : props.orderFlow.status === NftOrderStatusEnum.POST_OFFER_SUCCESS ? (
        <>
          <Wrapper>
            <img
              style={{
                borderRadius: '8px',
                height: '64px',
                marginRight: '12px',
                padding: '1em',
                width: 'auto'
              }}
              alt='nft-asset'
              src={val.image_url}
            />
            <div>Offer Successfully Sent For</div>
            <div>{val.name}</div>
          </Wrapper>
          <ButtonWrapper>
            <Button
              nature='primary'
              jumbo
              onClick={returnToMarketPlace}
              fullwidth
              data-e2e='returnToMarketPlace'
            >
              <FormattedMessage
                id='buttons.return_to_marketplace'
                defaultMessage='Return To Marketplace'
              />
            </Button>
          </ButtonWrapper>
        </>
      ) : (
        <NftFlyoutLoader />
      )}
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NftOrderStatus)
