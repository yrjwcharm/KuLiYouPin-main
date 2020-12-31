import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import NavigationBar from 'teaset/components/NavigationBar/NavigationBar'
import { useTheme } from '@react-navigation/native'
import Header from '~/views/TabBar/mine/Header'
import OrderStruct from '~/views/TabBar/mine/OrderStruct'
import Profit from '~/views/TabBar/mine/Profit'
import Struct from '~/views/TabBar/mine/Struct'
import Activity from '~/views/TabBar/mine/Activity'
import LikeMore from '~/components/LikeMore'
import { useDispatch, useSelector } from 'react-redux'
import { getAddressListAction } from '~/redux/actions/baseAction'
import NewUserBanner from '~/components/NewUserBanner'

export default () => {
  const { colors } = useTheme()
  const { user, app } = useSelector(state => state)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAddressListAction())
  }, [])
  return (
    <View style={styles.page}>
      <NavigationBar
        title='我的'
        style={{
          position: 'relative',
          backgroundColor: colors.brand
        }}
      />
      <ScrollView>
        <Header user={user} app={app} />
        <OrderStruct user={user} />
        <Profit />
        <NewUserBanner type='mine' />
        <Activity />
        <Struct />
        <LikeMore title='为您推荐' />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  }
})
