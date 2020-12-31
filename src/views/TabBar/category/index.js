import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity, Image
} from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native'
import SearchHeader from '~/views/TabBar/category/SearchHeader'
import { width } from '~/utils/common'
import Icon from 'react-native-vector-icons/EvilIcons'
import { useSelector } from 'react-redux'

/**
 * 渲染左侧菜单列表
 * @param sourceData
 * @param selectedIndex
 * @param setSelectedIndex
 * @return {JSX.Element}
 * @constructor
 */
const RenderLeftMenuItem = ({ sourceData, selectedIndex, setSelectedIndex }) => {
  const { index, item } = sourceData
  const { colors } = useTheme()
  if (item.categoryName === '热门' || item.categoryId === 256) {
    return false
  }
  return (
    <TouchableOpacity onPress={() => setSelectedIndex(index)} activeOpacity={0.8}>
      <View
        style={[
          styles.leftItem,
          {
            backgroundColor: selectedIndex === index ? colors.card : colors.background,
            borderRightColor: selectedIndex === index ? colors.brand : colors.background
          }
        ]}
      >
        <Text
          style={[
            styles.leftItemText,
            {
              color: selectedIndex === index ? colors.brand : colors.text,
              fontWeight: selectedIndex === index ? 'bold' : 'normal'
            }
          ]}
        >
          {item.categoryName}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

/**
 * 渲染内容
 * @param sourceData
 * @param height
 * @param setHeight
 * @return {JSX.Element|boolean}
 * @constructor
 */
const RenderContentItem = ({ sourceData, height, setHeight }) => {
  const { colors } = useTheme()
  const { index, item } = sourceData

  const onLayoutHandle = (e) => {
    e.persist()
    const { layout: { height: h } } = e.nativeEvent
    // 累加item高度
    const _height = height
    let totalHeight = 0
    if (height.length) {
      totalHeight = height[height.length - 1]
    }
    _height.push(totalHeight + h)
    setHeight(_height)
  }

  if (item.categoryName === '热门' || item.categoryId === 256) {
    return false
  }
  return (
    <View key={index} onLayout={e => onLayoutHandle(e)}>
      {item.iconUrl ? <Image source={{ uri: item.iconUrl }} resizeMode='cover' style={styles.topImage} /> : null}
      {item.children.map((_item, key) => {
        return (
          <View key={key} style={{ paddingTop: 10, paddingBottom: 10 }}>
            <View style={[styles.itemContent, { backgroundColor: colors.card }]}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemHeaderText, { color: colors.text }]}>{_item.categoryName}</Text>
                <Icon name='chevron-right' size={24} color={colors.desc} />
              </View>
              <View style={styles.itemList}>
                {_item.children.map((_col, _key) => {
                  return (
                    <View style={styles.itemChildrenWrap} key={_key}>
                      {_col.iconUrl ? (
                        <Image
                          source={{ uri: _col.iconUrl }}
                          resizeMode='contain'
                          style={styles.itemChildrenImage}
                        />
                      ) : null}
                      <Text style={[styles.itemChildrenText, { color: colors.desc }]}>{_col.categoryName}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const CategoryPage = () => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const base = useSelector(state => state.base)
  // 左边菜单ref
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  // 第几个选中
  const [selectedIndex, setSelectedIndex] = useState(1)
  // 高度
  const [height, setHeight] = useState([])

  const onToContentIndexHandle = (index) => {
    rightRef.current.scrollToIndex({
      animated: true,
      index
    })
  }

  const onScrollHandle = (e) => {
    const { contentOffset } = e.nativeEvent
    const index = height.findIndex(num => num > contentOffset.y)
    if (selectedIndex !== index + 1) {
      setSelectedIndex(index + 1)
    }
  }

  return (
    <View style={styles.page}>
      <SearchHeader title='搜索' statusBarStyle='dark-content' onPress={() => navigate('cart')} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.menuContainer}>
          <FlatList
            ref={leftRef}
            style={{ flexGrow: 1 }}
            data={base.primaryCategoryList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(data) => (
              <RenderLeftMenuItem
                sourceData={data}
                setSelectedIndex={onToContentIndexHandle}
                selectedIndex={selectedIndex}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.content}>
          <FlatList
            ref={rightRef}
            style={{ flexGrow: 1 }}
            data={base.allCategoryList}
            scrollEventThrottle={100}
            onScroll={(e) => onScrollHandle(e)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(data) => (
              <RenderContentItem
                sourceData={data}
                height={height}
                setHeight={setHeight}
                setSelectedIndex={setSelectedIndex}
                selectedIndex={selectedIndex}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    width: width,
    height: '100%'
  },
  container: {
    width: width,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10
  },
  menuContainer: {
    width: 90,
    height: '100%'
  },
  content: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10
  },
  leftItem: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2
  },
  leftItemText: {
    fontSize: 12
  },
  contentItem: {
    width: '100%',
    flexDirection: 'column'
  },
  topImage: {
    width: '100%',
    height: 90
  },
  itemContent: {
    width: '100%'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    paddingLeft: 10,
    paddingRight: 10
  },
  itemHeaderText: {
    fontSize: 14
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10
  },
  itemChildrenWrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '33%',
    paddingTop: 10,
    paddingBottom: 10
  },
  itemChildrenImage: {
    width: 50,
    height: 50
  },
  itemChildrenText: {
    marginTop: 10,
    fontSize: 13
  }
})

export default CategoryPage
