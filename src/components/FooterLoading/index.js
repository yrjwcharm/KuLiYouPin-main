import * as React from 'react'
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { useTheme } from '@react-navigation/native'

const FooterLoading = (props) => {
  const { colors } = useTheme()
  const { loading, finished, loadingLabel, beforeLoadingLabel, finishedLabel, loadingHandle } = props
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size='small' color={colors.brand} />
          <Text style={[styles.text, { color: colors.text, marginLeft: 10 }]}>
            {loadingLabel}
          </Text>
        </View>
      ) : (
        finished ? (
          <Text style={[styles.text]}>{finishedLabel}</Text>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={loadingHandle}>
            <Text style={[styles.text, { color: colors.text }]}>{beforeLoadingLabel}</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    color: '#777'
  }
})
FooterLoading.defaultProps = {
  loading: false,
  finished: false,
  loadingLabel: '加载中...',
  beforeLoadingLabel: '点击加载更多...',
  finishedLabel: '我也是有底线的！！！',
  loadingHandle: () => {}
}
FooterLoading.propTypes = {
  loading: PropTypes.bool,
  finished: PropTypes.bool,
  loadingLabel: PropTypes.string,
  beforeLoadingLabel: PropTypes.string,
  finishedLabel: PropTypes.string,
  loadingHandle: PropTypes.func
}

export default FooterLoading
