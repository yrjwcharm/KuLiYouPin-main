import http from '~/utils/http'

/**
 * 获取店铺信息
 * @param shopId
 * @returns {Promise<void>}
 */
export function getAppInfoApi (shopId) {
  return http({
    url: '/users/getShopName',
    method: 'get',
    params: { userId: shopId }
  })
}

/**
 * 获取最后访问店铺
 * @returns {Promise<void>}
 */
export function getLastShop () {
  return http({
    url: '/wxAuthorize/lastCode',
    method: 'get'
  })
}

/**
 * 获取店铺客服信息
 * @returns Promise
 */
export function getShopServiceApi () {
  return http({
    url: '/exhibition/selectByContact',
    method: 'get'
  })
}

/**
 * 查询店铺加价比例
 * @returns {Promise<void>}
 */
export function getMaxAddPriceRate () {
  return http({
    url: '/sysBaseConfigValue/querySysBaseConfig',
    method: 'get',
    params: { bcKey: 'sc_shop_addprice_max,sc_shop_addprice_is_static,sc_shop_addprice_default,default_shop_price' }
  })
}
