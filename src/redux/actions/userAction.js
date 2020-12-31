import { appGetToken, authLogin, getLastShopId, getNewUserSetting, getUserInfo, isMarketTing, isUserNew, judgeShopIdIsTrue } from '~/service/user'
import storage from '@react-native-community/async-storage'

export const SET_USER_TOKEN = 'SET_USER_TOKEN'

export const GET_USER_INFO = 'GET_USER_INFO'

/**
 * 获取用户信息token
 * @param _data
 * @return {function(*=): Promise<unknown>|Promise<boolean>|*}
 */
export function getUserTokenAction (_data) {
  return dispatch => {
    return authLogin(_data).then(res => {
      const { rel, data: { token } } = res
      if (!rel) return false
      storage.setItem('token', token, () => {
        dispatch({
          type: SET_USER_TOKEN,
          data: {
            token: token
          }
        })
      })
    })
  }
}

/**
 * 微信授权登陆
 * @param _data
 * @return {function(*): void}
 */
export function wechatUserTokenAction (_data) {
  return dispatch => {
    return appGetToken(_data).then(res => {
      console.log(res)
      const { rel, data: { token } } = res
      if (!rel) return false
      storage.setItem('token', token, () => {
        dispatch({
          type: SET_USER_TOKEN,
          data: {
            token: token
          }
        })
      })
    })
  }
}

/**
 * 清除token
 * @return {{data: {token: undefined}, type: string}}
 */
export function closeUserTokenAction () {
  return {
    type: SET_USER_TOKEN,
    data: {
      token: undefined
    }
  }
}

/**
 * 获取用户信息
 * @return {function(*): void}
 */
export function getUserInfoAction () {
  return dispatch => {
    return getUserInfo().then(res => {
      const { rel, data } = res
      console.log('userInfo', data)
      if (rel) {
        const { headimgurl, mobilePhone, levelName, nickname, invitecode, discount, sex, distributorsUserId, userId, payPoints, ...arg } = data
        dispatch({
          type: GET_USER_INFO,
          data: {
            avatar: headimgurl,
            nickName: nickname,
            mobile: mobilePhone,
            sex: sex,
            userId,
            payPoints,
            levelName,
            invitecode,
            discount,
            ...arg
          }
        })
        actionLastShopId(distributorsUserId, dispatch)
        actionJuniorShop(userId, dispatch)
        setIsUserNew(dispatch)
        setNewUserSetting(dispatch)
        actionMarketing(dispatch)
      }
    })
  }
}

/**
 * 获取当前店铺id分享者id
 * @param storeId
 * @param dispatch
 */
function actionLastShopId (storeId, dispatch) {
  getLastShopId(storeId).then(res => {
    const { rel, data } = res
    if (rel) {
      dispatch({
        type: GET_USER_INFO,
        data: {
          shopId: data.shopId,
          shareId: data.lastParentId || ''
        }
      })
    }
  })
}

/**
 * 是否新用户
 */
function setIsUserNew (dispatch) {
  isUserNew().then(res => {
    const { rel, data } = res
    if (rel) {
      dispatch({
        type: GET_USER_INFO,
        data: {
          isNewUser: data
        }
      })
    }
  })
}

/**
 * 新用户活动
 * @param dispatch
 */
function setNewUserSetting (dispatch) {
  getNewUserSetting().then(res => {
    const { rel, data } = res
    if (rel) {
      dispatch({
        type: GET_USER_INFO,
        data: {
          newUserData: data
        }
      })
    }
  })
}

/**
 * 是否为营销人员
 * @returns {function(...[*]=)}
 */
function actionMarketing (dispatch) {
  isMarketTing().then(res => {
    const { rel, data: { need } } = res
    if (rel) {
      dispatch({
        type: GET_USER_INFO,
        data: {
          isMarketTing: need === 'no'
        }
      })
    }
  })
}

/**
 * 是否为初级店铺
 * @returns {function(...[*]=)}
 */
function actionJuniorShop (userId, dispatch) {
  judgeShopIdIsTrue({ shopId: userId }).then(res => {
    const { rel } = res
    dispatch({ type: GET_USER_INFO, data: { isJuniorShop: rel } })
  }).catch(() => {
    dispatch({ type: GET_USER_INFO, data: { isJuniorShop: false } })
  })
}
