import * as React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import PropTypes from 'prop-types'
import { height, width } from '~/utils/common'
import { useTheme } from '@react-navigation/native'

const Empty = ({ image, desc, renderFooter }) => {
  const { colors } = useTheme()
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      {renderFooter || (
        <Text style={[styles.desc, { color: colors.text }]}>{desc}</Text>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: width,
    minHeight: height / 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: parseInt(width / 3),
    height: parseInt(width / 3)
  },
  desc: {
    fontSize: 14,
    marginTop: 15
  }
})
Empty.propTypes = {
  image: PropTypes.any.isRequired,
  desc: PropTypes.string.isRequired,
  renderFooter: PropTypes.element
}

export default Empty
