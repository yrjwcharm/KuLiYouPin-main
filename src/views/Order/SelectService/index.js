/**
 * 选择售后服务
 */
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { getFundOrderInfo } from '~/service/order'
import { toMoney } from '~/utils/tools'

const OrderSelectService = (props) => {
  const { route: { params: { id } } } = props
  const { colors } = useTheme()
  const [data, setData] = useState({
    products: []
  })

  const initData = () => {
    getFundOrderInfo(id).then(res => {
      const { rel, data } = res
      if (rel) {
        setData(data)
      }
    })
  }
  useEffect(() => {
    initData()
  }, [])
  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {data.products.map((item, key) => {
            return (
              <View key={key} style={{ flexDirection: 'row', paddingVertical: 6 }}>
                <Image source={{ uri: item.productsImageUrl || item.imageUrl }} style={{ width: 120, height: 120 }} />
                <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: 5, flex: 1, paddingBottom: 5, paddingTop: 4 }}>
                  <Text numberOfLines={2} style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.productDesc}>{item.specName}</Text>
                  <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.brand }}>￥{toMoney(item.salePrice)}</Text>
                    <Text style={{ color: colors.text }}>x{item.number}</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <View style={styles.details}>
          <TouchableOpacity>
            <View>
              <Text>我要退款（无需退货）</Text>
              <Text>没收到货，或与卖家协商同意不用退货退款</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text>我要退货退款</Text>
              <Text>已收到货，需要退还收到的货物</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default OrderSelectService
