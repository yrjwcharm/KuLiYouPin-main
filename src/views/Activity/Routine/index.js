import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native'
import { getCompleteBrand, getCompleteBrandProduct, getCompleteProduce, getConferenceHotPushList, getConferenceSwipeList, getIconDetailsBanner } from '~/service/activity'
import { filterActivityHandle } from '~/utils/tools'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { width as _width, width } from '~/utils/common'
import Carousel from 'teaset/components/Carousel/Carousel'
import { jumpTypeCheckedHook } from '~/hooks/useTypeCheckedHook'
import FooterLoading from '~/components/FooterLoading'
import ShopComplete from '~/components/ShopComplete'
import BrandContainer from '~/components/BrandContainer'
import ShopSimplicity from '~/components/ShopSimplicity'
import ShopColumn from '~/components/ShopColumn'

class Routine extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      url: '',
      picUrl: '',
      actType: '',
      displayModel: '',
      swipeList: [],
      hotPushList: [],
      list: [],
      loading: true,
      finished: false,
      page: 1,
      size: 10
    }
  }

  componentDidMount () {
    this.initData()
  }

  initData () {
    const { route: { params: { iconType, actId } }, navigation } = this.props
    // 获取活动海报
    getIconDetailsBanner({ iconType: iconType, actId: actId }).then((res) => {
      const { data: { actName, incomeUrl, picUrl, actType, displayModel }, rel } = res
      if (rel) {
        navigation.setOptions({ title: actName })
        this.setState({
          title: actName,
          url: incomeUrl,
          picUrl: picUrl,
          loading: false,
          actType,
          displayModel
        }, () => {
          this.onLoad()
        })
      }
    })
    // 获取轮播
    getConferenceSwipeList(actId).then(({ rel, data }) => {
      if (rel) {
        this.setState({ swipeList: data })
      }
    })
    // 获取推荐商品
    getConferenceHotPushList(actId).then(({ rel, data }) => {
      if (rel) {
        this.setState({
          hotPushList: filterActivityHandle(data)
        })
      }
    })
  }

  onLoad () {
    const { page, size, actType, displayModel, list, loading, finished } = this.state
    const { route: { params: { iconType, actId } } } = this.props
    if (loading || finished) return
    const params = {
      iconType: iconType,
      actId: actId,
      start: page,
      length: size
    }
    this.setState({ loading: true })
    if (+actType === 1 || +actType === 3) {
      getCompleteProduce(params).then(res => {
        const { rel, data: { rows } } = res
        if (rel) {
          this.setState({
            list: list.concat(rows),
            loading: false,
            page: page + 1,
            finished: rows.length < size
          })
        }
      })
    } else {
      if (+displayModel === 2 || +displayModel === 4) {
        getCompleteBrand(params).then(res => {
          const { rel, data: { rows } } = res
          if (rel) {
            this.setState({
              list: list.concat(rows),
              loading: false,
              page: page + 1,
              finished: rows.length < size
            })
          }
        })
      } else {
        getCompleteBrandProduct(params).then(res => {
          const { rel, data: { rows } } = res
          if (rel) {
            this.setState({
              list: list.concat(rows),
              loading: false,
              page: page + 1,
              finished: rows.length < size
            })
          }
        })
      }
    }
  }

  renderSwiper () {
    const { navigation: { navigate } } = this.props
    const { swipeList } = this.state
    if (!swipeList.length) return false
    return (
      <Carousel
        carousel
        interval={5000}
        cycle
        control={
          <Carousel.Control
            style={{ alignItems: 'center', marginBottom: 5 }}
            dot={<Text style={{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 5, marginLeft: 5, marginRight: 5, overflow: 'hidden' }} />}
            activeDot={<Text style={{ backgroundColor: colors.brand, width: 10, height: 10, borderRadius: 5, marginLeft: 5, marginRight: 5, overflow: 'hidden' }} />}
          />
        }
        style={styles.container}
      >
        {swipeList.map((item, key) => {
          return (
            <TouchableOpacity style={{ flex: 1 }} key={key} onPress={() => jumpTypeCheckedHook(navigate, item)}>
              <View style={styles.item}>
                {item.picAddress ? (
                  <Image style={styles.itemImage} source={{ uri: item.picAddress }} />
                ) : (
                  <View style={styles.itemImage} />
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </Carousel>
    )
  }

  renderHotStruct () {
    const { navigation: { navigate } } = this.props
    const { hotPushList } = this.state
    if (!hotPushList.length) return false
    return (
      <View style={styles.flex}>
        {hotPushList.map((item, key) => {
          return (
            <View key={key} style={styles.flex}>
              {item.goodsCount === 1 ? (
                <View>
                  <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[0])} url={item.activityList[0].picAddress} imageWidth={_width} />
                </View>
              ) : null}
              {item.goodsCount === 2 ? (
                <View style={{ flexDirection: 'row' }}>
                  <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[0])} url={item.activityList[0].picAddress} imageWidth={_width / 2} />
                  <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[1])} url={item.activityList[1].picAddress} imageWidth={_width / 2} />
                </View>
              ) : null}
              {item.goodsCount === 3 ? (
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[0])} url={item.activityList[0].picAddress} imageWidth={_width / 2} />
                  <View style={{ width: _width / 2 }}>
                    <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[1])} url={item.activityList[1].picAddress} imageWidth={_width / 2} />
                    <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[2])} url={item.activityList[2].picAddress} imageWidth={_width / 2} />
                  </View>
                </View>
              ) : null}
              {(item.goodsCount === 4 || item.goodsCount === 5 || item.goodsCount === 6 || item.goodsCount === 7) ? (
                <View style={{ flexDirection: 'row' }}>
                  {item.activityList.map((_item, key) => {
                    const _imageWidth = _width / item.activityList.length
                    return <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, _item)} key={key} url={_item.picAddress} imageWidth={parseInt(_imageWidth)} />
                  })}
                </View>
              ) : null}
            </View>
          )
        })}
      </View>
    )
  }

  render () {
    const { picUrl, displayModel, list, loading, finished } = this.state
    const _listStyle = displayModel === 5 ? { flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' } : {}
    return (
      <SafeAreaView style={styles.page}>
        <ScrollView>
          {picUrl ? <GetImageSizeComponent url={picUrl} imageWidth={width} /> : null}
          {this.renderSwiper()}
          {this.renderHotStruct()}
          <View style={[_listStyle]}>
            {list.map((item, key) => {
              if (displayModel === 1) {
                return <ShopComplete sourceData={item} key={key} />
              } else if (displayModel === 2) {
                return <BrandContainer sMore={true} sourceData={item} key={key} />
              } else if (displayModel === 3) {
                return <ShopSimplicity sourceData={item} key={key} />
              } else if (displayModel === 4) {
                return <BrandContainer sMore={true} sourceData={item} key={key} />
              } else if (displayModel === 5) {
                return <ShopColumn sourceData={item} key={key} />
              }
            })}
          </View>
          <FooterLoading loading={loading} finished={finished} loadingHandle={() => this.onLoad()} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    height: 130,
    marginTop: 6
  },
  item: {
    flex: 1
  },
  itemImage: {
    flex: 1,
    height: 130,
    borderRadius: 8,
    overflow: 'hidden'
  }
})

export default Routine
