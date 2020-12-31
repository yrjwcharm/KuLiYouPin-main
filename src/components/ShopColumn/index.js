import * as React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Image, Text, TouchableHighlight } from 'react-native'
import { width } from '~/utils/common'
import { useNavigation, useTheme } from '@react-navigation/native'
import { toMoney } from '~/utils/tools'

const ShopColumn = (props) => {
  const {
    sourceData: {
      productId,
      imageUrl1,
      productName,
      simpleName,
      activeNames,
      give,
      recurrence,
      brandLogoUrl,
      brandName,
      saleQuantityFictitious,
      minMaxPrice: {
        minPrice
      }
    }
  } = props
  const { colors } = useTheme()
  const { navigate } = useNavigation()

  // 跳转商品详情
  const jumpShopDetailsHandle = () => {
    navigate('details', { id: productId })
  }

  const activeStyle = { backgroundColor: colors.brand, color: colors.brandText, fontSize: 12 }
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TouchableHighlight onPress={jumpShopDetailsHandle}>
        <Image source={{ uri: imageUrl1 }} style={styles.image} />
      </TouchableHighlight>
      <View style={styles.info}>
        <TouchableHighlight>
          <View style={styles.brandWrap}>
            <Image style={styles.brandLogo} source={{ uri: brandLogoUrl }} />
            <Text style={{ fontSize: 12, color: colors.text }}>{brandName}</Text>
          </View>
        </TouchableHighlight>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
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
        <View style={styles.footer}>
          <Text style={{ fontSize: 16, color: colors.brand, fontWeight: 'bold' }}>￥{toMoney(minPrice)}</Text>
          <Text style={[styles.footerSale, { color: colors.desc }]}>已售{saleQuantityFictitious}件</Text>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: (width - 30) / 2,
    marginLeft: 10,
    marginTop: 10
  },
  image: {
    padding: 4,
    width: (width - 30) / 2,
    height: (width - 30) / 2,
    borderWidth: 1,
    borderColor: '#f5f5f9'
  },
  info: {
    padding: 6
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
  productName: {
    fontSize: 14,
    lineHeight: 20
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6
  },
  footerSale: {
    fontSize: 12
  }
})

ShopColumn.defaultProps = {
  sourceData: {}
}

ShopColumn.propTypes = {
  sourceData: PropTypes.object
}

export default ShopColumn
