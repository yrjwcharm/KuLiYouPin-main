import { CREATE_GIFT_INFO, CREATE_ORDER_INFO } from '~/redux/actions/orderAction'

const INITIAL_STATE = {
  sku: [],
  currentOrderInfo: {
    orderPrice: 0,
    consumptionMoney: 0,
    consumptionMoneyScale: 0,
    userAddress: undefined,
    couponsList: [],
    selectCoupon: undefined,
    products: [],
    userRealInfo: {
      realName: '',
      identitycard: '',
      mobile: ''
    }
  },
  giftId: undefined,
  currentGiftInfo: null
}

export default function order (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_ORDER_INFO:
      return {
        ...state,
        sku: action.data.list,
        currentOrderInfo: action.data.order
      }
    case CREATE_GIFT_INFO:
      return {
        ...state,
        giftId: action.data.giftId,
        currentGiftInfo: action.data.currentGiftInfo
      }
    default:
      return state
  }
}
