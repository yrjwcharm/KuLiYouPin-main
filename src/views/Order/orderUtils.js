import { getOrderKuaiDiInfo } from '~/service/order'

/**
 * 获取订单物流
 */
export const getProductLogistics = async (orderSn, expressNo) => {
  const { rel, data: { wayContent } } = await getOrderKuaiDiInfo(orderSn, expressNo)
  if (rel) {
    return JSON.parse(wayContent)
  } else {
    return []
  }
}

/**
 * 过滤快递物流
 * @param orderItemsVoList
 */
export const filterOrderProductHandle = (orderItemsVoList) => {
  const _deliveredList = {
    expressNo: undefined,
    expressName: '',
    productList: []
  }
  const _list = []
  let allList = []
  let count = 0
  orderItemsVoList.forEach((_item, index) => {
    // 异步闭包更新state
    (async function (item, _i) {
      const { itemExpressNo, itemExpressName, orderSn } = item
      if (itemExpressNo) {
        const data = await getProductLogistics(item.orderSn, itemExpressNo)
        const index = _list.findIndex(__item => __item.expressNo === itemExpressNo + '')
        if (index === -1) {
          _list.push({
            expressNo: itemExpressNo + '',
            expressName: itemExpressName,
            orderSn: orderSn,
            productList: [item],
            logisticsInfo: data
          })
        } else {
          _list[index].productList.push(item)
        }
      } else {
        _deliveredList.productList.push(item)
      }
      count++
      if (count === orderItemsVoList.length) {
        if (_deliveredList.productList.length) {
          allList = (_list.concat([_deliveredList]))
        }
      }
    })(_item, index)
  })
  return {
    list: _list,
    deliveredList: _deliveredList,
    allList
  }
}
