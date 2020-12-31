import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import CountDownButton from '~/components/CountDownCode'
import { useTheme } from '@react-navigation/native'
import Toast from 'teaset/components/Toast/Toast'
import { authGetCode, authRealInfo, updateUserRealInfo } from '~/service/user'
import { validateCard } from '~/utils/functional'

const ChangeRealDrawer = ({ realInfo, onClose }) => {
  const { colors } = useTheme()
  const [realName, setRealName] = useState(realInfo.realName)
  const [identityCard, setIdentityCard] = useState(realInfo.identitycard)
  const [mobile, setMobile] = useState(realInfo.mobile)
  const [code, setCode] = useState(undefined)
  const [isCode, setIsCode] = useState(false)
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
  const changeMobileHandle = (v) => {
    setMobile(v)
    if (v !== realInfo.mobile) {
      setIsCode(true)
    } else {
      setIsCode(false)
    }
  }
  /**
   * 提交修改
   * @return {boolean}
   */
  const handleSubmit = () => {
    // if (!/^[\u4e00-\u9fa5]{2,5}$/.test(realName)) {
    //   Toast.fail('请正确输入姓名')
    //   return false
    // }
    if (!validateCard(identityCard)) {
      Toast.fail('请正确输入身份证号码')
      return false
    }
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.fail('请正确输入手机号码')
      return false
    }
    if (isCode) {
      if (!code) {
        Toast.fail('请输入短信验证码')
        return false
      }
    }
    const _data = {
      realName: realName,
      identitycard: identityCard,
      mobile: mobile
    }
    _data.uriId = realInfo.uriId
    setLoading(true)
    console.log(_data)
    if (isCode) {
      authRealInfo(_data).then(({ rel, msg }) => {
        if (rel) {
          Toast.success(msg)
          onClose()
        } else {
          Toast.fail(msg)
        }
      }).catch(() => {
        Toast.fail('出错了')
      }).finally(() => {
        setLoading(false)
      })
    } else {
      updateUserRealInfo(_data).then(({ rel, msg }) => {
        if (rel) {
          Toast.success(msg)
          onClose()
        } else {
          Toast.fail(msg)
        }
      }).catch(() => {
        Toast.fail('出错了')
      }).finally(() => {
        setLoading(false)
      })
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>实名认证</Text>
      <Text style={styles.desc}>请填写姓名与身份证对应的真实信息</Text>
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
          onChangeText={changeMobileHandle}
          style={styles.input}
          placeholder='请输入手机号码'
        />
      </View>
      {isCode ? (
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
      ) : null}
      <TouchableOpacity disabled={loading} onPress={handleSubmit}>
        <Text style={styles.btn}>{loading ? '请稍后...' : '保存'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  title: {
    height: 44,
    lineHeight: 44,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  desc: {
    fontSize: 14,
    color: '#DE8C17',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15
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
    flex: 1
  },
  btn: {
    width: '100%',
    height: 44,
    backgroundColor: '#e93b3d',
    textAlign: 'center',
    lineHeight: 44,
    marginTop: 10,
    color: '#fff',
    fontSize: 16
  }
})

export default ChangeRealDrawer
