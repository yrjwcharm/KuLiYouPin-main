/**
 * 礼品中心
 */
import React, { useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native'
import ScrollableTabView from '~/components/ViewPagerTabs'
import GiftCenterContent from '~/views/Personal/GiftCenter/GiftCenterContent'
import { useTheme } from '@react-navigation/native'
import Toast from 'teaset/components/Toast/Toast'
import { getGiftCodeApi } from '~/service/activity'

const tabs = [
  { title: '待领取', type: 0 },
  { title: '已领取', type: 1 },
  { title: '未开始', type: 3 },
  { title: '已过期', type: 2 }
]

const PersonalGiftCenter = () => {
  const { colors } = useTheme()
  const [initialPage, setInitialPage] = useState(0)
  const [value, setValue] = useState(undefined)
  const [btnLoading, setBtnLoading] = useState(false)

  const getGiftCodeHandle = () => {
    if (!value) {
      Toast.fail('请输入礼品码！')
      return false
    }

    setBtnLoading(true)
    getGiftCodeApi(value).then(({ rel, msg }) => {
      if (rel) {
        Toast.success(msg)
      } else {
        Toast.fail(msg)
      }
    }).finally(() => {
      setBtnLoading(false)
    })
  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', height: 35, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
        <TextInput value={value} onChangeText={v => setValue(v)} placeholder='请输入礼品码' style={{ flex: 1 }} />
        <TouchableOpacity onPress={getGiftCodeHandle} disabled={btnLoading} activeOpacity={0.9}>
          <Text style={[styles.btn, { backgroundColor: colors.brand }]}>获取礼品</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollableTabView
          style={styles.container}
          onChangeTab={({ i }) => {
            setInitialPage(i)
          }}
          tabBarActiveTextColor='#EF4034'
          tabBarInactiveTextColor='#333'
          tabBarUnderlineStyle={{ backgroundColor: '#EF4034' }}
          initialPage={0}
          tabs={tabs}
          page={initialPage}
          renderingSiblingsNumber={2}>
          {tabs.map((item, key) => {
            return (
              <View key={key} style={[styles.container, { backgroundColor: '#f5f5f9' }]}>
                <GiftCenterContent type={item.type} />
              </View>
            )
          })}
        </ScrollableTabView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  btn: {
    height: 30,
    lineHeight: 30,
    borderRadius: 15,
    overflow: 'hidden',
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#fff'
  }
})

export default PersonalGiftCenter
