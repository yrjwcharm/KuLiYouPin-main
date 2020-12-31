import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, ScrollView, SafeAreaView } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native'
import { changeCurrentShop, updateLoginRecode } from '~/service/user'
import Drawer from 'teaset/components/Drawer/Drawer'
import Icon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux'
import Toast from 'teaset/components/Toast/Toast'
import Overlay from 'teaset/components/Overlay/Overlay'
import Label from 'teaset/components/Label/Label'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { width } from '~/utils/common'

const Struct = () => {
  let shopDrawer
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const { user, app } = useSelector(state => state)
  const [data, setData] = useState([])

  /**
   * 打开店铺列表
   */
  const openShopList = () => {
    shopDrawer = Drawer.open(
      <View style={{ height: 400, backgroundColor: '#fff' }}>
        <View style={{ width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
          <Text>店铺切换</Text>
          <TouchableOpacity onPress={() => shopDrawer.close()}>
            <Icon name='x' size={20} color='#777' />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            {data.map((item, key) => {
              return (
                <TouchableOpacity key={key} onPress={() => handleChangeShop(item, key)}>
                  <View style={styles.shopItem}>
                    <Image source={{ uri: item.logoUrl || item.headimgurl }} style={styles.shopImg} />
                    <Text style={styles.shopName}>{item.shopName || item.nickname}</Text>
                    {(!key && item.nowShop && item.shopName !== '访客店铺') ? (
                      <Text style={{ color: '#f84432', fontSize: 12 }}>当前店铺</Text>
                    ) : (
                      <Icon value='chevron-right' color='#888' size={16} />
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </SafeAreaView>
      </View>, 'bottom')
  }

  /**
   * 切换店铺
   * @param item  切换所属店铺
   * @param index 索引
   */
  const handleChangeShop = (item, index) => {
    if (index) {
      const { parentId, userId, isShop } = item
      // 更新最后访问店铺
      updateLoginRecode({
        lastShopUserId: isShop ? userId : user.userId,
        shareId: parentId || user.userId
      }).then(res => {
        const { rel } = res
        if (rel) {
          // 刷新首页
          shopDrawer.close()
          navigate('home', { shopId: isShop ? userId : user.userId })
        }
      })
    }
  }

  /**
   * 打开联系客服
   */
  const openServiceHandle = () => {
    const overlayView = (
      <Overlay.View
        style={{ alignItems: 'center', justifyContent: 'center' }}
        modal={false}
        overlayOpacity={0.6}
      >
        <View style={{ backgroundColor: '#fff', padding: 5, borderRadius: 15, alignItems: 'center' }}>
          <GetImageSizeComponent url={app.customerQrcodePath} imageWidth={width / 1.5} />
        </View>
      </Overlay.View>
    )
    Overlay.show(overlayView)
  }

  const initData = (flat) => {
    changeCurrentShop().then(res => {
      const { rel, data } = res
      if (rel && flat) {
        const list = []
        data.forEach(item => {
          if (item.shopName !== '访客店铺') {
            if (item.nowShop) {
              list.unshift(item)
            } else {
              list.push(item)
            }
          }
        })
        setData(list)
      }
    })
  }

  useEffect(() => {
    let flag = true
    initData(flag)
    return () => {
      flag = false
    }
  }, [])
  return (
    <View style={styles.content}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.itemBtn} onPress={() => navigate('collection')}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/spsc.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>商品收藏</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBtn} onPress={() => navigate('shopHistory')}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/lsll.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>历史浏览</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBtn} onPress={() => navigate('shopShareHistory')}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/zfjl.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>转发记录</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBtn} onPress={() => navigate('address')}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/shdz.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>收货地址</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBtn} onPress={openShopList}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/dpsc.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>店铺切换</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBtn} onPress={() => navigate('feedback')}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/gnfk.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>意见反馈</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBtn} onPress={() => Toast.fail('功能暂未开放！')}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/yhxy.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>用户协议</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemBtn} onPress={openServiceHandle}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/mine/lxkf.png')} />
            <Text style={[styles.itemText, { color: colors.text }]}>联系客服</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  container: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  itemBtn: {
    width: '25%'
  },
  item: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16
  },
  itemImage: {
    width: 28,
    height: 28
  },
  itemText: {
    fontSize: 12,
    marginTop: 12
  },
  shopItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9'
  },
  shopImg: {
    width: 50,
    height: 50,
    borderRadius: 5,
    overflow: 'hidden'
  },
  shopName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10
  }
})

export default Struct
