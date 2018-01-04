
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { delayAjax } from '../paths'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../selectors'

export default ({ api } = {}) => {
  const fetchSettings = function * () {
    try {
      const settings = yield select(S.getSettings)
      if (settings.status !== 'NotAsked') return
      const guid = yield select(selectors.wallet.getGuid)
      const sharedKey = yield select(selectors.wallet.getSharedKey)
      yield put(A.fetchSettingsLoading())
      const data = yield call(api.getSettings, guid, sharedKey)
      yield call(delay, delayAjax)
      yield put(A.fetchSettingsSuccess(data))
    } catch (e) {
      yield put(A.fetchSettingsFailure(e.message))
      throw e
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_SETTINGS, fetchSettings)
  }
}
