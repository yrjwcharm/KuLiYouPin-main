import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { height } from '~/utils/common'
import { useTheme } from '@react-navigation/native'

const PageLoading = () => {
  const { colors } = useTheme()
  return (
    <View style={styles.container}>
      <ActivityIndicator size={32} color={colors.brand} />
      <Text style={[styles.text, { color: colors.desc }]}>加载中,请稍后...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    marginTop: 12
  }
})

export default PageLoading
