import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose, Dispatch } from 'redux'

import { selectors } from 'data'

import FundsBox from './FundsBox.template'

const FundsBoxContainer = (props) => <FundsBox {...props} />

const mapStateToProps = (state) => ({
  funds: selectors.components.debitCard.getEligibleAccounts(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

const enhance = compose(connector)

export default enhance(FundsBoxContainer)
