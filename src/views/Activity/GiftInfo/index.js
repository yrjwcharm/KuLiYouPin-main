import React from 'react'
import { View, StyleSheet, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { addGiftInfo, getGiftPage } from '~/service/activity'
import { connect } from 'react-redux'
import { authGetCode } from '~/service/user'
import Toast from 'teaset/components/Toast/Toast'
import { getProductFirstMoney } from '~/service/product'
import { DefaultTheme } from '~/themes'
import CountDownButton from '~/components/CountDownCode'

@connect(({ user }) => ({
  user
}))
class GiftInfo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      giftInfo: {
        productId: undefined,
        skuIds: [],
        activeNames: undefined,
        skuSpecName: [],
        productName: '',
        timeStart: '',
        timeEnd: '',
        getCycle: 0,
        userGetQuantityMax: 0,
        orderExpireDate: 0,
        remark: ''
      },
      maxPrice: 0.00,
      type: ['单次赠送', '每周赠送', '每月赠送'],
      mobile: undefined,
      code: undefined,
      time: 0,
      codeLoading: false,
      isCode: false,
      btnLoading: false
    }
  }

  componentDidMount () {
    this.init()
  }

  init () {
    getGiftPage({ actId: this.props.route.params.id }).then(res => {
      if (res.rel && res.data.rows.length) {
        this.setState({ giftInfo: res.data.rows[0] }, () => {
          const { giftInfo } = this.state
          getProductFirstMoney(giftInfo.productId).then(({ rel, data }) => {
            if (!rel) return
            const prices = []
            for (const skuId in data) {
              if (this.state.giftInfo.skuIds.includes(skuId + '')) {
                prices.push(+data[skuId + ''])
              }
            }
            this.setState({
              mobile: this.props.user.mobile,
              maxPrice: Math.max(...prices).toFixed(2) || 0.00
            })
          })
        })
      }
    })
  }

  handleMobileChange (value) {
    const { user: { mobile } } = this.props
    this.setState({ isCode: value + '' !== mobile + '', mobile: value })
  }

  handleCodeChange (code) {
    this.setState({ code })
  }

  handleSubmit () {
    const { navigation: { navigate } } = this.props
    const { mobile, isCode, code } = this.state
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.fail('请正确输入手机号！')
      return false
    }
    const data = {
      mobilePhone: mobile,
      actId: this.props.route.params.id
    }
    if (isCode) {
      if (code) {
        data.code = this.code
      } else {
        Toast.fail('请输入短信验证码！')
        return false
      }
    }
    this.setState({ btnLoading: true })
    addGiftInfo(data).then(res => {
      if (res.rel) {
        Toast.success('领取成功！请前往我的-礼品中心 正式领取！')
        setTimeout(() => {
          navigate('myGiftCenter')
        }, 2000)
      } else {
        Toast.fail(res.msg)
      }
    }).finally(() => {
      this.setState({ btnLoading: false })
    })
  }

  // 获取短信验证码
  handleMobileCode (shouldStartCounting) {
    const { mobile } = this.state
    if (!/^1[3456789]\d{9}$/.test(mobile)) {
      Toast.fail('请正确输入手机号！')
      return false
    }
    authGetCode(mobile).then(res => {
      const { rel, msg } = res
      if (rel) {
        shouldStartCounting(true)
        Toast.success('短信验证码已发送至您的手机!')
      } else {
        Toast.fail(msg)
      }
    })
  }

  render () {
    const { giftInfo, maxPrice, type, mobile, code, isCode, btnLoading } = this.state
    return (
      <View style={styles.page}>
        <ScrollView>
          <View style={{ alignItems: 'center', backgroundColor: '#fff' }}>
            <Text style={{ marginTop: 10, fontSize: 16 }}>恭喜您即将获得下面的商品赠送：</Text>
            <Image style={{ width: 120, height: 120 }} source={{ uri: giftInfo.imageUrl1 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: DefaultTheme.colors.brand, fontSize: 16 }}>￥0.00</Text>
              <Text style={{ fontSize: 12, textDecorationLine: 'line-through', marginLeft: 8, color: '#999' }}>
                原价：{maxPrice}
              </Text>
            </View>
            {giftInfo.consumptionMoney ? (
              <Text style={{ color: '#fff', backgroundColor: '#FF8F00', fontSize: 12, marginTop: 5, paddingHorizontal: 5, paddingVertical: 3 }}>订单完成返{giftInfo.consumptionMoney}元红包</Text>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '70%', flexWrap: 'wrap' }}>
              <Text style={{ marginTop: 7 }}>{giftInfo.activeNames ? <Text style={{ backgroundColor: '#e4393c', color: '#fff', fontSize: 12 }}>{giftInfo.activeNames}</Text> : null}&nbsp;{giftInfo.productName}</Text>
              {giftInfo.skuSpecName.map((item, key) => {
                return <Text style={{
                  backgroundColor: '#ccc',
                  color: '#fff',
                  paddingVertical: 2,
                  paddingHorizontal: 6,
                  fontSize: 12,
                  marginRight: 5,
                  marginBottom: 5
                }} key={key}>{item}</Text>
              })}
              {giftInfo.skuSpecName.length > 1 ? <Text style={{ color: '#999', fontSize: 12 }}>(多规格任选其一)</Text> : null}
            </View>
          </View>
          <View style={{ backgroundColor: '#fff', marginTop: 10, paddingHorizontal: 10, paddingVertical: 12 }}>
            <Text style={{ fontSize: 14, lineHeight: 30 }}>活动说明：</Text>
            <Text style={styles.desc}>1、活动时间：{giftInfo.timeStart}~{giftInfo.timeEnd}</Text>
            <Text style={styles.desc}>2、赠送周期：{type[giftInfo.getCycle - 1]}</Text>
            <Text style={styles.desc}>3、赠送次数：累计{giftInfo.userGetQuantityMax}次</Text>
            <Text style={styles.desc}>4、领取有效期：每次发放后{giftInfo.orderExpireDate}天内</Text>
            <Text style={styles.desc}>5、报名成功后：在我的-礼品中心 正式领取</Text>
            {giftInfo.remark ? (
              <Text style={styles.desc}>6、活动备注：{giftInfo.remark}</Text>
            ) : null}
          </View>
          <View>
            <View style={styles.item}>
              <Text style={styles.itemLabel}>手机号码</Text>
              <TextInput style={styles.itemInput} value={mobile} onChangeText={this.handleMobileChange.bind(this)} placeholder='请输入手机号码' />
            </View>
            {isCode ? (
              <View style={styles.item}>
                <Text style={styles.itemLabel}>验证码</Text>
                <TextInput style={styles.itemInput} value={code} onChangeText={this.handleCodeChange.bind(this)} placeholder='请输入验证码' />
                <CountDownButton
                  textStyle={{ color: '#fff', fontSize: 12 }}
                  timerCount={120}
                  timerTitle={'获取短信验证码'}
                  enable={mobile.length !== 11}
                  timerActiveTitle={['重新获取（', 's）']}
                  disableColor='#333'
                  onClick={(shouldStartCounting) => {
                    this.handleMobileCode(shouldStartCounting)
                  }}
                  timerEnd={() => {}}
                />
              </View>
            ) : null}
            {giftInfo.booleanReceive ? (
              <TouchableOpacity disabled>
                <Text style={[styles.btn, { opacity: 0.6 }]}>已领取</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity activeOpacity={0.9} disabled={btnLoading} onPress={this.handleSubmit.bind(this)}>
                <Text style={styles.btn}>立即领取</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  desc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 24
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: '#fff',
    marginTop: 10
  },
  itemLabel: {
    width: 80
  },
  itemInput: {
    flex: 1
  },
  btn: {
    width: '100%',
    height: 40,
    backgroundColor: '#e4393c',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10
  }
})

export default GiftInfo
