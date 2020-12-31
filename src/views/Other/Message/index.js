import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { useSelector } from 'react-redux'
import ListRow from 'teaset/components/ListRow/ListRow'

const Message = () => {
  const app = useSelector(state => state.app)
  return (
    <View style={styles.page}>
      <Text style={styles.title}>客服热线：{app.telephone || '000-00000000'}</Text>
      <ListRow
        icon={<Image style={{ width: 40, height: 40, marginRight: 12 }} source={require('~/assets/message/order-message-icon.png')} />}
        title='订单消息'
        titlePlace='top'
        detail='暂无消息'
        onPress={() => {}}
      />
      <ListRow
        icon={<Image style={{ width: 40, height: 40, marginRight: 12 }} source={require('~/assets/message/other-message-icon.png')} />}
        title='其他消息'
        titlePlace='top'
        detail='暂无消息'
        onPress={() => {}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  title: {
    fontSize: 12,
    color: '#666',
    lineHeight: 50,
    textAlign: 'center'
  }
})

export default Message
