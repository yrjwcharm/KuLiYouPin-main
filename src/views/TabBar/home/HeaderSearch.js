import React, { useEffect } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useTheme } from '@react-navigation/native'
import PropTypes from 'prop-types'
import { HeaderHeight, HeaderStatusBarHeight, isIPhoneXFooter } from '~/utils/common'
import Drawer from 'teaset/components/Drawer/Drawer'
import BrandSearch from '~/views/TabBar/home/BrandSearch'

const HeaderSearch = ({ title }) => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  let drawerRef
  const handleJumpBrand = (item) => {
    drawerRef.close()
    navigate('brand', { brandId: item.brandId })
  }
  const onVisibleBrandModal = () => {
    drawerRef = Drawer.open((
      <View style={{
        width: 260,
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: HeaderStatusBarHeight,
        paddingBottom: isIPhoneXFooter(0)
      }}>
        <BrandSearch colors={colors} itemHandle={handleJumpBrand} />
      </View>
    ), 'left')
  }
  const onJumpMessage = () => {
    navigate('message')
  }
  useEffect(() => {

  })
  return (
    <View style={[styles.container]}>
      <View style={styles.content}>
        <TouchableOpacity onPress={onVisibleBrandModal}>
          <View style={styles.btn}>
            <Icon name='menu' size={24} color='#fff' />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchWrap} activeOpacity={0.9} onPress={() => navigate('search')}>
          <View style={styles.search}>
            <Icon name='search' size={16} color='#fff' />
            <Text style={styles.searchText}>{title}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onJumpMessage}>
          <View style={styles.btn}>
            <Icon name='message-square' size={24} color='#fff' />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: HeaderStatusBarHeight
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: HeaderHeight
  },
  btn: {
    width: HeaderHeight,
    height: HeaderHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchWrap: {
    flex: 1,
    height: HeaderHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  search: {
    flex: 1,
    height: 34,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20
  },
  searchText: {
    color: '#fff',
    marginLeft: 10
  }
})

HeaderSearch.propTypes = {
  title: PropTypes.string
}

export default HeaderSearch
