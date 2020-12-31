import React from 'react'
import { connect } from 'react-redux'
import { Text, View, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity, Image, TextInput } from 'react-native'
import { createOrderAction } from '~/redux/actions/orderAction'
import { createOrder, getSysPaymentList } from '~/service/order'
import { DefaultTheme } from '~/themes'
import { toMoney } from '~/utils/tools'
import wechat from 'react-native-wechat-lib'
import Checkbox from 'teaset/components/Checkbox/Checkbox'
import Icon from 'react-native-vector-icons/Feather'
import Drawer from 'teaset/components/Drawer/Drawer'
import ChangeRealDrawer from '~/views/Order/Confirmed/ChangeRealDrawer'
import { HeaderHeight } from '~/utils/common'
import CouponDrawer from './CouponDrawer'
import Toast from 'teaset/components/Toast/Toast'
import { getCartListAction } from '~/redux/actions/baseAction'

@connect(({ order, app, user }) => ({
  app,
  user,
  skuList: order.sku,
  currentOrderInfo: order.currentOrderInfo
}), (dispatch) => ({
  _createOrder (data, callback) {
    dispatch(createOrderAction(data, callback))
  },
  _getCartList () {
    dispatch(getCartListAction())
  }
}))
class ConfirmedOrder extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pointLoading: false,
      // 收货地址类型
      addressType: 'add',
      address: {},
      realInfo: undefined,
      // 订单金额
      orderPrice: 0,
      // 总金额
      totalPrice: 0,
      // 是否使用积分
      isPointsChecked: true,
      // 红包余额
      consumptionMoney: undefined,
      // 现金余额
      userBalanceMoney: undefined,
      // 支付方式
      payList: [],
      payType: undefined,
      // 优惠劵列表
      couponsList: [],
      selectCoupon: undefined,
      btnLoading: false,
      editRealModel: false
    }
  }

  componentDidMount () {
    this.initOrderInfo()
    this.getPayList()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.currentOrderInfo !== prevProps.currentOrderInfo) {
      this.initOrderInfo(this.props)
    }
  }

  openChangeRealDrawer () {
    const { realInfo } = this.state
    const { _createOrder, skuList } = this.props
    const realDrawer = Drawer.open(
      (
        <View style={{ paddingTop: HeaderHeight }}>
          <ChangeRealDrawer
            realInfo={realInfo}
            onClose={() => {
              _createOrder(skuList)
              realDrawer.close()
            }}
          />
        </View>
      ), 'top'
    )
  }

  /**
   * 初始化订单信息
   */
  initOrderInfo (nextProps) {
    const { currentOrderInfo: { orderPrice, consumptionMoney, consumptionMoneyScale, userAddress, userRealInfo, couponsList, selectCoupon } } = nextProps ||
    this.props
    let _defaultConsumptionMoney = 0
    let _addressType = 'add'
    let _address
    let _realInfo

    // 是否存在红包余额
    if (consumptionMoney) {
      const maxConsumptionMoney = Number(
        (orderPrice - 0.01) * (consumptionMoneyScale / 100))
      const minMoney = Math.min(maxConsumptionMoney, consumptionMoney)
      _defaultConsumptionMoney = minMoney.toFixed(2)
    }
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
    // 实名认证信息
    if (userRealInfo) {
      const { realName, identitycard, mobile, uriId } = userRealInfo
      _realInfo = {
        realName,
        uriId,
        identitycard,
        mobile
      }
    }
    this.setState({
      orderPrice: orderPrice - 0.01,
      consumptionMoney: _defaultConsumptionMoney,
      userBalanceMoney: '',
      addressType: _addressType,
      address: _address,
      realInfo: _realInfo,
      couponsList,
      selectCoupon
    }, () => {
      this.calculationTotalPrice()
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
   * 计算商品总价
   */
  calculationTotalPrice () {
    const { consumptionMoney, userBalanceMoney, orderPrice } = this.state
    let _price = orderPrice
    if (consumptionMoney > 0) {
      _price -= consumptionMoney
    }
    if (userBalanceMoney > 0) {
      _price -= userBalanceMoney
    }
    this.setState({
      totalPrice: _price + 0.01
    })
  }

  /**
   * 是否使用积分
   * @param checked
   */
  pointsChange ({ checked }) {
    const { skuList, _createOrder } = this.props
    if (this.state.pointLoading) return
    const _skuList = []
    skuList.forEach(item => {
      _skuList.push({
        ...item,
        isUseIntegral: checked ? 1 : 0,
        balanceMoney: 0,
        consumptionMoney: 0
      })
    })
    this.setState({ pointLoading: true })
    _createOrder(_skuList, () => {
      this.setState({ isPointsChecked: checked, pointLoading: false }, () => {
        this.initOrderInfo()
      })
    })
  }

  // 输入红包余额
  handlerConsumptionMoneyChange (value) {
    const { orderPrice } = this.state
    const { currentOrderInfo: { consumptionMoneyScale, consumptionMoney } } = this.props
    // 最大可输入
    const maxConsumptionMoney = (orderPrice * (consumptionMoneyScale / 100))
    // 余额
    const minMoney = Math.min(maxConsumptionMoney, consumptionMoney)
    // 是否输入金额
    const _value = Number(value) > +minMoney ? minMoney.toFixed(2) : value
    this.setState({ userBalanceMoney: '', consumptionMoney: _value + '' },
      () => {
        this.calculationTotalPrice()
      })
  }

  // 输入余额支付
  handleBalanceMoneyChange (value) {
    const { orderPrice, consumptionMoney } = this.state
    const { currentOrderInfo: { balanceMoney } } = this.props
    // 最大可输入
    const maxMoney = orderPrice - (consumptionMoney || 0)
    // 余额
    const money = balanceMoney.toFixed(2)
    const minMoney = Math.min(money, maxMoney)
    const _value = +value > +minMoney ? minMoney.toFixed(2) : value

    this.setState({ userBalanceMoney: _value + '' }, () => {
      this.calculationTotalPrice()
    })
  }

  selectCurrentCouponHandle ({ checked }, _item) {
    if (!checked) {
      this.notUseCouponHandle()
      return false
    }
    const { skuList, _createOrder } = this.props
    const _skuList = []
    skuList.forEach(item => {
      _skuList.push({
        ...item,
        couponId: _item.couponId,
        dcgdId: _item.dcgdId,
        balanceMoney: 0,
        consumptionMoney: 0
      })
    })
    _createOrder(_skuList, () => {
      this.setState({ couponModel: false }, () => {
        this.initOrderInfo()
      })
    })
  }

  notUseCouponHandle () {
    const { skuList, _createOrder } = this.props
    const _skuList = []
    skuList.forEach(item => {
      _skuList.push({
        ...item,
        couponId: -1,
        dcgdId: -1,
        balanceMoney: 0,
        consumptionMoney: 0
      })
    })
    _createOrder(_skuList, () => {
      this.setState({ couponModel: false }, () => {
        this.initOrderInfo()
      })
    })
  }

  /**
   * 提交订单
   */
  submitOrderHandle () {
    const { btnLoading, address, payType, isPointsChecked, userBalanceMoney, consumptionMoney } = this.state
    const { currentOrderInfo: { needIntegral, integralDiscountPrice, selectCoupon, couponsList }, skuList, navigation } = this.props
    if (btnLoading) return false
    this.setState({ btnLoading: true })
    const data = {
      uaId: address.id,
      payId: payType,
      integralState: isPointsChecked ? 1 : 0,
      needIntegral: isPointsChecked ? needIntegral : 0,
      integralDiscountPrice: isPointsChecked ? integralDiscountPrice : 0,
      isUseIntegral: isPointsChecked ? 1 : 0,
      couponId: selectCoupon,
      dcgdId: -1,
      skuArray: []
    }
    // 现金余额
    if (userBalanceMoney) {
      data.balanceMoney = userBalanceMoney
    }
    // 红包余额
    if (consumptionMoney) {
      data.consumptionMoney = consumptionMoney
    }
    // sku
    skuList.forEach(item => {
      data.skuArray.push({ skuId: item.skuId, number: item.number })
    })

    if (selectCoupon) {
      const _couponsList = couponsList.filter(
        item => item.couponId === selectCoupon)
      if (_couponsList.length) {
        data.dcgdId = _couponsList[0].dcgdId
      }
    }
    console.log('ok')
    if (this.props.user.isJuniorShop && this.props.user.shopId !== this.props.user.userId) {
      Alert.alert(
        '提示',
        '您已是VIP会员，不可在其他小店内下单；请在 我的-店铺切换，切换到自有小店！',
        [
          {
            text: '确认',
            onPress: () => {
              // TODO: 返回
              navigation.goBack()
            }
          }
        ]
      )
    } else {
      console.log(data)
      /*
      *
      * */
      createOrder(data).then(async ({ rel, msg, data: _data }) => {
        console.log(_data)
        if (rel) {
          const result = await wechat.pay(_data)
          console.log(result)
          if (result.errCode === 0) {
            navigation.navigate('orderSuccess')
          } else {
            Toast.fail(result.errStr)
          }
        } else {
          Toast.fail(msg)
          this.props._getCartList()
          if (msg === '支付调起失败，请联系店主') {
            navigation.navigate('orderList')
          }
        }
      }).finally(() => {
        this.setState({ btnLoading: false })
      })
    }
  }

  openCouponDrawer = () => {
    const { couponsList, selectCoupon } = this.state
    const couponDrawer = Drawer.open(
      <SafeAreaView style={{ height: 400, backgroundColor: '#fff' }}>
        <View style={{ width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
          <Text>优惠劵</Text>
          <TouchableOpacity onPress={() => couponDrawer.close()}>
            <Icon name='x' size={20} color='#777' />
          </TouchableOpacity>
        </View>
        <CouponDrawer
          data={couponsList}
          selectCoupon={selectCoupon}
          onChange={(item, sourceData) => {
            couponDrawer.close()
            this.selectCurrentCouponHandle(item, sourceData)
          }}
        />
        <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: 10, marginTop: 10 }} onPress={() => {
          couponDrawer.close()
          this.notUseCouponHandle()
        }}>
          <Text style={styles.couponBtn}>不使用优惠劵</Text>
        </TouchableOpacity>
      </SafeAreaView>, 'bottom')
  }

  /**
   * 订单商品
   * @return {JSX.Element}
   */
  renderOrderProduct () {
    const { currentOrderInfo: { products, tradeModelType } } = this.props
    return (
      <View style={styles.productContainer}>
        <Text style={styles.productTitle}>{tradeModelType}</Text>
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
    const { currentOrderInfo: { goodsPriceCount, freight, taxRate, orderMoney, tradeModel } } = this.props
    return (
      <View>
        <Text style={styles.itemTitle}>结算明细</Text>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>商品总价</Text>
          <Text style={styles.itemDesc}>￥{toMoney(goodsPriceCount || 0)}元</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>运费</Text>
          <Text style={styles.itemDesc}>￥{toMoney(freight || 0)}元</Text>
        </View>
        {tradeModel === 1 || tradeModel === 2 ? (
          <View style={styles.item}>
            <Text style={styles.itemLabel}>税金</Text>
            <Text style={styles.itemDesc}>￥{toMoney(taxRate || 0)}元</Text>
          </View>
        ) : null}
      </View>
    )
  }

  /**
   * 优惠
   * @return {JSX.Element}
   */
  renderDiscount () {
    const { currentOrderInfo: { integralDiscountPrice, userIntegral, needIntegral, couponsList, selectCoupon, couponPrice } } = this.props
    const { isPointsChecked } = this.state
    return (
      <View>
        <Text style={styles.itemTitle}>优惠</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {
          if (couponsList.length) {
            this.openCouponDrawer(couponsList)
          }
        }}>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>优惠劵</Text>
            <Text style={styles.itemDesc}>{couponsList.length ? (selectCoupon === -1 ? '不使用优惠劵' : `￥${couponPrice.toFixed(2)}`) : '无可用优惠劵'}</Text>
          </View>
        </TouchableOpacity>
        {integralDiscountPrice > 0 ? (
          <View style={styles.item}>
            <Text style={styles.itemLabel}>积分 <Text style={{ fontSize: 12, color: '#777' }}>共{userIntegral}可用{needIntegral}抵{integralDiscountPrice}</Text></Text>
            <Checkbox
              checked={isPointsChecked}
              uncheckedIcon={<Icon name='circle' size={20} color={DefaultTheme.colors.brand} />}
              checkedIcon={<Icon name='check-circle' size={20} color={DefaultTheme.colors.brand} />}
              onChange={checked => this.pointsChange({ checked })}
            />
          </View>
        ) : null}
      </View>
    )
  }

  /**
   * 余额支付
   * @return {JSX.Element|null}
   */
  renderMoreList () {
    const { currentOrderInfo: { consumptionMoney: _propsConsumptionMoney, balanceMoney, consumptionMoneyScale } } = this.props
    const { orderPrice, consumptionMoney, userBalanceMoney } = this.state
    const _consumptionMoney = orderPrice * (consumptionMoneyScale / 100)
    if (!_propsConsumptionMoney && !balanceMoney) return null

    return (
      <View>
        <Text style={styles.itemTitle}>余额支付</Text>
        {_propsConsumptionMoney ? (
          <View style={styles.item}>
            <Text style={styles.itemLabel}>余额红包<Text style={{ fontSize: 12, color: DefaultTheme.colors.desc }}>￥{toMoney(_propsConsumptionMoney)} 本单可用￥{toMoney(_consumptionMoney)}</Text></Text>
            <TextInput value={consumptionMoney} placeholder='请输入' onChangeText={this.handlerConsumptionMoneyChange.bind(this)} />
          </View>
        ) : null}
        {balanceMoney ? (
          <View style={styles.item}>
            <Text style={styles.itemLabel}>现金余额<Text style={{ fontSize: 12, color: DefaultTheme.colors.desc }}>￥{toMoney(balanceMoney)}</Text></Text>
            <TextInput value={userBalanceMoney} placeholder='请输入' onChangeText={this.handleBalanceMoneyChange.bind(this)} />
          </View>
        ) : null}
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
    const { currentOrderInfo: { userRealInfo }, navigation } = this.props
    const { totalPrice, address, couponModel, payList, payType, btnLoading, editRealModel } = this.state
    return (
      <SafeAreaView style={styles.page}>
        <ScrollView style={{ backgroundColor: '#f5f5f9', flex: 1 }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('address', { type: 'createOrder' })}>
            <View style={styles.address}>
              <Icon name='user' size={20} color={DefaultTheme.colors.desc} />
              {
                address ? (
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
          {userRealInfo ? (
            <View>
              <Text style={styles.realTitle}>买保税或直购商品，海关要求需填写订购人真实姓名及身份证</Text>
              <View style={styles.realContent}>
                <Text style={{ fontSize: 14, color: DefaultTheme.colors.text }}>订购人：{userRealInfo.realName} {userRealInfo.identitycard}</Text>
                <TouchableOpacity onPress={this.openChangeRealDrawer.bind(this)}>
                  <Text style={styles.realBtn}>修改</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {this.renderOrderProduct()}
          {this.renderDetails()}
          {this.renderDiscount()}
          {this.renderMoreList()}
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

export default ConfirmedOrder
