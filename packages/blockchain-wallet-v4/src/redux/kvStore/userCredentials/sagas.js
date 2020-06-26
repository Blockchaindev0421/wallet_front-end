import * as A from './actions'
import { call, put, select } from 'redux-saga/effects'
import { callTask } from '../../../utils/functional'
import { derivationMap, USER_CREDENTIALS } from '../config'
import { getMetadataXpriv } from '../root/selectors'
import { isEmpty, isNil } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { set } from 'ramda-lens'

export default ({ api, networks }) => {
  const createUserCredentials = function*(kv) {
    const user_id = ''
    const lifetime_token = ''
    const newkv = set(KVStoreEntry.value, { user_id, lifetime_token }, kv)
    yield put(A.createMetadataUserCredentials(newkv))
  }

  const fetchMetadataUserCredentials = function*() {
    try {
      const typeId = derivationMap[USER_CREDENTIALS]
      const mxpriv = yield select(getMetadataXpriv)
      const kv = KVStoreEntry.fromMetadataXpriv(mxpriv, typeId, networks.btc)
      yield put(A.fetchMetadataUserCredentialsLoading())
      const newkv = yield callTask(api.fetchKVStore(kv))
      if (isNil(newkv.value) || isEmpty(newkv.value)) {
        yield call(createUserCredentials, newkv)
      } else {
        yield put(A.fetchMetadataUserCredentialsSuccess(newkv))
      }
    } catch (e) {
      yield put(A.fetchMetadataUserCredentialsFailure(e.message))
    }
  }

  return {
    fetchMetadataUserCredentials
  }
}
