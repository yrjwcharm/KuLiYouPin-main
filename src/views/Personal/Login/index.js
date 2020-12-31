import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native'
import * as Wechat from 'react-native-wechat-lib'
import { isIPhoneXFooter } from '~/utils/common'
import Toast from 'teaset/components/Toast/Toast'
import { getLoginCode } from '~/service/user'
import { useDispatch } from 'react-redux'
import CountDownButton from '~/components/CountDownCode'
import storage from '@react-native-community/async-storage'
import { closeUserTokenAction, getUserInfoAction, getUserTokenAction, wechatUserTokenAction } from '~/redux/actions/userAction'
import { getAppInfoAction, getShopInfoAction, getShopMaxRateAction } from '~/redux/actions/appAction'
import { getCartListAction } from '~/redux/actions/baseAction'

const MobileLogin = () => {
  const { colors } = useTheme()
  const dispatch = useDispatch()
  const { goBack } = useNavigation()
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [btnLoading, setBtnLoading] = useState(false)

  const handleLogin = () => {
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.show({
        text: '请输入正确的手机号码'
      })
      return false
    }
    if (!code || code.length !== 6) {
      Toast.show({
        text: '请输入短信验证码'
      })
      return false
    }
    setBtnLoading(true)
    const data = { code, mobilePhone: mobile }
    dispatch(getUserTokenAction(data)).then(() => {
      Toast.success('登陆成功')
      dispatch(getUserInfoAction()).then(() => {
        // 获取店铺信息比例相关信息
        dispatch(getAppInfoAction())
        dispatch(getShopInfoAction())
        dispatch(getShopMaxRateAction())
        // 获取购物车商品
        dispatch(getCartListAction())
        goBack()
      })
    })
  }
  // 获取短信验证码
  const handleGetCode = (shouldStartCounting) => {
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.show({
        text: '请输入正确的手机号码'
      })
      return false
    }
    getLoginCode(mobile).then(res => {
      const { rel, msg } = res
      if (rel) {
        shouldStartCounting(true)
        Toast.show({
          text: '短信验证码已发送至您的手机!'
        })
      } else {
        Toast.show({ text: msg })
      }
    })
  }
  // 微信授权登陆
  const otherLoginWeChatHandle = () => {
    const scope = 'snsapi_userinfo'
    const state = 'wechat_sdk_demo'
    Wechat.isWXAppInstalled().then((isInstalled) => {
      if (isInstalled) {
        // 发送授权请求
        Wechat.sendAuthRequest(scope, state).then(responseCode => {
          console.log(responseCode)
          dispatch(wechatUserTokenAction(responseCode.code)).then(() => {
            Toast.success('登陆成功')
            dispatch(getUserInfoAction()).then(() => {
              // 获取店铺信息比例相关信息
              dispatch(getAppInfoAction())
              dispatch(getShopInfoAction())
              dispatch(getShopMaxRateAction())
              // 获取购物车商品
              dispatch(getCartListAction())
              goBack()
            })
          })
        }).catch(err => {
          Alert.alert('登录授权发生错误：', err.message, [
            { text: '确定' }
          ])
        })
      } else {
        Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [
          { text: '确定' }
        ])
      }
    })
  }

  const cloneUserToken = () => {
    storage.removeItem('token', () => {
      dispatch(closeUserTokenAction())
    })
  }
  useEffect(() => {
    cloneUserToken()
  }, [])
  return (
    <View style={styles.page}>
      <View style={styles.wrap}>
        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <Text style={[styles.text, { color: colors.text }]}>手机号：</Text>
          <TextInput
            value={mobile}
            numberOfLines={1}
            keyboardType='number-pad'
            textContentType='telephoneNumber'
            maxLength={11}
            onChangeText={(value) => setMobile(value)}
            style={styles.input}
            placeholder='请输入手机号码'
          />
        </View>
        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <Text style={[styles.text, { color: colors.text }]}>验证码：</Text>
          <TextInput
            value={code}
            numberOfLines={1}
            maxLength={6}
            keyboardType='number-pad'
            onChangeText={value => setCode(value)}
            style={styles.input}
            placeholder='请输入验证码'
          />
          <CountDownButton
            textStyle={{ color: '#fff', fontSize: 12 }}
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
        <TouchableOpacity
          disabled={btnLoading}
          activeOpacity={0.9}
          style={{ width: '100%', marginTop: 10 }}
          onPress={handleLogin}
        >
          <View style={[styles.btn, { backgroundColor: btnLoading ? colors.desc : colors.brand }]}>
            <Text style={{ color: colors.brandText, fontSize: 16 }}>
              {btnLoading ? '登陆中.请稍后...' : '立即登陆'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.otherLogin}>
        <View style={styles.otherHead}>
          <View style={styles.line} />
          <Text style={[styles.otherText, { color: colors.desc }]}>其他登陆方式</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.otherLoginFooter}>
          <TouchableOpacity activeOpacity={0.9} onPress={otherLoginWeChatHandle}>
            <Image source={require('~/assets/wechat-icon.png')} style={styles.otherLoginIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'space-between'
  },
  wrap: {
    marginTop: 10
  },
  item: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'flex-start'
  },
  text: {},
  input: {
    flex: 1,
    fontSize: 16
  },
  btn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  otherLogin: {
    paddingBottom: isIPhoneXFooter(0)
  },
  otherHead: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    width: '20%',
    height: 1,
    backgroundColor: '#ddd'
  },
  otherText: {
    marginLeft: 10,
    marginRight: 10
  },
  otherLoginFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20
  },
  otherLoginIcon: {
    width: 30,
    height: 30
  }
})

export default MobileLogin
