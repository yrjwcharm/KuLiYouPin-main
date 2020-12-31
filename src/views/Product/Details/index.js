import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Alert, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import ListRow from 'teaset/components/ListRow/ListRow'
import { HeaderHeight, HeaderStatusBarHeight, width } from '~/utils/common'
import { collectionProduct, getCurrentSelectSku, getProductFirstMoney, queryProductCouponList, saveCurrentSku, selectProductInfo } from '~/service/product'
import { isURL, toMoney } from '~/utils/tools'
import Carousel from 'teaset/components/Carousel/Carousel'
import LinearGradient from 'react-native-linear-gradient'
import Drawer from 'teaset/components/Drawer/Drawer'
import FooterDetail from '~/views/Product/Details/FooterDetail'
import Brand from '~/views/Product/Details/Brand'
import FooterAction from '~/views/Product/Details/FooterAction'
import HeaderInfo from '~/views/Product/Details/HeaderInfo'
import SkuSelectContent from '~/views/Product/Details/SkuSelectContent'
import { DefaultTheme } from '~/themes'
import CountDownTimer from '~/components/CountDownTimer'
import { handleGenerateSkuDTOList, handleGenerateSkuTree } from '~/utils/shopUtils'
import { connect } from 'react-redux'
import CouponModel from '~/views/Product/Details/CouponModel'
import Toast from 'teaset/components/Toast/Toast'
import GiftActivityContent from '~/components/GiftActivityContent'
import { addVisitItem, getCartListAction } from '~/redux/actions/baseAction'
import { addCart } from '~/service/common'
import { changeCurrentShop, updateLoginRecode } from '~/service/user'
import { getAppInfoAction, getShopInfoAction, getShopMaxRateAction } from '~/redux/actions/appAction'
import { getUserInfoAction } from '~/redux/actions/userAction'

@connect(({ app, user }) => ({
  app, user
}), (dispatch) => ({
  _getCartList () {
    dispatch(getCartListAction())
  },
  _initAppInfo () {
    dispatch(getAppInfoAction())
    dispatch(getShopInfoAction())
    dispatch(getShopMaxRateAction())
    dispatch(getUserInfoAction())
  },
  addHistoryProduct (data) {
    dispatch(addVisitItem(data))
  }
}))
class DetailsPage extends React.Component {
  constructor (props) {
    super(props)
    const { route: { params: { id, skuId } } } = props
    this.state = {
      _productId: id,
      _skuId: skuId,
      // 商品加载
      loading: false,
      // 加载状态
      error: false,
      // 商品主图
      mainImage: undefined,
      // 商品轮播
      swiperList: [],
      // 商品视频
      videoInfo: {
        url: undefined
      },
      // 品牌信息
      brandInfo: {
        brandLogoUrl: undefined,
        brandName: undefined,
        brandId: undefined
      },
      minMaxPrice: {
        minPrice: 0,
        maxPrice: 0
      },
      tradeModel: undefined,
      productLSPrice: {},
      primaryStorePrice: 0,
      // 商品分类
      typeName: undefined,
      // 商品标签
      activeNames: undefined,
      // 商品名称
      productName: undefined,
      // 是否收藏
      isSave: false,
      // 品质保证
      promise: '',
      // 商品描述
      description: '',
      templateTop: undefined,
      goodsTop: undefined,
      templateBottom: undefined,
      goodsBottom: undefined,
      // 商品标签
      labels: [],
      // 商品详情图片
      detailUrls: [],
      // 默认sku列表
      defaultSpecList: [],
      // sku 列表
      skuTree: [],
      // 组合商品
      skuList: [],
      selectedSku: undefined,
      selectedSkuComb: undefined,
      currentSpecInfo: '请选择商品规格',
      couponList: [],
      actGiftVos: undefined
    }
  }

  selectShopSku = undefined

  componentDidMount () {
    if (this.state._productId) {
      this.onLoadData(this.state._productId)
    }
  }

  /**
   * 初始化商品信息
   */
  onLoadData (id) {
    this.setState({ loading: true })
    selectProductInfo(id).then(({ rel, data }) => {
      if (!rel) {
        this.setState({ error: true })
        return false
      }
      this.props.addHistoryProduct({ ...data, key: data.productId })
      const {
        mianImage,
        slideShowList,
        videoUrl1,
        brandLogoUrl,
        brandName,
        brandId,
        typeName,
        activeNames,
        productName,
        isCollectGoods,
        imagesUrl,
        labels,
        isFolt,
        isRefundable,
        scProductsSkuSpecList,
        skuDTOList,
        description,
        templateTop,
        goodsTop,
        templateBottom,
        goodsBottom,
        minMaxPrice,
        tradeModel,
        actGiftVos
      } = data
      let text = ''
      text += isFolt ? '假一赔十' : ''
      text += isRefundable ? '、7天无理由退换货' : ''
      // 生成sku 对应数据
      const skuTree = handleGenerateSkuTree(scProductsSkuSpecList)
      // 所有规格商品
      const skuList = handleGenerateSkuDTOList(skuDTOList)
      const stateData = {
        mainImage: mianImage,
        defaultSpecList: scProductsSkuSpecList,
        swiperList: slideShowList.filter(url => isURL(url)),
        videoInfo: {
          url: videoUrl1
        },
        brandInfo: {
          brandLogoUrl,
          brandName,
          brandId
        },
        actGiftVos,
        minMaxPrice,
        tradeModel,
        typeName,
        activeNames,
        productName,
        description,
        templateTop,
        goodsTop,
        templateBottom,
        goodsBottom,
        isSave: !!isCollectGoods,
        promise: text,
        labels: labels ? labels.split(',') : [],
        detailUrls: imagesUrl,
        skuTree: skuTree,
        skuList: skuList
      }
      this.setState(stateData, async () => {
        this.getProductFirstMoney(id)
        // TODO: 判断是否选中sku
        await this.getShopSelectSku()
      })
    }).finally(() => {
      this.setState({ loading: false })
    })
  }

  /**
   * 获取商品最低价格
   * @param productId
   */
  getProductFirstMoney (productId) {
    getProductFirstMoney(productId).then(res => {
      const { rel, data } = res
      if (rel && data.minPriceInShop) {
        // 直接生成分享图
        this.setState({
          productLSPrice: data,
          primaryStorePrice: data.minPriceInShop
        })
      }
    })
  }

  async getShopSelectSku () {
    const { skuList, _productId, _skuId } = this.state
    const { rel, data } = await getCurrentSelectSku(_productId)
    if (_skuId || (rel && data)) {
      const skuId = _skuId || data
      const currentSku = skuList.filter(item => +item.id === +skuId)[0]
      const _state = {
        selectedSkuComb: currentSku,
        selectedSku: {
          selectedSkuComb: currentSku
        }
      }
      if (currentSku.s1) _state.selectedSku.s1 = currentSku.s1
      if (currentSku.s2) _state.selectedSku.s2 = currentSku.s2
      this.setState({
        ..._state,
        currentSpecInfo: this.filterCurrentSkuText(currentSku)
      }, () => {
        // 获取优惠劵列表
        this.getCouponListHandle()
      })
    }
  }

  filterCurrentSkuText (selectedSkuComb) {
    const { defaultSpecList } = this.state
    let _specText = '请选择商品规格'
    if (selectedSkuComb) {
      _specText = ''
      if (selectedSkuComb.s1) {
        defaultSpecList.forEach(item => {
          if (item.id === selectedSkuComb.s1) _specText += item.specName
        })
      }
      if (selectedSkuComb.s2) {
        defaultSpecList.forEach(item => {
          if (item.id === selectedSkuComb.s2) _specText += '、' + item.specName
        })
      }
    }
    return _specText
  }

  /**
   * 获取优惠劵列表
   */
  getCouponListHandle () {
    const { _productId, selectedSkuComb } = this.state
    const data = { productId: _productId }
    if (selectedSkuComb) {
      data.skuId = selectedSkuComb.id
    }
    queryProductCouponList(data).then(res => {
      const { rel, data } = res
      if (rel) {
        this.setState({ couponList: data })
      }
    })
  }

  // 导航
  renderHeaderNavBar () {
    const { navigation: { goBack } } = this.props
    return (
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={goBack}>
            <View style={[styles.headerBack, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <Icon name='chevron-left' size={24} color='#fff' />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleVipPrice (price, rate) {
    const _rate = (100 - rate) / 100
    return (price * _rate || 0).toFixed(2)
  }

  selectSkuChange (data) {
    this.setState({ selectedSkuComb: data.selectedSkuComb, selectedSku: data }, async () => {
      const { selectedSkuComb, _productId } = this.state
      if (selectedSkuComb) {
        await saveCurrentSku({
          productId: _productId,
          skuId: selectedSkuComb.id
        })
      }
      this.setState({
        currentSpecInfo: this.filterCurrentSkuText(selectedSkuComb)
      })
      // 获取优惠劵列表
      this.getCouponListHandle()
    })
  }

  renderCountDown () {
    const { selectedSkuComb } = this.state
    if (selectedSkuComb && selectedSkuComb.countDown > 0) {
      const downTime = new Date(new Date().getTime() + selectedSkuComb.countDown)
      return (
        <LinearGradient
          colors={['#ff6034', '#ee0a24']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.countDown}
        >
          <Text style={{ fontSize: 20, color: '#fff' }}>限时秒杀</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff' }}>距结束时间</Text>
            <CountDownTimer
              date={downTime}
              hours=':'
              mins=':'
              segs=''
              containerStyle={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}
              daysStyle={styles.time}
              hoursStyle={styles.time}
              minsStyle={styles.time}
              secsStyle={styles.time}
              firstColonStyle={styles.colon}
              secondColonStyle={styles.colon}
            />
          </View>
        </LinearGradient>
      )
    }
  }

  // 轮播
  renderSwiper () {
    const { swiperList } = this.state
    return (
      <View style={styles.swiper}>
        <Carousel
          carousel
          interval={5000}
          cycle
          control={
            <Carousel.Control
              style={{ alignItems: 'center', marginBottom: 5 }}
              dot={<Text style={[styles.swiperRadio, { backgroundColor: '#777' }]} />}
              activeDot={<Text style={[styles.swiperRadio, { backgroundColor: '#EF4034' }]} />}
            />
          }
          style={styles.swiperContent}
        >
          {swiperList.map((url, key) => {
            return (
              <View style={[styles.swiperContent, { backgroundColor: '#f5f5f5' }]} key={key}>
                <Image style={styles.swiperContent} resizeMode='cover' source={{ uri: url }} />
              </View>
            )
          })}
        </Carousel>
      </View>
    )
  }

  renderPrice () {
    const { app, user, navigation: { navigate } } = this.props
    const { minMaxPrice: { minPrice, maxPrice }, tradeModel, productLSPrice, selectedSkuComb } = this.state
    let _price = ''
    let _price2 = ''
    let _price3 = ''
    if (minPrice === maxPrice) {
      _price = '￥' + toMoney(minPrice || 0)
      _price2 = toMoney(productLSPrice.minPriceInShop || 0)
      _price3 = this.handleVipPrice(Number(minPrice), app.rate)
    } else {
      _price = `￥${toMoney(minPrice)}~${toMoney(maxPrice)}`
      _price2 = `${toMoney(productLSPrice.minPriceInShop || 0)}~${toMoney(productLSPrice.maxPriceInShop || 0)}`
      _price3 = `${this.handleVipPrice(Number(minPrice), app.rate)}~${this.handleVipPrice(Number(maxPrice), app.rate)}`
    }
    // 是否保税或者直购商品
    const isTradeModel = (+tradeModel === 1 || +tradeModel === 2)
    // 是否需要展示零售价
    const isLsjPrice = user.userId === user.shopId && (user.invitecode && (user.isMarketTing || user.isJuniorShop))
    // 高级店铺内是否需要展示vip价格
    const isVipPrice = !user.isMarketTing && !user.isJuniorShop && app.rate > 0 && app.dsp === 2 && user.userId === user.shopId
    const cjIsVip = user.userId !== user.shopId && !user.isMarketTing && !user.isJuniorShop && app.rate > 0 && user.isUpgradeVip
    return (
      <View style={styles.detailPrice}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Text style={styles.price}>{selectedSkuComb ? '￥' + (selectedSkuComb.price / 100 || 0).toFixed(2) : _price}</Text>
          {isLsjPrice ? (
            <Text style={styles.priceDiscounts}>
              零售价：{selectedSkuComb ? (productLSPrice[selectedSkuComb.id] || 0).toFixed(2) : _price2}
            </Text>
          ) : null}
          {isVipPrice ? (
            <Text style={styles.priceDiscounts}>
              VIP:{selectedSkuComb ? this.handleVipPrice((selectedSkuComb.price / 100), app.rate) : _price3}
            </Text>
          ) : null}
          {isVipPrice ? (
            <TouchableOpacity onPress={() => navigate('updateVip', { hideHeader: true })}>
              <Text style={styles.updateVipBtn}>升级VIP</Text>
            </TouchableOpacity>
          ) : null}
          {cjIsVip ? (
            <TouchableOpacity onPress={() => navigate('updateVip', { hideHeader: true })}>
              <Text style={styles.updateVipBtn}>升级VIP享{(((1 / (1 + (app.rate / 100))) * 10) / user.discount).toFixed(1)}折</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {isTradeModel ? (
          <View style={styles.tradeType}>
            <Icon name='alert-octagon' size={12} color='#888' />
            <Text style={{ fontSize: 12, color: '#888' }}>{selectedSkuComb ? `商品含税价：${((selectedSkuComb.price / 100) + toMoney(selectedSkuComb.taxRate))}元 税金：${toMoney(selectedSkuComb.taxRate)}元` : '价格未包含进口综合税'}</Text>
          </View>
        ) : null}
      </View>
    )
  }

  // 渲染服务
  renderService () {
    const { typeName, promise, currentSpecInfo } = this.state
    return (
      <View style={styles.serviceContainer}>
        <ListRow title='类型' detail={typeName} bottomSeparator='full' />
        <ListRow title='服务' detail={promise} bottomSeparator='full' />
        <ListRow title='已选' detail={currentSpecInfo} bottomSeparator='full' onPress={() => this.showShopSkuOverlay()} />
      </View>
    )
  }

  /**
   * 显示商品sku选择
   */
  showShopSkuOverlay () {
    const { skuList, skuTree, productName, mainImage, selectedSku, minMaxPrice } = this.state
    const { colors } = DefaultTheme
    this.selectShopSku = Drawer.open(
      <SkuSelectContent
        skuList={skuList}
        skuTree={skuTree}
        colors={colors}
        minMaxPrice={minMaxPrice}
        selectChange={this.selectSkuChange.bind(this)}
        onAddCart={this.handleAddCart.bind(this)}
        mainImage={mainImage}
        data={selectedSku}
        productName={productName}
      />, 'bottom')
  }

  /**
   * 打开优惠劵列表
   */
  openCouponModel () {
    const { couponList } = this.state
    const couponDrawer = Drawer.open(
      <View style={{ height: 400, backgroundColor: '#fff' }}>
        <View style={{ width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
          <Text>优惠</Text>
          <TouchableOpacity onPress={() => couponDrawer.close()}>
            <Icon name='x' size={20} color='#777' />
          </TouchableOpacity>
        </View>
        <CouponModel data={couponList} onChange={() => this.getCouponListHandle()} />
      </View>, 'bottom')
  }

  renderCouponList () {
    const { couponList } = this.state
    if (!couponList.length) return false
    return (
      <View style={{ marginTop: 10 }}>
        <ListRow title='优惠' detail={<View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          {couponList.map((item, key) => {
            return <Text style={styles.couponItem} key={key}>{item.couponName}</Text>
          })}
        </View>} bottomSeparator='none' onPress={this.openCouponModel.bind(this)} />
      </View>
    )
  }

  /**
   * 打开活动modal
   */
  openGiftVosHandle () {
    const { actGiftVos } = this.state
    const giftDrawer = Drawer.open(
      <View style={{ height: 400, backgroundColor: '#fff' }}>
        <View style={{ width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
          <Text>活动</Text>
          <TouchableOpacity onPress={() => giftDrawer.close()}>
            <Icon name='x' size={20} color='#777' />
          </TouchableOpacity>
        </View>
        <GiftActivityContent data={actGiftVos} />
      </View>, 'bottom')
  }

  renderGiftVos () {
    const { actGiftVos } = this.state
    const _vos = actGiftVos || []
    if (!_vos.length) return false
    return (
      <View style={{ marginTop: 10 }}>
        <ListRow
          title='活动'
          detail={(
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
              {_vos.map((item, key) => {
                return (
                  <View key={key} style={{ flexDirection: 'row' }}>
                    {item?.resultGiveList.length ? (
                      <Text style={styles.couponItem}>送赠品</Text>
                    ) : null}
                    {item.consumptionMoney ? (
                      <Text style={styles.couponItem}>返{item.consumptionMoney}元</Text>
                    ) : null}
                  </View>
                )
              })}
            </View>
          )}
          bottomSeparator='none'
          onPress={this.openGiftVosHandle.bind(this)}
        />
      </View>
    )
  }

  /**
   * 收藏商品
   */
  async onCollectionHandle () {
    const { _productId, isSave } = this.state
    const { rel, status } = await collectionProduct({ productId: _productId, status: !isSave ? 1 : 0 })
    if (rel) {
      this.setState({ isSave: !isSave })
      Toast.success(!isSave ? '收藏成功' : '已取消')
    } else {
      Toast.success('操作失')
    }
  }

  handleAddCart (skuNumber) {
    const { _getCartList, _initAppInfo } = this.props
    const { selectedSkuComb } = this.state
    if (!selectedSkuComb || !selectedSkuComb.id) {
      Toast.fail('请选择商品规格！')
      return false
    }
    const { isJuniorShop, shopId, userId } = this.props.user
    // 当前用户是高级店铺，并且不在自己店铺时
    if (isJuniorShop && shopId !== userId) {
      Alert.alert(
        '提示',
        '您已是VIP会员，在其他小店无法享受特价；是否帮您自动切换到自有小店内？',
        [
          {
            text: '立即切换',
            onPress: async () => {
              changeCurrentShop().then(response => {
                const { rel, data } = response
                if (rel) {
                  const shop = data.find(item => item.shopId === -1)
                  updateLoginRecode({
                    lastShopUserId: userId,
                    shareId: shop.parentId
                  }).then(res => {
                    const { rel } = res
                    if (rel) {
                      // 刷新用户信息
                      _initAppInfo()
                    }
                  })
                }
              })
            }
          }
        ]
      )
    } else {
      if (selectedSkuComb.price > 0) {
        this.setState({ btnLoading: true }, () => {
          addCart({ skuId: selectedSkuComb.id, num: skuNumber }).then(res => {
            const { rel, msg } = res
            if (rel) {
              _getCartList()
              this.setState({ btnLoading: false, skuSelectModel: false })
              this.selectShopSku.close()
              Toast.success(msg)
            } else {
              Toast.fail(msg)
            }
          })
        })
      }
    }
  }

  render () {
    const {
      productName,
      activeNames,
      labels,
      detailUrls,
      description,
      templateTop,
      goodsTop,
      templateBottom,
      goodsBottom,
      brandInfo,
      isSave
    } = this.state
    return (
      <SafeAreaView style={styles.container}>
        {this.renderHeaderNavBar()}
        <ScrollView>
          {this.renderSwiper()}
          {this.renderCountDown()}
          {this.renderPrice()}
          <HeaderInfo
            activeNames={activeNames}
            productName={productName}
            labels={labels}
          />
          {this.renderCouponList()}
          {this.renderGiftVos()}
          {this.renderService()}
          <Brand brandInfo={brandInfo} />
          <FooterDetail
            description={description}
            templateTop={templateTop}
            goodsTop={goodsTop}
            templateBottom={templateBottom}
            goodsBottom={goodsBottom}
            detailUrls={detailUrls}
          />
        </ScrollView>
        <FooterAction
          saveData={isSave}
          onAddCart={() => this.showShopSkuOverlay()}
          onShare={() => {}}
          onSave={this.onCollectionHandle.bind(this)}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  countDown: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  colon: {
    backgroundColor: 'rgba(0,0,0,0)',
    marginLeft: 5,
    marginRight: 5,
    color: '#fff'
  },
  time: {
    color: '#fff',
    fontSize: 16
  },

  detailPrice: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 5,
    flexDirection: 'row'
  },
  price: {
    fontSize: 20,
    color: '#e4393c',
    fontWeight: 'bold'
  },
  priceDiscounts: {
    color: '#999',
    fontSize: 12,
    marginLeft: 6
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
    marginLeft: 10
  },
  tradeType: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  couponItem: {
    fontSize: 10,
    borderWidth: 1,
    borderColor: '#e4393c',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 9,
    paddingRight: 9,
    color: '#e4393c',
    marginLeft: 8,
    marginBottom: 6
  },
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    zIndex: 8999,
    paddingTop: HeaderStatusBarHeight
  },
  headerContainer: {
    width: '100%',
    height: HeaderHeight,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerBack: {
    width: HeaderHeight - 10,
    height: HeaderHeight - 10,
    borderRadius: (HeaderHeight - 10) / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swiper: {
    width: width,
    height: width
  },
  swiperContent: {
    flex: 1
  },
  swiperRadio: {
    width: 10, height: 10, borderRadius: 5, marginLeft: 5, marginRight: 5, overflow: 'hidden'
  },
  serviceContainer: {
    marginTop: 10
  }
})

export default DetailsPage
