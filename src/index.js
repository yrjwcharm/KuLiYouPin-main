import React, { useEffect, useMemo, useState } from 'react'
import { BackHandler, StatusBar, ToastAndroid, useColorScheme } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { navigate, navigationRef } from '~/utils/navigation'
import { DartTheme, DefaultTheme } from '~/themes'
import MainStackPageRoute from '~/router/MainStackPageRoute'
import { Provider, useSelector } from 'react-redux'
import configureStore from '~/redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as WeChat from 'react-native-wechat-lib'

const RootStack = createStackNavigator()
const loginNames = ['mine', 'cart', 'signIn', 'point', 'giftCenter', 'updateVip']
const lightStyleNames = ['home', 'mine']
const homeRoutes = ['home', 'category', 'shareVip', 'cart', 'mine']
const getActiveRouteName = state => {
  const route = state.routes[state.index]
  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state)
  }

  return route.name
}

const App = () => {
  const { store, persist } = configureStore()

  function initApp () {
    WeChat.registerApp('wxc63aedaca59ae529', 'applinks:www.app.huikujia.com')
  }

  React.useEffect(() => {
    initApp()
  }, [])

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persist}>
          <Navigator />
        </PersistGate>
      </Provider>
    </>
  )
}

function Navigator () {
  const [currentRoute, setCurrentRoute] = React.useState('Main')
  const routeNameRef = React.useRef()
  const user = useSelector(state => state.user)
  const [lastBackPressed, setLastBackPressed] = useState(undefined)
  // 开启暗黑模式
  const scheme = useColorScheme()

  const onBackButtonPressAndroid = () => {
    if (homeRoutes.includes(routeNameRef.current)) {
      if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
        BackHandler.exitApp()
        return false
      }
      setLastBackPressed(Date.now())
      ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT)
      return true
    } else {
      return false
    }
  }

  useMemo(() => {
    const barStyleTheme = lightStyleNames.includes(currentRoute) ? 'light-content' : 'dark-content'
    StatusBar.setBarStyle(barStyleTheme)
  }, [currentRoute])

  useMemo(() => {
    if (loginNames.includes(routeNameRef.current) && !user.token) {
      navigate('mobileLogin')
    }
  }, [routeNameRef])

  useEffect(() => {
    const state = navigationRef.current.getRootState()
    routeNameRef.current = getActiveRouteName(state)

    BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackButtonPressAndroid)
    }
  }, [])
  return (
    <>
      <StatusBar
        animated
        translucent
        barStyle='light-content'
      />
      <NavigationContainer
        ref={navigationRef}
        theme={scheme === 'light' ? DefaultTheme : DartTheme}
        onStateChange={state => {
          const previousRouteName = routeNameRef.current
          const currentRouteName = getActiveRouteName(state)
          if (previousRouteName !== currentRouteName) {
            setCurrentRoute(currentRouteName)
          }
          routeNameRef.current = currentRouteName
        }}
      >
        <RootStack.Navigator initialRouteName='Main'>
          <RootStack.Screen
            name='Main'
            options={{ headerShown: false }}
            component={MainStackPageRoute}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default App
