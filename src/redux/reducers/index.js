import { combineReducers } from 'redux'
import userReducers from './userReducers'
import appReducers from './appReducers'
import baseReducers from './baseReducers'
import orderReducers from './orderReducers'

const reducer = combineReducers({
  user: userReducers,
  app: appReducers,
  base: baseReducers,
  order: orderReducers
})

export default reducer
