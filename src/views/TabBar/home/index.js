import React, { useEffect, useMemo, useState } from 'react'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { useTheme } from '@react-navigation/native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import HeaderSearch from './HeaderSearch'
import TabContentView from './TabContentView'
import { useDispatch, useSelector } from 'react-redux'
import { getAppInfoAction, getShopInfoAction, getShopMaxRateAction } from '~/redux/actions/appAction'
import { getCartListAction, getCategoryAction } from '~/redux/actions/baseAction'
import { getUserInfoAction } from '~/redux/actions/userAction'

const HomeScreen = ({ route }) => {
  const { colors } = useTheme()
  const [tabs, setTabs] = useState([])
  const { app, base, user } = useSelector(state => state)
  const dispatch = useDispatch()

  const [initialPage, setInitialPage] = useState(0)

  useMemo(() => {
    const _list = base.allCategoryList.map(item => ({ title: item.categoryName }))
    setTabs(_list)
  }, [base.allCategoryList])

  useEffect(() => {
    // 获取店铺信息比例相关信息
    dispatch(getAppInfoAction())
    dispatch(getShopInfoAction())
    dispatch(getShopMaxRateAction())
    // 获取购物车商品
    dispatch(getCartListAction())
    // 获取商品分类
    dispatch(getCategoryAction())
    if (user.token) {
      dispatch(getUserInfoAction())
    }
  }, [route?.params?.shopId])
  return (
    <View style={styles.page}>
      <ImageBackground
        style={styles.backgroundContent}
        imageStyle={{
          resizeMode: 'cover',
          width: '100%',
          height: 200,
          overlayColor: colors.background,
          backgroundColor: colors.background
        }}
        source={{
          uri: app.backgroundPicture
        }}
      >
        <HeaderSearch title={app.appName} />
        <ScrollableTabView
          style={styles.content}
          onChangeTab={({ i }) => {
            setInitialPage(i)
          }}
          tabs={tabs}
          initialPage={0}
          page={initialPage}
          renderingSiblingsNumber={2}
        >
          {base.allCategoryList.map((item, key) => {
            return (
              <View key={key} style={styles.content}>
                <TabContentView sourceData={item} index={key} />
              </View>
            )
          })}
        </ScrollableTabView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    flex: 1
  },
  backgroundContent: {
    flex: 1,
    width: '100%',
    resizeMode: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  content: {
    flex: 1
  }
})

export default HomeScreen
