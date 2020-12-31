/**
 * 首页轮播
 * @author echooys@qq.com
 */
import * as React from 'react'
import { Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Carousel from 'teaset/components/Carousel/Carousel'
import { getSwipeList } from '~/service/home'
import { useNavigation, useTheme } from '@react-navigation/native'
import { jumpTypeCheckedHook } from '~/hooks/useTypeCheckedHook'

const Swiper = ({ id }) => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [list, setList] = React.useState([])
  React.useEffect(() => {
    let flag = true
    if (!list.length) {
      getSwipeList(id).then(({ data }) => {
        flag && setList(data)
      })
    }
    return () => {
      flag = false
    }
  }, [])
  if (!list.length) {
    return false
  }
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
      {list.map((item, key) => {
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
const styles = StyleSheet.create({
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
Swiper.propTypes = {
  id: PropTypes.number
}

export default Swiper
