import { getAddressAll, getCartList, getCategoryList } from '~/service/common'

export const GET_CATEGORY_LIST = 'GET_CATEGORY_LIST'
export const GET_CART_LIST = 'GET_CART_LIST'
export const ADD_HISTORY_ITEM = 'ADD_HISTORY_ITEM'
export const DELETE_HISTORY_ITEM = 'DELETE_HISTORY_ITEM'
export const CLEAR_HISTORY_LIST = 'CLEAR_HISTORY_LIST'
export const SET_ADDRESS_LIST = 'SET_ADDRESS_LIST'

// list
export const ADD_VISIT_LIST_ITEM = 'SET_VISIT_LIST_ITEM'
export const DELETE_VISIT_LIST_ITEM = 'DELETE_VISIT_LIST_ITEM'
export const DELETE_VISIT_LIST = 'DELETE_VISIT_LIST'
export const ADD_SHARE_ITEM = 'ADD_SHARE_ITEM'
export const DELETE_SHARE_ITEM = 'DELETE_SHARE_ITEM'
export const DELETE_SHARE_LIST = 'DELETE_SHARE_LIST'

/**
 * 获取商品分类
 * @return {function(*): void}
 */
export function getCategoryAction () {
  return dispatch => {
    getCategoryList().then(res => {
      const { rel, data } = res
      if (!rel) return false
      const list = data.map(item => ({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        depth: item.depth,
        iconUrl: item.iconUrl
      }))
      dispatch({
        type: GET_CATEGORY_LIST,
        data: {
          allCategoryList: data,
          primaryCategoryList: list
        }
      })
    })
  }
}

/**
 * 获取购物车商品
 * @return {function(*): void}
 */
export function getCartListAction () {
  return dispatch => {
    return getCartList().then(res => {
      const { rel, data } = res
      if (!rel) return false
      dispatch({
        type: GET_CART_LIST,
        data: {
          cartNumber: data.length,
          cartList: filterProductTypeHandle(data)
        }
      })
    })
  }
}

/**
 * 获取收货地址列表
 * @return {function(*): void}
 */
export function getAddressListAction () {
  return dispatch => {
    getAddressAll().then(res => {
      const { rel, data } = res
      if (rel) {
        const _defaultAddress = data.find(item => item.isDefault)
        dispatch({
          type: SET_ADDRESS_LIST,
          data: {
            selectAddress: _defaultAddress,
            addressList: data || []
          }
        })
      }
    })
  }
}

/**
 * 添加历史搜索记录
 * @param data
 * @return {{data, type: string}}
 */
export function addHistoryItemAction (data) {
  return {
    type: ADD_HISTORY_ITEM,
    data: data
  }
}

/**
 * 删除单条搜索记录
 * @param key
 * @return {{data: {key}, type: string}}
 */
export function deleteHistoryItemAction (key) {
  return {
    type: DELETE_HISTORY_ITEM,
    data: {
      key
    }
  }
}

/**
 * 清空历史搜索记录
 * @return {{type: string}}
 */
export function clearHistoryListAction () {
  return {
    type: CLEAR_HISTORY_LIST
  }
}

/**
 * 添加商品访问记录
 * @param item
 * @return {{data, type: string}}
 */
export function addVisitItem (item) {
  return {
    type: ADD_VISIT_LIST_ITEM,
    data: item
  }
}

/**
 * 删除单条访问记录
 * @param key
 * @return {{data: {key}, type: string}}
 */
export function deleteVisitItem (key) {
  return {
    type: DELETE_VISIT_LIST_ITEM,
    data: {
      key
    }
  }
}

/**
 * 清空商品访问记录
 * @return {{type: string}}
 */
export function deleteVisitAll () {
  return {
    type: DELETE_VISIT_LIST
  }
}

/**
 * 添加转发记录
 * @param item
 * @return {{data, type: string}}
 */
export function addShareItem (item) {
  return {
    type: ADD_SHARE_ITEM,
    data: item
  }
}

/**
 * 删除单条转发记录
 * @param key
 * @return {{data: {key}, type: string}}
 */
export function deleteShareItem (key) {
  return {
    type: DELETE_SHARE_ITEM,
    data: {
      key
    }
  }
}

/**
 * 清空转发记录
 * @return {{type: string}}
 */
export function deleteShareAll () {
  return {
    type: DELETE_SHARE_LIST
  }
}

/**
 * 过滤购物车数据
 * @param data
 * @returns {[]}
 */
const filterProductTypeHandle = (data) => {
  const productList = []
  data.forEach((item) => {
    const _currentIndex = productList.findIndex(
      (_item) => _item.type === item.typeName && +item.warehouseId ===
        +_item.warehouseId && +item.logisticId === +_item.logisticId)
    if (_currentIndex !== -1) {
      productList[_currentIndex].productList.push(item)
    } else {
      productList.push({
        type: item.typeName,
        warehouseId: item.warehouseId,
        simpleName: item.simpleName,
        logisticName: item.logisticName,
        logisticId: item.logisticId,
        productList: [item]
      })
    }
  })
  return productList
}
