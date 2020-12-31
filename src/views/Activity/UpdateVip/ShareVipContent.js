import React, { useMemo, useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import { useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import CountDownButton from '~/components/CountDownCode'
import Toast from 'teaset/components/Toast/Toast'
import * as WeChat from 'react-native-wechat-lib'
import { authGetCode, updateLoginRecode } from '~/service/user'
import { freeUpgradeVip } from '~/service/updateVip'
import { useNavigation } from '@react-navigation/native'
import config from '~/config'
import Drawer from 'teaset/components/Drawer/Drawer'
import ShareDrawer, { generateSharePathHandle } from '~/components/ShareDrawer'

const ShareVipContent = (props) => {
  const { sourceData: { pullConfig, defaultPullConfig, creditMin, fans } } = props
  const user = useSelector(state => state.user)
  const { navigate } = useNavigation()
  const [mobile, setMobile] = useState(user.mobile)
  const [code, setCode] = useState(undefined)
  const [isCode, setIsCode] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)

  useMemo(() => {
    setMobile(user.mobile)
  }, [user.mobile])
  // 修改手机号
  const changeMobileHandle = (value) => {
    setMobile(value)
    if (value === user.mobile) {
      setIsCode(false)
    } else {
      setIsCode(true)
    }
  }
  // 获取短信验证码
  const handleGetCode = (shouldStartCounting) => {
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.fail('请正确输入手机号')
      return false
    }
    authGetCode(mobile).then(res => {
      const { rel, msg } = res
      if (rel) {
        shouldStartCounting(true)
        Toast.success('短信验证码已发送至您的手机！')
      } else {
        Toast.fail(msg)
      }
    })
  }
  // 免费升级vip
  const updateVipHandle = () => {
    const data = { phone: mobile }
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.fail('请正确输入手机号！')
      return false
    }
    if (isCode) {
      if (!code) {
        Toast.fail('请输入短信验证码！')
        return false
      } else {
        data.code = code
      }
    }
    setBtnLoading(true)
    freeUpgradeVip(data).then(res => {
      const { rel, msg } = res
      if (rel) {
        Toast.success(msg)
        updateLoginRecode({
          lastShopUserId: user.userId,
          shareId: user.shareId
        }).then(res => {
          const { rel } = res
          if (rel) {
            navigate('home', { time: new Date().getTime() })
          }
        })
      } else {
        Toast.fail(msg)
      }
    })
  }

  // 分享
  const shareInfo = (data) => {
    console.log(data)
    WeChat.shareMiniProgram({ ...data }).then(res => {
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  }

  const handleFilterShareData = (index, item) => {
    const _data = item || pullConfig.filter(i => i.isDefault === 1)[0] || pullConfig[0]
    const { pageUrl, fixValue, pageName, pageId, outTitle, outPic, displayMinPic } = _data
    const url = generateSharePathHandle(pageUrl, fixValue, pageName, pageId, user, user.userId)
    const title = outTitle || pageName
    const imageUrl = outPic || displayMinPic
    console.log('到这里了')
    shareInfo({
      title,
      userName: config.Applets.appId,
      path: url,
      thumbImageUrl: imageUrl,
      hdImageUrl: imageUrl,
      scene: index
    })
  }

  const openShareDrawer = (item) => {
    const shareDrawer = Drawer.open(
      <ShareDrawer
        onChange={(index) => {
          handleFilterShareData(index, item)
          shareDrawer.close()
        }}
        onClose={() => shareDrawer.close()}
      />,
      'bottom')
  }

  const speed = parseInt(((fans / creditMin) * 100).toString())
  const _fans = fans > creditMin ? 0 : creditMin - fans
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>邀请{creditMin}位粉丝立享特权</Text>
        <View style={styles.headerRow}>
          <Text style={{ fontSize: 10, color: '#fff' }}>当前粉丝 {fans}</Text>
          <Text style={{ fontSize: 10, color: '#fff' }}>还差{_fans}位粉丝升级</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
          <Text style={styles.headerLeavelLabel}>亲亲</Text>
          <View style={{ flex: 1, height: 2, backgroundColor: '#ea9994' }}>
            <View style={{ width: speed + '%', height: 2, backgroundColor: '#fdf9ee' }} />
          </View>
          <Text style={styles.headerLeavelLabel}>VIP店主</Text>
        </View>
        {(user.mobile && fans >= creditMin && !user.isJuniorShop) ? (
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>手机号码：</Text>
            <TextInput style={styles.input} maxLength={11} placeholder='请输入手机号码' value={mobile} onChangeText={changeMobileHandle} />
          </View>
        ) : null}
        {isCode ? (
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>验证码：</Text>
            <TextInput style={styles.input} placeholder='请输入验证码' value={code} onChangeText={v => setCode(v)} />
            <CountDownButton
              textStyle={{ fontSize: 12 }}
              style={{ backgroundColor: '#fff', height: 28, marginLeft: 10, borderRadius: 2, overflow: 'hidden' }}
              timerCount={120}
              timerTitle={'获取短信验证码'}
              enable={false}
              timerActiveTitle={['重新获取（', 's）']}
              disableColor='#333'
              onClick={(shouldStartCounting) => {
                handleGetCode(shouldStartCounting)
              }}
              timerEnd={() => {}}
            />
          </View>
        ) : null}
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {fans >= creditMin ? (
            user.isJuniorShop ? (
              <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold', height: 40, lineHeight: 40 }}>您已经是店主了</Text>
            ) : (
              <TouchableOpacity disabled={btnLoading} style={{ width: '80%' }} activeOpacity={0.9} onPress={updateVipHandle}>
                <Text style={styles.btn}>{btnLoading ? '升级中,请稍后...' : '免费升级'}</Text>
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity style={{ width: '80%' }} activeOpacity={0.9} onPress={() => openShareDrawer(defaultPullConfig)}>
              <Text style={styles.btn}>立即邀请</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ paddingTop: 20 }}>
        <Text style={styles.title}>快捷邀粉通道</Text>
        {pullConfig.map((item, key) => {
          return (
            <View style={styles.item} key={key}>
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                <Image source={{ uri: item.displayMinPic }} style={{ width: 22, height: 22 }} />
                <Text style={styles.itemText}>{item.displayMinTitle}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.9} onPress={() => openShareDrawer(item)}>
                <LinearGradient
                  colors={['rgb(238, 99, 102)', 'rgb(254, 157, 102)']}
                  start={{ x: 0, y: 0 }}
                  style={styles.itemBtn}
                  end={{ x: 1, y: 0 }}>
                  <Text style={{ fontSize: 12, color: '#fff' }}>立即分享</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  header: {
    backgroundColor: '#eb3b2c',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  headerTitle: {
    fontSize: 14,
    color: '#fff'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 24
  },
  headerLeavelLabel: {
    backgroundColor: '#fff',
    color: 'red',
    fontSize: 10,
    borderRadius: 6,
    overflow: 'hidden',
    paddingHorizontal: 4,
    paddingVertical: 2
  },
  inputWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
    marginBottom: 10
  },
  inputLabel: {
    width: 70,
    height: 40,
    textAlign: 'right',
    lineHeight: 40,
    color: '#fff',
    fontSize: 12
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden'
  },
  btn: {
    backgroundColor: '#fff',
    width: '100%',
    height: 30,
    color: '#ea3030',
    borderRadius: 15,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 30
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    color: '#9c7958',
    height: 40,
    lineHeight: 40,
    fontWeight: 'bold'
  },
  item: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 50,
    alignItems: 'center'
  },
  itemText: {
    fontSize: 12,
    marginLeft: 10,
    color: '#555'
  },
  itemBtn: {
    fontSize: 12,
    height: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  }
})
export default ShareVipContent
