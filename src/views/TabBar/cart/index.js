import React, { useState, useEffect, useMemo } from 'react'
import { cloneDeep } from 'lodash'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import LikeMore from '~/components/LikeMore'
import NavigationBar from 'teaset/components/NavigationBar/NavigationBar'
import Checkbox from 'teaset/components/Checkbox/Checkbox'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useTheme } from '@react-navigation/native'
import Empty from '~/components/Empty'
import CountNumber from '~/views/TabBar/cart/CountNumber'
import { toMoney } from '~/utils/tools'
import PageLoading from '~/components/PageLoading'
import { useDispatch, useSelector } from 'react-redux'
import { getCartListAction } from '~/redux/actions/baseAction'
import { addCart, batchSetProductStatus, deleteCartProduct } from '~/service/common'
import Toast from 'teaset/components/Toast/Toast'
import { createOrderAction } from '~/redux/actions/orderAction'
import Drawer from 'teaset/components/Drawer/Drawer'
import GiftActivityContent from '~/components/GiftActivityContent'
import CountDownTimer from '~/components/CountDownTimer'

const CartScreen = () => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const { app, user } = useSelector(state => state)
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [price, setPrice] = useState(0.00)
  const [allChecked, setAllChecked] = useState(false)
  const [checked, setChecked] = useState(true)
  const base = useSelector(state => state.base)
  const [manager, setManager] = useState(false)
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)

  /**
   * 管理购物车商品
   */
  const handleManagerShop = () => {
    setManager(!manager)
  }
  // 商品选中
  const changeProductItemStatus = async (v, item) => {
    const { rel } = await addCart({
      skuId: item.skuId, isSelect: v ? 1 : 0
    })
    if (rel) {
      const _list = cloneDeep(list)
      _list.forEach((_item, _key) => {
        _item.productList.forEach((__item, __key) => {
          if (__item.skuId === item.skuId) {
            _list[_key].productList[__key].isSelect = !!v
          }
        })
      })
      setList(_list)
    }
  }
  // 商品数量改变
  const changeProductItemNumber = async (item, value) => {
    const { rel } = await addCart({
      skuId: item.skuId, num: value, isSelect: item.isSelect ? 1 : 0
    })
    if (rel) {
      const _list = cloneDeep(list)
      _list.forEach((_item, _key) => {
        _item.productList.forEach((__item, __key) => {
          if (__item.skuId === item.skuId) {
            _list[_key].productList[__key].saleQuantity = _list[_key].productList[__key].saleQuantity + value
          }
        })
      })
      setList(_list)
    }
  }

  // 统计商品价格
  const handleTotalProductPrice = () => {
    let totalPrice = 0
    setChecked(true)
    list.forEach(item => {
      item.productList.forEach((_item, _key) => {
        if (!_item.isSelect) {
          setChecked(false)
        }
        if (_item.isSelect) {
          totalPrice += _item.salePrice * _item.saleQuantity
        }
      })
    })
    setPrice(totalPrice)
  }

  // 全选反选
  const changeCheckedHandle = async () => {
    setAllChecked(true)
    const ids = []
    list.forEach(item => {
      item.productList.forEach(_item => {
        ids.push(_item.skuId)
      })
    })
    const { rel } = await batchSetProductStatus({
      skuId: ids.join(','), isSelect: !checked ? 1 : 0
    })
    if (rel) {
      dispatch(getCartListAction())
      setAllChecked(false)
    }
  }

  // 批量删除
  const handleBatchDelete = () => {
    const ids = []
    list.forEach(item => {
      item.productList.forEach(_item => {
        if (_item.isSelect) {
          ids.push(_item.skuId)
        }
      })
    })
    if (ids.length) {
      Alert.alert(
        '删除',
        `确认将这${ids.length}个宝贝删除？`,
        [
          {
            text: '取消',
            style: 'cancel'
          },
          {
            text: '确认',
            onPress: async () => {
              const { rel, msg } = await deleteCartProduct({ skuId: ids })
              if (rel) {
                Toast.success('删除成功!')
                dispatch(getCartListAction())
              } else {
                Toast.fail(msg)
              }
            }
          }
        ]
      )
    }
  }

  // 提交订单
  const handleSubmit = () => {
    const _notFoundList = []
    const typeList = []
    const wareIds = []
    const logisticIds = []
    list.forEach(i => {
      i.productList.forEach(item => {
        if (item.isSelect) {
          _notFoundList.push({ skuId: item.skuId, number: item.saleQuantity, shopId: app.shopId })
          if (!typeList.includes(item.typeName)) {
            typeList.push(item.typeName)
          }
          if (wareIds.indexOf(item.warehouseId) === -1) {
            wareIds.push(item.warehouseId)
          }
          if (logisticIds.indexOf(item.logisticId) === -1) {
            logisticIds.push(item.logisticId)
          }
        }
      })
    })
    if (typeList.length > 1) {
      Toast.fail('不同商品类型不能一起下单!')
      return false
    } else if (wareIds.length > 1) {
      Toast.fail('不同仓库商品不能一起下单!')
      return false
    } else if (logisticIds.length > 1) {
      Toast.fail('不同配送方式商品不能一起下单!')
      return false
    } else {
      if (_notFoundList.length) {
        if (user.isJuniorShop && user.shopId !== user.userId) {
          Alert.alert(
            '提示',
            '您已是VIP会员，不可在其他小店内下单。请在 我的-店铺切换，切换到自有小店！',
            [
              {
                text: '取消',
                style: 'cancel'
              },
              {
                text: '确认',
                style: 'default',
                onPress: () => {
                  // TODO:切换到自己店铺
                }
              }
            ]
          )
        } else {
          setBtnLoading(true)
          dispatch(createOrderAction(_notFoundList, (res) => {
            const { rel, data, msg } = res
            setBtnLoading(false)
            if (rel) {
              // 订单创建成功
              navigate('confirmedOrder')
            } else {
              if (data === 'REAL_INFO_ERROR') {
                Alert.alert(
                  '认证提示！',
                  '购买进口商品需实名认证',
                  [
                    {
                      text: '取消',
                      style: 'cancel'
                    },
                    {
                      text: '确认',
                      style: 'destructive',
                      onPress: () => {
                        navigate('authReal')
                      }
                    }
                  ]
                )
              } else {
                Toast.fail(msg)
              }
            }
          }))
        }
      } else {
        Toast.fail('请先选择商品')
      }
    }
  }

  // 展示活动
  const openActivityHandle = (actGiftVos) => {
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

  useMemo(() => {
    setList(base.cartList)
  }, [base.cartList])

  useEffect(() => {
    handleTotalProductPrice()
  }, [list])

  useEffect(() => {
    if (base.cartNumber) {
      setLoading(false)
    }
    dispatch(getCartListAction()).then(() => {
      setList(base.cartList)
      setLoading(false)
    })
  }, [])
  return (
    <View style={styles.page}>
      <NavigationBar
        title='购物车'
        titleStyle={{ color: colors.text }}
        style={{
          position: 'relative',
          backgroundColor: colors.card
        }}
        rightView={(
          <TouchableOpacity style={styles.btn} onPress={handleManagerShop}>
            <Text>{manager ? '完成' : '管理'}</Text>
          </TouchableOpacity>
        )}
      />
      <ScrollView>
        <View style={styles.cartList}>
          {list.map((item, key) => {
            return (
              <View style={[styles.itemGroup, { backgroundColor: colors.card }]} key={key}>
                <View style={styles.head}>
                  <View style={styles.headLeft}>
                    <Text style={{ fontSize: 14, color: colors.text }}>{item.type}</Text>
                    <Text style={{ color: colors.desc, fontSize: 12, marginLeft: 10 }}>{item.logisticName}</Text>
                  </View>
                  <Text style={{ color: colors.desc, fontSize: 12 }}>{item.simpleName}</Text>
                </View>
                <View style={styles.itemList}>
                  {item.productList.map((_item, _key) => {
                    return (
                      <View style={styles.itemWrap} key={_key}>
                        {_item.countdown > 0 ? (
                          <View style={styles.productDownTime}>
                            <Text style={{ fontSize: 12, color: '#111' }}>秒杀</Text>
                            <Text style={{ fontSize: 12, color: '#666', marginLeft: 5, marginRight: 5 }}>距活动结束时间还剩</Text>
                            <CountDownTimer
                              date={new Date(new Date().getTime() + _item.countdown)}
                              hours=':'
                              mins=':'
                              segs=''
                              containerStyle={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}
                              daysStyle={styles.time}
                              hoursStyle={styles.time}
                              minsStyle={styles.time}
                              secsStyle={styles.time}
                              firstColonStyle={styles.colon}
                              secondColonStyle={styles.colon}
                            />
                          </View>
                        ) : null}
                        <View style={styles.item}>
                          <Checkbox
                            checked={!!_item.isSelect}
                            onChange={(v) => changeProductItemStatus(v, _item)}
                            uncheckedIcon={<Icon name='circle' size={18} color={colors.brand} />}
                            checkedIcon={<Icon name='check-circle' size={18} color={colors.brand} />}
                          />
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigate('details', { id: _item.productId, skuId: _item.skuId })}>
                            <Image
                              style={styles.itemImage}
                              source={{ uri: _item.imageUrl || _item.imageUrl1 }}
                            />
                          </TouchableOpacity>
                          <View style={styles.itemInfo}>
                            <Text numberOfLines={2} style={{ color: colors.text }}>{_item.productName}</Text>
                            <Text
                              style={[
                                styles.itemInfoLabel, {
                                  color: colors.desc,
                                  backgroundColor: colors.background
                                }]}
                            >
                              {_item.specName}
                            </Text>
                            {(_item?.give || _item?.recurrence) ? (
                              <TouchableOpacity onPress={() => openActivityHandle(_item.actGiftVos)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Text style={{ fontSize: 12, color: '#555' }}>活动：</Text>
                                  {_item?.give ? (
                                    <Text style={styles.activityText}>赠</Text>
                                  ) : null}
                                  {_item?.recurrence ? (
                                    <Text style={styles.activityText}>返</Text>
                                  ) : null}
                                </View>
                              </TouchableOpacity>
                            ) : null}
                            <View style={styles.itemFooter}>
                              <Text style={[styles.money, { color: colors.brand }]}>￥{toMoney(_item.salePrice)}</Text>
                              <CountNumber
                                count={_item.saleQuantity}
                                onAdd={() => changeProductItemNumber(_item, 1)}
                                onReduce={() => changeProductItemNumber(_item, -1)}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </View>
        {loading ? (
          <PageLoading />
        ) : (
          !base.cartNumber ? (
            <Empty desc='您还没有添加商品哦' image={require('~/assets/empty/Shoppingcart.png')} />
          ) : null
        )}
        <LikeMore title='为您推荐' />
      </ScrollView>
      {base.cartNumber ? (
        <View style={styles.cartFooter}>
          <TouchableOpacity disabled={allChecked} activeOpacity={0.9} onPress={() => changeCheckedHandle()}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {checked
                ? <Icon name='check-circle' size={18} color={colors.brand} />
                : <Icon name='circle' size={18} color={colors.brand} />}
              <Text style={{ fontSize: 14, marginLeft: 5, color: colors.text }}>全选</Text>
            </View>
          </TouchableOpacity>
          {manager ? (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleBatchDelete}>
              <Text style={[styles.submitBtn, { backgroundColor: colors.brand, color: colors.brandText }]}>删除</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: colors.text }}>合计:<Text style={{ color: colors.brand, fontWeight: 'bold' }}>￥{toMoney(price)}</Text></Text>
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleSubmit} disabled={btnLoading}>
                <Text style={[styles.submitBtn, { backgroundColor: colors.brand, color: colors.brandText }]}>
                  {btnLoading ? '提交中...' : '提交订单'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  btn: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cartList: {
    paddingLeft: 10,
    paddingRight: 10
  },
  itemGroup: {
    paddingTop: 6,
    paddingBottom: 6,
    marginTop: 10
  },
  head: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  headLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemWrap: {
    paddingBottom: 10
  },
  productDownTime: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  time: {
    color: '#777',
    borderWidth: 1,
    borderColor: '#777',
    fontSize: 12,
    borderRadius: 2,
    padding: 2
  },
  colon: {
    marginLeft: 5,
    marginRight: 5,
    fontWeight: 'bold'
  },
  item: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 6,
    overflow: 'hidden',
    marginLeft: 10,
    marginRight: 10
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  itemInfoLabel: {
    fontSize: 12,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    marginTop: 6,
    borderRadius: 2,
    overflow: 'hidden'
  },
  activityText: {
    color: '#fff',
    fontSize: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    backgroundColor: '#e4393c',
    marginRight: 5
  },
  itemFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  money: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  cartFooter: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  submitBtn: {
    height: 30,
    lineHeight: 30,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 12,
    borderRadius: 15,
    overflow: 'hidden'
  }
})

export default CartScreen
