import BigNumber from 'bignumber.js'
import { Exchange } from 'blockchain-wallet-v4/src'
import { prop } from 'ramda'

export const getData = (state, props) => {
  const fee = prop('fee', props)
  const feeXlm = Exchange.convertXlmToXlm({
    value: fee,
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  const effectiveBalanceXlm = prop('effectiveBalanceXlm', props)
  return {
    effectiveBalance: new BigNumber(effectiveBalanceXlm)
      .minus(feeXlm)
      .toString()
  }
}
