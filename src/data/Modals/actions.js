import * as AT from './actionTypes'

export const closeModal = () => ({ type: AT.CLOSE_MODAL })

export const showModalRequestBitcoin = () => ({ type: AT.SHOW_MODAL_REQUEST_BITCOIN })

export const showModalQRCode = (payload) => ({ type: AT.SHOW_MODAL_QR_CODE, payload })
