import qs from 'qs'
import { find, propEq } from 'ramda'

import utils from './utils'
import constants from './constants'

/**
 * Uninstalls an application from device
 * @async
 * @param {Transport} transport - The opened device transport
 * @param {String} baseUrl - Base url of socket connection
 * @param {String | Number} targetId - The targetId of the device
 * @param {Object} appInfo - The latest info/versions for application
 * @returns {Promise} Returns install result as a Promise
 */
const uninstallApp = (transport, baseUrl, targetId, appInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ensure timeout is long enough for user to allow device access
      transport.exchangeTimeout = 20000
      // socket params
      const params = {
        targetId,
        perso: appInfo.perso,
        deleteKey: appInfo.delete_key,
        firmware: appInfo.delete,
        firmwareKey: appInfo.delete_key,
        hash: appInfo.hash
      }

      // build socket url
      const url =
        `${baseUrl}${constants.socketPaths.install}` +
        `?${qs.stringify(params)}`

      // uninstall app via socket
      const res = await utils.mapSocketError(
        utils.createDeviceSocket(transport, url).toPromise()
      )

      if (res.err) {
        reject(res.errMsg)
      } else {
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Installs an application onto device
 * @async
 * @param {Transport} transport - The opened device transport
 * @param {String} baseUrl - Base url of socket connection
 * @param {String | Number} targetId - The targetId of the device
 * @param {String} appName - The app to install (BTC, BCH, ETH)
 * @param {Object} appInfos - The latest info/versions for applications
 * @returns {Promise} Returns install result as a Promise
 */
const installApp = (transport, baseUrl, targetId, appName, appInfos) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ensure timeout is long enough for user to allow device access
      transport.exchangeTimeout = 20000
      // derive latest app info
      const latestAppInfo = find(propEq('app', constants.appIds[appName]))(
        appInfos
      )
      // socket params
      const params = {
        targetId,
        perso: latestAppInfo.perso,
        deleteKey: latestAppInfo.delete_key,
        firmware: latestAppInfo.firmware,
        firmwareKey: latestAppInfo.firmware_key,
        hash: latestAppInfo.hash
      }

      // build socket url
      const url =
        `${baseUrl}${constants.socketPaths.install}` +
        `?${qs.stringify(params)}`

      // install app via socket
      const res = await utils.mapSocketError(
        utils.createDeviceSocket(transport, url).toPromise()
      )

      if (res.err) {
        reject(res.errMsg)
      } else {
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

export default {
  installApp,
  uninstallApp
}
