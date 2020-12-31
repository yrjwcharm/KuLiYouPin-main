/**
 * 订单详情
 */
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView, SafeAreaView, Image } from 'react-native'
import { getOrderItemDetails } from '~/service/order'
import { useNavigation, useTheme } from '@react-navigation/native'
import OrderItem from '~/views/Order/List/OrderItem'
import PageLoading from '~/components/PageLoading'
import ListRow from 'teaset/components/ListRow/ListRow'
import Icon from 'react-native-vector-icons/AntDesign'
import { toMoney } from '~/utils/tools'
import { orderType, refundType } from '~/utils/orderType'

const OrderDetails = ({ route }) => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    refundStatus: 0,
    orderStatus: 0,
    orderItemsVoList: [],
    consignee: '',
    mobile: '',
    province: '',
    city: '',
    district: '',
    address: '',
    productAmount: 0,
    shippingFee: 0,
    taxTotal: 0,
    couponMoney: 0,
    couponName: undefined,
    tradeModel: 0,
    pointsMoney: 0,
    consumptionMoney: 0,
    balancePaid: 0,
    thisPoints: 0,
    payName: 0,
    payAmount: 0,
    orderSn: '',
    tradeNo: '',
    createTime: '',
    payTime: '',
    transTime: '',
    orderRemark: ''
  })

  const initData = () => {
    getOrderItemDetails(route.params.id).then(res => {
      const { rel, data } = res
      if (rel) {
        setData(data)
        setLoading(false)
      }
    })
  }

  const _type = data.refundStatus > 0 ? data.refundStatus : data.orderStatus
  const _typeData = data.refundStatus > 0 ? refundType : orderType
  useEffect(() => {
    initData()
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {!loading ? (
          <View>
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <Text style={{ color: '#fff', fontSize: 18 }}>{_typeData[_type]?.title}</Text>
                <Text style={{ fontSize: 14, color: '#fff', marginTop: 10 }}>{_typeData[_type]?.message}</Text>
              </View>
              <Image source={require('~/assets/shop-icon.png')} style={{ width: 40, height: 40 }} />
            </View>
            <View style={styles.address}>
              <Icon name='enviromento' size={24} color={'#555'} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.addressTitle}>{data.consignee} {data.mobile}</Text>
                <Text style={styles.addressDesc}>{data.province} {data.city} {data.district} {data.address}</Text>
              </View>
            </View>
          </View>
        ) : null}
        {!loading ? <OrderItem sourceData={data} /> : null}
        {!loading ? (
          <View>
            <Text style={styles.title}>结算明细</Text>
            <ListRow title='商品总价' detail={`￥${toMoney(data.productAmount)}`} />
            <ListRow title='运费' detail={`￥${toMoney(data.shippingFee)}`} />
            {data.tradeModel === 1 || data.tradeModel === 2 ? (
              <ListRow title='税金' detail={`￥${toMoney(data.taxTotal)}`} />
            ) : null}
            {data.couponMoney ? (
              <ListRow title='优惠劵' detail={`￥-${toMoney(data.couponMoney)}`} />
            ) : null}
            {data.pointsMoney ? (
              <ListRow title='积分' detail={`已使用${data.thisPoints}积分, 抵扣￥-${toMoney(data.couponMoney)}`} />
            ) : null}
            {data.consumptionMoney ? (
              <ListRow title='余额红包' detail={`￥-${toMoney(data.consumptionMoney)}`} />
            ) : null}
            {data.balancePaid ? (
              <ListRow title='现金余额' detail={`￥-${toMoney(data.balancePaid)}`} />
            ) : null}
            <ListRow title='实付金额' detail={`￥${toMoney(data.payAmount)}`} />
            <ListRow title='支付方式' detail={`${data.payName}`} />
            <Text style={styles.title}>订单明细</Text>
            <ListRow title='订单编号' detail={data.orderSn} />
            <ListRow title='支付交易号' detail={data.tradeNo} />
            <ListRow title='创建时间' detail={data.createTime} />
            <ListRow title='付款时间' detail={data.payTime} />
            <ListRow title='发货时间' detail={data.transTime} />
            <ListRow title='其它信息' detail={`${data.orderRemark || '无备注'}`} />
          </View>
        ) : null}
        {loading ? <PageLoading /> : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#ff6600',
    padding: 20,
    flexDirection: 'row'
  },
  headerInfo: {
    flex: 1,
    marginRight: 10
  },
  address: {
    marginTop: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  addressTitle: {
    fontSize: 16,
    color: '#333'
  },
  addressDesc: {
    marginTop: 6,
    color: '#999',
    fontSize: 12
  },
  title: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingBottom: 8,
    paddingTop: 14,
    color: '#777'
  }
})

export default OrderDetails
