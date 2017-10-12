import { takeEvery, select, call, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions'
import * as selectors from '../selectors'
import * as sagas from '../sagas'
import { convertBtcUnitToBtcUnit } from 'services/ConversionService'

const sendBitcoinGoalSaga = function * (data) {
  const { amount, address, message } = data
  const unit = yield select(selectors.core.settings.getBtcUnit)
  const scaledAmount = convertBtcUnitToBtcUnit(amount, 'BTC', unit).value
  yield call(sagas.payment.initSendBitcoin)
  yield put(actions.form.startAsyncValidation('sendBitcoin'))
  yield put(actions.form.change('sendBitcoin', 'to2', address))
  yield put(actions.form.change('sendBitcoin', 'amount', scaledAmount))
  yield put(actions.form.change('sendBitcoin', 'message', message))
  yield put(actions.form.touch('sendBitcoin', 'to2', 'amount', 'message'))
}

const goalSaga = function * () {
  // const isV2Payload = yield select(selectors.core.wallet.getHDAccounts).length > 0
  const goals = yield select(selectors.goals.getGoals)

  yield goals.map((goal) => {
    const { name, data } = goal
    switch (name) {
      case 'payment': return call(sendBitcoinGoalSaga, data)
    }
  })
}

export default function * () {
  yield takeEvery(AT.RUN_GOALS, goalSaga)
}
