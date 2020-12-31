import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native'
import { getHomeSeckills } from '~/service/home'
import CountDownTimer from '~/components/CountDownTimer'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useTheme } from '@react-navigation/native'
import { toMoney } from '~/utils/tools'

const Seckill = () => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [status, setStatus] = useState(false)
  const [downTime, setDownTime] = useState(new Date())
  const [list, setList] = useState([])
  const getInitData = (flag) => {
    getHomeSeckills().then(res => {
      const { rel, data } = res
      if (rel && flag) {
        setStatus(data?.countdown > 0)
        const _time = new Date(new Date().getTime() + data.countdown)
        setDownTime(_time)
        setList(data.seckillGoodsVoList || [])
      }
    })
  }
  useEffect(() => {
    let flag = true
    getInitData(flag)
    return () => {
      flag = false
    }
  }, [])
  if (!status || list.length <= 0) return null
  return (
    <View style={styles.seckill}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>每日秒杀</Text>
          <CountDownTimer
            date={downTime}
            hours=':'
            mins=':'
            segs=''
            containerStyle={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}
            daysStyle={styles.time}
            hoursStyle={styles.time}
            minsStyle={styles.time}
            secsStyle={styles.time}
            firstColonStyle={styles.colon}
            secondColonStyle={styles.colon}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.text }}>更多</Text>
          <Icon name='chevron-right' size={14} color={colors.text} />
        </View>
      </View>
      <View style={{ borderWidth: 1, borderColor: '#f5f5f9' }}>
        <ScrollView horizontal style={{ padding: 10 }}>
          {list.map((item, key) => {
            return (
              <TouchableOpacity key={key} style={{ marginRight: 10 }} activeOpacity={0.8} onPress={() => navigate('details', { id: item.productId, skuId: item.skuId })}>
                <View>
                  <Image source={{ uri: item.imageUrl }} style={{ width: 120, height: 120 }} />
                  <View style={styles.itemInfo}>
                    <View>
                      <Text style={styles.priceNew}>{toMoney(item.seckillPrice)}</Text>
                      <Text style={styles.priceDefault}>{toMoney(item.costPrice)}</Text>
                    </View>
                    <Text style={styles.seckillBtn}>抢</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  seckill: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    paddingBottom: 10
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10
  },
  time: {
    color: '#e4393c',
    borderWidth: 1,
    borderColor: '#e4393c',
    fontSize: 12,
    borderRadius: 3,
    padding: 2
  },
  colon: {
    marginLeft: 5,
    marginRight: 5,
    fontWeight: 'bold'
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 6
  },
  priceNew: {
    color: '#e4393c',
    fontSize: 16,
    fontWeight: '600'
  },
  priceDefault: {
    color: '#999',
    textDecorationLine: 'line-through',
    fontSize: 12
  },
  seckillBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#e4393c',
    color: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 14
  }
})
export default Seckill
