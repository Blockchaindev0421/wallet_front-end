import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { RemoteDataType } from '@core/types'
import { HeartbeatLoader, Icon, Link, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox, TextBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { actions, selectors } from 'data'
import { isBrowserSupported } from 'services/browser'
import { required } from 'services/forms'
import { media } from 'services/styles'

import { Props as OwnProps } from '../..'
import {
  ActionButton,
  BackArrowFormHeader,
  CenteredColumn,
  NeedHelpLink,
  removeWhitespace,
  Row,
  SignUpLink,
  UnsupportedBrowserWarning,
  WrapperWithPadding
} from '../../model'

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.tabletL`
    width: 100%;
    justify-content: center;
  `};
`

const FormWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  z-index: 1;
  padding: 32px 0;
  max-height: 384px;
`

const SideWrapper = styled.div`
  height: 480px;
  width: 280px;
  ${media.tabletL`
    display: none;
  `};
`
const MobileAuthSideWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: visible;
  max-height: 352px;
  max-width: 274px;
  border-radius: 0 8px 8px 0;
  background-color: ${(props) => props.theme.grey000};
  z-index: 0;
  right: 1px;
  align-items: center;
  padding: 16px 32px;
`

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  > div {
    margin-bottom: 8px;
  }
`

const isSupportedBrowser = isBrowserSupported()

const EnterPasswordWallet = (props: Props) => {
  const {
    authActions,
    authType,
    busy,
    formValues,
    handleBackArrowClick,
    invalid,
    isMobileViewLogin,
    qrData,
    secureChannelLoginState,
    submitting,
    walletError
  } = props

  const passwordError = walletError && walletError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    walletError &&
    (walletError.toLowerCase().includes('this account has been locked') ||
      walletError.toLowerCase().includes('account is locked'))

  const twoFactorError = walletError && walletError.toLowerCase().includes('authentication code')
  const handleSmsResend = () => {
    authActions.resendSmsCode({ email: formValues?.email, guid: formValues?.guid })
  }
  return (
    <OuterWrapper>
      <FormWrapper>
        <WrapperWithPadding>
          <BackArrowFormHeader
            {...props}
            handleBackArrowClick={handleBackArrowClick}
            hideGuid={isMobileViewLogin}
            hideBackArrow={isMobileViewLogin}
          />
          <FormGroup>
            {!isSupportedBrowser && <UnsupportedBrowserWarning />}
            <FormItem>
              <FormLabel htmlFor='password'>
                <FormattedMessage
                  id='scenes.login.enter_password'
                  defaultMessage='Enter your password'
                />
              </FormLabel>
              <Field
                name='password'
                disabled={!isSupportedBrowser}
                validate={[required]}
                component={PasswordBox}
                data-e2e='loginPassword'
                autoFocus
                placeholder='Enter your password'
              />
              {passwordError && (
                <FormError data-e2e='passwordError' style={{ paddingTop: '5px' }}>
                  <FormattedMessage
                    id='scenes.login.wrong_password_recover'
                    defaultMessage='Wrong password. Do you want to recover your wallet using Secret Private Key Recovery Phrase?'
                  />
                  {'  '}
                  <LinkContainer to='/recover'>
                    <Link size='12px' data-e2e='loginRecover'>
                      <FormattedMessage
                        id='scenes.login.recover_account'
                        defaultMessage='Recover account'
                      />
                      .
                    </Link>
                  </LinkContainer>
                </FormError>
              )}
              {accountLocked && (
                <FormError position='relative'>{walletError?.split('.')[0]}.</FormError>
              )}
            </FormItem>
          </FormGroup>
          {authType > 0 && (
            <FormGroup>
              <FormItem>
                <FormLabel htmlFor='code'>
                  {authType === 1 && (
                    <FormattedMessage
                      id='scenes.login.yubikey_verify'
                      defaultMessage='Verify with your Yubikey'
                    />
                  )}
                  {(authType === 4 || authType === 5) && (
                    <FormattedMessage
                      id='scenes.logins.twofa.enter_code'
                      defaultMessage='Enter your Two Factor Authentication Code'
                    />
                  )}
                </FormLabel>
                <Field
                  name='code'
                  normalize={removeWhitespace}
                  validate={[required]}
                  component={authType === 1 ? PasswordBox : TextBox}
                  noLastPass
                  autoFocus
                  data-e2e='loginTwoFactorCode'
                />
                {authType === 5 && (
                  <Link size='12px' weight={400} onClick={handleSmsResend}>
                    <FormattedMessage id='scenes.login.resendsms' defaultMessage='Resend SMS' />
                  </Link>
                )}
                {twoFactorError && <FormError position='absolute'>{walletError}</FormError>}
                {accountLocked && (
                  <FormError position='absolute'>{walletError?.split('.')[0]}.</FormError>
                )}
              </FormItem>
              <Row style={{ marginTop: '16px' }}>
                <Text size='14px' weight={600} color='grey600' style={{ marginRight: '4px' }}>
                  <FormattedMessage
                    id='scenes.logins.twofa.lost'
                    defaultMessage='Lost access to your 2FA device?'
                  />
                </Text>
                <LinkContainer to='/reset-2fa'>
                  <Link size='14px' weight={600} data-e2e='reset2fa'>
                    <FormattedMessage id='copy.reset_now' defaultMessage='Reset Now' />
                  </Link>
                </LinkContainer>
              </Row>
            </FormGroup>
          )}
          <CenteredColumn>
            <ActionButton
              type='submit'
              nature='primary'
              fullwidth
              height='48px'
              disabled={submitting || invalid || busy || !formValues?.password}
              data-e2e='passwordButton'
              style={{ marginBottom: '16px' }}
            >
              {submitting || busy ? (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              ) : (
                <Text color='whiteFade900' size='16px' weight={600}>
                  <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
                </Text>
              )}
            </ActionButton>
            <NeedHelpLink authActions={authActions} origin='PASSWORD' />
          </CenteredColumn>
        </WrapperWithPadding>
        <SignUpLink />
      </FormWrapper>
      <MobileAuthSideWrapper>
        <TextColumn>
          {secureChannelLoginState.cata({
            Failure: (e) => (
              <Text>
                {typeof e === 'string' ? (
                  e
                ) : (
                  <FormattedMessage
                    id='scenes.login.qrcodelogin_failed'
                    defaultMessage='Login failed. Please refresh browser and try again.'
                  />
                )}
              </Text>
            ),
            Loading: () => {
              return (
                <Text size='14px' weight={600}>
                  <FormattedMessage
                    id='scenes.login.qrcodelogin_success_confirm'
                    defaultMessage='Please confirm the login on your mobile device.'
                  />
                </Text>
              )
            },
            NotAsked: () => <QRCodeWrapper value={qrData} size={150} showImage />,
            Success: () => {
              return (
                <Text size='14px' weight={600}>
                  <FormattedMessage
                    id='scenes.login.qrcodelogin_success'
                    defaultMessage='Success! Logging in...'
                  />
                </Text>
              )
            }
          })}
          <Text
            color='grey900'
            size='14px'
            weight={600}
            lineHeight='1.5'
            style={{ marginBottom: '16px' }}
          >
            <FormattedMessage
              id='scenes.login.wallet.mobile_app_login.title'
              defaultMessage='Or Log in with Mobile App'
            />
          </Text>
          <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.wallet.mobile_login.description.ios'
              defaultMessage='<b>iOS</b> - Tap the Menu button at the top left corner of the app to reveal Web Log In option.'
            />
          </Text>
          <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.wallet.mobile_login.description.android'
              defaultMessage='<b>Android</b> - Tap the QR code icon at the top right corner of the app.'
            />
          </Text>
        </TextColumn>
      </MobileAuthSideWrapper>
    </OuterWrapper>
  )
}

const mapStateToProps = (state) => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKeyForQrData(state),
  secureChannelLoginState: selectors.auth.getSecureChannelLogin(state) as RemoteDataType<any, any>,
  walletLoginData: selectors.auth.getLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  middlewareActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterPasswordWallet)
