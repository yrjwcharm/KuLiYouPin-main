import { getAppInfoApi, getMaxAddPriceRate, getShopServiceApi } from '~/service/app'

export const GET_APP_INFO = 'GET_APP_INFO'

/**
 * 获取店铺信息
 * @return {function(*): void}
 */
export function getAppInfoAction () {
  return dispatch => {
    getAppInfoApi().then(res => {
      const { rel, data } = res
      if (!rel) return false
      const { storeName, backgroundPicture, logoUrl, shopId, telephone } = data
      dispatch({
        type: GET_APP_INFO,
        data: {
          appName: storeName,
          backgroundPicture: backgroundPicture,
          logo: logoUrl,
          shopId,
          telephone
        }
      })
    })
  }
}

/**
 * 获取店铺客服信息
 * @return {function(*): void}
 */
export function getShopInfoAction () {
  return dispatch => {
    getShopServiceApi().then(res => {
      const { rel, data } = res
      if (!rel) return false
      const { phone, url } = data
      dispatch({
        type: GET_APP_INFO,
        data: {
          customerPhone: phone || '',
          customerQrcodePath: url || ''
        }
      })
    })
  }
}

/**
 * 获取店铺的加价比例和默认成交价
 * @return {function(*): void}
 */
export function getShopMaxRateAction () {
  return dispatch => {
    getMaxAddPriceRate().then(res => {
      const { rel, data } = res
      if (!rel) return false
      const { defaultRate, defaultShopPrice } = data
      dispatch({
        type: GET_APP_INFO,
        data: {
          rate: +defaultRate || 0,
          dsp: +defaultShopPrice
        }
      })
    })
  }
}

/**
 * 当前route 名称
 * @param name
 * @return {{data: {routeName}, type: string}}
 */
export function appChangeRouteNameAction (name) {
  return {
    type: GET_APP_INFO,
    data: {
      routeName: name
    }
  }
}
