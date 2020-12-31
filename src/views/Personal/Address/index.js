import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getAddressListAction } from '~/redux/actions/baseAction'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useTheme } from '@react-navigation/native'
import { createOrderAction } from '~/redux/actions/orderAction'

const Address = (props) => {
  const dispatch = useDispatch()
  const { navigate, goBack } = useNavigation()
  const { colors } = useTheme()
  const base = useSelector(state => state.base)
  const order = useSelector(state => state.order)

  const handleChangeOrderAddress = (itemInfo) => {
    if (props.route?.params?.type) {
      const { sku } = order
      const _sku = sku.map(item => ({ ...item, uaId: itemInfo.uaId }))
      dispatch(createOrderAction(_sku, () => {
        goBack()
      }))
    }
  }

  useEffect(() => {
    dispatch(getAddressListAction())
  }, [])
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView>
        {base?.addressList.map((item, key) => {
          return (
            <View key={key} style={[styles.addressItem, { backgroundColor: colors.card }]}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => handleChangeOrderAddress(item)}>
                <View style={styles.addressInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.isDefault ? (
                      <Text style={[styles.label, { backgroundColor: colors.brand, color: colors.brandText }]}>默认</Text>
                    ) : null}
                    <Text style={{ color: colors.text, fontSize: 16 }}>{item.consignee} {item.mobile}</Text>
                  </View>
                  <Text style={[styles.desc, { color: colors.desc }]}>{item.province}/{item.city}/{item.district} {item.address}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigate('addressEditAndAdd', { id: item.uaId })}>
                <Icon name='edit' size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
      <View style={[styles.footer]}>
        <TouchableOpacity onPress={() => navigate('addressEditAndAdd')}>
          <Text style={[styles.btn, { backgroundColor: colors.brand, color: colors.brandText }]}>添加收货地址</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 10
  },
  addressInfo: {
    flex: 1
  },
  label: {
    borderRadius: 8,
    fontSize: 10,
    padding: 4,
    overflow: 'hidden',
    marginRight: 5
  },
  desc: {
    marginTop: 10,
    fontSize: 14
  },
  footer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  btn: {
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 20,
    overflow: 'hidden'
  }
})
export default Address
