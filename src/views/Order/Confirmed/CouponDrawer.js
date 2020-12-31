import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import Checkbox from 'teaset/components/Checkbox/Checkbox'

const MyCouponItem = (props) => {
  const [showDesc, setShowDesc] = useState(false)
  const { active, onChange, sourceData: { couponId, couponType, couponMoney, useType, couponName, couponRemark, useMinSpending, couponEffectiveStart, couponEffectiveEnd } } = props
  const receiveCouponHandle = () => {
    const checked = active === couponId
    onChange({ checked: !checked }, props.sourceData)
  }
  return (
    <View style={styles.container}>
      <View style={[styles.content, { borderTopColor: '#e4393c' }]}>
        <View style={styles.title}>
          <Text style={{ color: '#e4393c', fontSize: 20 }}>{couponType === 1 ? `￥${couponMoney}` : `${couponMoney / 10}折`}</Text>
          <Text style={{ color: '#e4393c', fontSize: 12, marginTop: 10 }}>满{useMinSpending}元可用</Text>
        </View>
        <View style={styles.info}>
          <Text>
            <Text style={{ backgroundColor: '#e4393c', color: '#fff', fontSize: 14 }}>
              &nbsp;{useType === 1 ? '通用券' : useType === 2 ? '新手券' : useType === 3 ? '转发券' : useType === 4 ? '关注券' : useType === 5 ? '短信券' : '活动券'}&nbsp;
            </Text>
            &nbsp;&nbsp;
            <Text style={{ color: '#333', fontSize: 14 }}>{couponName}</Text>
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8 }}>
            <Text style={{ fontSize: 12, color: '#777' }}>{couponEffectiveStart.slice(0, 11) + '~' + couponEffectiveEnd.slice(0, 11)}</Text>
            <Checkbox
              checked={active === couponId}
              onChange={() => receiveCouponHandle()}
              checkedIcon={<Icon name='check-circle' size={20} color='#e4393c' />}
              uncheckedIcon={<Icon name='circle' size={20} color='#e4393c' />}
            />
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

const CouponDrawer = (props) => {
  const { data, selectCoupon, onChange } = props
  return (
    <View style={styles.container}>
      <ScrollView>
        {data.map((item, key) => {
          return (
            <View key={key} style={styles.item}>
              <MyCouponItem active={selectCoupon} onChange={onChange} sourceData={item} />
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
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

export default CouponDrawer
