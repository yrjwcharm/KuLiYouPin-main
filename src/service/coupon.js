import http from '~/utils/http'

/**
 * 领券中心
 * @return {AxiosPromise}
 */
export function couponCenterList (params) {
  return http({
    url: '/distributorsCoupons/getAllCoupon',
    method: 'get',
    params
  })
}

/**
 * 单张优惠券信息
 */
export function singleCouponInfo (couponId) {
  return http({
    url: '/distributorsCoupons/getCouponMsg',
    method: 'get',
    params: { couponId }
  })
}

/**
 * 领取优惠券
 * @params couponId
 * @return {AxiosPromise}
 */
export function receiveCoupon (couponId) {
  return http({
    url: '/distributorsCoupons/receiveCoupon',
    method: 'get',
    params: { couponId }
  })
}

/**
 * 我的优惠券
 * @return {AxiosPromise}
 */
export function mineCouponList (params) {
  return http({
    url: '/distributorsCoupons/getMyCoupon',
    method: 'get',
    params
  })
}

/**
 * 查询不同状态下的优惠券数量
 * @return {AxiosPromise}
 */
export function couponNumber () {
  return http({
    url: '/distributorsCoupons/selectMyCouponNum',
    method: 'get'
  })
}

/**
 * 删除优惠券
 * @params couponId
 * @return {AxiosPromise}
 */
export function deleteCoupon (couponId) {
  return http({
    url: '/distributorsCoupons/removeMyCoupon',
    method: 'delete',
    params: { couponId }
  })
}

/**
 * 进入首页查询可领取优惠券
 * @return {AxiosPromise}
 */
export function isReceiveCouponList (categoryId) {
  return http({
    url: '/ActivityGoodsItems/getPopup',
    method: 'get',
    params: { classification: categoryId }
  })
}

/**
 * 进入领券中心查询分类和品牌
 * @return {AxiosPromise}
 */
export function categoryAndBrandList () {
  return http({
    url: '/distributorsCoupons/getCategoryAndBrandByCouponExist',
    method: 'get'
  })
}

/**
 * 查询所有分类
 */
export function getCategoryList () {
  return http({
    url: '/category/findAll',
    method: 'get'
  })
}
