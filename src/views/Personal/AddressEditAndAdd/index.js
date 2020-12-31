import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Switch } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { getItemAddress, setAddressItem } from '~/service/common'
import Drawer from 'teaset/components/Drawer/Drawer'
import { RegionPicker } from '@yz1311/react-native-wheel-picker'
import Toast from 'teaset/components/Toast/Toast'
import { getAddressListAction } from '~/redux/actions/baseAction'
import { useDispatch } from 'react-redux'

const AddressEditAndAdd = ({ route, navigation }) => {
  const { setOptions, goBack } = navigation
  const { colors } = useTheme()
  const dispatch = useDispatch()
  let drawer
  const [id, setId] = useState(undefined)
  const [name, setName] = useState(undefined)
  const [mobile, setMobile] = useState(undefined)
  const [desc, setDesc] = useState('')
  const [area, setArea] = useState('选择省市区')
  const [areaCode, setAreaCode] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const openAreaHandle = () => {
    const _values = areaCode ? [areaCode.substring(0, 2), areaCode.substring(0, 4), areaCode] : []
    const view = (
      <View style={{ backgroundColor: colors.card, height: 300 }}>
        <RegionPicker
          selectedValue={areaCode}
          onPickerCancel={() => {
            drawer.close()
          }}
          onPickerConfirm={(value, ids) => {
            drawer.close()
            setArea(value.join('-'))
            setAreaCode(ids[2])
          }} />
      </View>
    )
    drawer = Drawer.open(view, 'bottom')
  }

  const onSubmitHandle = () => {
    if (!/^[\u4E00-\u9FA5]{2,4}$/.test(name)) {
      Toast.fail('请正确输入用户名')
      return false
    }
    if (!/(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(mobile)) {
      Toast.fail('请正确输入手机号码')
      return false
    }
    if (!areaCode.length) {
      Toast.fail('请选择地区')
      return false
    }
    if (!desc.trim()) {
      Toast.fail('请输入详细地址')
      return false
    }
    const _usId = id ? { uaId: id } : {}
    const data = {
      consignee: name,
      mobile,
      address: desc,
      province: area.split('-')[0],
      city: area.split('-')[1],
      district: area.split('-')[2],
      isDefault: isDefault ? 1 : 0,
      areaCode,
      ..._usId
    }
    setAddressItem(data).then(({ rel }) => {
      if (rel) {
        dispatch(getAddressListAction())
        Toast.success('保存成功')
        goBack()
      }
    })
  }

  useEffect(() => {
    if (route?.params?.id) {
      setOptions({ title: '编辑收货地址' })
      setId(route.params.id)
      getItemAddress(route.params.id).then(res => {
        const {
          rel, data: {
            consignee,
            mobile: _mobile,
            address,
            areaCode: _areaCode,
            province,
            city,
            district,
            isDefault: _isDefault
          }
        } = res
        if (rel) {
          setName(consignee)
          setMobile(_mobile)
          setDesc(address)
          setIsDefault(!!_isDefault)
          setAreaCode(_areaCode)
          setArea(`${province}-${city}-${district}`)
        }
      })
    } else {
      setOptions({ title: '添加收货地址' })
    }
  }, [])
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView>
        <View style={[styles.item, { backgroundColor: colors.card, marginTop: 10 }]}>
          <Text style={styles.itemLabel}>姓名</Text>
          <TextInput value={name} style={{ flex: 1 }} placeholder='收货人姓名' onChangeText={text => setName(text)} />
        </View>
        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <Text style={styles.itemLabel}>手机号</Text>
          <TextInput value={mobile} style={{ flex: 1 }} placeholder='收货人手机号码' onChangeText={text => setMobile(text)} />
        </View>
        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <Text style={styles.itemLabel}>地区</Text>
          <TouchableOpacity onPress={openAreaHandle}>
            <Text style={{ color: colors.text }}>{area}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <TextInput
            placeholder='请输入详细地址'
            multiline={true}
            value={desc}
            style={styles.multText}
            onChangeText={text => setDesc(text)}
            blurOnSubmit={false}
            numberOfLines={5}
          />
        </View>
        <View style={[styles.item, { backgroundColor: colors.card }]}>
          <Text style={styles.itemLabel}>默认地址</Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Switch value={isDefault} onValueChange={value => setIsDefault(value)} />
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={0.9} onPress={onSubmitHandle}>
            <Text style={[styles.btn, { backgroundColor: colors.brand, color: colors.brandText }]}>
              {id ? '保存' : '确认添加'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
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
  },
  item: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6
  },
  itemLabel: {
    width: 80,
    height: 30,
    lineHeight: 30
  },
  multText: {
    textAlignVertical: 'top',
    borderWidth: 1,
    flex: 1,
    padding: 6,
    height: 100,
    borderColor: '#f5f5f9'
  }
})

export default AddressEditAndAdd
