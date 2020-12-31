import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import FooterLoading from '~/components/FooterLoading'
import { queryBalanceDetails } from '~/service/mine'
import { useSelector } from 'react-redux'
import Toast from 'teaset/components/Toast/Toast'
import { useNavigation } from '@react-navigation/native'

const BalanceContent = ({ balanceType }) => {
  const user = useSelector(state => state.user)
  const { navigate } = useNavigation()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const { balanceMoney, consumeBalance } = user

  const url = balanceType === 1
    ? '/usersBalanceDetails/selectBalanceDetails'
    : '/usersBalanceDetails/selectExpenseBalanceDetails'

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    queryBalanceDetails(url, { start: page, length: 20 }).then(res => {
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
    <SafeAreaView style={{ flex: 1 }}>
      {balanceType === 1 ? (
        <View style={styles.headerTitle}>
          <Text style={{ fontSize: 14, color: '#333' }}>当前可提现余额：{balanceMoney || 0}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => Toast.fail('功能暂未开放')}>
              <Text style={[styles.btn, { backgroundColor: '#1989fa' }]}>充值</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigate('withDrawal')}>
              <Text style={[styles.btn, { backgroundColor: '#ee0a24' }]}>提现</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.headerTitle}>
          <Text style={{ fontSize: 14, color: '#333' }}>当前余额红包：{consumeBalance || 0}</Text>
          <Text style={{ fontSize: 12, color: '#888' }}>(红包不可提现，可抵扣部分订单金额)</Text>
        </View>
      )}
      <ScrollView>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={{ fontSize: 14, color: '#333' }}>{item.tradeDisplay}</Text>
                <Text style={{ fontSize: 12, marginTop: 10, color: '#777' }}>{item.tradeDate}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={{ fontSize: 14, color: item.income ? 'green' : 'red' }}>
                  {item.income ? '+' : '-'}{item.income || item.disburse}
                </Text>
                <Text style={{ fontSize: 12, marginTop: 10, color: '#777' }}>
                  余：{balanceType === 1 ? item.balanceMoney || 0 : item.consumptionMoney || 0}
                </Text>
              </View>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc={balanceType === 1 ? '暂无现金红包记录' : '暂无余额红包记录'} image={require('~/assets/empty/List.png')} />
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
  headerTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10
  },
  btn: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: '#fff',
    borderRadius: 2,
    overflow: 'hidden'
  },
  item: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f9'
  },
  itemLeft: {
    alignItems: 'flex-start'
  },
  itemRight: {
    alignItems: 'flex-end'
  }
})
export default BalanceContent
