import * as React from 'react'
import { useNavigation, useTheme } from '@react-navigation/native'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert
} from 'react-native'
import { toMoney } from '~/utils/tools'

const ShopSimplicity = (props) => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const theme = useTheme()
  const {
    sourceData: {
      productId,
      activeNames,
      give,
      recurrence,
      imageUrl1,
      imageUrl2,
      productName,
      simpleName,
      brandName,
      brandLogoUrl,
      labels,
      saleQuantityFictitious,
      headimgurl,
      minMaxPrice: {
        minPrice
      }
    }
  } = props
  // 跳转商品详情
  const jumpShopDetailsHandle = (id: String) => {
    navigate('details', { id: id })
  }

  const labelArr = labels && labels.length > 0 ? labels.split(',') : []
  const activeStyle = { backgroundColor: colors.brand, color: colors.brandText }
  // 根据用户权限展示零售价或者VIP价
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={() => jumpShopDetailsHandle(productId)}>
        <View style={styles.wrapper}>
          <View style={styles.shopImageWrapper}>
            <Image
              style={styles.shopImage}
              source={{
                uri: imageUrl1 || imageUrl2
              }}
            />
          </View>
          <View style={styles.content}>
            <View>
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
              <View style={styles.brandWrapper}>
                <Image
                  style={styles.brandImage}
                  source={{
                    uri: brandLogoUrl
                  }}
                />
                <Text style={styles.brandText}>{brandName}</Text>
              </View>
            </View>
            <View>
              {labelArr.length ? (
                <View style={styles.labelWrap}>
                  {labelArr.map((value, key) => {
                    return <Text key={key} style={[styles.labelItem, { backgroundColor: colors.auxiliaryText, color: colors.auxiliary }]}>{value}</Text>
                  })}
                </View>
              ) : null}
              <View style={styles.footer}>
                <View>
                  <Text style={[styles.money, { color: colors.brand }]}>￥{toMoney(minPrice)}</Text>
                </View>
                <View style={styles.footerSales}>
                  <Text style={{ fontSize: 12, color: colors.desc }}>已售{saleQuantityFictitious || 0}件</Text>
                  <View style={styles.footerSalesList}>
                    {headimgurl.map((item, key) => {
                      if (!item?.headimgurl) {
                        return null
                      }
                      return <Image style={[styles.footerAvatar, { marginLeft: -(key * 2 + 1) }]} source={{ uri: item.headimgurl }} key={key} />
                    })}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 2
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  shopImageWrapper: {
    width: 120,
    height: 120,
    backgroundColor: '#ccc'
  },
  shopImage: {
    width: 120,
    height: 120,
    borderRadius: 2
  },
  content: {
    flex: 1,
    height: 120,
    justifyContent: 'space-between',
    marginLeft: 10
  },
  productNameWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
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
  brandWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 4,
    paddingBottom: 4
  },
  brandImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#f5f5f9'
  },
  brandText: {
    fontSize: 12,
    marginLeft: 5
  },
  labelWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  labelItem: {
    fontSize: 10,
    paddingTop: 4,
    paddingBottom: 5,
    paddingRight: 4,
    paddingLeft: 4,
    marginRight: 5
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  money: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  footerSales: {
    position: 'relative'
  },
  footerSalesList: {
    position: 'absolute',
    top: -20,
    right: 0,
    flexDirection: 'row'
  },
  footerAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    overflow: 'hidden'
  }
})

export default ShopSimplicity
