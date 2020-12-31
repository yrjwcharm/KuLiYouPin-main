import http from '~/utils/http'

/**
 * 查询已绑定银行列表
 */
export function queryBindBankList () {
  return http({
    url: '/userAccountManager/queryMyBoundBank',
    method: 'get'
  })
}

/**
 * 查询所有银行列表
 */
export function queryBankList () {
  return http({
    url: '/userAccountManager/queryAllBank',
    method: 'get'
  })
}

/**
 * 提现
 */
export function cash (params) {
  return http({
    url: '/userAccountManager/withdrawals',
    method: 'post',
    data: params
  })
}

/**
 * 新增银行卡
 */
export function addBankCard (params) {
  return http({
    url: '/userAccountManager/addBankCard',
    method: 'post',
    data: params
  })
}

/**
 * 删除银行卡
 */
export function deleteBankCard (bankId) {
  return http({
    url: '/userAccountManager/removeBank',
    method: 'get',
    params: bankId
  })
}

/**
 * 查询提现明细
 */
export function queryCashDetails (data) {
  return http({
    url: '/userAccountManager/queryWithdrawalDetails',
    method: 'get',
    params: data
  })
}
