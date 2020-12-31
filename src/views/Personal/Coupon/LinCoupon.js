import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import { categoryAndBrandList } from '~/service/coupon'
import LinCouponContent from '~/views/Personal/Coupon/LinCouponContent'
import PageLoading from '~/components/PageLoading'

const LinCoupon = () => {
  const [list, setList] = useState([])
  const [initialPage, setInitialPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const initDataTabs = (flag) => {
    categoryAndBrandList().then(res => {
      const { rel, data: { brandList, categoryList } } = res
      const _list = [{ title: '推荐' }]
      if (rel && flag) {
        categoryList.forEach(item => {
          _list.push({ title: item.name, id: item.id, type: 1 })
        })
        brandList.forEach(item => {
          _list.push({ title: item.name, id: item.id, type: 2 })
        })
        console.log(_list)
        setList(_list)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    let flag = true
    initDataTabs(flag)
    return () => {
      flag = false
    }
  }, [])
  return (
    <View style={styles.page}>
      {loading ? (
        <PageLoading />
      ) : (
        <ScrollableTabView
          style={styles.content}
          onChangeTab={({ i }) => {
            setInitialPage(i)
          }}
          tabBarActiveTextColor='#EF4034'
          tabBarInactiveTextColor='#333'
          tabBarUnderlineStyle={{ backgroundColor: '#EF4034' }}
          initialPage={0}
          tabs={list}
          page={initialPage}
          renderingSiblingsNumber={2}
        >
          {list.map((item, key) => {
            return (
              <View key={key} style={styles.content}>
                <LinCouponContent sourceData={item} />
              </View>
            )
          })}
        </ScrollableTabView>
      )}
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

export default LinCoupon
