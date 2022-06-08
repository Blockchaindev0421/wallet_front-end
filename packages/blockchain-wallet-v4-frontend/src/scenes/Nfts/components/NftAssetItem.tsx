import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { F } from 'ramda'
import styled from 'styled-components'

import { Button, Image, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { GreyBlueGradientCartridge, GreyCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { AssetsQuery } from 'generated/graphql.types'

import { Asset, AssetCollection, AssetDetails, AssetImageContainer, PriceCTA } from '.'
import NftAssetImageType from './NftAssetImageType'
import NftCollectionImageSmall from './NftCollectionImageSmall'

const XSmallButton = styled(Button)`
  padding: 6px 8px;
  height: auto;
`

const NftAssetItem: React.FC<Props> = ({ asset }) => {
  const [hover, setHover] = useState(false)
  const dispatch = useDispatch()

  const logoClickTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_NFT_CLICKED,
        properties: {
          collection_name: asset.collection.name,
          image_logo: true,
          name_click: false
        }
      })
    )
  }
  const nameClickTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_NFT_CLICKED,
        properties: {
          collection_name: asset.collection.name,
          image_logo: false,
          name_click: true
        }
      })
    )
  }
  const viewDetailsTracking = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_VIEW_BUTTON_VIEWED,
        properties: {}
      })
    )
  }

  const lowestListing = asset.listings
    ? asset.listings.sort((a, b) => Number(a?.starting_price) - Number(b?.starting_price))[0]
    : null

  return !hover ? (
    <Asset key={asset?.token_id} className='asset' onMouseEnter={() => setHover(true)}>
      <LinkContainer
        style={
          asset.image_url
            ? { background: 'black', display: 'flex', height: 'fit-content', position: 'relative' }
            : { display: 'flex', height: '100%', position: 'relative' }
        }
        to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}
      >
        <Link>
          {asset.image_url ? (
            <AssetImageContainer
              className='asset-image-container'
              background={`url(${asset.image_url.replace(/=s\d*/, '')})`}
            />
          ) : (
            <Image width='100%' name='nft-img-placeholder' />
          )}
          <NftAssetImageType
            top='20px'
            right='10px'
            animation_url={asset.animation_url}
            image_url={asset.image_url}
          />
        </Link>
      </LinkContainer>
      <AssetDetails>
        <Flex flexDirection='column' gap={8}>
          <Text style={{ marginTop: '4px' }} size='16px' color='white' weight={600}>
            #{asset?.token_id}
          </Text>
          <LinkContainer
            onClick={logoClickTracking}
            to={`/nfts/collection/${asset.collection.slug}`}
          >
            <Link>
              <Flex alignItems='center' gap={8}>
                {asset.collection.image_url ? (
                  <NftCollectionImageSmall
                    isVerified={asset.collection.safelist_request_status === 'verified'}
                    alt='Dapp Logo'
                    src={asset.collection.image_url}
                    height='16px'
                    width='16px'
                  />
                ) : (
                  <NftCollectionImageSmall
                    isVerified={asset.collection.safelist_request_status === 'verified'}
                    alt='Dapp Logo'
                    src=''
                    height='16px'
                    width='16px'
                  />
                )}
                <AssetCollection onClick={nameClickTracking}>
                  <Text
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    size='14px'
                    color='white'
                    weight={600}
                  >
                    {asset?.collection?.name}
                  </Text>
                </AssetCollection>
              </Flex>
            </Link>
          </LinkContainer>
        </Flex>

        <PriceCTA>
          <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
            {lowestListing && lowestListing.starting_price ? (
              <Flex flexDirection='column' gap={4} alignItems='flex-start'>
                <Text weight={500} color='grey400'>
                  <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
                </Text>
                <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
                  <Link>
                    <CoinDisplay
                      coin={lowestListing.payment_token_symbol || 'ETH'}
                      size='14px'
                      weight={500}
                      lineHeight='21px'
                      style={{
                        background: 'linear-gradient(92.99deg, #9080FF 0.55%, #65A5FF 98.76%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        webkitBackgroundClip: 'text',
                        webkitTextFillColor: 'transparent'
                      }}
                    >
                      {lowestListing.starting_price}
                    </CoinDisplay>
                  </Link>
                </LinkContainer>
              </Flex>
            ) : (
              <Text weight={500} color='white'>
                <FormattedMessage id='copy.not_for_sale' defaultMessage='Not For Sale' />
              </Text>
            )}
          </LinkContainer>
        </PriceCTA>
      </AssetDetails>
    </Asset>
  ) : (
    <Asset onMouseLeave={() => setHover(false)}>
      {/* <LinkContainer
        style={{
          backdropFilter: 'blur(40px)',
          background:
            'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,115,121,0.02) 91%, rgba(0,212,255,1) 100%)',
          height: '100%',
          position: 'relative',
          width: '100%'
        }}
        to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}
      >
        <Link>
          <div
            style={{
              height: '100%',
              position: 'relative',
              width: '100%'
            }}
          />
        </Link>
      </LinkContainer>
      <AssetDetails /> */}
      <LinkContainer
        style={
          asset.image_url
            ? { background: 'black', display: 'flex', height: 'fit-content', position: 'relative' }
            : { display: 'flex', height: '100%', position: 'relative' }
        }
        to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}
      >
        <Link>
          {asset.image_url ? (
            <AssetImageContainer
              className='asset-image-container'
              background={`linear-gradient(180deg, rgba(14, 18, 27, 0.4) 0%, #0E121B 100%), url(${asset.image_url.replace(
                /=s\d*/,
                ''
              )})`}
              style={{ backdropFilter: 'blur(40px)' }}
            />
          ) : (
            <Image width='100%' name='nft-img-placeholder' />
          )}
          <NftAssetImageType
            top='20px'
            right='10px'
            animation_url={asset.animation_url}
            image_url={asset.image_url}
          />
        </Link>
      </LinkContainer>
      <AssetDetails>
        <Flex flexDirection='column' gap={8}>
          <Text style={{ marginTop: '4px' }} size='16px' color='white' weight={600}>
            #{asset?.token_id}
          </Text>
          <LinkContainer
            onClick={logoClickTracking}
            to={`/nfts/collection/${asset.collection.slug}`}
          >
            <Link>
              <Flex alignItems='center' gap={8}>
                {asset.collection.image_url ? (
                  <NftCollectionImageSmall
                    isVerified={asset.collection.safelist_request_status === 'verified'}
                    alt='Dapp Logo'
                    src={asset.collection.image_url}
                    height='16px'
                    width='16px'
                  />
                ) : (
                  <NftCollectionImageSmall
                    isVerified={asset.collection.safelist_request_status === 'verified'}
                    alt='Dapp Logo'
                    src=''
                    height='16px'
                    width='16px'
                  />
                )}
                <AssetCollection onClick={nameClickTracking}>
                  <Text
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    size='14px'
                    color='white'
                    weight={600}
                  >
                    {asset?.collection?.name}
                  </Text>
                </AssetCollection>
              </Flex>
            </Link>
          </LinkContainer>
        </Flex>
        <PriceCTA>
          <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
            {lowestListing && lowestListing.starting_price ? (
              <Flex flexDirection='column' gap={4} alignItems='flex-start'>
                <Text weight={500} color='grey400'>
                  <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
                </Text>
                <LinkContainer to={`/nfts/assets/${asset.contract?.address}/${asset.token_id}`}>
                  <Link>
                    <CoinDisplay
                      coin={lowestListing.payment_token_symbol || 'ETH'}
                      size='14px'
                      weight={500}
                      lineHeight='21px'
                      style={{
                        background: 'linear-gradient(92.99deg, #9080FF 0.55%, #65A5FF 98.76%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        webkitBackgroundClip: 'text',
                        webkitTextFillColor: 'transparent'
                      }}
                    >
                      {lowestListing.starting_price}
                    </CoinDisplay>
                  </Link>
                </LinkContainer>
              </Flex>
            ) : (
              <Text weight={500} color='white'>
                <FormattedMessage id='copy.not_for_sale' defaultMessage='Not For Sale' />
              </Text>
            )}
          </LinkContainer>
        </PriceCTA>
      </AssetDetails>
    </Asset>
  )
}

type Props = {
  asset: AssetsQuery['assets'][0]
}

export default NftAssetItem
