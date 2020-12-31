import { applyMiddleware, createStore, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-community/async-storage'

import reducers from './reducers'

const persistConfig = {
  key: 'micro', // 对于数据库 key 的定义
  storage // 选择的存储引擎
}

// 对 reducers 的封装处理
const persistedReducer = persistReducer(persistConfig, reducers)

const loggerMiddleware = createLogger()

function configureStore () {
  const enhancers = compose(
    applyMiddleware(thunk, loggerMiddleware)
  )
  // 处理后的 reducers 需要作为参赛传递在 createStore 中
  const store = createStore(persistedReducer, enhancers)

  // 持久化 store
  const persist = persistStore(store)

  return { store, persist }
}

export default configureStore
