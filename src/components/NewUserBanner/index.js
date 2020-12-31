import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import moment from 'moment'
import { useSelector } from 'react-redux'
import GetBackageroundImageSize from '~/components/GetBackageroundImageSize'
import { width } from '~/utils/common'
import { useNavigation } from '@react-navigation/native'
import CountDownTimer from '~/components/CountDownTimer'

const NewUserBanner = ({ type }) => {
  const user = useSelector(state => state.user)
  const { navigate } = useNavigation()
  const { isNewUser, newUserData } = user
  if (!newUserData || !newUserData.flashId) {
    return null
  }
  return (
    <View style={styles.container}>
      <GetBackageroundImageSize
        url={type === 'home' ? newUserData.picHome : newUserData.picCentre}
        imageWidth={width}
        onPress={() => navigate('ceremonyPeople')}
      >
        <View style={styles.content}>
          {isNewUser === 1 || isNewUser === 0 || isNewUser === 5 ? (
            <Text style={styles.text}>立即抢购 > </Text>
          ) : null}
          {isNewUser === 2 ? (
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.timeWrap}>
                <Text style={{ fontSize: 12, color: '#fff' }}>剩余时间：</Text>
                <CountDownTimer
                  date={new Date(new Date().getTime() + newUserData.millisecond * 1)}
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
              <Text style={styles.text}>立即抢购 > </Text>
            </View>
          ) : null}
          {isNewUser === 3 ? (
            <Text style={styles.text}>返场福利 > </Text>
          ) : null}
          {isNewUser === 4 ? (
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.timeWrap}>
                <Text style={{ fontSize: 12, color: '#fff' }}>剩余时间：</Text>
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
              <Text style={styles.text}>返场福利 > </Text>
            </View>
          ) : null}
        </View>
      </GetBackageroundImageSize>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  },
  timeWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10
  },
  text: {
    fontSize: 12,
    color: '#d52c4a',
    backgroundColor: '#fef9e3',
    width: 80,
    height: 25,
    textAlign: 'center',
    lineHeight: 25,
    borderRadius: 12,
    overflow: 'hidden'
  },
  time: {
    color: '#fff'
  },
  colon: {
    color: '#fff'
  }
})

export default NewUserBanner
