import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView, ImageBackground, Image, TouchableOpacity } from 'react-native'
import NavigationBar from 'teaset/components/NavigationBar/NavigationBar'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { pullNewConfig } from '~/service/updateVip'
import ShareVipContent from '~/views/Activity/UpdateVip/ShareVipContent'
import DefaultVipContent from '~/views/Activity/UpdateVip/DefaultVipContent'

const UpdateVip = (props) => {
  const { route: { params } } = props
  const user = useSelector(state => state.user)
  const { colors } = useTheme()
  const [isPullNewConfig, setIsPullNewConfig] = useState(true)
  const [current, setCurrent] = useState(2)
  const [data, setData] = useState({
    pullConfig: [],
    defaultPullConfig: {},
    creditMin: 0,
    fans: 0
  })

  const getCreateUserIdHandle = () => {
    return '69' + user.userId + String(user.userId / 3).substring(0, 2)
  }

  const getUpdateInfo = (flag) => {
    pullNewConfig().then(res => {
      const { rel, data: { pullNew, creditMin, total } } = res
      if (rel && flag) {
        const _dpc = pullNew.filter(i => i.isDefault === 1)[0] || pullNew[0]
        setData({
          pullConfig: pullNew || [],
          defaultPullConfig: _dpc,
          creditMin: Number(creditMin),
          fans: Number(total)
        })
      } else {
        setIsPullNewConfig(false)
        setCurrent(0)
      }
    })
  }

  useEffect(() => {
    let flag = true
    getUpdateInfo(flag)
    return () => {
      flag = false
    }
  }, [user])

  return (
    <View style={styles.page}>
      <LinearGradient colors={['#f5f5f5', '#fdf9ee']} style={{ flex: 1 }}>
        {!params?.hideHeader ? (
          <NavigationBar title='升级VIP店主' style={{ backgroundColor: colors.card, position: 'relative' }} titleStyle={{ color: colors.text }} />
        ) : null}
        <ScrollView>
          <ImageBackground resizeMode='cover' style={styles.headerBg} source={require('~/assets/member-icon/member-upgrade-header-bg.png')}>
            <Image style={styles.avatar} source={{ uri: user.avatar }} />
            <View style={styles.headerInfo}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.brandText }}>{user.nickName}</Text>
                <Text style={[styles.name, { backgroundColor: '#fff', color: colors.brand }]}>{user.levelName || '普通会员'}</Text>
              </View>
              <Text style={{ fontSize: 12, color: colors.brandText, marginTop: 10 }}>
                ID:{getCreateUserIdHandle()}
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.rule}>
            <View style={styles.ruleWrap}>
              <Text style={styles.ruleTitle}>您好，升级VIP店主享受多重权益哦！</Text>
              <View style={styles.ruleList}>
                <View style={styles.ruleItem}>
                  <Image source={require('~/assets/member-icon/icon1.png')} style={styles.ruleItemImage} />
                  <Text style={styles.ruleItemTitle}>专属福利</Text>
                  <Text style={styles.ruleItemLabel}>每月赠劵优惠</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Image source={require('~/assets/member-icon/icon2.png')} style={styles.ruleItemImage} />
                  <Text style={styles.ruleItemTitle}>自购省钱</Text>
                  <Text style={styles.ruleItemLabel}>全场VIP特价</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Image source={require('~/assets/member-icon/icon3.png')} style={styles.ruleItemImage} />
                  <Text style={styles.ruleItemTitle}>分享赚钱</Text>
                  <Text style={styles.ruleItemLabel}>最高20%佣金</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Image source={require('~/assets/member-icon/icon4.png')} style={styles.ruleItemImage} />
                  <Text style={styles.ruleItemTitle}>轻松创业</Text>
                  <Text style={styles.ruleItemLabel}>0库存 不囤货</Text>
                </View>
              </View>
            </View>
          </View>
          {isPullNewConfig ? (
            <View style={styles.memberTabs}>
              <TouchableOpacity style={{ width: '48%' }} onPress={() => setCurrent(1)}>
                <View style={[styles.memberTabItem, { backgroundColor: current === 1 ? '#eb3b2c' : '#ee6366' }]}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>付费升店主</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '48%' }} onPress={() => setCurrent(2)}>
                <View style={[styles.memberTabItem, { backgroundColor: current === 2 ? '#eb3b2c' : '#ee6366' }]}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>免费做店主</Text>
                  <Image style={styles.memberTabItemImage} source={require('~/assets/member-icon/hot-icon.png')} />
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          {current === 2 ? (
            <ShareVipContent sourceData={data} />
          ) : <DefaultVipContent />}
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  headerBg: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 100,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 25,
    overflow: 'hidden'
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 12,
    marginLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
    overflow: 'hidden'
  },
  rule: {
    paddingLeft: 18,
    paddingRight: 18,
    marginTop: -80
  },
  ruleWrap: {
    backgroundColor: '#ffe9d6',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20
  },
  ruleTitle: {
    width: '100%',
    color: '#9e7956',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    fontSize: 14,
    height: 40,
    lineHeight: 40
  },
  ruleList: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  ruleItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ruleItemImage: {
    width: 40,
    height: 40
  },
  ruleItemTitle: {
    color: '#9e7956',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8
  },
  ruleItemLabel: {
    fontSize: 10,
    color: '#9e7956',
    marginTop: 5
  },
  memberTabs: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  memberTabItem: {
    flex: 1,
    backgroundColor: 'red',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    overflow: 'hidden'
  },
  memberTabItemImage: {
    position: 'absolute',
    right: 20,
    width: 22,
    height: 22,
    top: 0
  }
})
export default UpdateVip
