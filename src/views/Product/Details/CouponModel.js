import React, { useState } from 'react'
import { cloneDeep } from 'lodash'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { receiveCoupon } from '~/service/coupon'
import Toast from 'teaset/components/Toast/Toast'

const CouponItem = (props) => {
  const { onChange, sourceData: { couponType, couponMoney, useType, couponName, couponId, useMinSpending, couponEffectiveStart, couponEffectiveEnd, isReceive } } = props
  const [btnLoading, setBtnLoading] = useState(false)
  const receiveCouponHandle = (couponId) => {
    if (btnLoading) return false
    setBtnLoading(true)
    receiveCoupon(couponId).then(res => {
      const { rel, data } = res
      if (rel && data === 0) {
        if (typeof onChange === 'function') {
          onChange(couponId)
          Toast.success('领券成功，稍后到账~')
        }
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
          case 7:
            txt = '您不是新人,不符合领取条件'
            break
        }
        Toast.fail(txt)
      }
    }).finally(() => {
      setBtnLoading(false)
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.title}>
          <Text style={{ color: '#e4393c', fontSize: 18 }}>{couponType === 1 ? `￥${couponMoney}` : `${couponMoney / 10}折`}</Text>
          <Text style={{ color: '#e4393c', fontSize: 12, marginTop: 10 }}>满{useMinSpending}元可用</Text>
        </View>
        <View style={styles.info}>
          <Text>
            <Text style={{ backgroundColor: '#e4393c', color: '#fff', fontSize: 10, lineHeight: 18 }}>
              &nbsp;{useType === 1 ? '通用券' : useType === 2 ? '新手券' : useType === 3 ? '转发券' : useType === 4 ? '关注券' : useType === 5 ? '短信券' : '活动券'}&nbsp;
            </Text>
            &nbsp;&nbsp;
            <Text style={{ color: '#333', fontSize: 14 }}>{couponName}</Text>
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text style={{ fontSize: 12, color: '#777' }}>{couponEffectiveStart.slice(0, 11) + '~' + couponEffectiveEnd.slice(0, 11)}</Text>
            {isReceive ? (
              <Text style={[styles.btn, { color: '#777' }]}>已领取</Text>
            ) : (
              <TouchableOpacity disabled={btnLoading} onPress={() => receiveCouponHandle(couponId)}>
                <Text style={[styles.btn, { color: '#fff', backgroundColor: '#e4393c', borderColor: '#e4393c' }]}>
                  {btnLoading ? '领取中...' : '立即领取'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

const CouponModel = (props) => {
  const [couponList, setCouponList] = useState(props.data || [])
  const changeItem = (couponId) => {
    const _list = cloneDeep(couponList)
    const newData = _list.map(item => {
      if (item.couponId === couponId) {
        return {
          ...item,
          isReceive: 1
        }
      }
      return item
    })
    setCouponList(newData)
    props.onChange()
  }
  return (
    <SafeAreaView style={{ width: '100%', flex: 1 }}>
      <ScrollView>
        {couponList.map((item, key) => {
          return (
            <CouponItem sourceData={item} key={key} onChange={changeItem} />
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
    height: 64,
    justifyContent: 'space-between'
  },
  btn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#ccc'
  }
})

export default CouponModel
