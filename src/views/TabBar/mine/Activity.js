import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { width } from '~/utils/common'
import { useNavigation } from '@react-navigation/native'

const Activity = () => {
  const { navigate } = useNavigation()
  const _ww = (width - 30) / 2
  const pax = 357 / _ww
  const _h = Math.floor(110 / pax)
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('coupon')}>
        <Image
          source={require('~/assets/mine/coupon-images.png')}
          style={{ width: _ww, height: _h }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('myGiftCenter')}>
        <Image
          source={require('~/assets/mine/gift-images.png')}
          style={{ width: _ww, height: _h, marginLeft: 10 }}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10
  }
})

export default Activity
