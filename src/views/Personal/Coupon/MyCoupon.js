import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import MyCouponContent from '~/views/Personal/Coupon/MyCouponContent'

const couponType = [
  { title: '待使用', id: 0 },
  { title: '已使用', id: 1 },
  { title: '已过期', id: 2 }
]

const MyCoupon = () => {
  const [type, setType] = useState(couponType)
  const [initialPage, setInitialPage] = useState(0)
  return (
    <View style={styles.page}>
      <ScrollableTabView
        style={styles.content}
        tabBarMaxNum={6}
        tabBarActiveTextColor='#EF4034'
        tabBarInactiveTextColor='#333'
        tabBarUnderlineStyle={{ backgroundColor: '#EF4034' }}
        onChangeTab={({ i }) => {
          setInitialPage(i)
        }}
        initialPage={0}
        tabs={type}
        page={initialPage}
        renderingSiblingsNumber={2}
      >
        {type.map((item, key) => {
          return (
            <View key={key} style={styles.content}>
              <MyCouponContent index={key} />
            </View>
          )
        })}
      </ScrollableTabView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1
  }
})

export default MyCoupon
