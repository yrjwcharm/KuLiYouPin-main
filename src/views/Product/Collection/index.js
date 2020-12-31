import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { collectionProduct, getSaveProductList } from '~/service/product'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import FooterLoading from '~/components/FooterLoading'
import { toMoney } from '~/utils/tools'
import Checkbox from 'teaset/components/Checkbox/Checkbox'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme } from '@react-navigation/native'

const ShopCollection = ({ route }) => {
  const { colors } = useTheme()
  const [manager, setManager] = useState(false)
  const [checkedAll, setCheckedAll] = useState(false)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    getSaveProductList({ start: page, length: 20 }).then(res => {
      const { rel, data: { rows } } = res
      if (rel) {
        setPage(page + 1)
        setLoading(false)
        setList([...list, ...rows])
        setFinished(rows.length < 20)
      }
    })
  }

  const handleCheckItem = (index) => {
    const _list = _.cloneDeep(list)
    _list[index].checked = !_list[index].checked
    setList(_list)
  }

  const handleToggleAll = () => {
    const _data = list.map(item => ({ ...item, checked: !checkedAll }))
    setList(_data)
    setCheckedAll(!checkedAll)
  }

  const handleDeleteProduct = () => {
    Alert.alert(
      '提示',
      '确定要把选中的商品从收藏中移除吗？',
      [
        { text: '取消' },
        {
          text: '确认',
          onPress: () => {
            list.forEach(async item => {
              if (item.checked) {
                await collectionProduct({ productId: item.productId, status: 0 })
              }
            })
            setList([])
            loadDataHandle()
          }
        }
      ]
    )
  }

  useMemo(() => {
    setManager(route.params?._manager)
  }, [route.params])

  useEffect(() => {
    loadDataHandle()
  }, [])
  return (
    <SafeAreaView style={[styles.page, { backgroundColor: '#fff' }]}>
      <ScrollView style={[styles.page, { backgroundColor: '#f5f5f9' }]}>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              {manager ? (
                <Checkbox
                  checked={item.checked}
                  onChange={() => handleCheckItem(key)}
                  checkedIcon={<Icon name='check-circle' size={20} color={colors.brand} />}
                  uncheckedIcon={<Icon name='circle' size={20} color={colors.brand} />}
                />
              ) : null}
              <TouchableOpacity style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.info}>
                  <Image style={styles.image} source={{ uri: item.imageUrl1 }} />
                  <View style={styles.infoContent}>
                    <Text numberOfLines={2} style={{ fontSize: 16, color: colors.text }}>{item.productName}</Text>
                    <Text style={[styles.price, { color: colors.brand }]}>￥{toMoney(item.minPrice || 0)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无收藏商品' image={require('~/assets/empty/List.png')} />
        ) : null}
        {list.length === 0 && loading ? <PageLoading /> : null}
        {list.length > 0 ? (
          <FooterLoading loading={loading} finished={finished} loadingHandle={loadDataHandle} />
        ) : null}
      </ScrollView>
      {manager ? (
        <View style={styles.footer}>
          <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={handleToggleAll}>
            <View style={styles.footerChecked}>
              <Checkbox
                checked={checkedAll}
                checkedIcon={<Icon name='check-circle' size={20} color={colors.brand} />}
                uncheckedIcon={<Icon name='circle' size={20} color={colors.brand} />}
              />
              <Text style={{ marginLeft: 5, color: '#333' }}>全选</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteProduct}>
            <Text style={styles.footerBtn}>删除</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  image: {
    width: 120,
    height: 120
  },
  info: {
    flexDirection: 'row',
    flex: 1
  },
  infoContent: {
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 10
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  footer: {
    backgroundColor: '#fff',
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerChecked: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  footerBtn: {
    height: 40,
    backgroundColor: 'red',
    color: '#fff',
    paddingHorizontal: 10,
    lineHeight: 40
  }
})

export default ShopCollection
