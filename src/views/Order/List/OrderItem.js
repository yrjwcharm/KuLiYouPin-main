import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { orderType, refundType } from '~/utils/orderType'
import { toMoney } from '~/utils/tools'
import { useNavigation, useTheme } from '@react-navigation/native'
import { filterOrderProductHandle } from '~/views/Order/orderUtils'
import { cancelOrderFund, cancelOrderHandle, confirmReceiptHandle, deleteOrderItem } from '~/service/order'
import Toast from 'teaset/components/Toast/Toast'

const OrderItem = (props) => {
  const {
    sourceData: {
      typeName, orderTotal, taxCount, orderStatus, refundStatus, payAmount, orderId, orderSn, orderItemsVoList
    },
    onChange
  } = props
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [list, setList] = useState([])
  const [allList, setAllList] = useState([])
  const [deliveredList, setDeliveredList] = useState({
    expressNo: undefined,
    expressName: '',
    productList: []
  })

  /**
   * 删除订单
   * @param _orderId
   * @param callback
   */
  const handleDeleteOrderItem = (_orderId, callback) => {
    Alert.alert('提示！', '确认要删除该订单吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        style: 'default',
        onPress: async () => {
          const { rel, msg } = await deleteOrderItem(_orderId)
          if (rel) {
            Toast.success('删除成功！')
            if (typeof callback === 'function') {
              callback()
            } else {
              onChange()
            }
          } else {
            Toast.fail(msg)
          }
        }
      }
    ])
  }

  /**
   * 取消售后订单
   * @param _orderSn
   * @param callback
   */
  const handleCancelOrderItem = (_orderSn, callback) => {
    Alert.alert('提示！', '您确认要取消退款服务吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        style: 'default',
        onPress: async () => {
          const { rel, msg } = await cancelOrderFund(_orderSn)
          if (rel) {
            Toast.success('取消成功！')
            if (typeof callback === 'function') {
              callback()
            } else {
              onChange()
            }
          } else {
            Toast.fail(msg)
          }
        }
      }
    ])
  }

  /**
   * 取消订单
   * @param _orderSn
   * @param callback
   */
  const handleCancelOrder = (_orderSn, callback) => {
    Alert.alert('提示！', '您确认要取消退款服务吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        style: 'default',
        onPress: async () => {
          const { rel, msg } = await cancelOrderHandle(_orderSn)
          if (rel) {
            Toast.success('取消成功！')
            if (typeof callback === 'function') {
              callback()
            } else {
              onChange()
            }
          } else {
            Toast.fail(msg)
          }
        }
      }
    ])
  }

  /**
   * 确认收货
   * @param _orderSn
   * @param callback
   */
  const handleConfirmReceipt = (_orderSn, callback) => {
    Alert.alert('确认收货！', '您确认收货吗？确认之后订单不可操作.', [
      { text: '取消', style: 'cancel' },
      {
        text: '确认',
        style: 'default',
        onPress: async () => {
          const { rel, msg } = await confirmReceiptHandle(_orderSn)
          if (rel) {
            Toast.success('收货成功！')
            if (typeof callback === 'function') {
              callback()
            } else {
              onChange()
            }
          } else {
            Toast.fail(msg)
          }
        }
      }
    ])
  }

  /**
   * 提醒发货
   */
  const handleToastDeliver = () => {
    Toast.success('已提醒发货！')
  }

  const title = refundStatus ? refundType[refundStatus + ''].title || '' : orderType[orderStatus].title || ''

  // 是否可以申请退款
  const isRefund = (+orderStatus === 1 || orderStatus === 2 || orderStatus === 5) && (refundStatus === 0 || refundStatus === 4)
  useEffect(() => {
    const orderData = filterOrderProductHandle(orderItemsVoList)
    setList(orderData.list)
    setAllList(orderData.allList)
    setDeliveredList(orderData.deliveredList)
  }, [props.sourceData])
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('orderDetails', { id: orderId })}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center', paddingHorizontal: 10 }}>
          <Text style={{ color: '#333' }}>{typeName}</Text>
          <Text style={{ color: '#EF4034', fontSize: 12 }}>
            {title === '待发货' ? (list.length ? '已部分发货' : '待发货') : title}</Text>
        </View>
      </TouchableOpacity>
      <View>
        {allList.map((item, key) => {
          if (!item?.productList.length) return null
          return (
            <View key={key}>
              {item.productList.map((_item, _key) => {
                return (
                  <TouchableOpacity key={_key} onPress={() => navigate('details', { id: _item.productId })}>
                    <View style={{ flexDirection: 'row', width: '100%', borderBottomWidth: 1, marginBottom: 6, borderBottomColor: '#f5f5f9', paddingHorizontal: 10, paddingVertical: 8 }}>
                      <View style={{ position: 'relative', width: 120, height: 120 }}>
                        <Image source={{ uri: _item.imageUrl }} style={{ width: 120, height: 120 }} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }} numberOfLines={2}>
                          {_item.productName}
                        </Text>
                        <Text style={{ fontSize: 12, backgroundColor: '#f5f5f9', color: '#777', paddingVertical: 3, paddingHorizontal: 6 }}>{_item.specName}</Text>
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ color: '#EF4034', fontWeight: 'bold', fontSize: 16 }}>{toMoney(_item.productPrice || 0)}</Text>
                          <Text style={{ fontSize: 12, color: '#777' }}>x{_item.quantity}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
              {item.expressNo ? (
                <View>
                </View>
              ) : null}
            </View>
          )
        })}
      </View>
      <TouchableOpacity onPress={() => navigate('orderDetails', { id: orderId })}>
        <Text style={{ fontSize: 14, textAlign: 'right', paddingHorizontal: 10, height: 30, lineHeight: 30, color: '#333' }}>
          总金额<Text style={{ color: '#EF4034' }}>￥{orderTotal}</Text>&nbsp;&nbsp;
          实付<Text style={{ color: '#EF4034' }}>￥{payAmount}</Text>&nbsp;&nbsp;
          {taxCount && <Text style={{ fontSize: 12, color: '#666' }}>(含油税￥{taxCount})</Text>}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 50, alignItems: 'center' }}>
        {orderStatus === 0 ? (
          <TouchableOpacity onPress={() => navigate('orderCashier', { id: orderSn })}>
            <Text style={[styles.defaultBtn, { backgroundColor: colors.brand, color: '#fff' }]}>
              去支付
            </Text>
          </TouchableOpacity>
        ) : null}
        {isRefund ? (
          <TouchableOpacity onPress={() => navigate('orderSelectService')}>
            <Text style={[styles.defaultBtn, { backgroundColor: colors.brand, color: '#fff' }]}>
              申请退款
            </Text>
          </TouchableOpacity>
        ) : null}
        {refundStatus === 1 || refundStatus === 2 ? (
          <TouchableOpacity onPress={() => handleCancelOrderItem(orderSn)}>
            <Text style={styles.defaultBtn}>取消售后申请</Text>
          </TouchableOpacity>
        ) : null}
        {orderStatus === 1 && refundStatus === 0 ? (
          <TouchableOpacity onPress={handleToastDeliver}>
            <Text style={styles.defaultBtn}>提醒发货</Text>
          </TouchableOpacity>
        ) : null}
        {orderStatus === 2 ? (
          <TouchableOpacity onPress={() => handleConfirmReceipt(orderSn)}>
            <Text style={[styles.defaultBtn, { backgroundColor: colors.brand, color: '#fff' }]}>
              确认收货
            </Text>
          </TouchableOpacity>
        ) : null}
        {orderStatus === 9 || refundStatus === 3 ? (
          <TouchableOpacity onPress={() => handleDeleteOrderItem(orderId, onChange)}>
            <Text style={styles.defaultBtn}>删除订单</Text>
          </TouchableOpacity>
        ) : null}
        {orderStatus === 0 ? (
          <TouchableOpacity onPress={() => handleCancelOrder(orderSn)}>
            <Text style={styles.defaultBtn}>取消订单</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 10
  },
  defaultBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f9',
    fontSize: 12,
    marginRight: 10,
    color: '#333',
    borderRadius: 3,
    overflow: 'hidden'
  }
})

export default OrderItem
