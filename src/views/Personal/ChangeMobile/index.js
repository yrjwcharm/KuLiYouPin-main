import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import Toast from 'teaset/components/Toast/Toast'
import { getUserInfoAction } from '~/redux/actions/userAction'
import { getAppInfoAction, getShopInfoAction, getShopMaxRateAction } from '~/redux/actions/appAction'
import { getCartListAction } from '~/redux/actions/baseAction'
import { authGetCode, bandingUserMobile } from '~/service/user'
import CountDownButton from '~/components/CountDownCode'

const changeMobile = () => {
  const dispatch = useDispatch()
  const { colors } = useTheme()
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
    const data = { code, newPhone: mobile }
    bandingUserMobile(data).then(res => {
      const { rel, msg } = res
      if (rel) {
        Toast.success(msg)
        dispatch(getUserInfoAction()).then(() => {
          // 获取店铺信息比例相关信息
          dispatch(getAppInfoAction())
          dispatch(getShopInfoAction())
          dispatch(getShopMaxRateAction())
          // 获取购物车商品
          dispatch(getCartListAction())
          goBack()
        })
      }
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
    authGetCode(mobile).then(res => {
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
  return (
    <View style={styles.page}>
      <View style={styles.content}>
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
              {btnLoading ? '绑定中.请稍后...' : '立即绑定'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  content: {
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
  }
})

export default changeMobile
