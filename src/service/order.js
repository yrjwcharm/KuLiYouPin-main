import http from '../utils/http'

/**
 * 创建订单详情
 * @param data
 */
export function getTaxItems (data) {
  return http({
    url: '/orderInfo/taxItems',
    method: 'post',
    data: data
  })
}

/**
 * 生成订单
 * @param data
 */
export function createOrder (data) {
  return http({
    url: '/orderInfo/createOrder',
    method: 'post',
    data: data
  })
}

/**
 * 获取订单支付方式
 */
export function getSysPaymentList () {
  return http({
    url: '/sysPayment/getList',
    method: 'get'
  })
}

/**
 * 获取订单列表
 */
export function getOrderList (data) {
  return http({
    url: '/orderInfo/queryAllOrderInfo',
    method: 'get',
    params: data
  })
}

/**
 * 取消订单售后
 * @param orderSn
 * @return Promise
 */
export function cancelOrderFund (orderSn) {
  return http({
    url: '/orderRefund/cancelOrderRefund',
    method: 'post',
    data: {
      orderSn
    }
  })
}

/**
 * 取消订单
 * @param orderSn
 * @returns {AxiosPromise}
 */
export function cancelOrderHandle (orderSn) {
  return http({
    url: '/orderInfo/delOrderSn',
    method: 'get',
    params: { orderSn }
  })
}

/**
 * 获取订单详情
 * @param orderId
 * @return Promise
 */
export function getOrderItemDetails (orderId) {
  return http({
    url: '/orderInfo/queryOrderInfo',
    method: 'get',
    params: {
      orderId
    }
  })
}

/**
 * 获取未支付订单详情
 * @param id
 */
export function getOrderItemInfo (id) {
  return http({
    url: '/orderInfo/orderDetails',
    method: 'get',
    params: {
      orderSn: id
    }
  })
}

/**
 * 确认收货
 * @param orderSn
 * @return Promise
 */
export function confirmReceiptHandle (orderSn) {
  return http({
    url: '/orderInfo/confirmReceiving',
    method: 'put',
    data: {
      orderSn
    }
  })
}

/**
 * 删除订单
 * @param id
 * @returns {Promise}
 */
export function deleteOrderItem (id) {
  return http({
    url: '/orderInfo/delete?id=' + id,
    method: 'delete'
  })
}

/**
 * 获取快递物流
 * @param orderSn
 * @param expressNo
 * @returns Promise
 */
export function getOrderKuaiDiInfo (orderSn, expressNo) {
  return http({
    url: '/webkuaidi100/queryOne',
    method: 'get',
    params: {
      orderSn,
      expressNo
    }
  })
}

/**
 * 获取售后订单信息
 * @param orderSn
 * @returns {Promise<void>}
 */
export function getFundOrderInfo (orderSn) {
  return http({
    url: '/orderRefund/queryOrderItem',
    method: 'get',
    params: {
      orderSn
    }
  })
}

/**
 * 获取退货原因
 * @returns {Promise<void>}
 */
export function getFundTypeList () {
  return http({
    url: '/sysRefundReson/getList',
    method: 'get',
    params: {
      refundType: 1
    }
  })
}

/**
 * 添加订单售后信息
 * @param data
 * @returns {Promise<void>}
 */
export function addOrderFundInfo (data) {
  return http({
    url: '/orderRefund/createOrderRefund',
    method: 'post',
    data: data
  })
}

/**
 * 创建预览订单 礼品
 * @param data
 * @returns Promise
 */
export function createGiftItems (data) {
  return http({
    url: '/orderInfo/giftItems',
    method: 'post',
    data
  })
}

/**
 * 重新支付订单
 * @param orderSn | urlCode
 */
export function resetPayOrder (params) {
  return http({
    url: '/orderInfo/payOrder',
    method: 'post',
    data: params
  })
}

/**
 * 创建礼品订单
 * @param data
 * @returns Promise
 */
export function createGiftOrderItems (data) {
  return http({
    url: '/orderInfo/createGiftItems',
    method: 'post',
    data
  })
}
