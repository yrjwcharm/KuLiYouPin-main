import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { cash, queryBindBankList } from '~/service/withDrawal'
import { useNavigation } from '@react-navigation/native'
import Drawer from 'teaset/components/Drawer/Drawer'
import Icon from 'react-native-vector-icons/Feather'
import SelectBankDrawer from '~/views/Personal/WithDrawal/SelectBankDrawer'
import Toast from 'teaset/components/Toast/Toast'
import { getUserInfoAction } from '~/redux/actions/userAction'

const WithDrawal = ({ route }) => {
  const { navigate } = useNavigation()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [price, setPrice] = useState(undefined)
  const [isTip, setIsTip] = useState(false)
  const [remark, setRemark] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({
    bankId: undefined,
    bankName: undefined
  })

  const getBindBankListHandle = () => {
    queryBindBankList().then(res => {
      const { rel, data } = res
      if (rel && data.length) {
        setList(data || [])
        setInfo({
          bankId: data[0].bindId,
          bankName: data[0].bankName + `(${data[0].accountCardNo.slice(-4)})`
        })
      }
    })
  }

  // 提现金额改变
  const handleChangePrice = (_value) => {
    const value = _value
    const { balanceMoney } = user
    const _inputValue = value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    setPrice(_inputValue)
    if (+_inputValue > +(balanceMoney || 0)) {
      setIsTip(true)
    } else {
      setIsTip(false)
    }
  }

  // 提现全部金额
  const handleAllMoney = () => {
    if (user.balanceMoney) {
      setPrice(user.balanceMoney + '')
    }
  }

  const handleJumpCard = () => {
    if (info.bankId) {
      // TODO: 选择银行卡
      const withDrawer = Drawer.open(
        <View style={{ height: 500, backgroundColor: '#fff' }}>
          <View style={{ width: '100%', height: 56, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14, color: '#333' }}>选择到账银行卡</Text>
              <Text style={{ fontSize: 12, color: '#999', marginTop: 6 }}>请留意各银行到账时间</Text>
            </View>
            <TouchableOpacity onPress={() => withDrawer.close()}>
              <Icon name='x' size={20} color='#777' />
            </TouchableOpacity>
          </View>
          <SafeAreaView style={styles.content}>
            <SelectBankDrawer
              list={list}
              defaultInfo={info}
              onJumpCard={() => {
                withDrawer.close()
                navigate('withDrawalAddCard')
              }}
              onChange={value => {
                setInfo(value)
                withDrawer.close()
              }}
            />
          </SafeAreaView>
        </View>, 'bottom')
    } else {
      navigate('withDrawalAddCard')
    }
  }

  const handleSubmit = () => {
    console.log('ok')
    if (info.bankId && price > 0 && !isTip) {
      setLoading(true)
      cash({ bindId: info.bankId, amount: price, requestRemark: remark }).then(res => {
        const { rel } = res
        if (rel) {
          setPrice(undefined)
          setRemark(undefined)
          Toast.success('申请提现成功')
          dispatch(getUserInfoAction())
        } else {
          Toast.fail('申请提现失败')
        }
      })
    }
  }

  useMemo(() => {
    getBindBankListHandle()
  }, [route?.params?.isRead])

  useEffect(() => {
    getBindBankListHandle()
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={{ color: '#333' }}>到账银行卡</Text>
          <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleJumpCard}>
            <Text style={{ color: '#005195' }}>{info.bankName || '添加银行卡'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 14, color: '#222', marginBottom: 10 }}>提现金额</Text>
          <View style={{ flexDirection: 'row', height: 65, paddingVertical: 12, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 32 }}>￥</Text>
            <TextInput placeholder='请输入提现金额' value={price} onChangeText={handleChangePrice} style={{ flex: 1, fontSize: 22 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 32 }}>
            {isTip ? (
              <Text style={{ color: 'red' }}>输入金额超过可提现余额</Text>
            ) : (
              <>
                <Text style={{ color: '#777' }}>当前可提现金额{user.balanceMoney}元</Text>
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleAllMoney}>
                  <Text style={{ color: '#005195' }}>全部提现</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', height: 55, alignItems: 'center' }}>
          <Text style={{ color: '#333' }}>备注</Text>
          <TextInput placeholder='请输入备注' value={remark} onChangeText={v => setRemark(v)} style={{ flex: 1, height: 55, marginLeft: 10 }} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity activeOpacity={0.7} disabled={!info.bankId || price <= 0 || isTip} onPress={handleSubmit}>
            <Text style={[
              styles.btn, {
                backgroundColor: info.bankId && price > 0 && !isTip ? 'red' : '#f1f1f1',
                color: info.bankId && price > 0 && !isTip ? '#fff' : '#bdbdbd'
              }]}>
              提交
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12
  },
  content: {
    flex: 1
  },
  card: {
    backgroundColor: '#fff',
    paddingBottom: 20
  },
  header: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f1f1f1'
  },
  btn: {
    width: '100%',
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    fontSize: 16,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#f1f1f1',
    color: '#bdbdbd'
  }
})

export default WithDrawal
