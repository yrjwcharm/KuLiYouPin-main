import http from '~/utils/http'

/**
 * 查询商品详情
 * @param id
 */
export function selectProductInfo (id) {
  return http({
    url: '/goodsMsg/selectOne',
    method: 'get',
    params: {
      productId: id
    }
  })
}

/**
 * 获取当前商品是否存在选中商品规格
 * @param productId 商品id
 * @returns {Promise}
 */
export function getCurrentSelectSku (productId) {
  return http({
    url: '/goodsMsg/selectCheckedSkuId',
    method: 'get',
    params: { productId }
  })
}

/**
 * 条件搜索查询
 * @param params
 * @returns {Promise<void>}
 */
export function selectBySearch (params) {
  return http({
    url: '/goods/selectBySearch',
    method: 'get',
    params: params
  })
}

/**
 * 获取icon活动详情
 * @param data
 * @returns {Promise<void>}
 */
export function getIconDetails (data) {
  return http({
    url: '/goods/selectByGuess',
    method: 'get',
    params: data
  })
}

/**
 * 查询最大加价比例
 * @returns {Promise<void>}
 */
export function getMaxAddPriceRate () {
  return http({
    url: '/sysBaseConfigValue/querySysBaseConfig',
    method: 'get',
    params: { bcKey: 'sc_shop_addprice_max,sc_shop_addprice_is_static,sc_shop_addprice_default,default_shop_price' }
  })
}

/**
 * 收藏商品
 * @param data
 */
export const collectionProduct = (data) => {
  return http({
    url: '/userCollect/collectGoods',
    method: 'put',
    data
  })
}

/**
 * 获取所有收藏商品
 */
export function getSaveProductList (params) {
  return http({
    url: '/userCollect/selectCollectGoods',
    method: 'get',
    params: params
  })
}

/**
 * 保存当前商品选中sku
 * @param data
 * @returns {Promise<void>}
 */
export function saveCurrentSku (data) {
  return http({
    url: '/goodsMsg/saveCheckedSkuId',
    method: 'post',
    data: data
  })
}

/**
 * 查询商品优惠券列表
 * @params productId | skuId
 */
export function queryProductCouponList (data) {
  return http({
    url: '/goodsMsg/getCouponList',
    method: 'get',
    params: data
  })
}

/**
 * 获取二维码
 * @param data
 * @returns {Promise<T>}
 */
export function getQuCode (data) {
  return http({
    url: '/weChatAuthorized/getMini',
    method: 'get',
    params: data
  })
}

/**
 * 获取商品初级店铺价格
 * @param productId
 * @returns Promise
 */
export function getProductFirstMoney (productId) {
  return http({
    url: '/goodsMsg/getMinPriceInShopForShow',
    method: 'get',
    params: { productId }
  })
}
