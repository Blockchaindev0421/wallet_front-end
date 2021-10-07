import { RemoteDataType } from '@core/types'

export enum ExchangeErrorCodes {
  EMAIL_NOT_VERIFIED = 65,
  EXPECT_2FA = 11,
  NOT_LINKED = 12,
  UNRECOGNIZED_DEVICE = 99,
  WRONG_PASSWORD = 9
}
export enum ProductAuthOptions {
  EXCHANGE = 'EXCHANGE',
  EXPLORER = 'EXPLORER',
  WALLET = 'WALLET'
}

export enum AccountUnificationFlows {
  EXCHANGE_MERGE = 'EXCHANGE_MERGE',
  EXCHANGE_UPGRADE = 'EXCHANGE_UPGRADE',
  WALLET_MERGE = 'WALLET_MERGE'
}

export enum LoginSteps {
  CHECK_EMAIL = 'CHECK_EMAIL',
  ENTER_EMAIL_GUID = 'ENTER_EMAIL_GUID',
  ENTER_PASSWORD = 'ENTER_PASSWORD',
  LOADING = 'LOADING',
  PRODUCT_PICKER_AFTER_AUTHENTICATION = 'PRODUCT_PICKER_AFTER_AUTHENTICATION',
  PRODUCT_PICKER_BEFORE_AUTHENTICATION = 'PRODUCT_PICKER_BEFORE_AUTHENTICATION',
  UPGRADE_CONFIRM = 'UPGRADE_CONFIRM',
  UPGRADE_PASSWORD = 'UPGRADE_PASSWORD',
  UPGRADE_SUCCESS = 'UPGRADE_SUCCESS',
  VERIFICATION_MOBILE = 'VERIFICATION_MOBILE'
}

export enum RecoverSteps {
  CLOUD_RECOVERY = 'CLOUD_RECOVERY',
  RECOVERY_OPTIONS = 'RECOVERY_OPTIONS',
  RECOVERY_PHRASE = 'RECOVERY_PHRASE',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export type RecoverFormType = {
  password: string
  step: RecoverSteps
}

export type LoginPayloadType = {
  code: string
  guid: string
  mobileLogin: boolean
  password: string
  sharedKey: string
}

export type ExchangeLoginType = {
  code: string
  password: string
  username: string
}

export type LoginFormType = {
  email: string
  emailToken?: string
  guid: string
  guidOrEmail: string
  password: string
  step: LoginSteps
  twoFA?: number | string
}

export enum UserType {
  EXCHANGE = 'EXCHANGE',
  WALLET = 'WALLET',
  WALLET_EXCHANGE_BOTH = 'WALLET_EXCHANGE_BOTH',
  WALLET_EXCHANGE_LINKED = 'WALLET_EXCHANGE_LINKED',
  WALLET_EXCHANGE_NOT_LINKED = 'WALLET_EXCHANGE_NOT_LINKED'
}

export type WalletDataFromMagicLink = {
  exchange?: {
    email?: string
    twoFaMode?: boolean
    user_id?: string
  }
  mergeable?: boolean | null
  product?: ProductAuthOptions
  unified?: boolean
  upgradeable?: boolean | null
  user_type?: UserType
  wallet?: {
    auth_type?: number
    email: string
    email_code?: string
    exchange?: {
      email?: string
      two_fa_mode?: boolean
      user_id?: string
    }
    guid: string
    has_cloud_backup?: boolean
    is_mobile_setup?: string | boolean
    last_mnemonic_backup?: number | null
    mobile_device_type?: number | null
    nabu?: {
      recovery_eligible?: boolean
      recovery_token?: string
      user_id?: string
    }
  }
}

// TODO: this is here to handle old version of magic link
// Can be removed when it's completely deprecated
export type WalletDataFromMagicLinkLegacy = {
  email: string
  email_code?: string
  guid: string
  is_mobile_setup: string | boolean
  mobile_device_type: number | null
}

export type LoginErrorType =
  | {
      auth_type: number
      authorization_required: boolean
      initial_error?: string
      message?: string
    }
  | string

export type ExchangeLoginSuccessType = {}

export type ExchangeLoginFailtureType = string | boolean | undefined

export type LoginSuccessType = {}

export type LoginFailureType = string | boolean | undefined

export type MetadataRestoreType = any

export type RegisteringFailureType = undefined

export type RegisteringSuccessType = undefined

export type RestoringType = undefined

export type SecureChannelLoginType = undefined

export type AuthStateType = {
  accountUnificationFlow?: AccountUnificationFlows
  auth_type: number
  designatedProduct: ProductAuthOptions
  designatedProductRedirect?: string
  exchangeAuth: {
    exchangeLogin: RemoteDataType<ExchangeLoginFailtureType, ExchangeLoginSuccessType>
    exchangeLoginError?: ExchangeErrorCodes
  }
  firstLogin: boolean
  isAuthenticated: boolean
  isLoggingIn: boolean
  kycReset?: boolean
  login: RemoteDataType<LoginFailureType, LoginSuccessType>
  magicLinkData?: WalletDataFromMagicLink
  manifestFile: any
  metadataRestore: RemoteDataType<string, MetadataRestoreType>
  mobileLoginStarted: boolean
  registerEmail?: string
  registering: RemoteDataType<RegisteringFailureType, RegisteringSuccessType>
  resetAccount: boolean
  restoring: RemoteDataType<string, RestoringType>
  secureChannelLogin: RemoteDataType<string, SecureChannelLoginType>
  userGeoData: any
}
