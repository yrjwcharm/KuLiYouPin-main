import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { cloneDeep } from 'lodash'
import { connect } from 'react-redux'
import { categoryQueryProduct } from '~/service/home'
import FooterLoading from '~/components/FooterLoading'
import ShopComplete from '~/components/ShopComplete'
import { width } from '~/utils/common'
import { DefaultTheme } from '~/themes'

@connect(({ base }) => ({
  base: {
    categoryList: base.allCategoryList.filter(item => item.children && item.children.length)
  }
}))
class Secondary extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      globalCategoryList: [],
      title: '加载中...',
      twoCategory: undefined,
      current: 0,
      categoryId: '',
      baseCategoryId: '',
      page: 1,
      size: 10,
      loading: false,
      finished: false,
      list: []
    }
  }

  componentDidMount () {
    const { params: { id } } = this.props.route
    this.setState({
      globalCategoryList: cloneDeep(this.props.base.categoryList)
    }, () => {
      this.recursivePartitioningHandle(this.state.globalCategoryList, id)
    })
  }

  recursivePartitioningHandle (list, id) {
    const { navigation } = this.props
    for (const item of list) {
      if (item.categoryId * 1 === id * 1) {
        const category = item
        if (category.children && category.children.length) {
          category.children.unshift({ categoryName: '全部', categoryId: '' })
        }
        navigation.setOptions({ title: item.categoryName })
        this.setState({
          twoCategory: category,
          title: item.categoryName,
          categoryId: item.categoryId,
          baseCategoryId: id
        }, () => {
          this.onLoad()
        })
      } else if (item.children && item.children.length) {
        this.recursivePartitioningHandle(item.children, id)
      }
    }
  }

  onLoad () {
    const { page, size, list, categoryId, finished, baseCategoryId } = this.state
    const params = {
      start: page,
      length: size,
      categoryId: categoryId || baseCategoryId
    }
    if (finished) return
    this.setState({ loading: true })
    categoryQueryProduct(params).then(({ rel, data: { rows } }) => {
      if (rel) {
        this.setState({
          page: +page + 1,
          loading: false,
          list: [...list, ...rows],
          finished: rows.length < size
        })
      }
    })
  }

  /**
   * 分类切换
   * @param item
   * @param index
   */
  onTabItemChange (item, index) {
    this.setState({
      current: index,
      categoryId: item.categoryId || this.state.baseCategoryId,
      page: 1,
      loading: true,
      finished: false,
      list: []
    }, () => {
      this.onLoad()
    })
  }

  render () {
    const { loading, finished, list, twoCategory, current } = this.state
    const categoryList = (twoCategory && twoCategory.children)
      ? twoCategory.children
      : []
    const _width = categoryList.length > 6 ? width / 6 : width / categoryList.length
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <ScrollView horizontal>
            {categoryList.map((item, key) => {
              return (
                <TouchableOpacity key={key} onPress={() => this.onTabItemChange(item, key)}>
                  <Text
                    numberOfLines={1}
                    style={[styles.headerItem, { width: _width, color: key === current ? DefaultTheme.colors.brand : '#333' }]}>
                    {item.categoryName}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
        <View style={styles.content}>
          <ScrollView>
            {list.map((item, key) => {
              return (
                <ShopComplete sourceData={item} key={key} />
              )
            })}
            <FooterLoading loading={loading} finished={finished} loadingHandle={this.onLoad} />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  header: {
    backgroundColor: '#fff'
  },
  headerItem: {
    height: 30,
    lineHeight: 30,
    textAlign: 'center'
  }
})

export default Secondary
