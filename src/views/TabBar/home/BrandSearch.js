import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { getBrandHotList } from '~/service/home'
import FooterLoading from '~/components/FooterLoading'

const BrandSearch = ({ colors, itemHandle }) => {
  const [value, setValue] = useState(undefined)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    getBrandHotList({ start: page, length: 20, brandName: value }).then(res => {
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
    <View style={styles.container}>
      <Text style={styles.title}>品牌搜索</Text>
      <View style={styles.search}>
        <View style={[styles.searchInput, { backgroundColor: colors.background }]}>
          <Icon name='search' size={14} color={'#999'} />
          <TextInput value={value} onChangeText={text => setValue(text)} style={styles.input} placeholder='请输入品牌名称' />
        </View>
        <TouchableOpacity activeOpacity={0.9}>
          <Text style={[styles.btn, { backgroundColor: colors.brand, color: colors.brandText }]}>搜索</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView>
          {list.map((item, key) => {
            return (
              <TouchableOpacity key={key} onPress={() => itemHandle(item)}>
                <View style={styles.item}>
                  <Image style={styles.itemImage} source={{ uri: item.logoUrl }} />
                  <View style={styles.itemInfo}>
                    <Text style={{ fontSize: 14, color: colors.text }}>{item.brandName}</Text>
                    <Text style={{ fontSize: 12, marginTop: 6, color: colors.auxiliary }}>共<Text style={{ color: colors.brand }}>{item.count}</Text>款热销商品</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
          <FooterLoading loading={loading} finished={finished} loadingHandle={loadDataHandle} />
        </ScrollView>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 16,
    width: '100%',
    height: 44,
    textAlign: 'center',
    lineHeight: 44
  },
  search: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  searchInput: {
    borderRadius: 30,
    flexDirection: 'row',
    flex: 1,
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  input: {
    marginLeft: 10,
    fontSize: 12
  },
  btn: {
    height: 30,
    paddingLeft: 14,
    paddingRight: 14,
    lineHeight: 30,
    fontSize: 14,
    borderRadius: 3,
    overflow: 'hidden'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6
  },
  itemImage: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#f5f5f9',
    borderRadius: 5,
    overflow: 'hidden'
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  }
})

export default BrandSearch
