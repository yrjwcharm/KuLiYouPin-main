import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import TabView from 'teaset/components/TabView/TabView'
import LinCoupon from './LinCoupon'
import MyCoupon from './MyCoupon'

const Coupon = ({ route }) => {
  const [index, setIndex] = useState(route?.params?.index || 0)
  return (
    <View style={styles.page}>
      <TabView style={{ flex: 1 }} activeIndex={index} onChange={i => setIndex(i)} type='projector' barStyle={{ backgroundColor: '#fff' }}>
        <TabView.Sheet
          type='sheet'
          title={<Text style={{ color: index === 0 ? 'red' : '#333', fontSize: 10 }}>优惠劵</Text>}
          onPress={() => setIndex(0)}
          icon={<Image style={{ width: 20, height: 20 }} source={require('~/assets/mine/coupon.png')} />}
          activeIcon={<Image style={{ width: 20, height: 20 }} source={require('~/assets/mine/coupon-active.png')} />}
        >
          <View style={styles.content}>
            <LinCoupon />
          </View>
        </TabView.Sheet>
        <TabView.Sheet
          title={<Text style={{ color: index === 1 ? 'red' : '#333', fontSize: 10 }}>我的</Text>}
          icon={<Image style={{ width: 20, height: 20 }} source={require('~/assets/mine/mine.png')} />}
          activeIcon={<Image style={{ width: 20, height: 20 }} source={require('~/assets/mine/mine-active.png')} />}
        >
          <View style={styles.content}>
            <MyCoupon />
          </View>
        </TabView.Sheet>
      </TabView>
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

export default Coupon
