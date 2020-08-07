import { bindActionCreators, Dispatch } from 'redux'
import { Button, Text } from 'blockchain-info-components'
import { connect, ConnectedProps } from 'react-redux'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBOrderType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { actions } from 'data'

import { convertBaseToStandard } from 'data/components/exchange/services'
import { CustodialTransactionRow } from '../components'
import { getOrderType } from 'data/components/simpleBuy/model'
import { Status } from './model'

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
  ${media.mobile`
    width: 50%;
  `};
`
const AmountColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  width: 50%;
  ${media.atLeastTabletL`
    display: flex;
  `}
`
const ViewInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 20%;
  align-items: flex-end;
  ${media.mobile`
    min-width: 50%;
  `};
`

class SimpleBuyListItem extends PureComponent<Props> {
  showModal = (order: SBOrderType) => {
    this.props.modalActions.showModal('SIMPLE_BUY_MODAL', {
      origin: 'TransactionList'
    })
    this.props.simpleBuyActions.setStep({
      step:
        order.state === 'PENDING_CONFIRMATION'
          ? 'CHECKOUT_CONFIRM'
          : 'ORDER_SUMMARY',
      order
    })
  }

  render () {
    const { order } = this.props

    const inputAmt =
      getOrderType(order) === 'BUY'
        ? fiatToString({
            unit: order.inputCurrency as FiatType,
            value: convertBaseToStandard('FIAT', order.inputQuantity)
          })
        : fiatToString({
            unit: order.outputCurrency as FiatType,
            value: convertBaseToStandard('FIAT', order.outputQuantity)
          })

    return (
      <CustodialTransactionRow onClick={() => this.showModal(order)}>
        <StatusColumn data-e2e='orderStatusColumn'>
          <Status order={order} />
        </StatusColumn>
        <AmountColumn data-e2e='orderAmountColumn'>
          <Text size='14px' weight={500}>
            {inputAmt}
          </Text>
        </AmountColumn>
        <ViewInfoColumn>
          <Button
            data-e2e='viewInfoButton'
            size='14px'
            height='35px'
            nature='light'
          >
            <FormattedMessage
              id='modals.simplebuy.transactionlist.viewdetails'
              defaultMessage='View Details'
            />
          </Button>
        </ViewInfoColumn>
      </CustodialTransactionRow>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type OwnProps = {
  order: SBOrderType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(SimpleBuyListItem)
