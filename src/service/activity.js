import http from '~/utils/http'

/**
 * 获取icon活动海报
 * @param data
 * @returns {Promise<void>}
 */
export function getIconDetailsBanner (data) {
  return http({
    url: '/goods/selectByPoster',
    method: 'get',
    params: data
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
 * 获取会场页轮播
 * @param activePage
 * @returns {Promise<void>}
 */
export function getConferenceSwipeList (activePage) {
  return http({
    url: '/ActivityGoodsItems/carouselActivity',
    method: 'get',
    params: { activePage }
  })
}

/**
 * 回去会场页推荐商品
 * @param activePage
 * @returns {Promise<void>}
 */
export function getConferenceHotPushList (activePage) {
  return http({
    url: '/ActivityGoodsItems/pickOfTheWeek',
    method: 'get',
    params: { activePage }
  })
}

/**
 * 获取活动商品列表
 * @param data
 * @returns Promise
 */
export function getCompleteProduce (data) {
  return http({
    url: '/exhibition/completeProduce',
    method: 'get',
    params: data
  })
}

/**
 * 获取品牌列表
 * @param data
 * @returns Promise
 */
export function getCompleteBrand (data) {
  return http({
    url: '/exhibition/completeBrand',
    method: 'get',
    params: data
  })
}

/**
 * 品牌模式下商品展示模式
 * @param data
 * @returns Promise
 */
export function getCompleteBrandProduct (data) {
  return http({
    url: '/exhibition/completeBrandProduct',
    method: 'get',
    params: data
  })
}

/**
 * 获取当前签到详情
 * @returns Promise
 */
export function getAttendanceInfo (id) {
  return http({
    url: '/actSignInItems/queryActSignInId',
    method: 'get',
    params: { signInId: id }
  })
}

/**
 * 签到
 * @param data
 * @returns Promise
 */
export function addActSignIn (data) {
  return http({
    url: '/actSignInUserStat/addActSignInUser',
    method: 'post',
    data: data
  })
}

/**
 * 获取积分兑换比例
 * @returns Promise
 */
export function getAttendanceRate () {
  return http({
    url: '/sysBaseConfigValue/getDisCreditBase',
    method: 'get'
  })
}

/**
 * 我的礼品列表
 * @param data
 * @returns Promise
 */
export function selectByUserGiftCarStatus (data) {
  return http({
    url: '/userGiftCar/selectByUserGiftCarStatus',
    method: 'get',
    params: data
  })
}

/**
 * 获取赠品活动详情
 * @return Promise
 */
export function getGiftInfo () {
  return http({
    url: '/actGiftActivity/getTitle',
    method: 'get'
  })
}

/**
 * 获取赠品商品列表
 * @param data
 * @return Promise
 */
export function getGiftPage (data) {
  return http({
    url: '/actGiftActivity/getPage',
    method: 'get',
    params: data
  })
}

/**
 * icon积分抵现活动详情
 * @param data
 * @return Promise
 */
export function getPointOffsetInfo (data) {
  return http({
    url: '/goods/selectByCreditPoster',
    method: 'get',
    params: data
  })
}

/**
 * icon低分抵现商品分页
 * @param data
 * @return Promise
 */
export function getPointOffsetProductList (data) {
  return http({
    url: '/goods/selectByCreditId',
    method: 'get',
    params: data
  })
}

/**
 * 领取赠品
 * @param data
 * @return Promise
 */
export function addGiftInfo (data) {
  return http({
    url: '/actGiftActivity/getActGift',
    method: 'post',
    data
  })
}

/**
 * 领取礼品码
 * @param codeNo
 * @returns Promise
 */
export function getGiftCodeApi (codeNo) {
  return http({
    url: '/distributorsShop/addActGiftCodeNo',
    method: 'post',
    data: { codeNo }
  })
}
