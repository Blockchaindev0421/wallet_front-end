import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { pathOr } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import { getFormMeta, InjectedFormProps, reduxForm } from 'redux-form'

import { RemoteDataType } from '@core/types'
import Form from 'components/Form/Form'
import { actions, selectors } from 'data'
import { ProductAuthOptions, RecoverFormType, RecoverSteps } from 'data/types'

import CloudRecovery from './CloudRecovery'
import { RECOVER_FORM } from './model'
import RecoveryOptions from './RecoveryOptions'
import RecoveryPhrase from './RecoveryPhrase'
import ResetAccount from './ResetAccount'

class RecoverWalletContainer extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props,
  State
> {
  constructor(props) {
    super(props)
    this.state = {
      showPhraseStep: pathOr(false, ['location', 'state', 'showPhraseStep'], this.props)
    }
  }

  componentDidMount() {
    if (this.state.showPhraseStep) {
      this.props.formActions.change(RECOVER_FORM, 'step', RecoverSteps.RECOVERY_PHRASE)
    } else {
      this.props.formActions.change(RECOVER_FORM, 'step', RecoverSteps.RECOVERY_OPTIONS)
    }
  }

  componentWillUnmount() {
    this.props.formActions.destroy(RECOVER_FORM)
  }

  setStep = (step: RecoverSteps) => {
    this.props.formActions.change(RECOVER_FORM, 'step', step)
  }

  render() {
    const { step } = this.props.formValues || RecoverSteps.RECOVERY_OPTIONS

    return (
      <Form>
        {(() => {
          switch (step) {
            case RecoverSteps.RECOVERY_OPTIONS:
              return <RecoveryOptions {...this.props} setStep={this.setStep} />
            case RecoverSteps.CLOUD_RECOVERY:
              return <CloudRecovery {...this.props} setStep={this.setStep} />
            case RecoverSteps.RECOVERY_PHRASE:
              return <RecoveryPhrase {...this.props} setStep={this.setStep} />
            case RecoverSteps.RESET_ACCOUNT:
              return <ResetAccount {...this.props} setStep={this.setStep} />
            default:
              return <RecoveryOptions {...this.props} setStep={this.setStep} />
          }
        })()}
      </Form>
    )
  }
}

const mapStateToProps = (state) => ({
  cachedEmail: selectors.cache.getEmail(state),
  cachedGuid: selectors.cache.getStoredGuid(state),
  emailFromMagicLink: selectors.auth.getMagicLinkData(state)?.wallet?.email as string,
  formMeta: getFormMeta(RECOVER_FORM)(state),
  formValues: selectors.form.getFormValues(RECOVER_FORM)(state) as RecoverFormType,
  hasCloudBackup: selectors.cache.getHasCloudBackup(state) as boolean,
  kycReset: selectors.signup.getKycResetStatus(state),
  language: selectors.preferences.getLanguage(state),
  lastGuid: selectors.cache.getLastGuid(state),
  loginFormValues: selectors.form.getFormValues('login')(state),
  nabuId: selectors.auth.getMagicLinkData(state)?.wallet?.nabu?.user_id,
  product: selectors.auth.getProduct(state) as ProductAuthOptions,
  registering: selectors.signup.getRegistering(state) as RemoteDataType<string, any>
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch)
})

type FormProps = {
  busy: boolean
  invalid: boolean
  pristine: boolean
  setStep: (step: RecoverSteps) => void
  submitting: boolean
}

type State = { showPhraseStep: boolean }
export type Props = ConnectedProps<typeof connector> & FormProps

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose<React.ComponentType>(
  reduxForm({
    destroyOnUnmount: false,
    form: RECOVER_FORM
  }),
  connector
)

export default enhance(RecoverWalletContainer)
