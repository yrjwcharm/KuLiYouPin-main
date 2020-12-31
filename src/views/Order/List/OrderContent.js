import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native'
import { getOrderList } from '~/service/order'
import FooterLoading from '~/components/FooterLoading'
import OrderItem from '~/views/Order/List/OrderItem'
import PageLoading from '~/components/PageLoading'
import Empty from '~/components/Empty'

const OrderContent = (props) => {
  const [id, _] = useState(props.typeId)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = (_loading, _finished) => {
    if (_loading || _finished) return false
    setLoading(true)
    getOrderList({ start: page, length: 20, orderStatus: id }).then(res => {
      const { rel, data: { rows } } = res
      if (rel) {
        setPage(page + 1)
        setLoading(false)
        setList([...list, ...rows])
        setFinished(rows.length < 20)
      }
    })
  }
  /**
   * 刷新
   */
  const initData = () => {
    setLoading(false)
    setFinished(false)
    setPage(1)
    setList([])
    loadDataHandle(false, false)
  }
  useEffect(() => {
    loadDataHandle(false, false)
  }, [])
  return (
    <SafeAreaView style={styles.content}>
      <ScrollView>
        {list.map((item, key) => {
          return <OrderItem sourceData={item} key={key} onChange={initData} />
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无订单' image={require('~/assets/empty/List.png')} />
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
  content: {
    flex: 1,
    backgroundColor: '#f5f5f9'
  }
})

export default OrderContent
