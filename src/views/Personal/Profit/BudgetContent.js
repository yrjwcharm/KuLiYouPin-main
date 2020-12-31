import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native'
import { getBudgetDetailList, getFansList } from '~/service/mine'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import { useTheme } from '@react-navigation/native'

const BudgetContent = (props) => {
  const { colors } = useTheme()
  const [total, setTotal] = useState({
    sumBonusMoney: 0,
    sumOrderAmount: 0,
    sumShopGetPrice: 0
  })
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const loadDataHandle = () => {
    if (loading) return false
    setLoading(true)
    getBudgetDetailList({ type: props.budgetType }).then(res => {
      const { rel, data: { rows } } = res
      if (rel) {
        setLoading(false)
        setTotal(rows[0] || {
          sumBonusMoney: 0,
          sumOrderAmount: 0,
          sumShopGetPrice: 0
        })
        setList(rows[1] || [])
      }
    })
  }
  useEffect(() => {
    loadDataHandle()
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.item}>
          <View style={styles.col} />
          <Text style={styles.col}>订单金额</Text>
          <Text style={styles.col}>收益总计</Text>
          <Text style={styles.col}>奖励合计</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.col}>合计</Text>
          <Text style={[styles.col, { color: colors.brand, fontWeight: 'bold', fontSize: 14 }]}>￥{total.sumOrderAmount || 0}</Text>
          <Text style={[styles.col, { color: colors.brand, fontWeight: 'bold', fontSize: 14 }]}>￥{total.sumShopGetPrice || 0}</Text>
          <Text style={[styles.col, { color: colors.brand, fontWeight: 'bold', fontSize: 14 }]}>￥{total.sumBonusMoney || 0}</Text>
        </View>
        {list.map((item, key) => {
          return (
            <View style={styles.item} key={key}>
              <Text style={styles.col}>{item.payTime}</Text>
              <Text style={styles.col}>￥{item.orderAmount || 0}</Text>
              <Text style={styles.col}>￥{total.shopGetPrice || 0}</Text>
              <Text style={styles.col}>￥{total.bonusMoney || 0}</Text>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无收益' image={require('~/assets/empty/List.png')} />
        ) : null}
        {list.length === 0 && loading ? <PageLoading /> : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  col: {
    width: '25%',
    height: 40,
    lineHeight: 40,
    fontSize: 12,
    color: '#333'
  }
})

export default BudgetContent
