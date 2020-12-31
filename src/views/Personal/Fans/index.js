import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native'
import { getFansList } from '~/service/mine'
import FooterLoading from '~/components/FooterLoading'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'

const Fans = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    getFansList({ start: page, length: 20 }).then(res => {
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
              <Image style={styles.itemImage} source={{ uri: item.headimgurl }} />
              <Text style={styles.itemName}>{item.nickname}</Text>
              <Text style={styles.itemDesc}>{item.roleName}</Text>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无粉丝' image={require('~/assets/empty/Comment.png')} />
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
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden'
  },
  itemName: {
    fontSize: 14,
    marginLeft: 14,
    color: '#333'
  },
  itemDesc: {
    fontSize: 12,
    marginLeft: 6,
    color: '#ccc'
  }
})

export default Fans
