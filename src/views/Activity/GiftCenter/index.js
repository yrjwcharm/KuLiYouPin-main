import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { getGiftInfo, getGiftPage } from '~/service/activity'
import { useNavigation, useTheme } from '@react-navigation/native'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { width } from '~/utils/common'
import GiftShopItem from '~/components/GiftShopItem'
import FooterLoading from '~/components/FooterLoading'

const GiftCenter = () => {
  const { colors } = useTheme()
  const { setOptions, navigate } = useNavigation()
  const size = 20
  const [picUrl, setPicUrl] = useState(undefined)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [page, setPage] = useState(1)

  const initGiftInfo = () => {
    getGiftInfo().then(res => {
      const { rel, data } = res
      if (rel) {
        setPicUrl(data.actUrl)
        setOptions({ title: data.pageName })
      }
    })
  }

  const onLoad = () => {
    setLoading(true)
    getGiftPage({ start: page, length: size }).then(res => {
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
    initGiftInfo()
    onLoad()
  }, [])
  return (
    <View style={styles.page}>
      {picUrl ? (
        <GetImageSizeComponent url={picUrl} imageWidth={width} />
      ) : null}
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.brand }]} activeOpacity={0.9}>
        <Text style={{ fontSize: 16, color: '#fff' }}>去分享</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <ScrollView>
          {list.map((item, key) => {
            return <GiftShopItem sourceData={item} navigate={navigate} key={key} />
          })}
          <FooterLoading loading={loading} finished={finished} loadingHandle={onLoad} />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: 'relative'
  },
  btn: {
    position: 'absolute',
    right: 0,
    top: 60,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 14,
    paddingRight: 14
  }
})

export default GiftCenter
