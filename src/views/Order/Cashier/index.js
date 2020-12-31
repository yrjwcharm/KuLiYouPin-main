/**
 * 收银台
 */
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { getOrderItemInfo, getSysPaymentList, resetPayOrder } from '~/service/order'
import { DefaultTheme } from '~/themes'
import { toMoney } from '~/utils/tools'
import { useNavigation, useTheme } from '@react-navigation/native'
import CountDownTimer from '~/components/CountDownTimer'
import Checkbox from 'teaset/components/Checkbox/Checkbox'
import Icon from 'react-native-vector-icons/Feather'
import Toast from 'teaset/components/Toast/Toast'
import * as WeChat from 'react-native-wechat-lib'

const OrderCashier = (props) => {
  const { route: { params: { id } } } = props
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [data, setData] = useState({
    goodsPriceCount: undefined,
    freight: undefined,
    taxRate: undefined,
    couponMoney: undefined,
    tradeModel: undefined,
    consumptionMoney: undefined,
    balancePaid: undefined,
    needIntegral: undefined,
    products: [],
    integralDiscountPrice: undefined
  })
  const [downTime, setDownTime] = useState('')
  const [payList, setPayList] = useState([])
  const [payType, setPayType] = useState(undefined)
  const [btnLoading, setBtnLoading] = useState(false)

  const getPayList = async () => {
    const { rel, data } = await getSysPaymentList()
    if (rel) {
      const payList = data.map(item => ({ label: item.payName, value: item.payId + '' }))
      setPayList(payList)
      setPayType(data[0].payId + '')
    }
  }

  const initData = () => {
    getOrderItemInfo(id).then(res => {
      const { rel, data } = res
      if (rel) {
        console.log(data.payDate)
        setData(data)
        setDownTime(new Date(new Date().getTime() + data.payDate * 1000 * 60))
      }
    })
  }

  const handleSubmit = () => {
    if (!payType) {
      Toast.fail('请选择支付方式')
      return false
    }
    resetPayOrder({ orderSn: id + '', urlCode: '', payId: payType }).then(res => {
      if (res.rel) {
        onBridgeReady(res.data)
      } else {
        Toast.fail(res.msg)
      }
    }).finally(() => {
      setBtnLoading(false)
    })
  }

  const onBridgeReady = async (data) => {
    const { errCode, errStr } = WeChat.pay(data)
    if (errCode === 0) {
      navigate('orderSuccess')
    } else {
      Toast.fail(errStr)
      navigate('orderList')
    }
  }
  useEffect(() => {
    initData()
    getPayList()
  }, [])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f9' }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>订单剩余支付时间：</Text>
            <CountDownTimer
              date={downTime}
              hours='时'
              mins='分'
              segs='秒'
              containerStyle={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}
              daysStyle={styles.time}
              hoursStyle={styles.time}
              minsStyle={styles.time}
              secsStyle={styles.time}
              firstColonStyle={styles.colon}
              secondColonStyle={styles.colon}
            />
          </View>
          <View style={styles.productContainer}>
            <Text style={styles.productTitle}>{data.tradeModel}</Text>
            {data.products.map((item, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', paddingVertical: 6 }}>
                  <Image source={{ uri: item.imageUrl || item.imageUrl1 }} style={{ width: 120, height: 120 }} />
                  <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: 5, flex: 1, paddingBottom: 5, paddingTop: 4 }}>
                    <Text numberOfLines={2} style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.productDesc}>{item.specName}</Text>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.brand }}>￥{toMoney(item.productPrice)}</Text>
                      <Text style={{ color: colors.text }}>x{item.quantity}</Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
          <View>
            <Text style={styles.itemTitle}>结算明细</Text>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>商品总价</Text>
              <Text style={styles.itemDesc}>￥{toMoney(data.goodsPriceCount || 0)}元</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>运费</Text>
              <Text style={styles.itemDesc}>￥{toMoney(data.freight || 0)}元</Text>
            </View>
            {data.tradeModel === 1 || data.tradeModel === 2 ? (
              <View style={styles.item}>
                <Text style={styles.itemLabel}>税金</Text>
                <Text style={styles.itemDesc}>￥{toMoney(data.taxRate || 0)}元</Text>
              </View>
            ) : null}
            {data.couponMoney ? (
              <View style={styles.item}>
                <Text style={styles.itemLabel}>优惠劵</Text>
                <Text style={styles.itemDesc}>￥{toMoney(data.couponMoney || 0)}元</Text>
              </View>
            ) : null}
            {data.needIntegral ? (
              <View style={styles.item}>
                <Text style={styles.itemLabel}>积分</Text>
                <Text style={styles.itemDesc}>已使用{data.needIntegral}积分, 抵扣￥-{data.integralDiscountPrice}</Text>
              </View>
            ) : null}
            {data.consumptionMoney ? (
              <View style={styles.item}>
                <Text style={styles.itemLabel}>余额红包</Text>
                <Text style={styles.itemDesc}>￥{toMoney(data.consumptionMoney || 0)}元</Text>
              </View>
            ) : null}
            {data.balancePaid ? (
              <View style={styles.item}>
                <Text style={styles.itemLabel}>现金余额</Text>
                <Text style={styles.itemDesc}>￥{toMoney(data.balancePaid || 0)}元</Text>
              </View>
            ) : null}
          </View>
          <View>
            <Text style={styles.itemTitle}>支付方式</Text>
            {payList.map((item, key) => {
              return (
                <View style={styles.item} key={key}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Checkbox
                    size='md'
                    uncheckedIcon={<Icon name='circle' size={20} color={DefaultTheme.colors.brand} />}
                    checkedIcon={<Icon name='check-circle' size={20} color={DefaultTheme.colors.brand} />}
                    checked={payType === item.value}
                    onChange={checked => {
                      setPayType(checked ? item.value : undefined)
                    }}
                  />
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity disabled={btnLoading} activeOpacity={0.9} onPress={handleSubmit}>
        <Text style={styles.btn}>支付{toMoney(data.totalPrice)}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#EF4034',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    height: 44,
    textAlign: 'center',
    lineHeight: 44
  },
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fffbe8'
  },
  headerText: {
    fontSize: 12,
    color: '#ed6a0c'
  },
  time: {
    fontSize: 16,
    color: '#ed6a0c',
    marginHorizontal: 5
  },
  colon: {
    color: '#ed6a0c'
  },
  productContainer: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10
  },
  item: {
    flexDirection: 'row',
    backgroundColor: DefaultTheme.colors.card,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10
  },
  productTitle: {
    fontSize: 14,
    color: '#333',
    height: 30,
    lineHeight: 30
  },
  productName: {
    lineHeight: 20
  },
  productDesc: {
    fontSize: 12,
    backgroundColor: DefaultTheme.colors.auxiliaryText,
    color: DefaultTheme.colors.auxiliary,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8
  },
  itemTitle: {
    fontSize: 12,
    color: '#666',
    paddingTop: 14,
    paddingBottom: 6,
    paddingLeft: 10
  },
  itemLabel: {
    color: DefaultTheme.colors.text
  },
  itemDesc: {
    fontSize: 12,
    color: DefaultTheme.colors.desc
  }
})

export default OrderCashier
