import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import { FormGroup, FormItem, TextBox } from 'components/Form'
import { isBrowserSupported } from 'services/browser'
import { required, validWalletIdOrEmail } from 'services/forms'

import { Props } from '..'
import {
  ActionButton,
  GuidError,
  LinkRow,
  LoginFormLabel,
  NeedHelpLink,
  removeWhitespace,
  UnsupportedBrowserWarning
} from '../model'

const isSupportedBrowser = isBrowserSupported()

const Wallet = (props: Props) => {
  const { authActions, busy, guidOrEmail, invalid, loginError, submitting } = props
  const guidError = loginError && loginError.toLowerCase().includes('unknown wallet id')
  return (
    <>
      <FormGroup>
        {!isSupportedBrowser && <UnsupportedBrowserWarning />}
        <FormItem>
          <LoginFormLabel htmlFor='guid'>
            <FormattedMessage
              id='scenes.login.email_guid'
              defaultMessage='Your Email or Wallet ID'
            />
          </LoginFormLabel>
          <Field
            component={TextBox}
            data-e2e='loginGuidOrEmail'
            disabled={!isSupportedBrowser}
            disableSpellcheck
            name='guidOrEmail'
            normalize={removeWhitespace}
            validate={[required, validWalletIdOrEmail]}
            placeholder='Enter your email or wallet ID'
            autoFocus
          />
        </FormItem>
        {guidError && (
          <GuidError inline>
            <Text size='12px' color='error' weight={400} data-e2e='walletIdError'>
              <FormattedMessage
                id='scenes.login.guid_error'
                defaultMessage='Unknown Wallet ID. Please check that it was entered correctly or try signing in with your email.'
              />
            </Text>
          </GuidError>
        )}
      </FormGroup>
      <LinkRow>
        <ActionButton
          type='submit'
          nature='primary'
          fullwidth
          height='48px'
          disabled={submitting || invalid || busy || !guidOrEmail}
          data-e2e='loginButton'
          style={{ marginBottom: '16px' }}
        >
          {submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <Text color='whiteFade900' size='16px' weight={600}>
              <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
            </Text>
          )}
        </ActionButton>
        <NeedHelpLink authActions={authActions} origin='IDENTIFIER' />
      </LinkRow>
    </>
  )
}

export default Wallet
