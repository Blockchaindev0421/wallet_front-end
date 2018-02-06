import { combineReducers } from 'redux'
import bitcoin from './bitcoin/reducers'
import ethereum from './ethereum/reducers'
import misc from './misc/reducers'
import sfox from './sfox/reducers'
import shapeShift from './shapeShift/reducers'

const dataReducer = combineReducers({
  bitcoin: bitcoin,
  ethereum: ethereum,
  misc: misc,
  sfox: sfox,
  shapeShift: shapeShift
})

export default dataReducer
