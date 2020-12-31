import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'

/**
 * 生成分享路径
 * @param url
 * @param fixValue
 * @param title
 * @param pageId
 * @param user
 * @param _userId
 * @returns {string}
 */
export function generateSharePathHandle (url, fixValue, title, pageId, user, _userId) {
  let pagePath = ''
  switch (url) {
    case '/gift/list':
      // 免费领
      pagePath = `/pages/activity/giftList/index?title=${title}&itemValue=${pageId}&u=${user.userId ||
      _userId}&s=${user.shopId || _userId}`
      break
    case '/seckill':
      // 跳转秒杀页面
      pagePath = `/pages/activity/seckill/index?seckillId=${fixValue}&title=${title}&itemValue=${pageId}&u=${user.userId ||
      _userId}&s=${user.shopId || _userId}`
      break
    case '/attendance':
      // 签到
      pagePath = `/pages/activity/signIn/index?id=${fixValue}&title=${title}&itemValue=${pageId}&u=${user.userId ||
      _userId}&s=${user.shopId || _userId}`
      break
    case '/activity/point':
      // 积分换购
      pagePath = `/pages/activity/point/index?id=${fixValue}&title=${title}&itemValue=${pageId}&u=${user.userId ||
      _userId}&s=${user.shopId || _userId}`
      break
    case '/updateVip':
      // 升级vip
      pagePath = `/pages/other/memberUpgrade1/index?id=${fixValue}&u=${user.userId ||
      _userId}&s=${user.shopId || _userId}`
      break
    case '/activity/ceremony-people':
      // 1元购
      pagePath = `/pages/other/CeremonyPeople/index?id=${fixValue}&u=${user.userId ||
      _userId}&s=${user.shopId || _userId}`
      break
    case '/home':
      // 首页
      pagePath = `/pages/tabbar/home/index?id=${fixValue}&u=${user.userId ||
      _userId}&s=${user.shopId || _userId}`
      break
  }
  return pagePath
}

const ShareDrawer = (props) => {
  const { onClose, onChange } = props
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <Text style={styles.title}>分享</Text>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => onChange(0)}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/share-0.png')} />
            <Text style={styles.itemText}>分享到好友</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChange(1)}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/share-1.png')} />
            <Text style={styles.itemText}>分享到朋友圈</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onChange(2)}>
          <View style={styles.item}>
            <Image style={styles.itemImage} source={require('~/assets/share-2.png')} />
            <Text style={styles.itemText}>分享到收藏</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cancelBtnWrap} onPress={onClose}>
        <Text style={styles.cancelBtn}>取消</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 44,
    color: '#333',
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff'
  },
  item: {
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemImage: {
    width: 50,
    height: 50
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6
  },
  cancelBtnWrap: {
    borderTopWidth: 6,
    borderTopColor: '#f5f5f9'
  },
  cancelBtn: {
    backgroundColor: '#fff',
    width: '100%',
    textAlign: 'center',
    lineHeight: 44,
    fontSize: 14,
    color: '#333'
  }
})

export default ShareDrawer
