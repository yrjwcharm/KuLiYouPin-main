import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Text } from 'react-native'
import LikeMore from '~/components/LikeMore'
import { getSaleItemList } from '~/service/user'
import { useSelector } from 'react-redux'
import CountDownTimer from '~/components/CountDownTimer'
import { width } from '~/utils/common'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { useNavigation } from '@react-navigation/native'
import Toast from 'teaset/components/Toast/Toast'
import moment from 'moment'

const CeremonyPeople = () => {
  const user = useSelector(state => state.user)
  const { navigate } = useNavigation()
  const [list, setList] = useState([])
  const { newUserData, isNewUser } = user

  const getBtnText = () => {
    switch (isNewUser * 1) {
      case 0:
        return '已过期'
      case 1:
      case 2:
        return `${newUserData.specialPrice}元抢购`
      case 3:
        return '已结束'
      case 4:
        return `${newUserData.specialPrice}元抢购`
      case 5:
        return '已使用'
      default:
        return `${newUserData.specialPrice}元抢购`
    }
  }

  const handleJumpProduct = (item) => {
    if (isNewUser === 0) {
      Toast.fail('已过期')
      return
    }
    if (isNewUser === 5) {
      Toast.fail('已使用')
      return
    }
    if (isNewUser === 3) {
      Toast.fail('已结束')
      return
    }
    navigate('details', {
      id: item.productId,
      skuId: item.skuId
    })
  }

  const init = () => {
    getSaleItemList().then(({ rel, data }) => {
      if (rel) {
        setList(data)
      }
    })
  }

  useEffect(() => {
    init()
  }, [])
  return (
    <View style={styles.page}>
      <ScrollView>
        <GetImageSizeComponent url={newUserData.picOther1} imageWidth={width} />
        <View style={styles.content}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
            {isNewUser === 0 ? (
              <Text style={{ color: '#fff' }}>您的新人特权已过期！</Text>
            ) : null}
            {isNewUser === 5 ? (
              <Text style={{ color: '#fff' }}>您的新人特权已使用！</Text>
            ) : null}
            {isNewUser === 3 && (
              <View>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>您的新人特权时间已结束！</Text>
                <Text style={{ color: '#ccc', fontSize: 12, textAlign: 'center', marginTop: 10 }}>再次进入本页面可激活1次返场福利</Text>
              </View>
            )}
            {isNewUser === 2 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#fff' }}>剩余时间：</Text>
                <CountDownTimer
                  date={new Date(new Date().getTime() + newUserData.millisecond * 1).getTime()}
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
            ) : null}
            {isNewUser === 4 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#fff' }}>返场福利：</Text>
                <CountDownTimer
                  date={moment(newUserData.endTime)}
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
            ) : null}
          </View>
          <View style={styles.list}>
            {list.map((item, key) => {
              return (
                <TouchableOpacity key={key} style={styles.item} activeOpacity={0.9} onPress={() => handleJumpProduct(item)}>
                  <View style={styles.itemContent}>
                    <Image source={{ uri: item.imageUrl1 }} style={styles.itemImage} />
                    <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                    <Text style={[
                      styles.itemBtn, {
                        backgroundColor: isNewUser === 0 || isNewUser === 5 || isNewUser === 3 ? '#ccc' : '#d61238',
                        color: isNewUser === 0 || isNewUser === 5 || isNewUser === 3 ? '#777' : '#fff'
                      }]}>
                      {getBtnText()}
                    </Text>
                    {isNewUser === 5 ? (
                      <Image source={require('~/assets/ceremony-icon.png')} style={styles.itemOverlay} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
        <LikeMore title='为您推荐' />
      </ScrollView>
      <TouchableOpacity onPress={() => navigate('updateVip', { hideHeader: true })} style={[styles.shareBtn, { position: 'absolute', right: 0, top: 50 }]}>
        <Text style={{ fontSize: 14, color: '#fff' }}>去分享</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: 'relative'
  },
  shareBtn: {
    backgroundColor: '#e6392f',
    color: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 5,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20
  },
  content: {
    backgroundColor: '#d32c4b'
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  item: {
    width: (width - 40) / 3,
    marginLeft: 10,
    marginBottom: 10
  },
  itemContent: {
    backgroundColor: '#fff',
    borderRadius: 3,
    overflow: 'hidden',
    padding: 5,
    position: 'relative'
  },
  itemOverlay: {
    width: ((width - 40) / 3),
    height: ((width - 40) / 3) + 46,
    position: 'absolute',
    top: 0,
    left: 0
  },
  itemImage: {
    width: ((width - 40) / 3) - 10,
    height: ((width - 40) / 3) - 10,
    borderRadius: 3,
    overflow: 'hidden'
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24
  },
  itemBtn: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    borderRadius: 3,
    overflow: 'hidden'
  },
  time: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#d8b588',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    overflow: 'hidden'
  },
  colon: {
    color: '#fff',
    marginHorizontal: 5
  }
})

export default CeremonyPeople
