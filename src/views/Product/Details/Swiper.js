/**
 * 首页轮播
 * @author echooys@qq.com
 */
import * as React from 'react'
import { Image, View, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import Carousel from 'teaset/components/Carousel/Carousel'
import { useTheme } from '@react-navigation/native'

const Swiper = ({ list }) => {
  const { colors } = useTheme()
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
      {list.map((url, key) => {
        return (
          <View style={[styles.item, { backgroundColor: colors.card }]} key={key}>
            <Image style={styles.itemImage} resizeMode='cover' source={{ uri: url }} />
          </View>
        )
      })}
    </Carousel>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flex: 1
  },
  itemImage: {
    flex: 1
  }
})
Swiper.propTypes = {
  list: PropTypes.array
}

export default Swiper
