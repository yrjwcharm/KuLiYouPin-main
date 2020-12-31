import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import WithDrawalDetailsContent from '~/views/Personal/WithDrawalDetails/WithDrawalDetailsContent'

const tabs = [
  { title: '全部', value: '' },
  { title: '待处理', value: 0 },
  { title: '处理中', value: 1 },
  { title: '处理成功', value: 2 },
  { title: '处理失败', value: 3 },
  { title: '后台驳回', value: 4 },
  { title: '已取消', value: 5 }
]

const WidthDrawalContent = () => {
  const [initialPage, setInitialPage] = useState(0)
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
              <WithDrawalDetailsContent status={item.value} />
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

export default WidthDrawalContent
