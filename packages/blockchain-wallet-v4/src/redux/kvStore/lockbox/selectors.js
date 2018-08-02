import { keys, path, map, flatten } from 'ramda'
import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

export const getMetadata = path([kvStorePath, LOCKBOX])

export const getDevices = state =>
  getMetadata(state).map(path(['value', 'devices']))

export const getDevice = (state, deviceID) =>
  getDevices(state).map(path(deviceID))

export const getAccounts = state =>
  getDevices(state).map(devices =>
    map(d => path([d, 'accounts'], devices), keys(devices))
  )

export const getLockboxBtc = state => getAccounts(state).map(map(path(['btc'])))

export const getLockboxBtcAccounts = state =>
  getLockboxBtc(state).map(map(path(['accounts'])))

export const getLockboxBtcContext = state => {
  return getLockboxBtcAccounts(state).map(accounts => {
    return accounts ? flatten(accounts).map(a => path(['xpub'], a)) : []
  })
}
