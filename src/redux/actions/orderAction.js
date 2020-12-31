import { createGiftItems, getTaxItems } from '~/service/order'
import Toast from 'teaset/components/Toast/Toast'

export const CREATE_ORDER_INFO = 'CREATE_ORDER_INFO'
export const CREATE_GIFT_INFO = 'CREATE_GIFT_INFO'

export function createOrderAction (_data, callback) {
  return dispatch => {
    getTaxItems(_data).then(res => {
      const { rel, data } = res
      if (rel) {
        dispatch({
          type: CREATE_ORDER_INFO,
          data: {
            list: _data,
            order: data
          }
        })
      }
      if (typeof callback === 'function') {
        callback(res)
      }
    })
  }
}

export function createGiftOrderAction (_data, callback) {
  return dispatch => {
    console.log(_data)
    createGiftItems(_data).then(res => {
      console.log(res)
      const { rel, data, msg } = res
      if (rel) {
        dispatch({
          type: CREATE_GIFT_INFO,
          data: {
            giftId: _data.giftId,
            currentGiftInfo: data
          }
        })
        if (typeof callback === 'function') {
          callback()
        }
      } else {
        Toast.fail(msg)
      }
    }).catch((error) => {
      console.log(error)
      Toast.fail('领取失败！')
    })
  }
}
