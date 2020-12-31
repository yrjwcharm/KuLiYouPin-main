import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import routers from '~/views/routers'
import otherRoutes from '~/views/otherRoutes'
import TabBarScreen from '~/router/TabBarPageRoute'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

const AppStack = createStackNavigator()

const HeaderLeft = (props) => (
  <TouchableOpacity {...props} style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Icon name='arrowleft' size={20} />
  </TouchableOpacity>
)

export default function AppStackScreen () {
  return (
    <AppStack.Navigator
      initialRouteName='App'
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'transparent',
          shadowOpacity: 0,
          borderBottomWidth: 0,
          borderBottomColor: 'transparent',
          elevation: 0
        },
        headerBackTitleVisible: false
      }}
    >
      <AppStack.Screen name='App' component={TabBarScreen} options={{ headerShown: false }} />
      {routers.map((item, key) => (
        <AppStack.Screen
          name={item.name}
          key={key}
          component={item.component}
          options={Object.assign({}, {
            title: '加载中...',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 18
            },
            headerLeft: HeaderLeft
          }, item.options || {})}
        />
      ))}
      {otherRoutes.map((item, key) => (
        <AppStack.Screen
          name={item.name}
          key={key}
          component={item.component}
          options={item.options}
        />
      ))}
    </AppStack.Navigator>
  )
}
