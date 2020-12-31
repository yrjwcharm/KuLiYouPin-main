import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import FooterLoading from '~/components/FooterLoading'
import { getIntegralList } from '~/service/mine'

const IntegralContent = ({ integralType }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    getIntegralList({ start: page, length: 20, type: integralType }).then(res => {
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
      {integralType === 1 ? (
        <Text style={styles.title}>当前消费积分余额：{list[0]?.integral || 0}</Text>
      ) : (
        <Text style={styles.title}>当前等级积分余额：{list[0]?.integral || 0}</Text>
      )
      }
      <ScrollView>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={{ fontSize: 14, color: '#333' }}>{item.content}</Text>
                <Text style={{ fontSize: 12, marginTop: 10, color: '#777' }}>{item.createTime}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={{ fontSize: 14, color: item.pointsAddType ? 'green' : 'red' }}> {item.pointsAddType ? '+' : '-'}{item.thisPoints}</Text>
                <Text style={{ fontSize: 12, marginTop: 10, color: '#777' }}>余：{item.payPoints}</Text>
              </View>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc={integralType === 1 ? '暂无消费积分' : '暂无等级积分'} image={require('~/assets/empty/List.png')} />
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
  title: {
    width: '100%',
    height: 40,
    lineHeight: 40,
    color: '#333',
    paddingLeft: 10
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
export default IntegralContent
