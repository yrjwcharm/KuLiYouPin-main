import * as React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { HeaderStatusBarHeight, HeaderHeight } from '~/utils/common'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme, useNavigation } from '@react-navigation/native'
import { navigate } from '~/utils/navigation'
import Empty from '~/components/Empty'
import { useDispatch, useSelector } from 'react-redux'
import { addHistoryItemAction, clearHistoryListAction } from '~/redux/actions/baseAction'

const Search = () => {
  const base = useSelector(state => state.base)
  const dispatch = useDispatch()
  const { colors } = useTheme()
  const { goBack } = useNavigation()
  const [value, setValue] = React.useState(null)
  const handleSearch = () => {
    dispatch(addHistoryItemAction({
      categoryId: undefined,
      value: value,
      key: new Date().getTime()
    }))
    navigate('searchList', { value: value, categoryId: undefined })
  }

  const handleJumpSearch = (item) => {
    navigate('searchList', { value: item.value, categoryId: item.categoryId, key: item.key })
  }

  const handleClearHistoryList = () => {
    dispatch(clearHistoryListAction())
  }
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
              autoFocus
              onSubmitEditing={handleSearch}
              onChangeText={value => setValue(value)}
              numberOfLines={1}
              returnKeyType='search'
              placeholder='请输入您要搜索的商品'
            />
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.historyTitle}>
          <Text style={{ color: colors.text }}>最近搜索</Text>
          <TouchableOpacity onPress={handleClearHistoryList}>
            <Icon name='x' size={20} color={colors.desc} />
          </TouchableOpacity>
        </View>
        <View style={styles.historyList}>
          {base.searchHistoryList.map((item, key) => {
            return (
              <TouchableOpacity style={{ marginRight: 10 }} key={key} onPress={() => handleJumpSearch(item)}>
                <Text style={[styles.historyItem, { backgroundColor: colors.card, color: colors.text }]}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            )
          })}
          {!base.searchHistoryList.length ? (
            <Empty desc='暂无搜索记录' image={require('~/assets/empty/Search.png')} />
          ) : null}
        </View>
      </View>
    </View>
  )
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
  content: {
    flex: 1,
    width: '100%'
  },
  historyTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    alignItems: 'center'
  },
  historyList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10
  },
  historyItem: {
    fontSize: 16,
    padding: 6,
    paddingRight: 12,
    paddingBottom: 6,
    paddingLeft: 12
  }
})

export default Search
