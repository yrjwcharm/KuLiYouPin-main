import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { getPointOffsetInfo, getPointOffsetProductList } from '~/service/activity'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { width } from '~/utils/common'
import FooterLoading from '~/components/FooterLoading'
import ShopColumn from '~/components/ShopColumn'

const Point = ({ route, navigation }) => {
  const { id, itemValue } = route.params
  const { setOptions } = navigation
  const size = 20
  const [picUrl, setPicUrl] = useState(undefined)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)
  const initPageData = () => {
    getPointOffsetInfo({ creditId: id, pageId: itemValue }).then(res => {
      const { rel, data } = res
      if (rel) {
        setOptions({ title: data.pageName })
        setPicUrl(data.actUrl)
      }
    })
  }
  const onLoad = () => {
    if (loading || finished) return
    const params = {
      creditId: id,
      start: page,
      length: size
    }
    setLoading(true)
    getPointOffsetProductList(params).then(res => {
      const { rel, data: { rows } } = res
      if (rel) {
        setLoading(false)
        setList(list.concat(rows))
        setPage(page + 1)
        setFinished(rows.length < size)
      }
    })
  }
  useEffect(() => {
    initPageData()
    onLoad()
  }, [])
  return (
    <View style={styles.page}>
      <ScrollView>
        {picUrl ? (
          <GetImageSizeComponent url={picUrl} imageWidth={width} />
        ) : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {list.map((item, key) => {
            return (
              <ShopColumn sourceData={item} key={key} />
            )
          })}
        </View>
        <FooterLoading finished={finished} loading={loading} loadingHandle={onLoad} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  }
})

export default Point
