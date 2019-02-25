import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

// import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import {
  Button,
  Image,
  Modal,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const AirdropReminderModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  > span {
    color: ${props => props.theme['gray-1']};
  }
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
  text-align: center;
`
const Copy = styled(Text)`
  margin-top: 16px;
`
const Footer = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 0 24px 32px 24px;
  box-sizing: border-box;
`
const FooterButton = styled(Button)`
  height: auto;
  font-weight: 300;
  padding: 15px 0;
`
const LaterButton = styled(FooterButton)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  top: calc(100% + 9px);
  width: calc(100% - 48px);
  &:hover {
    background-color: rgba(0, 0, 0, 0);
    border: none;
  }
`

class AirdropReminder extends React.PureComponent {
  render () {
    const { position, total, close } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <AirdropReminderModalHeader onClose={close} />
        <Image
          width='100%'
          name='get-free-crypto'
          srcset={{
            'get-free-crypto2': '2x',
            'get-free-crypto3': '3x'
          }}
        />
        <Body>
          <Text size='24px' weight={300}>
            <FormattedMessage
              id='modals.airdropreminder.AirdropReminder'
              defaultMessage='Get Free Crypto'
            />
          </Text>
          <Copy weight={300}>
            <FormattedMessage
              id='modals.airdropreminder.completeprofile'
              defaultMessage='Complete your profile today and we will airdrop free Stellar (XLM) in your Wallet.'
            />
          </Copy>
        </Body>
        <Footer>
          <FooterButton
            nature='primary'
            size='18px'
            fullwidth
            // onClick={actions.airdropReminderSubmitClicked}
          >
            <FormattedMessage
              defaultMessage='Get Started'
              id='modals.airdropreminder.getstarted'
            />
          </FooterButton>
          <LaterButton nature='primary' size='18px' fullwidth onClick={close}>
            <FormattedMessage
              defaultMessage='Remind Me Later'
              id='modals.airdropreminder.later'
            />
          </LaterButton>
        </Footer>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  // actions: bindActionCreators(actions.components.swapOnboarding, dispatch)
})

const enhance = compose(
  connect(
    undefined,
    mapDispatchToProps
  ),
  modalEnhancer('AirdropReminder')
)

export default enhance(AirdropReminder)
