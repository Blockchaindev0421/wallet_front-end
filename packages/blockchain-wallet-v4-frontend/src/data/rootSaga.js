import { all, call, fork } from 'redux-saga/effects'

import config from 'config'
import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import alerts from './alerts/sagas.js'
import auth from './auth/sagas.js'
import data from './data/sagas.js'
import goals from './goals/sagas.js'
import payment from './payment/sagas.js'
import settings from './settings/sagas.js'
import wallet from './wallet/sagas.js'

const dataPath = config.WALLET_DATA_PATH
const settingsPath = config.WALLET_SETTINGS_PATH
const walletPath = config.WALLET_PAYLOAD_PATH
const kvStorePath = config.WALLET_KVSTORE_PATH

export const sagas = {
  core: coreSagasFactory({
    api,
    dataPath,
    walletPath,
    settingsPath,
    kvStorePath,
    socket
  })
}

const welcomeSaga = function * () {
  if (console) {
    const version = '4.0.0.0'
    const style1 = 'background: #F00; color: #FFF; font-size: 24px;'
    const style2 = 'font-size: 18px;'
    console.log('=======================================================')
    console.log(`%c Wallet version ${version}`, style2)
    console.log('=======================================================')
    console.log('%c STOP!!', style1)
    console.log('%c This browser feature is intended for developers.', style2)
    console.log('%c If someone told you to copy-paste something here,', style2)
    console.log('%c it is a scam and will give them access to your money!', style2)
  }
}

const rootSaga = function * () {
  yield all([
    call(welcomeSaga),
    fork(alerts),
    fork(auth),
    fork(data),
    fork(goals),
    fork(payment),
    fork(settings),
    fork(wallet),
    fork(sagas.core.webSocket)
  ])
}

export default rootSaga
