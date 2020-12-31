import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Text, Image } from 'react-native'
import { getBrandInfo, getBrandProductList } from '~/service/other'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { width } from '~/utils/common'
import ShopComplete from '~/components/ShopComplete'
import { DefaultTheme } from '~/themes'
import FooterLoading from '~/components/FooterLoading'

class BrandPage extends Component {
  constructor (props) {
    super(props)
    const { route: { params: { brandId } } } = props
    this.state = {
      _brandId: brandId,
      brandName: '',
      brandLogoUrl: '',
      brandBackgroundUrl: '',
      brandDesc: '',
      brandLabels: [],
      list: [],
      // 页码
      page: 1,
      // 每页条数
      size: 20,
      initLoading: true,
      loading: false,
      finished: false
    }
  }

  componentDidMount () {
    this.initData()
  }

  initData () {
    const { _brandId } = this.state
    getBrandInfo({ brandId: _brandId }).then(res => {
      const { rel, data: { brandName, logoUrl, logoBackUrl, labels, remark } } = res
      if (rel) {
        this.setState({
          brandName: brandName,
          brandLogoUrl: logoUrl,
          brandBackgroundUrl: logoBackUrl,
          brandDesc: remark,
          brandLabels: labels ? labels.split(',') : []
        })
        this.handleLoadData()
      }
    })
  }

  handleLoadData = () => {
    const { page, size, list, _brandId } = this.state
    const params = { start: page, length: size, brandId: _brandId }
    this.setState({ loading: true }, () => {
      getBrandProductList(params).then(({ rel, data: { rows } }) => {
        if (rel) {
          this.setState({
            page: page + 1,
            loading: false,
            initLoading: false,
            list: [...list, ...rows],
            finished: rows.length < size
          })
        }
      })
    })
  }

  onLoadMore = () => {
    const { loading, finished } = this.state
    if (!loading || !finished) {
      this.handleLoadData()
    }
  }

  renderBrandHeader = () => {
    const { brandBackgroundUrl, brandLogoUrl, brandName, brandLabels, brandDesc } = this.state
    const { colors } = DefaultTheme
    return (
      <View style={styles.headerContainer}>
        {brandBackgroundUrl ? (
          <GetImageSizeComponent url={brandBackgroundUrl} imageWidth={width} />
        ) : <View style={{ width: width, height: 120 }} />}
        <View style={styles.header}>
          {brandLogoUrl ? (
            <Image source={{ uri: brandLogoUrl }} style={styles.brandLogo} />
          ) : null}
          <View style={{ paddingTop: 12, paddingLeft: 12 }}>
            <Text style={[styles.brandName, { color: colors.text }]}>{brandName}</Text>
            {brandLabels.length ? (
              <View style={styles.labels}>
                {brandLabels.map((item, key) => (
                  <Text key={key} style={[styles.labelItem, { backgroundColor: colors.brand, color: colors.brandText }]}>{item}</Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>
        <Text style={styles.brandDesc}>{brandDesc}</Text>
        <Text style={[styles.brandTitle, { backgroundColor: colors.background, color: colors.brand }]}>品牌商品</Text>
      </View>
    )
  }

  render () {
    const { list, loading, finished } = this.state
    return (
      <View style={styles.page}>
        <FlatList
          data={list}
          ListHeaderComponent={this.renderBrandHeader}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ShopComplete sourceData={item} />}
          ListFooterComponent={<FooterLoading loading={loading} loadingHandle={this.onLoadMore} finished={finished} />}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  headerContainer: {
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: -20
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  labels: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  labelItem: {
    fontSize: 12,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5
  },
  brandDesc: {
    fontSize: 12,
    color: '#666',
    padding: 10,
    lineHeight: 20
  },
  brandTitle: {
    padding: 12,
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default BrandPage
