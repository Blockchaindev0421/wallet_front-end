import { combineReducers } from 'redux'
import bitcoin from './bitcoin/reducers'
import ethereum from './ethereum/reducers'
import bch from './bch/reducers'
import misc from './misc/reducers'
import shapeShift from './shapeShift/reducers'

const dataReducer = combineReducers({
  bitcoin: bitcoin,
  ethereum: ethereum,
  bch: bch,
  misc: misc,
  shapeShift: shapeShift
})

export default dataReducer
