import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { format } from 'date-fns'
import { map } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { convertCoinToCoin } from '@core/exchange'
import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Title } from 'components/Flyout'
import { Row, Value } from 'components/Flyout/model'
import Form from 'components/Form/Form'
import NumberBox from 'components/Form/NumberBox'
import SelectBox from 'components/Form/SelectBox'
import TabMenuNftSaleType from 'components/Form/TabMenuNftSaleType'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { required, validDecliningPrice } from 'services/forms'
import { media } from 'services/styles'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import SellFees from '../ShowAsset/Sell/fees'

const FormWrapper = styled.div`
  gap: 8px;
  max-height: 500px;
  ${media.tabletL`
    max-height: 170px;
  `}
`

const MarkForSale: React.FC<Props> = (props) => {
  const { close, formValues, nftActions, orderFlow } = props
  const coin = formValues.timedAuctionType === 'highestBidder' ? 'WETH' : 'ETH'

  const disabled =
    formValues['sale-type'] === 'fixed-price'
      ? // Fixed Price
        !formValues.amount || props.orderFlow.isSubmitting
      : // Dutch (Declining)
        ((!formValues.starting ||
          !formValues.ending ||
          props.orderFlow.isSubmitting ||
          formValues.ending > formValues.starting) &&
          formValues.timedAuctionType === 'decliningPrice') ||
        // English (Ascending)
        (!formValues.starting && formValues.timedAuctionType === 'highestBidder')

  const resetForms = () => {
    formValues.amount = ''
    formValues.starting = ''
    formValues.ending = ''
    formValues.expirationDays = 1
    formValues.timedAuctionType = 'decliningPrice'
  }

  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => (
          <AssetDesc>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </AssetDesc>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <>
            <div style={{ position: 'relative' }}>
              <Icon
                onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.SHOW_ASSET })}
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
            <Form>
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.sale_type' defaultMessage='Sale Type' />
                  </b>
                </Title>
                <Value>
                  <div style={{ display: 'inline-block' }}>
                    <Field
                      name='sale-type'
                      // reset values to default on toggle
                      onChange={resetForms}
                      component={TabMenuNftSaleType}
                    />
                  </div>
                </Value>
              </Row>
              {formValues['sale-type'] === 'fixed-price' ? (
                <>
                  <Row>
                    <Title>
                      <b>
                        <FormattedMessage
                          id='copy.amount'
                          defaultMessage='Amount ({val})'
                          values={{
                            val: `${coin}`
                          }}
                        />
                      </b>
                    </Title>
                    <Value>
                      <Field
                        name='amount'
                        component={NumberBox}
                        props={{ center: 'center', size: '48px' }}
                        onChange={(e) =>
                          nftActions.fetchFees({
                            asset: val,
                            expirationDays: formValues.expirationDays,
                            operation: GasCalculationOperations.Sell,
                            startPrice: e.target.value
                          })
                        }
                      />
                    </Value>
                    <Value>
                      <FiatDisplay size='12px' weight={600} coin={coin}>
                        {convertCoinToCoin({
                          baseToStandard: false,
                          coin,
                          value: formValues.amount
                        }) || 0}
                      </FiatDisplay>
                    </Value>
                  </Row>
                </>
              ) : (
                // Time Based Auction
                <>
                  <Row>
                    <Title>
                      <b>
                        <FormattedMessage id='copy.starting_price' defaultMessage='Method' />
                      </b>
                    </Title>
                    <Value>
                      <FormWrapper>
                        <div style={{ marginBottom: '8px' }}>
                          <Field
                            name='timedAuctionType'
                            component={SelectBox}
                            onChange={resetForms}
                            elements={[
                              {
                                group: '',
                                items: map(
                                  (item) => ({
                                    text: item.text,
                                    value: item.value
                                  }),
                                  [
                                    { text: 'Sell with declining price', value: 'decliningPrice' },
                                    { text: 'Sell to highest bidder', value: 'highestBidder' }
                                  ]
                                )
                              }
                            ]}
                          />
                        </div>
                      </FormWrapper>
                    </Value>
                  </Row>
                  <Row>
                    <Title>
                      <b>
                        <FormattedMessage
                          id='copy.starting_price'
                          defaultMessage='Starting Price ({val})'
                          values={{
                            val: `${coin}`
                          }}
                        />
                      </b>
                    </Title>
                    <Value>
                      <Field name='starting' component={NumberBox} />
                    </Value>
                    <Value>
                      <FiatDisplay size='12px' weight={600} coin={coin}>
                        {convertCoinToCoin({
                          baseToStandard: false,
                          coin,
                          value: formValues.starting
                        }) || 0}
                      </FiatDisplay>
                    </Value>
                  </Row>
                  {formValues.timedAuctionType === 'decliningPrice' && (
                    <Row>
                      <Title>
                        <b>
                          <FormattedMessage
                            id='copy.ending_price'
                            defaultMessage='Ending Price ({val})'
                            values={{
                              val: `${coin}`
                            }}
                          />
                        </b>
                      </Title>
                      <Value>
                        <Field
                          name='ending'
                          component={NumberBox}
                          validate={[required, validDecliningPrice]}
                          onChange={() => {
                            nftActions.fetchFees({
                              asset: val,
                              endPrice: undefined,
                              expirationDays: formValues.expirationDays,
                              operation: GasCalculationOperations.Sell,
                              paymentTokenAddress: window.coins.WETH.coinfig.type.erc20Address,
                              startPrice: Number(formValues.starting)
                            })
                          }}
                        />
                      </Value>
                      <Value>
                        <FiatDisplay size='12px' weight={600} coin={coin}>
                          {convertCoinToCoin({
                            baseToStandard: false,
                            coin,
                            value: formValues.ending
                          }) || 0}
                        </FiatDisplay>
                      </Value>
                    </Row>
                  )}
                </>
              )}
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.select_coin' defaultMessage='Expires After' />
                  </b>
                </Title>
                <Value>
                  <Field
                    name='expirationDays'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(days: any) => {
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    }}
                    component={SelectBox}
                    elements={[
                      {
                        group: '',
                        items: map(
                          (item) => ({
                            text: item.text,
                            value: item.value
                          }),
                          [
                            { text: '1 Day', value: 1 },
                            { text: '3 Days', value: 3 },
                            { text: '7 Days', value: 7 },
                            { text: '1 Months', value: 30 },
                            { text: '3 Months', value: 90 },
                            { text: '6 Months', value: 180 }
                          ]
                        )
                      }
                    ]}
                  />
                </Value>
              </Row>
              <Row>
                <Value asTitle>
                  <FormattedMessage id='copy.service_fees' defaultMessage='Service Fees' />
                </Value>
                <Title asValue>
                  <FormattedMessage
                    id='copy.opensea_service_fee'
                    defaultMessage='OpenSea Service Fee'
                  />{' '}
                  {val.asset_contract.opensea_seller_fee_basis_points / 100}%
                </Title>
                <Title asValue>
                  <FormattedMessage id='copy.creator_royalty' defaultMessage='Creator Royalty' />{' '}
                  {Number(val.collection.dev_seller_fee_basis_points) / 100}%
                </Title>
              </Row>
            </Form>
            <StickyCTA>
              <SellFees {...props} asset={val} />
              {props.orderFlow.fees.cata({
                Failure: () => (
                  <Button jumbo nature='sent' fullwidth data-e2e='sellNft' disabled>
                    <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark for Sale' />
                  </Button>
                ),
                Loading: () => (
                  <Button jumbo nature='primary' fullwidth data-e2e='sellNft' disabled>
                    <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark for Sale' />
                  </Button>
                ),
                NotAsked: () => null,
                Success: (fees) => (
                  <Button
                    jumbo
                    nature='primary'
                    fullwidth
                    data-e2e='sellNft'
                    disabled={disabled}
                    onClick={() => {
                      if (formValues['sale-type'] === 'fixed-price') {
                        nftActions.createSellOrder({
                          asset: val,
                          endPrice: null,
                          expirationDays: formValues.expirationDays,
                          gasData: fees,
                          paymentTokenAddress: undefined,
                          startPrice: Number(formValues.amount),
                          waitForHighestBid: false
                        })
                        // English Auction
                      } else if (
                        formValues['sale-type'] === 'timed-auction' &&
                        formValues.timedAuctionType === 'highestBidder'
                      ) {
                        nftActions.createSellOrder({
                          asset: val,
                          endPrice: null,
                          expirationDays: formValues.expirationDays,
                          gasData: fees,
                          paymentTokenAddress: window.coins.WETH.coinfig.type.erc20Address,
                          startPrice: Number(formValues.starting),
                          waitForHighestBid: true
                        })
                      }
                      // Dutch Auction
                      else {
                        nftActions.createSellOrder({
                          asset: val,
                          endPrice: Number(formValues.ending),
                          expirationDays: formValues.expirationDays,
                          gasData: fees,
                          paymentTokenAddress: undefined,
                          startPrice: Number(formValues.starting),
                          waitForHighestBid: false
                        })
                      }
                    }}
                  >
                    {formValues.amount || formValues.starting ? (
                      props.orderFlow.isSubmitting ? (
                        <HeartbeatLoader color='blue100' height='20px' width='20px' />
                      ) : (
                        <FormattedMessage
                          id='copy.mark_for_sale_value'
                          defaultMessage='Mark for Sale for {val}'
                          values={{
                            val: formValues.amount
                              ? `${formValues.amount} ${coin}`
                              : `${formValues.starting} ${coin}`
                          }}
                        />
                      )
                    ) : (
                      <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark for Sale' />
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

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('nftMarkForSale')(state) as {
    amount: string
    ending: string
    expirationDays: number
    starting: string
    timedAuctionType: string
  }
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'nftMarkForSale',
    initialValues: {
      listingTime: format(new Date(), 'yyyy-MM-dd'),
      'sale-type': 'fixed-price',
      timedAuctionType: 'decliningPrice'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MarkForSale) as React.FC<OwnProps>
