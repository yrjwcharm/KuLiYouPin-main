import React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Badge from 'teaset/components/Badge/Badge'

const OrderStruct = (props) => {
  const { navigate } = useNavigation()
  const { colors } = useTheme()
  const { user: { status1, status2, status3, status4, status5 } } = props
  const [_status1, _status2, _status3, _status4, _status5] = [
    +status1,
    +status2,
    +status3,
    +status4,
    +status5]
  return (
    <View style={styles.orderStruct}>
      <View style={[styles.orderStructContent, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16, color: colors.text }}>我的订单</Text>
          <TouchableOpacity onPress={() => navigate('orderList')}>
            <Text style={{ fontSize: 12, color: colors.desc }}>
              查看全部
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.orderList}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigate('orderList', { type: 1 })}>
            <View style={styles.orderItem}>
              <Image style={styles.orderItemImage} source={require('~/assets/mine/dfk.png')} />
              <Text style={{ fontSize: 12, color: colors.text }}>
                待付款
              </Text>
              {_status1 ? (<Badge style={styles.badge} count={status1} />) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigate('orderList', { type: 2 })}>
            <View style={styles.orderItem}>
              <Image style={styles.orderItemImage} source={require('~/assets/mine/dfh.png')} />
              <Text style={{ fontSize: 12, color: colors.text }}>
                待发货
              </Text>
              {_status2 ? (<Badge style={styles.badge} count={status2} />) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigate('orderList', { type: 3 })}>
            <View style={styles.orderItem}>
              <Image style={styles.orderItemImage} source={require('~/assets/mine/dsh.png')} />
              <Text style={{ fontSize: 12, color: colors.text }}>
                待收货
              </Text>
              {_status3 ? (<Badge style={styles.badge} count={status3} />) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigate('orderList', { type: 4 })}>
            <View style={styles.orderItem}>
              <Image style={styles.orderItemImage} source={require('~/assets/mine/dpj.png')} />
              <Text style={{ fontSize: 12, color: colors.text }}>
                已完成
              </Text>
              {_status4 ? (<Badge style={styles.badge} count={status4} />) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => navigate('orderList', { type: 5 })}>
            <View style={styles.orderItem}>
              <Image style={styles.orderItemImage} source={require('~/assets/mine/tksh.png')} />
              <Text style={{ fontSize: 12, color: colors.text }}>
                退款/售后
              </Text>
              {_status5 ? (<Badge style={styles.badge} count={status5} />) : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  orderStruct: {
    marginTop: -30,
    paddingLeft: 10,
    paddingRight: 10
  },
  orderStructContent: {
    borderRadius: 10
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  orderList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10
  },
  orderItem: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    right: 8,
    top: -6
  },
  orderItemImage: {
    width: 24,
    height: 24,
    marginBottom: 8
  }
})

export default OrderStruct
