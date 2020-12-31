import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import ShopCollection from '~/views/Product/Collection'
import ShopHistory from '~/views/Product/History'
import ShopShareHistory from '~/views/Product/ShareHistory'

const customHeaderRight = ({ navigation }, title) => {
  return {
    title,
    headerRight: () => {
      const [manager, setManager] = React.useState(false)
      const changeManagerHandle = () => {
        setManager(!manager)
        navigation.setParams({ _manager: !manager })
      }
      return (
        <View style={{ flexDirection: 'row', flex: 1, width: 44, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={changeManagerHandle} style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{manager ? '完成' : '管理'}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const otherRoutes = [
  {
    name: 'collection',
    component: ShopCollection,
    options: ({ navigation }) => customHeaderRight({ navigation }, '商品收藏')
  },
  {
    name: 'shopHistory',
    component: ShopHistory,
    options: ({ navigation }) => customHeaderRight({ navigation }, '历史浏览')
  },
  {
    name: 'shopShareHistory',
    component: ShopShareHistory,
    options: ({ navigation }) => customHeaderRight({ navigation }, '转发记录')
  }
]

export default otherRoutes
