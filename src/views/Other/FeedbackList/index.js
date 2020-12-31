import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, SafeAreaView, Text, Image } from 'react-native'
import { getFeedbackList } from '~/service/mine'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import FooterLoading from '~/components/FooterLoading'

const FeedbackList = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    getFeedbackList({ start: page, length: 20 }).then(res => {
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
              <View style={styles.header}>
                <Text style={{ color: '#333' }}>反馈类型：{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{item.createTime}</Text>
              </View>
              <Text style={styles.content}>{item.content}</Text>
              <View style={styles.images}>
                {item.imgUrl1 ? (
                  <Image style={styles.image} source={{ uri: item.imgUrl1 }} />
                ) : null}
                {item.imgUrl2 ? (
                  <Image style={styles.image} source={{ uri: item.imgUrl2 }} />
                ) : null}
                {item.imgUrl3 ? (
                  <Image style={styles.image} source={{ uri: item.imgUrl3 }} />
                ) : null}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#333' }}>处理状态：</Text>
                {item.state === 0 ? <Text style={styles.defaultStatus}>未处理</Text> : null}
                {item.state === 1 ? <Text style={styles.success}>已处理</Text> : null}
              </View>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无反馈' image={require('~/assets/empty/List.png')} />
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
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40
  },
  content: {
    paddingVertical: 10,
    color: '#333'
  },
  images: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  image: {
    width: 80,
    height: 80
  },
  defaultStatus: {
    backgroundColor: '#f5f5f9',
    color: '#666',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden'
  },
  success: {
    backgroundColor: '#EF4034',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden'
  }
})

export default FeedbackList
