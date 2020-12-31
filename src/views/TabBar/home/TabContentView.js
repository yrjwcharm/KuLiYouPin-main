import React from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native'
import SecondaryClass from './SecondaryClass'
import Swiper from './Swiper'
import Struct from './Struct'
import HotStruct from './HotStruct'
import Seckill from './Seckill'
import { getHomeViewType, getNovelBrandList, selectByCategory } from '~/service/home'
import ShopSimplicity from '~/components/ShopSimplicity'
import BrandContainer from '~/components/BrandContainer'
import FooterLoading from '~/components/FooterLoading'
import Profit from '~/views/TabBar/mine/Profit'
import NewUserBanner from '~/components/NewUserBanner'

const TabContentView = ({ sourceData, index }) => {
  // 商品展示方式
  const [viewMode, setViewMode] = React.useState(undefined)
  // 商品页码
  const [page, setPage] = React.useState(1)
  const [size, setSize] = React.useState(20)
  // 加载
  const [loading, setLoading] = React.useState(false)
  // 商品数组
  const [list, setList] = React.useState([])
  // 是否加载完成
  const [finished, setFinished] = React.useState(false)
  // 品牌秀列表
  const [brandList, setBrandList] = React.useState([])

  // 加载商品分页
  const loadDataHandle = () => {
    const params = { start: page, length: size }
    // 不是首页需要携带分类ID
    if (index !== 0) {
      params.categoryId = sourceData.categoryId
    }
    setLoading(true)
    selectByCategory(params, viewMode).then(({ rel, data }) => {
      if (rel) {
        setPage(page + 1)
        setLoading(false)
        setList(list.concat(data.rows))
        setFinished(data.rows.length < size)
      }
    })
  }

  // 加载更多
  const onScrollToLower = () => {
    if (!loading && !finished) {
      loadDataHandle()
    }
  }

  // 筛选当前品牌秀
  const getCurrentNovelBrand = (key) => {
    const index = parseInt(key / 4)
    return brandList[index] ? brandList[index] : undefined
  }

  React.useEffect(() => {
    let flag = true
    if (!viewMode) {
      // 获取首页展示方式
      getHomeViewType().then(({ data }) => {
        flag && setViewMode(data.bcKeyValue * 1)
        // 默认加载第一页
        if (page === 1 && !list.length) {
          flag && loadDataHandle()
        }
      })
    }
    // 加载品牌秀列表
    if (!brandList.length) {
      getNovelBrandList().then(({ rel, data }) => {
        if (rel) {
          flag && setBrandList(data)
        }
      })
    }
    return () => {
      flag = false
    }
  }, [])
  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <View>
            {sourceData.children.length ? <SecondaryClass list={sourceData.children} /> : null}
            {sourceData.categoryId ? <Swiper id={sourceData.categoryId} /> : null}
            {index === 0 ? <Struct id={sourceData.categoryId} /> : null}
            <NewUserBanner type='home' />
            {sourceData.categoryId ? <HotStruct id={sourceData.categoryId} /> : null}
            {index === 0 ? <Seckill /> : null}
          </View>
        )}
        renderItem={({ index, item }) => {
          const data = getCurrentNovelBrand(index)
          if (viewMode === 1) {
            return (
              <>
                {data && index % 4 === 0 ? <BrandContainer sourceData={data} more={false} style={{ width: '100%', height: 200, backgroundColor: '#000' }} /> : null}
                <ShopSimplicity key={index} index={index} sourceData={item} />
              </>
            )
          } else {
            return (
              <BrandContainer sourceData={data} more={false} style={{ width: '100%', height: 200, backgroundColor: '#000' }} />
            )
          }
        }}
        ListFooterComponent={() => (
          <FooterLoading
            loading={loading}
            finished={finished}
            loadingHandle={onScrollToLower}
          />
        )}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default TabContentView
