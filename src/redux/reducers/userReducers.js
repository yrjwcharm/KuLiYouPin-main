import { GET_USER_INFO, SET_USER_TOKEN } from '~/redux/actions/userAction'

const initialState = {
  token: undefined,
  // 用户头像
  avatar: undefined,
  // 用户昵称
  nickName: undefined,
  levelName: undefined,
  // 性别
  sex: 0,
  userId: undefined,
  invitecode: undefined,
  discount: undefined,
  // 用户积分
  payPoints: 0,
  // 店铺id
  shopId: undefined,
  // 分享者id
  shareId: undefined,
  // 是否初级店铺
  isJuniorShop: false,
  // 是否为营销人员
  isMarketTing: false,
  // 是否可以升级会员
  isUpgradeVip: false,
  // 是否为新用户
  isNewUser: false,
  // 新用户活动
  newUserData: undefined
}

export default function userReducers (state = initialState, action) {
  switch (action.type) {
    case SET_USER_TOKEN:
      return Object.assign({}, state, action.data)
    case GET_USER_INFO:
      return Object.assign({}, state, action.data)
    default:
      return state
  }
}
