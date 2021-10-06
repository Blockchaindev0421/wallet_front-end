import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { auth } from 'data/actions'
import { AccountUnificationFlows, LoginSteps } from 'data/types'

import { Props } from '../../index'
import {
  ActionButton,
  BackArrowFormHeader,
  CenteredColumn,
  CircleBackground,
  LOGIN_FORM_NAME
} from '../../model'

const IconTextRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const TextStack = styled.div`
  margin-left: 16px;
`

const MergeAccountConfirm = (props: Props) => {
  const { accountUnificationFlow, authActions, cacheActions, formActions, initCaptcha, setStep } =
    props
  const handleBackArrowClick = () => {
    cacheActions.removedStoredLogin()
    formActions.destroy(LOGIN_FORM_NAME)
    setStep(LoginSteps.ENTER_EMAIL_GUID)
    authActions.clearLoginError()
    initCaptcha()
  }

  const handleUpgradeAccountClick = () => {
    if (accountUnificationFlow === AccountUnificationFlows.EXCHANGE_UPGRADE) {
      setStep(LoginSteps.UPGRADE_PASSWORD)
    }
    if (accountUnificationFlow === AccountUnificationFlows.EXCHANGE_MERGE) {
      // call action that merges accounts
      // Temp step to set step to sucess without it actually happening
      setStep(LoginSteps.UPGRADE_SUCCESS)
    }
    if (accountUnificationFlow === AccountUnificationFlows.WALLET_MERGE) {
      // call action that merges accounts
      // Temp step to set step to sucess without it actually happening
      setStep(LoginSteps.UPGRADE_SUCCESS)
    }
  }

  const handleDoThisLaterClick = () => {
    if (
      accountUnificationFlow === AccountUnificationFlows.EXCHANGE_UPGRADE ||
      accountUnificationFlow === AccountUnificationFlows.EXCHANGE_MERGE
    ) {
      // call saga function that directs them to exchange
    }
    if (accountUnificationFlow === AccountUnificationFlows.WALLET_MERGE) {
      // continue with second part of wallet authentication
      authActions.loginRoutineTestPartTwo()
    }
  }

  return (
    <>
      <BackArrowFormHeader {...props} handleBackArrowClick={handleBackArrowClick} hideGuid />
      <CenteredColumn style={{ textAlign: 'center' }}>
        <Image name='account-icons' />
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage
            id='scenes.login.upgrade.header'
            defaultMessage='Upgrade to a Unified Account'
          />
        </Text>
        <Text size='16px' weight={500} color='grey900' lineHeight='1.5'>
          <FormattedMessage
            id='scenes.login.upgrade.subheader'
            defaultMessage='Would you like to upgrade to a single login for all you Blockchain.com accounts?'
          />
        </Text>
      </CenteredColumn>
      <IconTextRow style={{ marginTop: '24px' }}>
        <CircleBackground size='24px' color='blue000'>
          <Text color='blue600' size='16px' weight={600}>
            1
          </Text>
        </CircleBackground>
        <TextStack>
          <Text size='16px' color='grey900' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.upgrade.onelogin.header'
              defaultMessage='One Login for All Accounts'
            />
          </Text>
          <Text size='14px' color='grey600' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.upgrade.onelogin'
              defaultMessage='Easily access your Blockchain.com Wallet and the Exchange with a single login.'
            />
          </Text>
        </TextStack>
      </IconTextRow>
      <IconTextRow style={{ marginTop: '24px' }}>
        <CircleBackground size='24px' color='blue000'>
          <Text color='blue600' size='16px' weight={600}>
            2
          </Text>
        </CircleBackground>
        <TextStack>
          <Text size='16px' color='grey900' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='sscenes.login.upgrade.greatersecurity.header'
              defaultMessage='Greater Security Across Accounts'
            />
          </Text>
          <Text size='14px' color='grey600' weight={500} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.upgrade.greatersecurity'
              defaultMessage='Secure your investments across all Blockchain.com products.'
            />
          </Text>
        </TextStack>
      </IconTextRow>
      <ActionButton
        nature='primary'
        fullwidth
        height='48px'
        // disabled={submitting || busy}
        data-e2e='upgradeButton'
        style={{ margin: '32px 0 24px' }}
        onClick={handleUpgradeAccountClick}
      >
        <Text color='whiteFade900' size='16px' weight={600}>
          <FormattedMessage id='buttons.upgrade_account' defaultMessage='Upgrade Account' />
        </Text>
      </ActionButton>
      <Button
        nature='empty-blue'
        fullwidth
        height='48px'
        data-e2e='upgradeLater'
        onClick={handleDoThisLaterClick}
      >
        {/* might need to do some loading state here while user is being logged into
        whatever product they want to  be logged into */}
        <FormattedMessage id='copy.later' defaultMessage="I'll Do This Later" />
      </Button>
    </>
  )
}

export default MergeAccountConfirm
