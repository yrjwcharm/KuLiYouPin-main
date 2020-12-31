import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, Text, ScrollView, TouchableOpacity } from 'react-native'
import Empty from '~/components/Empty'
import PageLoading from '~/components/PageLoading'
import FooterLoading from '~/components/FooterLoading'
import { couponCenterList, receiveCoupon } from '~/service/coupon'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Toast from 'teaset/components/Toast/Toast'

const LinCouponContent = (props) => {
  const { typeId, sourceData } = props
  const { navigate } = useNavigation()
  const base = useSelector(state => state.base)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)
  const [btnLoading, setBtnLoading] = useState(false)

  // 根据优惠劵状态做不同处理
  const handleCoupon = (item) => {
    // 已领取
    if (item.isReceive) {
      useCouponHandle()
    } else {
      receiveCouponHandle(item.couponId)
    }
  }

  // 立即使用
  const useCouponHandle = () => {
    navigate('searchList', { categoryId: undefined, value: undefined })
  }
  // 立即领取
  const receiveCouponHandle = (couponId) => {
    setBtnLoading(true)
    receiveCoupon(couponId).then(({ rel, data }) => {
      if (rel) {
        setPage(1)
        setList([])
        setLoading(false)
        setFinished(false)
        loadDataHandle()
        Toast.success('领取成功！')
      } else {
        let txt = '领券失败！'
        switch (data) {
          case 1:
            txt = '券不存在'
            break
          case 2:
            txt = '无效'
            break
          case 3:
            txt = '领取时间过期'
            break
          case 4:
            txt = '未到可领取时间'
            break
          case 5:
            txt = '可用库存不足'
            break
          case 6:
            txt = '已领取'
            break
        }
        Toast.fail(txt)
      }
    }).finally(() => {
      setBtnLoading(false)
    })
  }

  const renderImage = (list, type) => {
    return list.map((item, key) => {
      return (
        <TouchableOpacity style={{ marginRight: 5 }} key={key} onPress={() => navigate('details', { id: item.productId })}>
          <View style={{ position: 'relative' }}>
            <Image style={{ width: 80, height: 80 }} source={{ uri: type === 1 || type === 4 ? item.imagesUrl : item }} />
            {
              type === 1 || type === 4 ? (
                <Text style={styles.price}>{item.price && (item.price).toFixed(2)}</Text>
              ) : null
            }
          </View>
        </TouchableOpacity>
      )
    })
  }

  const loadDataHandle = () => {
    if (finished || loading) return false
    setLoading(true)
    const params = {}
    if (sourceData.type === 1) {
      const categoryIds = []
      const _categoryList = base.allCategoryList.filter(item => item.categoryId === sourceData.id)[0] || []
      _categoryList.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          categoryIds.push(item2.categoryId)
        })
      })
      params.categoryId = categoryIds.join(',')
    } else {
      params.brandId = sourceData.id
    }
    couponCenterList({ start: page, length: 20, ...params }).then(res => {
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
    <View style={styles.content}>
      <ScrollView>
        {list.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <View style={styles.info}>
                <Text style={{ lineHeight: 30, height: 30 }}>{item.couponName}</Text>
                <View style={{ height: 90, flexDirection: 'row' }}>
                  <ScrollView horizontal>
                    {renderImage(item.imagesList || item.scProductList || [], item.couponArea)}
                  </ScrollView>
                </View>
              </View>
              <View style={styles.type}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  {item.couponType === 1 ? <Text style={{ color: '#EF4034', fontSize: 12 }}>￥</Text> : null}
                  <Text style={{ fontSize: 22, color: '#EF4034', lineHeight: 22, fontWeight: 'bold' }}>{item.couponType === 2 ? item.couponMoney * 0.1 : item.couponMoney}</Text>
                  {item.couponType === 2 ? <Text style={{ fontSize: 12, color: '#EF4034' }}>折</Text> : null}
                </View>
                <Text style={{ marginTop: 10, color: '#EF4034' }}>满{item.useMinSpending}元可用</Text>
                <TouchableOpacity style={{ marginTop: 10 }} disabled={btnLoading} onPress={() => handleCoupon(item)}>
                  <Text style={[
                    styles.btn, {
                      backgroundColor: item.isReceive ? '#fff' : '#EF4034',
                      color: item.isReceive ? '#EF4034' : '#fff'
                    }]}>{item.isReceive ? '立即使用' : '立即领取'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
        {list.length === 0 && !loading ? (
          <Empty desc='暂无优惠劵' image={require('~/assets/empty/Comment.png')} />
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
  content: {
    flex: 1,
    backgroundColor: '#f5f5f9'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden'
  },
  info: {
    flex: 1,
    height: 120
  },
  price: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    borderRadius: 4,
    overflow: 'hidden'
  },
  type: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderStyle: 'solid',
    borderLeftColor: '#f5f5f9'
  },
  btn: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EF4034',
    color: '#fff',
    borderRadius: 10,
    overflow: 'hidden'
  }
})
export default LinCouponContent
