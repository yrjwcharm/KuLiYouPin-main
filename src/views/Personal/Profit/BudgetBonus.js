import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native'
import { getBudgetDetailList } from '~/service/mine'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import FooterLoading from '~/components/FooterLoading'
import Icon from 'react-native-vector-icons/Feather'
import BudgetOrderDetailItem from './BudgetOrderDetailItem'

const BudgetBonus = (props) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    getBudgetDetailList({ start: page, length: 20, type: props.budgetType }).then(res => {
      const { rel, data: { rows } } = res
      if (rel) {
        setPage(page + 1)
        setLoading(false)
        setList([...list, ...rows])
        setFinished(rows.length < 20)
      }
    })
  }
  useEffect(() => {
    loadDataHandle()
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', height: 24, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginRight: 5, fontSize: 14, color: '#333' }}>{item.createTime}</Text>
                  {item.bonusStatus ? (
                    <Icon name='check-circle' size={16} color='green' />
                  ) : null}
                </View>
                <Text style={{ color: '#555', fontSize: 12 }}>
                  {item.bonusType === 1 ? '现金奖励' : ''}{item.bonusType === 2 ? '权益奖励' : ''}_{item.countLevel}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', height: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginRight: 5, fontSize: 14, color: '#333' }}>{item.nickname}</Text>
                </View>
                <Text style={{ color: '#656' }}>
                  ￥{item.orderAmount}(&nbsp;
                  <Text style={{ color: 'red' }}>
                    +{(item.bonusMoney || 0).toFixed(2)}
                  </Text>
                  &nbsp;)
                </Text>
              </View>
              <View style={styles.content}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <BudgetOrderDetailItem
                    orderSn={item.orderSn}
                    list={item.items || []} />
                </View>
              </View>
              <View>
                <Text style={styles.infoText}>订单编号：{item.orderSn}</Text>
                <Text style={styles.infoText}>收件人：{item.consignee} {item.mobile}</Text>
                <Text style={styles.infoText}>地址：{item.address}</Text>
              </View>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无订单明细' image={require('~/assets/empty/List.png')} />
        ) : null}
        {list.length === 0 && loading ? <PageLoading /> : null}
        {list.length > 0 ? (
          <FooterLoading loading={loading} finished={finished} loadingHandle={loadDataHandle} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f9',
    paddingVertical: 12
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoText: {
    fontSize: 10,
    color: '#888',
    lineHeight: 18
  }
})

export default BudgetBonus
