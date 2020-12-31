import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import { selectByUserGiftCarStatus } from '~/service/activity'
import { useDispatch } from 'react-redux'
import { createGiftOrderAction } from '~/redux/actions/orderAction'
import { useNavigation } from '@react-navigation/native'

const GiftCenterContent = (props) => {
  const { type } = props
  const dispatch = useDispatch()
  const { navigate } = useNavigation()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const handleReceiveGift = (giftId) => {
    setLoading(true)
    dispatch(createGiftOrderAction({ giftId }, () => {
      setLoading(false)
      navigate('giftConfirmedOrder')
    }))
  }

  const loadDataHandle = () => {
    if (loading) return false
    setLoading(true)
    selectByUserGiftCarStatus({ catStatus: type }).then(res => {
      const { rel, data } = res
      if (rel) {
        setPage(page + 1)
        setLoading(false)
        setList([...list, ...data])
      }
    })
  }
  useEffect(() => {
    loadDataHandle()
  }, [props.type])
  return (
    <View style={styles.page}>
      <ScrollView style={{ flex: 1 }}>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <TouchableOpacity onPress={() => navigate('details', { id: item.productId, skuId: item.skuId })}>
                <Image source={{ uri: item.imageUrl1 }} style={styles.itemImage} />
              </TouchableOpacity>
              <View style={styles.itemContent}>
                <TouchableOpacity onPress={() => navigate('details', { id: item.productId, skuId: item.skuId })}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={styles.name} numberOfLines={2}>{item.productName}</Text>
                    <Text style={styles.label}>{item.specName}</Text>
                  </View>
                </TouchableOpacity>
                {type === 3 ? (
                  <Text style={styles.label}>开始时间：{item.timeStart}</Text>
                ) : (
                  <Text style={styles.label}>过期时间：{item.timeEnd}</Text>
                )}
                <View style={styles.footer}>
                  <Text style={{ flex: 1, fontSize: 12, color: '#666' }}>{item.giftDisplay}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {(item.consumptionMoney && item.consumptionMoney > 0) ? (
                      <Text style={{ fontSize: 12, color: '#e93b3d' }}>返{item.consumptionMoney}元</Text>
                    ) : null}
                    {type === 0 ? (
                      <TouchableOpacity disabled={loading} onPress={() => handleReceiveGift(item.giftId)}>
                        <Text style={styles.btn}>{loading ? '领取中...' : '立即领取'}</Text>
                      </TouchableOpacity>
                    ) : null}
                    {type === 1 ? (
                      <Text style={styles.btnOver}>已领取</Text>
                    ) : null}
                    {type === 2 ? (
                      <Text style={styles.btnOver}>已过期</Text>
                    ) : null}
                    {type === 3 ? (
                      <Text style={styles.btnOver}>未开始</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无礼品' image={require('~/assets/empty/List.png')} />
        ) : null}
        {list.length === 0 && loading ? <PageLoading /> : null}
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  item: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 5
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  name: {
    fontSize: 14,
    color: '#333',
    lineHeight: 14
  },
  label: {
    fontSize: 12,
    marginTop: 10,
    backgroundColor: '#f2f2f2',
    color: '#666',
    paddingVertical: 2,
    paddingHorizontal: 4
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btn: {
    backgroundColor: '#e93b3d',
    color: '#fff',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 5,
    borderRadius: 5,
    overflow: 'hidden'
  },
  btnOver: {
    backgroundColor: '#f2f2f2',
    color: '#666',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 5,
    borderRadius: 5,
    overflow: 'hidden'
  }
})
export default GiftCenterContent
