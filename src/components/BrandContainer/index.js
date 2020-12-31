import * as React from 'react'

import { ImageBackground, ScrollView, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { useNavigation, useTheme } from '@react-navigation/native'
import { toMoney } from '~/utils/tools'
import { width } from '~/utils/common'

const BrandHeader = ({ sourceData }) => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const { logoUrl, brandName, labels, logoBackUrl } = sourceData
  const _labels = labels ? labels.split(',') : []
  return (
    <TouchableOpacity onPress={() => navigate('brand', { brandId: sourceData.brandId })} style={[styles.header, { paddingLeft: 10, paddingRight: 10, backgroundColor: logoBackUrl ? 'rgba(0, 0, 0, 0.4)' : '#fff' }]}>
      <Image source={{ uri: logoUrl }} style={styles.logo} />
      <View style={styles.content}>
        <View style={styles.contentInfo}>
          <Text style={[{ fontSize: 16, fontWeight: 'bold', color: logoBackUrl ? colors.card : colors.text }]}>{brandName}</Text>
          {_labels && _labels.length ? (
            <View style={styles.brandLabel}>
              {_labels.map((val, key) => (
                <Text key={key} style={[styles.brandLabelItem, { backgroundColor: colors.brand }]}>{val}</Text>
              ))}
            </View>
          ) : null}
        </View>
        <Text style={[styles.headerText, { color: logoBackUrl ? colors.card : colors.text }]}>进入品牌 ></Text>
      </View>
    </TouchableOpacity>
  )
}

const BrandContainer = ({ sourceData, more }) => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const { logoBackUrl, distributorsProductDTO, remark } = sourceData
  const [visible, setVisible] = React.useState(false)
  const remarkMaxSize = (width - 20) / 14 * 2 < remark.length
  return (
    <View>
      {logoBackUrl ? (
        <ImageBackground source={{ uri: logoBackUrl }} resizeMode='cover' style={styles.header}>
          <BrandHeader sourceData={sourceData} />
        </ImageBackground>
      ) : (
        <BrandHeader sourceData={sourceData} />
      )}
      {more ? (
        <View style={[styles.desc, { backgroundColor: colors.card }]}>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }} numberOfLines={remarkMaxSize ? (visible ? 2 : 20) : 2}>{remark}</Text>
          {remarkMaxSize ? (
            <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.descBtn}>
              <Text style={{ backgroundColor: colors.card, color: colors.brand, paddingLeft: 5, paddingRight: 5 }}>{visible ? '展开' : '收起'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      <View style={[styles.shopList, { backgroundColor: colors.card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {distributorsProductDTO.map((item, key) => {
            return (
              <TouchableOpacity key={key} onPress={() => navigate('details', { id: item.productId })}>
                <View style={styles.shopItem}>
                  <Image source={{ uri: item.imageUrl1 }} style={styles.shopItemImage} />
                  <Text style={styles.shopItemMoney}>{toMoney(item.minPrice)}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  header: {
    flex: 1,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 3,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  contentInfo: {
    flex: 1
  },
  headerText: {
    fontSize: 14
  },
  brandLabel: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 4
  },
  brandLabelItem: {
    fontSize: 12,
    paddingTop: 2,
    paddingRight: 4,
    paddingBottom: 2,
    paddingLeft: 4,
    color: '#fff',
    borderRadius: 3,
    overflow: 'hidden'
  },
  desc: {
    padding: 10,
    position: 'relative'
  },
  descBtn: {
    position: 'absolute',
    right: 10,
    bottom: 13
  },
  shopList: {
    flex: 1,
    height: 120
  },
  shopItem: {
    marginTop: 10,
    marginRight: 10,
    width: 100,
    height: 100,
    position: 'relative'
  },
  shopItemImage: {
    width: 100,
    height: 100
  },
  shopItemMoney: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 12,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 4,
    paddingLeft: 4,
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderRadius: 5,
    overflow: 'hidden'
  }
})
BrandContainer.propTypes = {
  sourceDta: PropTypes.object,
  more: PropTypes.bool
}
export default BrandContainer
