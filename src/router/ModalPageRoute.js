import * as React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import modalRoutes from '~/views/Modal'
import TabBarScreen from '~/router/TabBarPageRoute'

const Drawer = createDrawerNavigator()

export default function DrawerScreen () {
  return (
    <Drawer.Navigator initialRouteName='App'>
      <Drawer.Screen name='App' component={TabBarScreen} />
      {modalRoutes.map((item, key) => (
        <Drawer.Screen
          key={key}
          name={item.name}
          component={item.component}
          options={item.options}
        />
      ))}
    </Drawer.Navigator>
  )
}
