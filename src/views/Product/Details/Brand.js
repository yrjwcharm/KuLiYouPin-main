import * as React from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme, useNavigation } from '@react-navigation/native'

const Brand = (props) => {
  const { brandInfo: { brandLogoUrl, brandName, brandId } } = props
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  return (
    <TouchableOpacity style={[styles.brand, { backgroundColor: colors.card }]} onPress={() => navigate('brand', { brandId })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
        <Image style={{ width: 40, height: 40 }} source={{ uri: brandLogoUrl }} />
        <Text style={{ marginLeft: 10, fontSize: 14 }}>{brandName}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: colors.desc }}>进入品牌</Text>
        <Icon name='chevron-right' size={16} color={colors.desc} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    marginTop: 10
  }
})

export default Brand
