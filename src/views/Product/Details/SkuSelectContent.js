import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import PropTypes from 'prop-types'
import Stepper from 'teaset/components/Stepper/Stepper'
import { isIPhoneXFooter } from '~/utils/common'

const SkuSelectContent = (props) => {
  const { skuList, onAddCart, skuTree, colors, mainImage, productName, selectChange, data, minMaxPrice: { minPrice, maxPrice } } = props
  const [shopCount, setShopCount] = React.useState(1)
  const [selectedSku, setSelectedSku] = React.useState(data || {})

  const handleCheckedSku = (name: String, id) => {
    const _selectedSku = selectedSku
    if (_selectedSku[name] === id) {
      _selectedSku[name] = undefined
    } else {
      _selectedSku[name] = id
    }
    const _currentSku = skuList.find(item => {
      return item.s1 === _selectedSku.s1 && item.s2 === _selectedSku.s2
    })
    if (_currentSku) {
      _selectedSku.selectedSkuComb = _currentSku
    } else {
      _selectedSku.selectedSkuComb = undefined
    }
    const _selectedSkuComb = Object.assign({}, selectedSku, _selectedSku)
    setSelectedSku(_selectedSkuComb)
    selectChange(_selectedSkuComb)
  }
  // 展示商品价格
  let _price = ''
  if (selectedSku?.selectedSkuComb?.price) {
    _price = (selectedSku?.selectedSkuComb?.price / 100).toFixed(2)
  } else {
    if (minPrice === maxPrice) {
      _price = Number(minPrice).toFixed(2)
    } else {
      _price = `￥${minPrice.toFixed(2)}~${maxPrice.toFixed(2)}`
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Image style={styles.mainImage} source={{ uri: selectedSku?.selectedSkuComb?.img || mainImage }} />
        <View style={{ flex: 1, marginLeft: 10, alignItems: 'flex-start', justifyContent: 'space-between', height: 120 }}>
          <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
          <Text style={[styles.money, { color: colors.brand }]}>{_price}</Text>
          <Text style={[styles.weight, { color: colors.desc }]}>重量:{selectedSku?.selectedSkuComb?.weight || 0}g</Text>
        </View>
      </View>
      <View style={styles.skuList}>
        {skuTree.map((item, key) => {
          return (
            <View style={styles.skuItem} key={key}>
              <Text style={[styles.skuItemTitle, { color: '#333' }]}>{item.k}</Text>
              <View style={styles.skuItemList}>
                {item.v.map((_item, _key) => {
                  return (
                    <TouchableOpacity
                      style={{ marginRight: 10, marginBottom: 10 }}
                      key={_key}
                      onPress={() => handleCheckedSku(item.k_s, _item.id)}
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
      <View style={styles.skuNumber}>
        <Text>数量</Text>
        <Stepper
          value={shopCount}
          onChange={value => setShopCount(value)}
          step={1}
          valueStyle={{ minWidth: 40 }}
        />
      </View>
      <TouchableOpacity onPress={() => onAddCart(shopCount)}>
        <Text style={styles.skuButton}>加入购物车</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: isIPhoneXFooter(200),
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: isIPhoneXFooter(0)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  mainImage: {
    width: 120,
    height: 120,
    padding: 4,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    borderRadius: 2,
    overflow: 'hidden'
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22
  },
  money: {
    fontSize: 20,
    marginTop: 10
  },
  weight: {
    fontSize: 12,
    marginTop: 10
  },
  skuItemTitle: {
    fontSize: 16,
    paddingBottom: 20
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
    fontSize: 14,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderRadius: 4
  },
  skuNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20
  },
  skuButton: {
    width: '100%',
    height: 44,
    textAlign: 'center',
    lineHeight: 44,
    fontSize: 16,
    backgroundColor: '#ee0a24',
    borderRadius: 22,
    overflow: 'hidden',
    color: '#fff',
    fontWeight: 'bold'
  }
})
SkuSelectContent.defaultProps = {
  selectChange: () => {}
}
SkuSelectContent.propTypes = {
  skuList: PropTypes.array,
  skuTree: PropTypes.array,
  colors: PropTypes.object,
  minMaxPrice: PropTypes.object,
  mainImage: PropTypes.string,
  productName: PropTypes.string,
  selectChange: PropTypes.func,
  selectedSkuComb: PropTypes.any
}

export default SkuSelectContent
