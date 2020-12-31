import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import { addBankCard, queryBankList } from '~/service/withDrawal'
import Drawer from 'teaset/components/Drawer/Drawer'
import Icon from 'react-native-vector-icons/Feather'
import SelectBankDrawer from '~/views/Personal/WithDrawal/SelectBankDrawer'
import Toast from 'teaset/components/Toast/Toast'
import { RegionPicker } from '@yz1311/react-native-wheel-picker'
import { useNavigation, useTheme } from '@react-navigation/native'

const WithDrawalAddCard = () => {

  let drawer
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [list, setList] = useState([])
  const [bank, setBank] = useState({
    bankId: undefined,
    bankName: undefined
  })
  const [area, setArea] = useState('选择银行所属省市')
  const [areaCode, setAreaCode] = useState(undefined)
  const [bankBranch, setBankBranch] = useState(undefined)
  const [accountName, setAccountName] = useState(undefined)
  const [accountCardNo, setAccountCardNo] = useState(undefined)
  const [accountCardNoConfirm, setAccountCardNoConfirm] = useState(undefined)

  const [loading, setLoading] = useState(false)

  const getBindBankListHandle = () => {
    queryBankList().then(res => {
      const { rel, data } = res
      if (rel) {
        setList(data || [])
      }
    })
  }

  const openBankDrawer = () => {
    const bankDrawer = Drawer.open(
      <View style={{ height: 500, backgroundColor: '#fff' }}>
        <View style={{ width: '100%', height: 56, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 14, color: '#333' }}>选择银行卡</Text>
          </View>
          <TouchableOpacity onPress={() => bankDrawer.close()}>
            <Icon name='x' size={20} color='#777' />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.content}>
          <SelectBankDrawer
            list={list}
            hideBtn={true}
            defaultInfo={bank}
            onChange={value => {
              setBank(value)
              bankDrawer.close()
            }}
          />
        </SafeAreaView>
      </View>, 'bottom')
  }

  const openAreaHandle = () => {
    const _values = areaCode ? [areaCode.substring(0, 2) * 1, areaCode * 1] : []
    const view = (
      <View style={{ backgroundColor: colors.card, height: 300 }}>
        <RegionPicker
          mode="pc"
          selectedValue={_values}
          onPickerCancel={() => {
            drawer.close()
          }}
          onPickerConfirm={(value, ids) => {
            drawer.close()
            setArea(value.join('-'))
            setAreaCode(ids[1])
          }} />
      </View>
    )
    drawer = Drawer.open(view, 'bottom')
  }

  const submitHandle = () => {
    if (!bank.bankId || !bank.bankName) {
      Toast.fail('请选择银行')
      return false
    }
    if (!areaCode.length) {
      Toast.fail('请选择银行所属省市')
      return false
    }
    if (!bankBranch) {
      Toast.fail('请输入开户行')
      return false
    }
    if (!accountName) {
      Toast.fail('请输入持卡人姓名')
      return false
    }
    if (!accountCardNo) {
      Toast.fail('请输入卡号')
      return false
    } else {
      const reg = /^([1-9]{1})(\d{15}|\d{18})$/
      if (!reg.test(accountCardNo)) {
        Toast.fail('请输入正确卡号')
        return false
      }
    }
    if (!accountCardNoConfirm) {
      Toast.fail('请输入确认卡号')
      return false
    }
    if (accountCardNoConfirm !== accountCardNo) {
      Toast.fail('两次卡号输入不一致')
      return false
    }
    setLoading(true)
    const params = {
      bankId: bank.bankId,
      bankBranch,
      accountName,
      accountCardNo,
      bankName: bank.bankName,
      bankProvince: areaCode.substring(0, 2),
      bankCity: areaCode
    }
    console.log(params)
    addBankCard(params).then(res => {
      const { rel, msg } = res
      if (rel) {
        Toast.success('添加成功', { isRead: true })
        navigate('withDrawal')
      } else {
        Toast.fail(msg)
      }
    })
  }

  useEffect(() => {
    getBindBankListHandle()
  }, [])
  return (
    <View>
      <ScrollView>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>所属银行</Text>
          <TouchableOpacity onPress={openBankDrawer}>
            <Text style={styles.itemText}>{bank.bankName || '选择所属银行'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>银行所属省市</Text>
          <TouchableOpacity onPress={openAreaHandle}>
            <Text>{area}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>银行开户行</Text>
          <TextInput style={styles.input} value={bankBranch} onChangeText={v => setBankBranch(v)} placeholder='请输入银行开户行' />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>持卡人</Text>
          <TextInput style={styles.input} value={accountName} onChangeText={v => setAccountName(v)} placeholder='请输入持卡人真实姓名' />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>卡号</Text>
          <TextInput style={styles.input} value={accountCardNo} onChangeText={v => setAccountCardNo(v)} placeholder='请输入卡号' />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>确认卡号</Text>
          <TextInput style={styles.input} value={accountCardNoConfirm} onChangeText={v => setAccountCardNoConfirm(v)} placeholder='请再次输入卡号' />
        </View>
        <View style={{ paddingHorizontal: 12, paddingVertical: 20 }}>
          <TouchableOpacity disabled={loading} onPress={submitHandle}>
            <Text style={styles.btn}>{loading ? '添加中...' : '添加'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9'
  },
  itemLabel: {
    width: 120,
    color: '#333'
  },
  input: {
    flex: 1,
    height: 48
  },
  btn: {
    width: '100%',
    height: 44,
    backgroundColor: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 44,
    borderRadius: 2,
    overflow: 'hidden'
  }
})

export default WithDrawalAddCard
