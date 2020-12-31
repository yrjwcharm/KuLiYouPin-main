import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { View, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import { useTheme } from '@react-navigation/native'
import FooterLoading from '~/components/FooterLoading'
import { getIconDetails } from '~/service/product'
import ShopColumn from '~/components/ShopColumn'

const LikeMore = (props) => {
  const { title } = props
  const { colors } = useTheme()
  const size = 20
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)

  const loadHandle = () => {
    if (loading || finished) {
      return false
    }
    setLoading(true)
    getIconDetails({ start: page, length: size }).then(res => {
      const { rel, data } = res
      if (rel) {
        setPage(page + 1)
        setFinished(data.rows.length < size)
        setList(list.concat(data.rows))
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  useEffect(() => {
    let flag = true
    if (flag) {
      loadHandle()
    }
    return () => {
      flag = false
    }
  }, [])
  return (
    <View style={[styles.container]}>
      <View style={[styles.title, { backgroundColor: colors.card }]}>
        <Text style={{ fontSize: 16, color: colors.text }}>{title}</Text>
      </View>
      <LinearGradient colors={['#ffffff', '#f5f5f9']}>
        <View style={styles.shopList}>
          {list.map((item, key) => {
            return (
              <ShopColumn sourceData={item} key={key} />
            )
          })}
        </View>
      </LinearGradient>
      <FooterLoading loading={loading} finished={finished} loadingHandle={loadHandle} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  title: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f9'
  },
  shopList: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})

LikeMore.propTypes = {
  title: PropTypes.string
}

LikeMore.defaultProps = {
  title: '猜您喜欢'
}

export default LikeMore
