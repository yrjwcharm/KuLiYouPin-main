import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import IntegralContent from '~/views/Personal/Integral/IntegralContent'
import { useNavigation } from '@react-navigation/native'
import BalanceContent from '~/views/Personal/Balance/BalanceContent'

const tabs = [
  { title: '现金红包', type: 0 },
  { title: '余额红包', type: 1 }
]

const Balance = ({ route }) => {
  const { setOptions } = useNavigation()
  const [initialPage, setInitialPage] = useState(route?.params?.index || 0)

  useEffect(() => {
    setOptions({
      title: initialPage === 0 ? '现金红包' : '余额红包'
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
        initialPage={initialPage}
        tabs={tabs}
        page={initialPage}
        renderingSiblingsNumber={2}>
        {tabs.map((item, key) => {
          return (
            <View key={key} style={[styles.container, { backgroundColor: '#f5f5f9' }]}>
              <BalanceContent balanceType={key + 1} />
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

export default Balance
