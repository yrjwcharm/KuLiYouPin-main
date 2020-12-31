import http from '~/utils/http'

/**
 * 获取我的粉丝列表
 * @returns Promise
 */
export function getFansList (data) {
  return http({
    url: '/personalCenter/selectByFans',
    method: 'get',
    params: data
  })
}

/**
 * 获取积分明细
 * @param params 积分类型 分页
 * @returns Promise
 */
export function getIntegralList (data) {
  return http({
    url: '/personalCenter/selectByIntegral',
    method: 'get',
    params: data
  })
}

/**
 * 余额明细
 * */
export function queryBalanceDetails (url, data) {
  return http({
    url,
    method: 'get',
    params: data
  })
}

/**
 * 我的礼品列表
 * @param params
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
 * 获取收益分页列表
 * @param params
 * @returns Promise
 */
export function getBudgetDetailList (params) {
  return http({
    url: '/orderInfo/summaryOrderProfit',
    method: 'get',
    params: params
  })
}

/**
 * 获取意见反馈类型
 * @return Promise
 */
export function getFeeBackTypeList () {
  return http({
    url: '/userFeedbackType/getList',
    method: 'get'
  })
}

/**
 * 添加反馈信息
 * @param data
 * @return Promise
 */
export function insertFeeBackData (data) {
  return http({
    url: '/userFeedback/insert',
    method: 'post',
    data
  })
}

/**
 * 获取反馈列表
 * @return Promise
 */
export function getFeedbackList (params) {
  return http({
    url: '/userFeedback/getPage',
    method: 'get',
    params
  })
}
