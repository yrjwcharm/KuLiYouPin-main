import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import OrderContent from '~/views/Order/List/OrderContent'

const orderType = [
  { title: '全部', key: 0, id: '' },
  { title: '待付款', key: 1, id: '0' },
  { title: '待发货', key: 2, id: '1' },
  { title: '待收货', key: 3, id: '2' },
  { title: '已完成', key: 4, id: '10' },
  { title: '售后', key: 5, id: '11' }
]

const OrderList = ({ route }) => {
  const [type, _] = useState(orderType)
  const [initialPage, setInitialPage] = useState(route.params?.type || 0)

  return (
    <View style={styles.page}>
      <ScrollableTabView
        style={styles.content}
        tabs={type}
        tabBarMaxNum={6}
        tabBarActiveTextColor='#EF4034'
        tabBarInactiveTextColor='#333'
        tabBarUnderlineStyle={{ backgroundColor: '#EF4034' }}
        onChangeTab={({ i }) => {
          setInitialPage(i)
        }}
        initialPage={initialPage}
        page={initialPage}
        renderingSiblingsNumber={2}
      >
        {type.map((item, key) => {
          return (
            <View key={key} style={styles.content}>
              <OrderContent typeId={item.id} />
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

export default OrderList
