import * as React from 'react'
import { TouchableOpacity, Text, Image, BackHandler, ToastAndroid } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UpdateVip from '~/views/Activity/UpdateVip'
import {
  HomeScreen,
  CategoryScreen,
  CartScreen,
  MineScreen
} from '~/views/TabBar'
import { useTheme } from '@react-navigation/native'
import { useEffect, useState } from 'react'

const BottomTabs = createBottomTabNavigator()
const tabBarLabel = {
  home: '首页',
  category: '分类',
  shareVip: '做店主',
  cart: '购物车',
  mine: '我的'
}

export default function TabBarScreen () {
  const theme = useTheme()

  useEffect(() => {
  }, [])
  return (
    <BottomTabs.Navigator
      initialRouteName='home'
      screenOptions={({ route }) => ({
        tabBarButton: props => (
          <TouchableOpacity {...props} activeOpacity={0.7} />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          const _size = size - 5
          switch (route.name) {
            case 'home':
              return (
                <Image
                  style={{ width: _size, height: _size }}
                  source={focused ? require('~/assets/tabbar/tabbar-home-icon-active.png') : require('~/assets/tabbar/tabbar-home-icon.png')}
                />
              )
            case 'category':
              return (
                <Image
                  style={{ width: _size, height: _size }}
                  source={focused ? require('~/assets/tabbar/tabbar-category-icon-active.png') : require('~/assets/tabbar/tabbar-category-icon.png')}
                />
              )
            case 'shareVip':
              return (
                <Image
                  style={{ width: _size, height: _size }}
                  source={focused ? require('~/assets/tabbar/tabbar-shop-icon-active.png') : require('~/assets/tabbar/tabbar-shop-icon.png')}
                />
              )
            case 'cart':
              return (
                <Image
                  style={{ width: _size, height: _size }}
                  source={focused ? require('~/assets/tabbar/tabbar-cart-icon-active.png') : require('~/assets/tabbar/tabbar-cart-icon.png')}
                />
              )
            case 'mine':
              return (
                <Image
                  style={{ width: _size, height: _size }}
                  source={focused ? require('~/assets/tabbar/tabbar-mine-icon-active.png') : require('~/assets/tabbar/tabbar-mine-icon.png')}
                />
              )
          }
        },
        tabBarLabel: ({ focused, color, size }) => {
          return (
            <Text
              style={{
                color: focused ? theme.colors.brand : color,
                fontSize: 10,
                marginTop: -5
              }}
            >
              {tabBarLabel[route.name]}
            </Text>
          )
        }
      })}
    >
      <BottomTabs.Screen
        name='home'
        component={HomeScreen}
      />
      <BottomTabs.Screen
        name='category'
        component={CategoryScreen}
      />
      <BottomTabs.Screen
        name='shareVip'
        component={UpdateVip}
      />
      <BottomTabs.Screen
        name='cart'
        component={CartScreen}
      />
      <BottomTabs.Screen
        name='mine'
        component={MineScreen}
      />
    </BottomTabs.Navigator>
  )
}
