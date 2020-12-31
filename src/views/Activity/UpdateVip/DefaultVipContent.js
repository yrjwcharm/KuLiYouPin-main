import React, { useEffect, useMemo, useState } from 'react'
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { authGetCode, bandingUserMobile, queryUpgradeRules, updateLoginRecode, updateUserRealInfo, upgradeVipPayMoney } from '~/service/user'
import Toast from 'teaset/components/Toast/Toast'
import { useNavigation } from '@react-navigation/native'
import { getSysPaymentList } from '~/service/order'
import { toMoney } from '~/utils/tools'
import * as WeChat from 'react-native-wechat-lib'
import CountDownButton from '~/components/CountDownCode'

const DefaultVipContent = () => {
  const { goBack } = useNavigation()
  const user = useSelector(state => state.user)
  const { navigate } = useNavigation()

  const [mobile, setMobile] = useState(user.mobile)
  const [updateBtn, setUpdateBtn] = useState(false)
  const [payId, setPayId] = useState(0)

  const [code, setCode] = useState(undefined)
  const [isCode, setIsCode] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [currentSkuId, setCurrentSkuId] = useState(undefined)

  const [data, setData] = useState({
    upgradeRules: {
      conditionType: 1
    },
    skuIds: [],
    redEnvelopes: [],
    coupons: []
  })

  // 升级规则
  const queryUpgradeRulesHandle = () => {
    queryUpgradeRules().then(res => {
      const { rel, data } = res
      if (rel) {
        const { conditionType, toolTips, statusVIP, skuIds, redEnvelopes, coupons } = data
        if (statusVIP && (+statusVIP === 1 || +statusVIP === 2 || +statusVIP === 3)) {
          Toast.info(toolTips)
          setUpdateBtn(false)
          // goBack()
        }

        if (conditionType === 2) {
          setData({
            upgradeRules: data,
            skuIds: skuIds || [],
            redEnvelopes: redEnvelopes || [],
            coupons: coupons || []
          })
        } else {
          setData({
            upgradeRules: data,
            skuIds: [],
            redEnvelopes: [],
            coupons: []
          })
        }
      } else {
        setData({
          upgradeRules: {
            conditionType: 1
          },
          skuIds: [],
          redEnvelopes: [],
          coupons: []
        })
      }
    })
  }
  // 支付方式
  const getPayList = () => {
    getSysPaymentList().then(res => {
      const { rel, data } = res
      if (rel && data.length) {
        setPayId(data[0].payId)
      } else {
        Toast.fail('获取支付方式失败！')
      }
    }).catch(() => {
      Toast.fail('获取支付方式失败')
    })
  }

  // 修改手机号
  const changeMobileHandle = value => {
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
      Toast.fail('请正确输入手机号！')
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

  // 绑定手机号
  const onBandingMobileHandle = () => {
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.fail('请正确输入手机号！')
      return false
    }
    if (isCode) {
      if (!code) {
        Toast.fail('请输入短信验证码！')
        return false
      }
      setBtnLoading(true)
      bandingUserMobile({ newPhone: mobile, code }).then(res => {
        const { rel, msg } = res
        if (rel) {
          if (data.skuIds.length > 1) {
            if (currentSkuId) {
              upgradeVipHandle(currentSkuId)
            } else {
              Toast.fail('请选择赠品！')
            }
          } else {
            upgradeVipHandle(data.skuIds[0].skuId)
          }
        } else {
          Toast.fail(msg)
        }
        setBtnLoading(false)
      })
    } else {
      setBtnLoading(true)
      updateUserRealInfo({ mobile }).then(res => {
        const { rel, msg } = res
        if (rel) {
          if (data.skuIds.length > 1) {
            if (currentSkuId) {
              upgradeVipHandle(currentSkuId)
            } else {
              Toast.fail('请选择赠品！')
            }
          } else {
            upgradeVipHandle(data.skuIds[0].skuId)
          }
        } else {
          Toast.fail('升级失败！')
        }

        setBtnLoading(false)
      })
    }
  }

  // 升级店主
  const upgradeVipHandle = (skuId) => {
    const params = payId !== -1 ? { payId, skuId } : { id: 1, skuId }
    upgradeVipPayMoney(params).then(res => {
      const { rel, data, msg } = res
      if (rel) {
        // 付费升级
        if (data && payId !== -1 && data.upgradeRules.conditionType === 2) {
          onBridgeReady(data)
        } else {
          Toast.success('升级成功！')
          updateLoginRecode({
            lastShopUserId: user.userId,
            shareId: user.shareId
          }).then(({ rel: _rel }) => {
            if (_rel) {
              navigate('home', { shopId: user.userId })
            }
          })
        }
      } else {
        Toast.fail(msg)
      }
    })
  }

  // 支付
  const onBridgeReady = (data) => {
    const { errCode, errStr } = WeChat.pay(data)
    if (errCode === 0) {
      Toast.success('升级成功！')
      updateLoginRecode({
        lastShopUserId: user.userId,
        shareId: user.shareId
      }).then(({ rel: _rel }) => {
        if (_rel) {
          navigate('home', { shopId: user.userId })
        }
      })
    } else {
      Toast.fail(errStr)
    }
  }

  useMemo(() => {
    setMobile(user.mobile)
  }, [user.mobile])

  useEffect(() => {
    queryUpgradeRulesHandle()
    getPayList()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {data.upgradeRules.conditionType === 2 ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: '#fff' }}>特权卡 ￥</Text>
            <Text style={{ fontSize: 20, color: '#fff', marginHorizontal: 5 }}>{toMoney(data.upgradeRules.payMoneyMin || 0)}</Text>
            <Text style={{ fontSize: 12, color: '#f5f5f9', textDecorationLine: 'line-through' }}>原价￥{toMoney(data.upgradeRules.payMoneyMin + 200 || 0)}</Text>
          </View>
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#fff', lineHeight: 24 }}>消费可获得等级积分，当前<Text>{user.payPoints}</Text>分</Text>
            <Text style={{ fontSize: 14, color: '#fff', lineHeight: 24 }}>
              等级积分满<Text>{data.upgradeRules.creditMin || 1000}</Text>可免费升级VIP店主
            </Text>
          </View>
        )}
        {user.mobile ? (
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
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          {user.isJuniorShop ? (
            <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold', height: 40, lineHeight: 40 }}>您已经是店主</Text>
          ) : (
            <TouchableOpacity style={{ width: '70%' }} onPress={onBandingMobileHandle}>
              <Text style={styles.btn}>升级VIP店主 ></Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {data.upgradeRules.conditionType === 2 && (data.skuIds.length || data.redEnvelopes.length || data.coupons.length) ? (
        <View>
          <Text style={styles.ruleTitle}>VIP店主升级赠品包({data.skuIds.length}选1)</Text>
          {data.skuIds.map((item, key) => {
            return (
              <TouchableOpacity activeOpacity={0.9} onPress={() => {
                setCurrentSkuId(item.skuId)
              }}>
                <View key={key} style={[styles.ruleItem, { borderWidth: 1, borderColor: item.skuId === currentSkuId ? 'red' : '#fff' }]}>
                  <Image source={{ uri: item.skuImageUrl || item.imageUrl }} style={styles.ruleItemImage} />
                  <View style={styles.ruleInfo}>
                    <Text style={styles.ruleItemTitle}>{item.productName}({item.specName})</Text>
                    <Text style={styles.ruleDesc}>升级后礼品中心领取</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
          <Text style={styles.ruleTitle}>VIP店主升级优惠礼包</Text>
          {data.redEnvelopes.map((item, key) => {
            return (
              <View style={styles.ruleItem} key={key}>
                <Image source={require('~/assets/common/gift-icon.png')} style={styles.ruleItemImage} />
                <View style={styles.ruleInfo}>
                  <Text style={styles.ruleItemTitle}>送{item.redEnvelopesValue}元现金红包</Text>
                  <Text style={styles.ruleDesc}>下单时可抵扣部分订单金额</Text>
                  <Text style={styles.ruleDesc}>升级后自动获得</Text>
                </View>
              </View>
            )
          })}
          {data.coupons.length ? (
            <View style={styles.ruleItem}>
              <Image source={require('~/assets/common/money-icon.png')} style={styles.ruleItemImage} />
              <View style={styles.ruleInfo}>
                <Text style={styles.ruleItemTitle}>送优惠劵礼包</Text>
                <View>
                  {data.coupons.map((item, key) => {
                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 7 }} key={key}>
                        <Text style={{ fontSize: 14, color: 'red' }}>{item.couponName} x {item.quantity}</Text>
                        <Text style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{item.effectiveEnd}</Text>
                      </View>
                    )
                  })}
                </View>
                <Text style={styles.ruleDesc}>升级后自动获得</Text>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  header: {
    width: '100%',
    backgroundColor: '#eb3b2c',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  inputWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
    marginBottom: 6
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
  ruleTitle: {
    height: 50,
    lineHeight: 50,
    color: '#333',
    fontSize: 14
  },
  ruleItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    padding: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  ruleItemImage: {
    width: 60,
    height: 60
  },
  ruleInfo: {
    flex: 1,
    marginLeft: 10
  },
  ruleItemTitle: {
    color: '#333'
  },
  ruleDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 6
  }
})
export default DefaultVipContent
