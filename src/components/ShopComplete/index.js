import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { DefaultTheme } from '~/themes'
import { width } from '~/utils/common'
import { handleGenerateSkuDTOList, handleGenerateSkuTree } from '~/utils/shopUtils'
import { getProductFirstMoney } from '~/service/product'
import { addCart } from '~/service/common'
import { connect } from 'react-redux'
import { getCartListAction } from '~/redux/actions/baseAction'
import Button from 'teaset/components/Button/Button'
import Toast from 'teaset/components/Toast/Toast'

@connect(({ common, user, app }) => ({
  common,
  user,
  app
}), (dispatch) => ({
  _getCartList () {
    dispatch(getCartListAction())
  }
}))
class ShopComplete extends Component {
  constructor (props) {
    super(props)
    const { sourceData: { scProductsSkuSpecList, skuDTOList } } = props
    // 生成sku 对应数据
    const skuTree = handleGenerateSkuTree(scProductsSkuSpecList)
    // 所有规格商品
    const skuList = handleGenerateSkuDTOList(skuDTOList)
    this.state = {
      urls: [],
      // 规格 list
      sku: [],
      //  DTO sku list
      list: [],
      // 禁用 sku
      disabledSku: [],
      // 当前选中
      selectedSku: {
        s1: undefined,
        s2: undefined
      },
      // 当前选中sku
      selectedSkuComb: undefined,
      productLSPrice: {},
      primaryStorePrice: undefined,
      btnLoading: false
    }
  }

  static defaultProps = {
    sourceData: {
      minMaxPrice: {
        minPrice: 0.00,
        maxPrice: 0.00
      }
    }
  }

  static propTypes = {
    sourceData: PropTypes.object
  }

  componentDidMount () {
    const { sourceData: { productId, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, scProductsSkuSpecList, skuDTOList } } = this.props
    // 获取商品初级店铺价格
    getProductFirstMoney(productId).then(respone => {
      if (respone.rel && respone.status === 200) {
        this.setState({
          productLSPrice: respone.data,
          primaryStorePrice: respone.data.minPriceInShop
        })
      }
    })
    this.setState({
      urls: [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5],
      sku: handleGenerateSkuTree(scProductsSkuSpecList),
      list: handleGenerateSkuDTOList(skuDTOList)
    })
  }

  /**
   * 选中规格 设置当前规格
   * @param ks
   * @param id
   */
  handleCheckedCurrentSku (ks, id) {
    const { list, selectedSku } = this.state
    let selectedSkuComb = {}
    // 当前选中规格组合
    const _selectedSku = selectedSku
    _selectedSku[ks] = selectedSku[ks] === id ? undefined : id
    this.setState({ selectedSku: _selectedSku }, () => {
      const _ck = this.state.selectedSku
      selectedSkuComb = list.find(item => {
        return item.s1 === _ck.s1 && item.s2 === _ck.s2
      })
      this.setState({ selectedSkuComb })
    })
  }

  /**
   * 添加购物车
   */
  handleAddCart () {
    const { _getCartList } = this.props
    const { selectedSkuComb } = this.state
    if (!selectedSkuComb || !selectedSkuComb.id) {
      Toast.fail('请选择商品规格！')
      return false
    }
    // 当前用户是高级店铺，并且不在自己店铺时
    if (this.props.user.isJuniorShop && this.props.user.shopId !== this.props.user.userId) {
      Toast.info('您已是VIP会员，不可在其他小店内下单；请在 我的-店铺切换，切换到自有小店！')
    } else {
      if (selectedSkuComb.price > 0) {
        this.setState({ btnLoading: true }, () => {
          addCart({ skuId: selectedSkuComb.id, num: 1 }).then(res => {
            const { rel, msg } = res
            if (rel) {
              _getCartList()
              this.setState({ btnLoading: false })
              Toast.success(msg)
            } else {
              Toast.fail(msg)
            }
          })
        })
      } else {
        Toast.fail('您选择的商品为VIP专享，升级VIP后即可购买！')
      }
    }
  }

  renderProductFooter () {
    const { btnLoading, selectedSkuComb, productLSPrice } = this.state
    const { sourceData, user, app } = this.props
    const { minMaxPrice: { minPrice, maxPrice } } = sourceData
    const _rate = 1 - (app.rate / 100)
    const _rateBack = 1 + (app.rate / 100)
    const _skuPrice = selectedSkuComb ? selectedSkuComb.price / 100 : 0
    let _price = ''
    let _vip = ''
    let _retail = ''
    if (minPrice === maxPrice) {
      _price = '￥' + Number(minPrice).toFixed(2)
      _vip = selectedSkuComb ? '￥' + (_skuPrice * _rate).toFixed(2) : '￥' +
        (minPrice * _rate).toFixed(2)
      _retail = selectedSkuComb
        ? '￥' + (productLSPrice[selectedSkuComb.id] || 0).toFixed(2)
        : '￥' + (productLSPrice.minPriceInShop || 0).toFixed(2)
    } else {
      _price = `￥${minPrice.toFixed(2)}~${maxPrice.toFixed(2)}`
      _vip = selectedSkuComb ? '￥' + (_skuPrice * _rate).toFixed(2) : '￥' +
        (minPrice * _rate).toFixed(2) + '~' + (maxPrice * _rate).toFixed(2)
      _retail = selectedSkuComb
        ? '￥' + (productLSPrice[selectedSkuComb.id] || 0).toFixed(2)
        : '￥' + (productLSPrice.minPriceInShop || 0).toFixed(2) + '~' +
        (productLSPrice.maxPriceInShop || 0).toFixed(2)
    }
    return (
      <View style={styles.footer}>
        <View style={styles.price}>
          <Text style={styles.priceText}>{user.userId === app.shopId ? '拿货价' : '抢货价'}：{selectedSkuComb ? '￥' + (selectedSkuComb.price / 100).toFixed(2) : _price}</Text>
          {user.userId === user.shopId && app.rate > 0 && (user.isJuniorShop || user.isMarketTing) ? (
            <Text style={styles.priceOrg}>零售价：{_retail}</Text>
          ) : null}
          {user.userId === user.shopId && app.dsp === 2 && !user.isMarketTing && !user.isJuniorShop ? (
            <View style={styles.priceRetail}>
              <Text style={styles.priceOrg}>VIP价：{_vip}</Text>
              <TouchableOpacity>
                <Text style={styles.updateVipBtn}>升级VIP</Text>
              </TouchableOpacity>
            </View>
          ) : (
            app.rate > 0 && !user.isMarketTing && !user.isJuniorShop && user.isUpgradeVip ? (
              <TouchableOpacity>
                <Text style={styles.updateVipBtn}>升级VIP享{(((1 / (1 + (app.rate / 100))) * 10) / user.discount).toFixed(1)}折</Text>
              </TouchableOpacity>
            ) : null
          )}
        </View>
        <Button
          type='primary'
          size='sm'
          disabled={btnLoading}
          style={{ backgroundColor: DefaultTheme.colors.brand, borderColor: DefaultTheme.colors.brand }}
          title='加购'
          onPress={() => this.handleAddCart()}
        />
      </View>
    )
  }

  render () {
    const {
      sourceData: {
        activeNames,
        give,
        recurrence,
        simpleName,
        productName,
        imageUrl1,
        imageUrl2,
        imageUrl3,
        imageUrl4,
        imageUrl5,
        brandLogoUrl,
        brandName
      }
    } = this.props
    const { sku, selectedSku } = this.state
    const { colors } = DefaultTheme
    const activeStyle = { backgroundColor: colors.brand, color: colors.brandText }
    const _wrapW = (width - 30) / 2

    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {activeNames ? (
            <Text style={[styles.activeName, activeStyle]}>
              &nbsp;{activeNames}&nbsp;
            </Text>
          ) : null}
          {give ? ' ' : ''}
          {give ? (
            <Text style={[styles.activeName, activeStyle]}>
              &nbsp;赠&nbsp;
            </Text>
          ) : null}
          {recurrence ? ' ' : ''}
          {recurrence ? (
            <Text style={[styles.activeName, activeStyle]}>
              &nbsp;返&nbsp;
            </Text>
          ) : null}
          &nbsp;{simpleName ? `【${simpleName}】` : ''}{productName}
        </Text>
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUrl1 }} style={[styles.image, { width: _wrapW, height: _wrapW }]} />
          <View style={styles.imageList}>
            <Image source={{ uri: imageUrl2 }} style={[styles.image, { width: (_wrapW - 10) / 2, height: (_wrapW - 10) / 2 }]} />
            <Image source={{ uri: imageUrl3 }} style={[styles.image, { width: (_wrapW - 10) / 2, height: (_wrapW - 10) / 2, marginLeft: 10 }]} />
            <Image source={{ uri: imageUrl4 }} style={[styles.image, { width: (_wrapW - 10) / 2, height: (_wrapW - 10) / 2, marginTop: 10 }]} />
            <Image source={{ uri: imageUrl5 }} style={[styles.image, { width: (_wrapW - 10) / 2, height: (_wrapW - 10) / 2, marginLeft: 10, marginTop: 10 }]} />
          </View>
        </View>
        <TouchableOpacity>
          <View style={styles.brandWrap}>
            <Image style={styles.brandLogo} source={{ uri: brandLogoUrl }} />
            <Text style={{ fontSize: 12, color: colors.text }}>{brandName}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.skuList}>
          {sku.map((item, key) => {
            return (
              <View style={styles.skuItem} key={key}>
                <Text style={[styles.skuItemTitle, { color: '#333' }]}>{item.k}</Text>
                <View style={styles.skuItemList}>
                  {item.v.map((_item, _key) => {
                    return (
                      <TouchableOpacity
                        style={{ marginRight: 10, marginBottom: 2 }}
                        key={_key}
                        activeOpacity={0.9}
                        onPress={() => this.handleCheckedCurrentSku(item.k_s, _item.id)}
                      >
                        <Text
                          style={[
                            styles.skuItemText, {
                              backgroundColor: +selectedSku[item.k_s] === +_item.id ? colors.brand : colors.background,
                              color: +selectedSku[item.k_s] === +_item.id ? colors.brandText : colors.text
                            }]}
                        >
                          {_item.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </View>
        {this.renderProductFooter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10
  },
  price: {
    flexDirection: 'column'
  },
  updateVipBtn: {
    fontSize: 10,
    color: '#e4393c',
    borderWidth: 1,
    borderColor: '#e4393c',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 5
  },
  priceOrg: {
    flexDirection: 'row',
    marginTop: 6,
    color: '#777',
    fontSize: 12
  },
  priceRetail: {
    justifyContent: 'flex-start'
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20
  },
  activeName: {
    fontSize: 12,
    marginRight: 5
  },
  imageWrap: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageList: {
    width: (width - 30) / 2,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  image: {
    padding: 2,
    borderWidth: 1,
    borderColor: '#f5f5f9'
  },
  brandWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6
  },
  brandLogo: {
    width: 20,
    height: 20,
    overflow: 'hidden',
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f5f5f9'
  },
  skuList: {
    paddingTop: 10
  },
  skuItemTitle: {
    fontSize: 14,
    paddingBottom: 16
  },
  skuItemList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  skuItemText: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 12,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 4
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceDefault: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    color: '#333'
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DefaultTheme.colors.brand
  }
})

export default ShopComplete
