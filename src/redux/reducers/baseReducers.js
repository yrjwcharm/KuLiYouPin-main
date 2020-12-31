import {
  ADD_HISTORY_ITEM,
  CLEAR_HISTORY_LIST,
  DELETE_HISTORY_ITEM,
  GET_CART_LIST,
  GET_CATEGORY_LIST, SET_ADDRESS_LIST,
  ADD_VISIT_LIST_ITEM,
  DELETE_VISIT_LIST_ITEM,
  DELETE_VISIT_LIST,
  ADD_SHARE_ITEM,
  DELETE_SHARE_ITEM,
  DELETE_SHARE_LIST
} from '~/redux/actions/baseAction'
import _ from 'lodash'

const initialState = {
  // 一级分类页
  primaryCategoryList: [],
  // 所有分类
  allCategoryList: [],
  // 购物车数量
  cartNumber: 0,
  // 购物车列表
  cartList: [],
  // 收货地址列表
  addressList: [],
  selectAddress: {},
  // 搜索记录
  searchHistoryList: [],
  // 访问商品
  visitList: [],
  // 转发商品
  shareList: []
}

export default function baseReducers (state = initialState, action) {
  const _state = _.cloneDeep(state)
  switch (action.type) {
    case GET_CATEGORY_LIST:
      return Object.assign({}, state, action.data)
    case GET_CART_LIST:
      return Object.assign({}, state, action.data)
    case ADD_HISTORY_ITEM:
      const newList = _.compact(_state.searchHistoryList)
      newList.unshift(action.data)
      return Object.assign({}, state, { searchHistoryList: _.uniq(newList) })
    case DELETE_HISTORY_ITEM:
      return Object.assign({}, state, { searchHistoryList: _.remove(_state.searchHistoryList, (n) => n.key === action.data.key) })
    case CLEAR_HISTORY_LIST:
      return Object.assign({}, state, { searchHistoryList: [] })
    case SET_ADDRESS_LIST:
      return Object.assign({}, state, { ...action.data })

    case ADD_VISIT_LIST_ITEM:
      const _list = _.compact(_state.visitList)
      _list.unshift(action.data)
      return Object.assign({}, state, { visitList: _.uniq(_list) })
    case ADD_SHARE_ITEM:
      const _shareList = _.compact(_state.shareList)
      _shareList.unshift(action.data)
      return Object.assign({}, state, { shareList: _.uniq(_shareList) })
    case DELETE_VISIT_LIST_ITEM:
      _.remove(_state.visitList, (n) => n.key === action.data.key)
      return Object.assign({}, state, { visitList: _state.visitList })
    case DELETE_SHARE_ITEM:
      _.remove(_state.shareList, (n) => n.key === action.data.key)
      return Object.assign({}, state, { shareList: _state.shareList })
    case DELETE_VISIT_LIST:
      return Object.assign({}, state, { visitList: [] })
    case DELETE_SHARE_LIST:
      return Object.assign({}, state, { shareList: [] })
    default:
      return state
  }
}
