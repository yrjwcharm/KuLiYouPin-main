import http from '~/utils/http'
/**
 * 获取当前品牌详情
 * @param data
 * @returns {Promise<void>}
 */
export function getBrandInfo (data) {
  return http({
    url: '/distributorsBrand/getBrand',
    method: 'get',
    params: { ...data }
  })
}

/**
 * 获取品牌下商品分页
 * @param params
 * @returns {Promise<void>}
 */
export function getBrandProductList (params) {
  return http({
    url: '/distributorsBrand/getBrandPage',
    method: 'get',
    params: params
  })
}
