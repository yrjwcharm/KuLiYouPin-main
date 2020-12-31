import * as React from 'react'
import { StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native'
import ListRow from 'teaset/components/ListRow/ListRow'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const settings = () => {
  const user = useSelector(state => state.user)
  const { navigate } = useNavigation()
  const getUserId = (userId) => {
    return '69' + userId + String(userId / 3).substring(0, 2)
  }
  const switchSex = (sex) => {
    switch (sex * 1) {
      case 1:
        return '男'
      case 2:
        return '女'
      case 0:
        return '未知'
      default:
        return '未知'
    }
  }
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView style={styles.page}>
        <ListRow title='头像' detail={<Image style={{ width: 50, height: 50, borderRadius: 5, overflow: 'hidden' }} source={{ uri: user.avatar }} />} />
        <ListRow title='会员ID' detail={getUserId(user.userId)} />
        <ListRow title='会员名' detail={user.userName} />
        <ListRow title='昵称' detail={user.nickName} />
        <ListRow title='性别' detail={switchSex(user.sex)} />
        <ListRow title='手机号' onPress={() => navigate('changeMobile')} />
        <ListRow title='地址管理' onPress={() => navigate('address')} />
        {user.isJuniorShop ? (
          <ListRow title='小店设置' onPress={() => navigate('shopSettings')} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  }
})

export default settings
