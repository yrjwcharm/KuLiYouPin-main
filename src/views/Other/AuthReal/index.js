import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import Toast from 'teaset/components/Toast/Toast'
import { authGetCode, authRealInfo } from '~/service/user'
import { validateCard } from '~/utils/functional'
import CountDownButton from '~/components/CountDownCode'
import { useNavigation, useTheme } from '@react-navigation/native'

const AuthReal = () => {
  const { colors } = useTheme()
  const { goBack } = useNavigation()
  const [realName, setRealName] = useState(undefined)
  const [identityCard, setIdentityCard] = useState(undefined)
  const [mobile, setMobile] = useState(undefined)
  const [code, setCode] = useState(undefined)
  const [loading, setLoading] = useState(false)
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
  const handleSubmit = () => {
    if (!/^[\u4e00-\u9fa5]{2,4}$/.test(realName)) {
      Toast.fail('请正确输入姓名')
      return false
    }
    if (!validateCard(identityCard)) {
      Toast.fail('请正确输入身份证号码')
      return false
    }
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.fail('请正确输入手机号码')
      return false
    }
    if (!code) {
      Toast.fail('请输入短信验证码')
      return false
    }
    setLoading(true)
    authRealInfo({
      realName: realName,
      identitycard: identityCard,
      mobile: mobile,
      code: code
    }).then(({ rel, msg }) => {
      if (rel) {
        Toast.success('实名认证成功！,2秒后自动返回')
        setTimeout(() => {
          goBack()
        }, 2000)
      } else {
        Toast.fail(msg)
      }
    }).catch(() => {
      Toast.fail('出错了')
    }).finally(() => {
      setLoading(false)
    })
  }
  return (
    <View style={styles.page}>
      <ScrollView>
        <Text style={styles.tips}>提示：海关严格要求只有实名认证过的用户，才可正常进行海外购物，真实姓名和身份证号必须一致，否则将存在订单驳回风险</Text>
        <View style={[styles.item, { backgroundColor: colors.card, marginTop: 10 }]}>
          <Text style={[styles.text, { color: colors.text }]}>姓名</Text>
          <TextInput
            value={realName}
            numberOfLines={1}
            onChangeText={(value) => setRealName(value)}
            style={styles.input}
            placeholder='请输入姓名'
          />
        </View>
        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <Text style={[styles.text, { color: colors.text }]}>身份证号</Text>
          <TextInput
            value={identityCard}
            numberOfLines={1}
            onChangeText={(value) => setIdentityCard(value)}
            style={styles.input}
            placeholder='请输入身份证号码'
          />
        </View>
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
        <TouchableOpacity disabled={loading} style={{ paddingHorizontal: 10 }} onPress={handleSubmit}>
          <Text style={styles.btn}>{loading ? '请稍后...' : '保存'}</Text>
        </TouchableOpacity>
        <Text style={styles.desc}>我们承诺您的身份信息仅用于验证您的身份，我们将严格加密保管您的信息</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
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
  text: {
    width: 100
  },
  input: {
    flex: 1,
    height: 50
  },
  btn: {
    width: '100%',
    height: 44,
    backgroundColor: '#e93b3d',
    textAlign: 'center',
    lineHeight: 44,
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    borderRadius: 3,
    overflow: 'hidden'
  },
  tips: {
    padding: 10,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#f60',
    lineHeight: 22
  },
  desc: {
    padding: 10,
    fontSize: 12,
    color: '#666',
    lineHeight: 22
  }
})

export default AuthReal
