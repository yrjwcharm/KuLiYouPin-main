import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native'
import ListRow from 'teaset/components/ListRow/ListRow'
import Checkbox from 'teaset/components/Checkbox/Checkbox'
import Icon from 'react-native-vector-icons/Feather'

const SelectBankDrawer = (props) => {
  const { list, onChange, defaultInfo, onJumpCard, hideBtn } = props
  const [info, setInfo] = useState(defaultInfo || {
    bankId: undefined,
    bankName: undefined
  })

  const handleChangeBank = (item) => {
    if (typeof onChange === 'function') {
      onChange(item)
      setInfo(item)
    }
  }

  return (
    <>
      <ScrollView>
        {list.map((item, key) => {
          return (
            <View key={key}>
              <ListRow onPress={() => handleChangeBank({ bankId: item.bankId, bankName: item.bankName })} title={item.bankName} detail={(
                <Checkbox
                  onChange={() => handleChangeBank({ bankId: item.bankId, bankName: item.bankName })}
                  checked={item.bankId === info.bankId}
                  checkedIcon={<Icon name='check-circle' size={20} color='red' />}
                  uncheckedIcon={<Icon name='circle' size={20} color='#999' />}
                />
              )} />
            </View>
          )
        })}
      </ScrollView>
      {!hideBtn ? (
        <View style={{ padding: 10 }}>
          <TouchableOpacity onPress={onJumpCard}>
            <Text style={styles.btn}>使用新卡提现</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  btn: {
    width: '100%',
    height: 40,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'red',
    textAlign: 'center',
    lineHeight: 40,
    borderRadius: 2,
    overflow: 'hidden'
  }
})

export default SelectBankDrawer
