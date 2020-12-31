import { GET_APP_INFO } from '~/redux/actions/appAction'

const initialState = {
  routeName: undefined,
  // 店铺名称
  appName: undefined,
  // 首页背景
  backgroundPicture: undefined,
  // logo
  logo: undefined,
  // 店铺id
  shopId: undefined,
  // 商城客服电话
  telephone: undefined,
  // 小店客服电话
  customerPhone: undefined,
  // 客服二维码
  customerQrcodePath: undefined,
  // 加价比例
  rate: undefined,
  // 默认成交价
  dsp: undefined
}

export default function appReducers (state = initialState, action) {
  switch (action.type) {
    case GET_APP_INFO:
      return Object.assign({}, state, action.data)
    default:
      return state
  }
}
