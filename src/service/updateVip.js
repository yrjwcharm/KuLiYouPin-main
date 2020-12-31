import http from '~/utils/http'

/**
 * 获取拉新规则
 * @returns {Promise<void>}
 */
export function pullNewConfig () {
  return http({
    url: '/exhibition/selectByPullNewConfig',
    method: 'get'
  })
}

/**
 * 免费升级vip
 * @param data
 * @returns {Promise<void>}
 */
export function freeUpgradeVip (data) {
  return http({
    url: '/distributorsShop/insertPullNewShop',
    method: 'post',
    data
  })
}
