import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native'
import { HeaderStatusBarHeight, HeaderHeight, isIPhoneXFooter } from '~/utils/common'
import Icon from 'react-native-vector-icons/Feather'
import ShopColumn from '~/components/ShopColumn'
import { selectBySearch } from '~/service/product'
import FooterLoading from '~/components/FooterLoading'
import { DefaultTheme } from '~/themes'

const slotRule = [
  {
    name: '综合',
    key: undefined
  }, {
    name: '销量',
    key: 'salesSort'
  },
  {
    name: '价格',
    key: 'priceSort'
  },
  {
    name: '新品',
    key: 'timeSort'
  }
]

class SearchListPage extends React.Component {
  constructor (props) {
    super(props)
    const { route: { params: { categoryId, value } } } = props
    this.state = {
      _categoryId: categoryId,
      _value: value,
      slot: undefined,
      slotDesc: undefined,
      list: [],
      page: 1,
      size: 20,
      loading: false,
      finished: false
    }
  }

  componentDidMount () {
    this.onLoad()
  }

  handleSearch = () => {
    this.setState({
      loading: false,
      finished: false,
      list: [],
      page: 1
    }, () => {
      this.onLoad()
    })
  }

  handleChangeValue = (value) => {
    this.setState({ _value: value })
  }

  changeSlotHandle = (item) => {
    const { slot, slotDesc } = this.state
    let _slot
    let _slotDesc
    if (slot === item.key) {
      _slot = slot
      _slotDesc = slotDesc ? 0 : 1
    } else {
      _slot = item.key
      _slotDesc = 0
    }
    this.setState({
      loading: false,
      finished: false,
      list: [],
      page: 1,
      slot: _slot,
      slotDesc: _slotDesc
    }, () => {
      this.onLoad()
    })
  }

  onLoad = () => {
    console.log('开始加载')
    const { list, loading, finished, page, size, _categoryId, _value, slot, slotDesc } = this.state
    if (loading || finished) {
      return false
    }
    const params = { start: page, length: size }
    if (_categoryId) {
      params.categoryId = _categoryId
    } else {
      params.productName = _value
    }
    if (slot) {
      params[slot] = slotDesc
    }
    this.setState({ loading: true })
    selectBySearch(params).then(({ rel, data }) => {
      console.log(rel)
      if (rel) {
        const { goodsList, scCategoryList } = data
        this.setState({
          list: [...list, ...goodsList],
          page: page + 1,
          finished: goodsList.length < size
        })
      }
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  render () {
    const { navigation: { goBack } } = this.props
    const { _value, finished, loading, list, slot, slotDesc } = this.state
    const { colors } = DefaultTheme
    return (
      <View style={[styles.page, { backgroundColor: colors.background }]}>
        <View style={[styles.headerWrapper, { backgroundColor: colors.card }]}>
          <View style={[styles.header]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
              <Icon name='chevron-left' size={30} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.searchWrap}>
              <Icon name='search' size={16} color={colors.desc} />
              <TextInput
                style={styles.input}
                value={_value}
                autoFocus
                onSubmitEditing={this.handleSearch}
                onChangeText={this.handleChangeValue}
                numberOfLines={1}
                returnKeyType='search'
                placeholder='请输入您要搜索的商品'
              />
            </View>
          </View>
        </View>
        <View style={styles.slots}>
          {slotRule.map((item, key) => {
            return (
              <TouchableOpacity key={key} style={styles.slotItem} onPress={() => this.changeSlotHandle(item)}>
                <View style={styles.slotItemContent}>
                  <Text style={{ fontSize: 14, color: item.key === slot ? colors.brand : colors.text }}>{item.name}</Text>
                  {item.key ? (
                    <Icon
                      name={item.key === slot ? (slotDesc ? 'chevron-up' : 'chevron-down') : 'chevron-down'}
                      size={16}
                      color={item.key === slot ? colors.brand : colors.text}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={{ flex: 1, paddingBottom: isIPhoneXFooter(0) }}>
          <FlatList
            data={list}
            numColumns={2}
            columnWrapperStyle={{ flexDirection: 'row' }}
            ListFooterComponent={() => (
              <FooterLoading
                loading={loading}
                finished={finished}
                loadingHandle={this.onLoad}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ShopColumn sourceData={item} />}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    flex: 1
  },
  headerWrapper: {
    paddingTop: HeaderStatusBarHeight
  },
  header: {
    width: '100%',
    height: HeaderHeight,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: 10
  },
  backBtn: {
    width: HeaderHeight,
    height: HeaderHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchWrap: {
    flex: 1,
    height: HeaderHeight - 10,
    backgroundColor: '#f5f5f9',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: (HeaderHeight - 10) / 2,
    overflow: 'hidden'
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    marginLeft: 10
  },

  slots: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  slotItem: {
    flex: 1,
    height: 44
  },
  slotItemContent: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default SearchListPage
