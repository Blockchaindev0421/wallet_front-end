import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCamera, IconComputer, IconGlobe } from '@blockchain-com/icons'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  CollectionFilterFields,
  EventFilterFields,
  useCollectionsQuery
} from 'generated/graphql.types'

import { CollectionHeader, GridWrapper, NftBannerWrapper, opensea_event_types } from '../components'
import NftError from '../components/NftError'
import OpenSeaStatusComponent from '../components/openSeaStatus'
import TraitGridFilters from '../components/TraitGridFilters'
import Events from '../Events'
import NftFilter, { NftFilterFormValuesType } from '../NftFilter'
import CollectionItems from './CollectionItems'
import NftCollectionLoading from './NftCollection.template.loading'
import Stats from './Stats'

const CollectionInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CollectionImage = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.grey100};
`

const LinksContainer = styled.div`
  display: flex;
  > div {
    padding: 10px;
    border: 1px solid ${(props) => props.theme.white};
  }
  > &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  > &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`

const NftsCollection: React.FC<Props> = ({ formActions, formValues, ...rest }) => {
  const { slug } = rest.computedMatch.params
  const params = new URLSearchParams(window.location.hash.split('?')[1])
  const tab = params.get('tab') === 'EVENTS' ? 'EVENTS' : 'ITEMS'

  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'EVENTS'>(tab)
  const [numOfResults, setNumOfResults] = useState<number | undefined>(undefined)
  const [isFilterTriggered, setIsFilterTriggered] = useState<boolean>(false)

  const [collectionsQuery] = useCollectionsQuery({
    requestPolicy: 'network-only',
    variables: { filter: [{ field: CollectionFilterFields.Slug, value: slug }] }
  })

  const collection = collectionsQuery.data?.collections
    ? collectionsQuery.data.collections[0]
    : undefined

  useEffect(() => {
    setActiveTab(tab)
  }, [tab])

  if (collectionsQuery.error)
    return (
      <div style={{ marginTop: '40px' }}>
        <NftError error={collectionsQuery.error} />
      </div>
    )

  if (collectionsQuery.fetching) return <NftCollectionLoading />

  if (!collection) return null

  return (
    <div style={{ paddingTop: '0px', position: 'relative' }}>
      <OpenSeaStatusComponent />
      <CollectionHeader bgUrl={collection.banner_image_url || ''}>
        <NftBannerWrapper>
          <CollectionInfo>
            <div style={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
              <CollectionImage src={collection.image_url || ''} />
              <Text color='white' size='32px' weight={600}>
                {collection.name}
              </Text>
            </div>
            <LinksContainer>
              {collection.external_url ? (
                <Link target='_blank' href={collection.external_url}>
                  <Icon label='globe' color='grey400'>
                    <IconGlobe />
                  </Icon>
                </Link>
              ) : null}
              {collection.instagram_username ? (
                <Link
                  target='_blank'
                  href={`https://instagram.com/${collection.instagram_username}`}
                >
                  <Icon label='camera' color='grey400'>
                    <IconCamera />
                  </Icon>
                </Link>
              ) : null}
              {collection.discord_url ? (
                <Link target='_blank' href={`${collection.discord_url}`}>
                  <Icon label='computer' color='grey400'>
                    <IconComputer />
                  </Icon>
                </Link>
              ) : null}
            </LinksContainer>
          </CollectionInfo>
          <Stats
            formActions={formActions}
            formValues={formValues}
            total_supply={collection.total_supply}
            stats={collection.stats}
          />
        </NftBannerWrapper>
      </CollectionHeader>
      <GridWrapper>
        <NftFilter
          collections={[]}
          formActions={formActions}
          formValues={formValues}
          isTriggered={isFilterTriggered}
          total_supply={collection.total_supply}
          traits={activeTab === 'ITEMS' ? collection.traits : []}
          opensea_event_types={activeTab === 'ITEMS' ? [] : opensea_event_types}
          minMaxPriceFilter={activeTab === 'ITEMS'}
          forSaleFilter={activeTab === 'ITEMS'}
          setIsFilterTriggered={setIsFilterTriggered}
        />
        <div style={{ width: '100%' }}>
          <TraitGridFilters
            tabs={['ITEMS', 'EVENTS']}
            formValues={formValues}
            numOfResults={numOfResults}
            showSortBy
            setIsFilterTriggered={setIsFilterTriggered}
            formActions={formActions}
            setRefreshTrigger={setRefreshTrigger}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collections={[]}
          />
          {activeTab === 'ITEMS' ? (
            <CollectionItems
              collectionsQuery={collectionsQuery}
              formValues={formValues}
              refreshTrigger={refreshTrigger}
              setNumOfResults={setNumOfResults}
              slug={slug}
            />
          ) : (
            <Events
              isFetchingParent={collectionsQuery.fetching}
              filters={[
                { field: EventFilterFields.CollectionSlug, value: slug },
                ...(formValues?.event
                  ? [{ field: EventFilterFields.EventType, value: formValues.event }]
                  : [])
              ]}
            />
          )}
        </div>
      </GridWrapper>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftFilter')(state) as NftFilterFormValuesType
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({ destroyOnUnmount: false, form: 'nftFilter' }),
  connector
)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { slug: string } }
}

export default enhance(NftsCollection) as React.FC<{ computedMatch: { params: { slug: string } } }>
