import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from 'react-native'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import FooterLoading from '~/components/FooterLoading'
import { mineCouponList } from '~/service/coupon'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'

const MyCouponItem = (props) => {
  const { navigate } = useNavigation()
  const [showDesc, setShowDesc] = useState(false)
  const { active, sourceData: { couponType, couponMoney, useType, couponName, couponRemark, useMinSpending, couponEffectiveStart, couponEffectiveEnd } } = props
  const receiveCouponHandle = () => {
    navigate('searchList', { categoryId: undefined, value: undefined })
  }
  return (
    <View style={styles.container}>
      <View style={[styles.content, { borderTopColor: active === 0 ? '#e4393c' : '#ddd' }]}>
        <View style={styles.title}>
          <Text style={{ color: active === 0 ? '#e4393c' : '#666', fontSize: 18 }}>{couponType === 1 ? `￥${couponMoney}` : `${couponMoney / 10}折`}</Text>
          <Text style={{ color: active === 0 ? '#e4393c' : '#666', fontSize: 12, marginTop: 10 }}>满{useMinSpending}元可用</Text>
        </View>
        <View style={styles.info}>
          {active === 1 ? (
            <Image style={styles.image} source={require('~/assets/images/coupon-use.png')} />
          ) : null}
          {active === 2 ? (
            <Image style={styles.image} source={require('~/assets/images/coupon-expired.png')} />
          ) : null}
          <Text>
            <Text style={{ backgroundColor: active === 0 ? '#e4393c' : '#f5f5f9', color: active === 0 ? '#fff' : '#333', fontSize: 14 }}>
              &nbsp;{useType === 1 ? '通用券' : useType === 2 ? '新手券' : useType === 3 ? '转发券' : useType === 4 ? '关注券' : useType === 5 ? '短信券' : '活动券'}&nbsp;
            </Text>
            &nbsp;&nbsp;
            <Text style={{ color: '#333', fontSize: 14 }}>{couponName}</Text>
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#777' }}>{couponEffectiveStart.slice(0, 11) + '~' + couponEffectiveEnd.slice(0, 11)}</Text>
            {active === 0 ? (
              <TouchableOpacity onPress={receiveCouponHandle}>
                <Text style={[styles.btn, { color: '#fff', backgroundColor: '#e4393c', borderColor: '#e4393c' }]}>
                  立即使用
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={{ width: '100%', marginTop: 8, borderTopColor: '#ccc', borderTopWidth: 1 }}>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => setShowDesc(!showDesc)}>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', height: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#777' }}>详细信息</Text>
                <Icon name='chevron-down' />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {showDesc ? (
        <View style={{ backgroundColor: '#f5f5f9', height: 30, justifyContent: 'center', paddingLeft: 10 }}>
          <Text style={{ color: '#777', fontSize: 12 }}>详细信息：{couponRemark}</Text>
        </View>
      ) : null}
    </View>
  )
}

const MyCouponContent = (props) => {
  const { index } = props
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)
  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    mineCouponList({ start: page, length: 20, couponStatus: index }).then(res => {
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
    <View style={styles.page}>
      <ScrollView>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <MyCouponItem active={index} sourceData={item} />
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无优惠劵' image={require('~/assets/empty/List.png')} />
        ) : null}
        {list.length === 0 && loading ? <PageLoading /> : null}
        {list.length > 0 ? (
          <FooterLoading loading={loading} finished={finished} loadingHandle={loadDataHandle} />
        ) : null}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  container: {
    paddingHorizontal: 10,
    marginTop: 10
  },
  content: {
    borderTopWidth: 4,
    borderTopColor: '#e4393c',
    backgroundColor: '#f5f5f9',
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: 'row'
  },
  title: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
    position: 'relative'
  },
  image: {
    width: 60,
    height: 60,
    position: 'absolute',
    right: -10,
    top: -10,
    zIndex: 99
  },
  btn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#ccc'
  }
})

export default MyCouponContent
