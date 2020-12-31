import React from 'react'
import PropTypes from 'prop-types'
import { getProductFirstMoney } from '~/service/product'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import { DefaultTheme } from '~/themes'

class GiftShopItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      maxPrice: 0
    }
  }

  static defaultProps = {
    sourceData: {
      skuSpecName: []
    }
  }

  static propTypes = {
    sourceData: PropTypes.object
  }

  componentDidMount () {
    this.getProductMaxPrice()
  }

  getProductMaxPrice () {
    const { sourceData: { skuIds, productId } } = this.props
    getProductFirstMoney(productId).then(res => {
      const { rel, data } = res
      if (rel) {
        const prices = []
        for (const skuId in data) {
          if (skuIds.includes(skuId + '')) {
            prices.push(+data[skuId + ''])
          }
        }
        this.setState({
          maxPrice: Math.max(...prices).toFixed(2) || 0.00
        })
      }
    })
  }

  handlerJumpInfo (id) {
    const { sourceData: { booleanReceive }, navigate } = this.props
    if (booleanReceive) {
      navigate('myGiftCenter', { id })
    } else {
      navigate('giftInfo', { id })
    }
  }

  handleJumpProductInfo () {
    const { navigate, sourceData: { productId } } = this.props
    navigate('details', { id: productId })
  }

  render () {
    const {
      sourceData: {
        imageUrl1,
        activeNames,
        simpleName,
        productName,
        booleanReceive,
        actId,
        skuSpecName,
        getCycle,
        consumptionMoney
      }
    } = this.props
    const { maxPrice } = this.state
    const { colors } = DefaultTheme
    const activeStyle = { backgroundColor: colors.brand, color: colors.brandText, fontSize: 12 }
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={this.handleJumpProductInfo}>
          <Image style={styles.image} source={{ uri: imageUrl1 }} />
        </TouchableOpacity>
        <View style={styles.info}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
            {activeNames ? (
              <Text style={[styles.activeName, activeStyle]}>
                &nbsp;{activeNames}&nbsp;
              </Text>
            ) : null}
            &nbsp;{simpleName ? `【${simpleName}】` : ''}{productName}
          </Text>
          <View style={styles.skus}>
            {skuSpecName.slice(0, 2).map((item, key) => {
              return <Text style={styles.skuItem} key={key}>{item}</Text>
            })}
            {skuSpecName.length > 2 &&
            <Text style={{ color: '#ccc' }}>...</Text>}
          </View>
          {skuSpecName.length > 1 ? (
            <Text style={styles.desc}>(多规格任选其一)</Text>
          ) : null}
          <View style={styles.types}>
            <Text style={styles.type}>
              {getCycle * 1 === 1 ? '单次赠送' : ''}
              {getCycle * 1 === 2 ? '每周赠送' : ''}
              {getCycle * 1 === 3 ? '每月赠送' : ''}
            </Text>
            {consumptionMoney && (
              <Text style={[styles.type, { fontSize: 10 }]}>
                返{consumptionMoney}元
              </Text>
            )}
          </View>
          <View style={styles.action}>
            <View style={styles.price}>
              <Text style={{ color: colors.brand }}>￥0.00</Text>
              <Text style={{ color: '#999', fontSize: 12, marginLeft: 5, fontWeight: '600', textDecorationLine: 'line-through' }}>原价：￥{maxPrice}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.handlerJumpInfo(actId)}>
              <Text style={[styles.btn, { backgroundColor: colors.brand }]}>{booleanReceive ? '已报名' : '报名领取'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff'
  },
  productName: {
    fontSize: 14,
    lineHeight: 20
  },
  info: {
    flex: 1,
    marginLeft: 10
  },
  skus: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 5
  },
  skuItem: {
    marginRight: 5,
    fontSize: 12,
    backgroundColor: '#ccc',
    color: '#fff',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6
  },
  desc: {
    fontSize: 12,
    color: '#999',
    marginTop: 5
  },
  types: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  type: {
    fontSize: 12,
    backgroundColor: '#FF8F00',
    color: '#fff',
    marginRight: 3,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5
  },
  price: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  image: {
    width: 135,
    height: 135
  },
  btn: {
    fontSize: 12,
    color: '#fff',
    height: 25,
    lineHeight: 25,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12
  }
})

export default GiftShopItem
