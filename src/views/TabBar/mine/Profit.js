import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native'
import { getBudgetInfoApi } from '~/service/user'

const Profit = () => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [data, setData] = useState({
    orderAmount: 0,
    shopGetPrice: 0,
    sumOrderAmount: 0,
    numUsersTeamSame: 0,
    numUsersTeamAll: 0,
    performanceSelf: 0,
    performanceTeam: 0
  })
  /**
   * 获取店铺收益
   */
  const getBudgetInfo = (flag) => {
    getBudgetInfoApi().then(res => {
      if (res.rel && flag) {
        setData({
          orderAmount: Number(res.data.orderAmount || 0).toFixed(2),
          sumOrderAmount: Number(res.data.sumOrderAmount || 0).toFixed(2),
          shopGetPrice: Number(res.data.shopGetPrice || 0).toFixed(2),
          numUsersTeamSame: Number(res.data.numUsersTeamSame || 0),
          numUsersTeamAll: Number(res.data.numUsersTeamAll || 0),
          performanceSelf: Number(res.data.performanceSelf || 0).toFixed(2),
          performanceTeam: Number(res.data.performanceTeam || 0).toFixed(2)
        })
      }
    })
  }
  useEffect(() => {
    let flag = true
    getBudgetInfo(flag)
    return () => {
      flag = false
    }
  }, [])
  return (
    <TouchableOpacity onPress={() => navigate('profit')}>
      <View style={styles.content}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <View style={styles.item}>
            <Text style={styles.text}>今日订单:<Text style={{ color: colors.brand }}>￥{data.orderAmount}</Text></Text>
            <Text style={styles.text}>今日收益:<Text style={{ color: colors.brand }}>￥{data.shopGetPrice}</Text></Text>
            <Text style={styles.text}>累计收益:<Text style={{ color: colors.brand }}>￥{data.sumOrderAmount}</Text></Text>
          </View>
          <View style={[styles.item, { marginTop: 10 }]}>
            <Text style={styles.text}>队友:<Text style={{ color: colors.brand }}>{data.numUsersTeamSame}人</Text>总:<Text style={{ color: colors.brand }}>{data.numUsersTeamAll}人</Text></Text>
            <Text style={styles.text}>个人业绩:<Text style={{ color: colors.brand }}>￥{data.sumOrderAmount}</Text></Text>
            <Text style={styles.text}>团队业绩:<Text style={{ color: colors.brand }}>￥{data.performanceTeam}</Text></Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  container: {
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 12
  }
})

export default Profit
