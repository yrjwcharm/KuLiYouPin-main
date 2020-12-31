import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import BudgetContent from '~/views/Personal/Profit/BudgetContent'
import BudgetOrderDetail from '~/views/Personal/Profit/BudgetOrderDetail'
import BudgetBonus from '~/views/Personal/Profit/BudgetBonus'

const profitType = [
  { title: '日收益' },
  { title: '月收益' },
  { title: '订单明细' },
  { title: '奖励明细' }
]

const Profit = ({ route }) => {
  const [type] = useState(profitType)
  const [initialPage, setInitialPage] = useState(0)

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
          if (key === 0 || key === 1) {
            return (
              <View key={key} style={styles.content}>
                <BudgetContent budgetType={key} />
              </View>
            )
          } else if (key === 2) {
            return (
              <View key={key} style={styles.content}>
                <BudgetOrderDetail budgetType={3} />
              </View>
            )
          } else {
            return (
              <View key={key} style={styles.content}>
                <BudgetBonus budgetType={4} />
              </View>
            )
          }
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

export default Profit
