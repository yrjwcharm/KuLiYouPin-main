import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { getProductLogistics } from '~/views/Order/orderUtils'
import Drawer from 'teaset/components/Drawer/Drawer'

const BudgetOrderDetailItem = (props) => {
  const { list, orderSn } = props
  const [visible, setVisible] = useState(false)

  const openLogisticsModel = (_expressNo, _expressName, LogisticsInfo) => {
    const logisticsDrawer = Drawer.open(
      <View style={{ height: 600, backgroundColor: '#fff' }}>
        <View style={{ width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
          <Text>物流信息</Text>
          <TouchableOpacity onPress={() => logisticsDrawer.close()}>
            <Icon name='x' size={20} color='#777' />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.content}>
          <ScrollView style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', lineHeight: 40, color: '#666', fontSize: 12 }}>{_expressName}:{_expressNo}</Text>
            <View style={styles.itemContent}>
              {LogisticsInfo.map((item, key) => {
                return (
                  <View key={key} style={styles.item}>
                    <View style={[styles.circle, { backgroundColor: key === 0 ? 'green' : '#f5f5f9' }]} />
                    <Text style={{ fontSize: 14, lineHeight: 18, color: key === 0 ? 'green' : '#333' }}>{item.context}</Text>
                    <Text style={{ fontSize: 14, lineHeight: 18, color: key === 0 ? 'green' : '#333' }}>{item.ftime}</Text>
                  </View>
                )
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>, 'bottom')
  }
  const handleShowLogistics = async (_expressNo, _expressName) => {
    const LogisticsInfo = await getProductLogistics(orderSn, _expressNo)
    openLogisticsModel(_expressNo, _expressName, LogisticsInfo)
  }

  return (
    <View>
      {list.map((item, key) => {
        if (key === 0 || visible) {
          return (
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', height: 22 }}>
              {list.length > 1 ? (
                <View style={{ width: 20 }}>
                  {key === 0 ? (
                    <TouchableOpacity onPress={() => setVisible(!visible)}>
                      <Icon name={!visible ? 'chevron-right' : 'chevron-down'} size={14} color='#666' />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
              <Text style={{ flex: 1, fontSize: 12, color: '#555' }} numberOfLines={1}>{item.productName} x{item.quantity}</Text>
              {item.expressNo ? (
                <TouchableOpacity onPress={() => handleShowLogistics(item.expressNo, item.expressName)}>
                  <Image style={{ width: 20, height: 20 }} source={require('~/assets/common/logistics-icon.png')} />
                </TouchableOpacity>
              ) : null}
            </View>
          )
        }
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  itemContent: {
    paddingHorizontal: 12
  },
  item: {
    borderLeftWidth: 1,
    borderLeftColor: '#f5f5f9',
    paddingLeft: 15,
    paddingBottom: 20,
    position: 'relative'
  },
  circle: {
    width: 6,
    height: 6,
    position: 'absolute',
    borderRadius: 3,
    overflow: 'hidden',
    left: -3,
    top: 0
  }
})

export default BudgetOrderDetailItem
