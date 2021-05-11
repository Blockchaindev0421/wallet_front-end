import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { BlockchainLoader, Text } from 'blockchain-info-components'
import { ExtractSuccess } from 'core/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { WalletFormType } from '../../../../../typings/redux-form'
import { getData } from './selectors'

const AddressWrapper = styled.div`
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.grey000};
  }
`

class UnstoppableDomains extends PureComponent<Props> {
  state = {}

  componentWillUnmount() {
    this.props.sendActions.fetchUnstoppableDomainResultsNotAsked()
  }

  handleClick = (address: string) => {
    this.props.formActions.change(this.props.form, 'to', {
      value: {
        label: address,
        value: address
      }
    })
  }

  render() {
    return this.props.data.cata({
      Success: val =>
        val.unstoppableDomains.results.map(result => {
          return (
            <AddressWrapper onClick={() => this.handleClick(result.address)}>
              <Text size='14px' weight={500} color='grey800'>
                {result.address}
              </Text>
            </AddressWrapper>
          )
        }),
      Loading: () => <BlockchainLoader height='24px' width='24px' />,
      NotAsked: () => null,
      Failure: e => <>{e}</>
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  form: WalletFormType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UnstoppableDomains)
