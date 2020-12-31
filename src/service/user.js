import http from '~/utils/http'

/**
 * 获取用户信息
 * @returns {Promise<void>}
 */
export function getUserInfo () {
  return http({
    url: '/users/selectBaseMsg',
    method: 'get'
  })
}

/**
 * 获取访客用户
 * @return {Promise<void>}
 */
export function getVisitorInfo () {
  return http({
    url: '/wxAuthorize/queryCode',
    method: 'get'
  })
}

/**
 * app 微信授权登陆
 * @param code
 * @return Promise
 */
export function appGetToken (code) {
  return http({
    url: '/appLogin/appUsers',
    method: 'get',
    params: {
      code
    }
  })
}

/**
 * 获取短信验证码
 * @param mobile
 * @return AxiosPromise
 */
export function getLoginCode (mobile) {
  return http({
    url: '/login/sendSms',
    method: 'get',
    params: {
      mobile_phone: mobile,
      role_id: 4,
      sms_type: 'SMS_REGISTER'
    }
  })
}

/**
 * 登陆
 * @param data
 * @return AxiosPromise
 */
export function authLogin (data) {
  return http({
    url: '/login/signIn',
    method: 'post',
    data: data
  })
}

/**
 * 是否是高级店铺营销人员
 * @returns {Promise<void>}
 */
export function isMarketTing () {
  return http({
    url: '/distributorsShop/boolDistributorsUser',
    method: 'get'
  })
}

/**
 * 获取最后访问初级店铺id
 * @param storeId
 * @returns {Promise<void>}
 */
export function getLastShopId (storeId) {
  return http({
    url: '/wxAuthorize/lastShopUserId',
    method: 'get',
    params: { storeId }
  })
}

/**
 * 实名验证
 * @param data
 */
export function authRealInfo (data) {
  return http({
    url: '/userRealInfo/auth',
    method: 'post',
    data: data
  })
}

/**
 * 获取短信验证码
 * @param {string} mobile
 */
export function authGetCode (mobile) {
  return http({
    url: '/userRealInfo/sendSms',
    method: 'get',
    params: {
      mobile: mobile,
      sms_type: 'AUTH_CODE'
    }
  })
}

/**
 * 修改用户手机号
 * @param data
 * @returns AxiosPromise
 */
export function bandingUserMobile (data) {
  return http({
    url: '/users/checkSms',
    method: 'post',
    data: data
  })
}

/**
 * 修改店铺名称
 * @param data
 * @returns Promise
 */
export function editShopName (data) {
  return http({
    url: '/users/changeShopMassage',
    method: 'put',
    data: data
  })
}

/**
 * 比较当前号码是否是实名认证的号码
 * @param data
 * @returns {Promise}
 */
export function compareTelPhone (data) {
  return http({
    url: '/userRealInfo/compareTelphone',
    method: 'get',
    params: data
  })
}

/**
 * 更新实名认证信息
 * @param data
 * @returns {Promise}
 */
export function updateUserRealInfo (data) {
  return http({
    url: '/userRealInfo/update',
    method: 'put',
    data: data
  })
}

/**
 * 获取用户等级积分
 * @returns Promise
 */
export function getUserRankPoint () {
  return http({
    url: '/personalCenter/selectByRankPoints',
    method: 'get'
  })
}

/**
 * 获取初级店铺收益
 * @returns Promise
 */
export function getBudgetInfoApi () {
  return http({
    url: '/orderInfo/orderProfit',
    method: 'get'
  })
}

/**
 * 查询当前小店设置信息
 * @returns Promise
 */
export function getCurrentShopInfo () {
  return http({
    url: '/exhibition/selectByName',
    method: 'get'
  })
}

/**
 * 切换当前店铺
 * */
export function changeCurrentShop () {
  return http({
    url: '/distributors/getAllStore',
    method: 'get'
  })
}

/**
 * 修改最后一次访问店铺记录
 * @params lastShopUserId,shareId
 * */
export function updateLoginRecode (params) {
  return http({
    url: '/write/update',
    method: 'put',
    data: params
  })
}

/**
 * 判断初级店铺id是否有效
 * @params shopId
 * */
export function judgeShopIdIsTrue (shop) {
  return http({
    url: '/distributorsShop/getShopId',
    method: 'get',
    params: shop
  })
}

/**
 * 查询升级规则
 * @returns Promise
 */
export function queryUpgradeRules () {
  return http({
    url: '/exhibition/selectByShopConfig',
    method: 'get'
  })
}

/**
 * 升级Vip
 * @param data 付费需要传payId
 * @returns Promise
 */
export function upgradeVipPayMoney (data) {
  return http({
    url: '/distributorsShop/insertShopConfig',
    method: 'post',
    data
  })
}

/**
 * 判断token是否过期
 * @param token
 * @returns Promise
 */
export function queryToken (token) {
  return http({
    url: '/login/queryToken',
    method: 'get',
    params: { token }
  })
}

/**
 * 判断初级店铺内是否可升级vip
 * @returns Promise
 */
export function selectByUpgrade () {
  return http({
    url: '/exhibition/selectByUpgrade',
    method: 'get'
  })
}

/**
 * 新用户检测是否需要输入验证码
 * @returns AxiosPromise
 */
export function authInviteCode () {
  return http({
    url: '/sysInviteCodeUseDetail/inviteCode',
    method: 'get'
  })
}

/**
 * 检测店铺邀请码是否输入正确
 * @param code
 * @returns Promise
 */
export function queryInvitationCode (code) {
  return http({
    url: '/sysInviteCodeUseDetail/boolInvitationCode',
    method: 'get',
    params: {
      nvitationCode: code
    }
  })
}

/**
 * 根据店铺邀请码返回店铺标识，店铺id
 * @param code
 * @returns Promise
 */
export function checkedShopCode (code) {
  return http({
    url: '/distributorsShop/getStoreCode',
    method: 'get',
    params: {
      inviteCode: code
    }
  })
}

/**
 * 获取访客用户
 * @return {Promise<void>}
 */
export function queryVisitorInfo () {
  return http({
    url: '/wxAuthorize/queryCode',
    method: 'get'
  })
}

/**
 * 是否新用户
 * @return {Promise<void>}
 */
export function isUserNew () {
  return http({
    url: '/flashSale/isNewObject',
    method: 'get'
  })
}

/**
 * 获取新人礼活动配置
 * @return {Promise<void>}
 */
export function getNewUserSetting () {
  return http({
    url: '/flashSale/getSale',
    method: 'get'
  })
}

/**
 * 获取活动商品
 * @return {Promise<void>}
 */
export function getSaleItemList () {
  return http({
    url: '/flashSale/getSaleItems',
    method: 'get'
  })
}
