import http from '~/utils/http'

/**
 * 查询所有分类
 */
export function getCategoryList () {
  return http({
    url: '/category/findAll',
    method: 'get'
  })
}

/**
 * 添加购物车
 * @param data
 */
export function addCart (data) {
  return http({
    url: '/cart/addGoods',
    method: 'post',
    data: data
  })
}

/**
 * 批量设置购物车选中状态
 * @param data
 * @returns {Promise<void>}
 */
export function batchSetProductStatus (data) {
  return http({
    url: '/cart/updateCheckStatus',
    method: 'put',
    data: data
  })
}

/**
 * 查询购物车商品
 */
export function getCartList () {
  return http({
    url: '/cart/selectOfCartGoods',
    method: 'get'
  })
}

/**
 * 删除购物车商品
 * @param data
 */
export function deleteCartProduct (data) {
  return http({
    url: '/cart/removeCartGoods',
    method: 'delete',
    data: data
  })
}

/**
 * 查询所有收货地址信息
 */
export function getAddressAll () {
  return http({
    url: '/userAddress/selectAll',
    method: 'get'
  })
}

/**
 * 查询单个收货地址信息
 * @param id
 */
export function getItemAddress (id) {
  return http({
    url: '/userAddress/selectOne',
    method: 'get',
    params: { uaId: id }
  })
}

/**
 * 添加收货地址 - 编辑收货地址（有无id）
 * @param data
 */
export function setAddressItem (data) {
  return http({
    url: '/userAddress/add',
    method: 'post',
    data: data
  })
}

export function deleteAddressItem (id) {
  return http({
    url: '/userAddress/delete',
    method: 'delete',
    data: { uaId: id }
  })
}
