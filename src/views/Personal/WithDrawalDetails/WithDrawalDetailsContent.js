import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native'
import FooterLoading from '~/components/FooterLoading'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import { queryCashDetails } from '~/service/withDrawal'

const statusType = {
  0: '待处理',
  1: '处理中',
  2: '处理成功',
  3: '处理失败',
  4: '后台驳回',
  5: '已取消'
}

const WithDrawalDetailsContent = (props) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    const _value = props.status ? { status: props.status } : {}
    queryCashDetails({ start: page, length: 20, ..._value }).then(res => {
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
      <ScrollView>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <View>
                <Text>{statusType[item.status] || '未知'}</Text>
                <Text>{item.amount}</Text>
              </View>
              <View>
                <Text>{item.createTime}</Text>
                <Text>{item.bankName + `(${item.accountCardNo && item.accountCardNo.slice(-4)})`}</Text>
              </View>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无明细' image={require('~/assets/empty/List.png')} />
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
  item: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center'
  }
})

export default WithDrawalDetailsContent
