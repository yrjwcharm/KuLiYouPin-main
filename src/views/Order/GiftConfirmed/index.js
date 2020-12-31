import React from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity, Image } from 'react-native'
import { createGiftOrderItems, createOrder, getSysPaymentList } from '~/service/order'
import { DefaultTheme } from '~/themes'
import { toMoney } from '~/utils/tools'
import * as wechat from 'react-native-wechat-lib'
import Checkbox from 'teaset/components/Checkbox/Checkbox'
import Icon from 'react-native-vector-icons/Feather'
import Toast from 'teaset/components/Toast/Toast'

@connect(({ order }) => ({
  order
}))
class GiftConfirmed extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // 收货地址类型
      addressType: 'add',
      address: {},
      payList: [],
      totalPrice: 0,
      payType: undefined,
      products: [],
      freight: 0,
      btnLoading: false
    }
  }

  componentDidMount () {
    this.initOrderInfo()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.currentOrderInfo !== prevProps.currentOrderInfo) {
      this.initOrderInfo()
    }
  }

  /**
   * 初始化订单信息
   */
  initOrderInfo () {
    const { order: { currentGiftInfo: { userAddress, freight, products } } } = this.props
    let _addressType = 'add'
    let _address = {}
    // 是否存在收货地址
    if (userAddress) {
      const { consignee, mobile, province, city, district, address, uaId } = userAddress
      _addressType = 'edit'
      _address = {
        name: consignee,
        phone: mobile,
        address: province + city + district + address,
        id: uaId
      }
    }
    this.setState({
      addressType: _addressType,
      address: _address,
      totalPrice: freight,
      products,
      freight
    }, () => {
      this.getPayList()
    })
  }

  /**
   * 获取支付方式
   */
  async getPayList () {
    const { rel, data } = await getSysPaymentList()
    if (rel) {
      const payList = data.map(
        item => ({ label: item.payName, value: item.payId + '' }))
      this.setState({ payList, payType: data[0].payId + '' })
    }
  }

  /**
   * 提交订单
   */
  submitOrderHandle () {
    const { address, addressType, payType } = this.state
    const { order: { currentGiftInfo: { giftId }, navigation } } = this.props
    if (addressType === 'edit') {
      const data = {
        uaId: address.id,
        payId: payType,
        giftId
      }
      this.setState({ btnLoading: true })
      createGiftOrderItems(data).then(async res => {
        this.setState({ btnLoading: false })
        const { rel, data } = res
        if (rel) {
          if (!data) {
            navigation.navigate('orderList')
          } else {
            const result = await wechat.pay(data)
            console.log(result)
            if (result.errCode === 0) {
              navigation.navigate('orderSuccess')
            } else {
              Toast.fail(result.errStr)
            }
          }
        } else {
          Toast.fail('提单提交失败！')
        }
      })
    }
  }

  /**
   * 订单商品
   * @return {JSX.Element}
   */
  renderOrderProduct () {
    const { products } = this.state
    return (
      <View style={styles.productContainer}>
        {products.map((item, key) => {
          return (
            <View key={key} style={{ flexDirection: 'row', paddingVertical: 6 }}>
              <Image source={{ uri: item.skuImageUrl }} style={{ width: 120, height: 120 }} />
              <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: 5, flex: 1, paddingBottom: 5, paddingTop: 4 }}>
                <Text numberOfLines={2} style={styles.productName}>{item.productName}</Text>
                <Text style={styles.productDesc}>{item.specName1 + item.specName2}</Text>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: DefaultTheme.colors.brand }}>￥{toMoney(item.salePrice)}</Text>
                  <Text style={{ color: DefaultTheme.colors.text }}>x{item.number}</Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  /**
   * 订单详情
   * @return {JSX.Element}
   */
  renderDetails () {
    const { freight } = this.state
    return (
      <View>
        <Text style={styles.itemTitle}>结算明细</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>运费</Text>
          <Text style={styles.itemDesc}>￥{toMoney(freight || 0)}元</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>总金额</Text>
          <Text style={styles.itemDesc}>￥{toMoney(freight || 0)}元</Text>
        </View>
      </View>
    )
  }

  /**
   * 支付方式
   * @return {JSX.Element}
   */
  renderPayList () {
    const { payList, payType } = this.state
    return (
      <View>
        <Text style={styles.itemTitle}>支付方式</Text>
        {payList.map((item, key) => {
          return (
            <View style={styles.item} key={key}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Checkbox
                size='md'
                uncheckedIcon={<Icon name='circle' size={20} color={DefaultTheme.colors.brand} />}
                checkedIcon={<Icon name='check-circle' size={20} color={DefaultTheme.colors.brand} />}
                checked={payType === item.value}
                onChange={checked => {
                  this.setState({ payType: checked ? item.value : undefined })
                }}
              />
            </View>
          )
        })}
      </View>
    )
  }

  render () {
    const { navigation } = this.props
    const { addressType, address, btnLoading, totalPrice } = this.state
    return (
      <SafeAreaView style={styles.page}>
        <ScrollView style={{ backgroundColor: '#f5f5f9', flex: 1 }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('address', { type: 'createOrder' })}>
            <View style={styles.address}>
              <Icon name='user' size={20} color={DefaultTheme.colors.desc} />
              {
                addressType === 'edit' ? (
                  <View style={styles.addressInfo}>
                    <Text>{address.name} {address.phone}</Text>
                    <Text style={{ fontSize: 12, color: DefaultTheme.colors.desc, marginTop: 8 }}>{address.address}</Text>
                  </View>
                ) : (
                  <Text style={styles.addressInfoText}>添加联系人</Text>
                )
              }
              <Icon name='chevron-right' size={20} color={DefaultTheme.colors.desc} />
            </View>
          </TouchableOpacity>
          {this.renderOrderProduct()}
          {this.renderDetails()}
          {this.renderPayList()}
          <View style={{ height: 20 }} />
        </ScrollView>
        <View style={styles.footerAction}>
          <Text>合计：<Text style={{ color: DefaultTheme.colors.brand, fontWeight: 'bold', fontSize: 16 }}>￥{toMoney(totalPrice)}</Text></Text>
          <TouchableOpacity disabled={btnLoading} onPress={this.submitOrderHandle.bind(this)}>
            <Text style={styles.submitBtn}>{btnLoading ? '提交中...' : '提交订单'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#fff'
  },
  address: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  addressInfo: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  addressInfoText: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 14,
    color: DefaultTheme.colors.text
  },
  realTitle: {
    color: '#e4393c',
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 8,
    paddingTop: 15
  },
  realContent: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    alignItems: 'center'
  },
  realBtn: {
    borderWidth: 1,
    borderColor: DefaultTheme.colors.brand,
    color: DefaultTheme.colors.brand,
    fontSize: 12,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10
  },
  productContainer: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10
  },
  productTitle: {
    fontSize: 14,
    color: '#333',
    height: 30,
    lineHeight: 30
  },
  productName: {
    lineHeight: 20
  },
  productDesc: {
    fontSize: 12,
    backgroundColor: DefaultTheme.colors.auxiliaryText,
    color: DefaultTheme.colors.auxiliary,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8
  },
  couponBtn: {
    backgroundColor: DefaultTheme.colors.brand,
    color: '#fff',
    width: '100%',
    height: 44,
    lineHeight: 44,
    textAlign: 'center'
  },
  item: {
    flexDirection: 'row',
    backgroundColor: DefaultTheme.colors.card,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingLeft: 10,
    paddingRight: 10
  },
  itemTitle: {
    fontSize: 12,
    color: '#666',
    paddingTop: 14,
    paddingBottom: 6,
    paddingLeft: 10
  },
  itemLabel: {
    color: DefaultTheme.colors.text
  },
  itemDesc: {
    fontSize: 12,
    color: DefaultTheme.colors.desc
  },
  footerAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: DefaultTheme.colors.card,
    paddingBottom: 10,
    paddingTop: 10
  },
  submitBtn: {
    fontSize: 14,
    height: 32,
    lineHeight: 32,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: DefaultTheme.colors.brand,
    color: DefaultTheme.colors.brandText,
    borderRadius: 16,
    overflow: 'hidden'
  }
})

export default GiftConfirmed
