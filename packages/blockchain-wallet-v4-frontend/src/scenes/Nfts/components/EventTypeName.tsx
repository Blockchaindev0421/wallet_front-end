import React from 'react'
import { FormattedMessage } from 'react-intl'

import { opensea_event_types } from '.'

const EventTypeName: React.FC<Props> = ({ event_type }) => {
  switch (event_type) {
    case 'successful':
      return <FormattedMessage id='copy.sale' defaultMessage='Sale' />
    case 'transfer':
      return <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
    case 'offer_entered':
      return <FormattedMessage id='copy.offer_entered' defaultMessage='Offer Made' />
    case 'created':
      return <FormattedMessage id='copy.created' defaultMessage='Created' />
    case 'bid_entered':
      return <FormattedMessage id='copy.bid_made' defaultMessage='Bid Made' />
    case 'bid_withdrawn':
      return <FormattedMessage id='copy.bid_withdrawn' defaultMessage='Bid Withdrawn' />
    default:
      return null
  }
}

type Props = {
  event_type: keyof typeof opensea_event_types
}

export default EventTypeName
