import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import IntegralContent from '~/views/Personal/Integral/IntegralContent'
import { useNavigation } from '@react-navigation/native'

const tabs = [
  { title: '消费积分', type: 0 },
  { title: '等级积分', type: 1 }
]
const Integral = () => {
  const { setOptions } = useNavigation()
  const [initialPage, setInitialPage] = useState(0)

  useEffect(() => {
    setOptions({
      title: initialPage === 0 ? '消费积分' : '等级积分'
    })
  }, [initialPage])

  return (
    <View style={styles.container}>
      <ScrollableTabView
        style={styles.container}
        onChangeTab={({ i }) => {
          setInitialPage(i)
        }}
        tabBarActiveTextColor='#EF4034'
        tabBarInactiveTextColor='#333'
        tabBarUnderlineStyle={{ backgroundColor: '#EF4034' }}
        initialPage={0}
        tabs={tabs}
        page={initialPage}
        renderingSiblingsNumber={2}>
        {tabs.map((item, key) => {
          return (
            <View key={key} style={[styles.container, { backgroundColor: '#f5f5f9' }]}>
              <IntegralContent integralType={key + 1} />
            </View>
          )
        })}
      </ScrollableTabView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export default Integral
