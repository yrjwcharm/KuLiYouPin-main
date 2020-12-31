import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native'
import { getIconShortcutList } from '~/service/home'
import { jumpTypeCheckedHook } from '~/hooks/useTypeCheckedHook'

const Struct = () => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const [iconList, setIconList] = React.useState([])
  React.useEffect(() => {
    let flag = true
    if (!iconList.length) {
      getIconShortcutList().then(({ data }) => {
        flag && setIconList(data)
      })
    }
    return () => {
      flag = false
    }
  }, [])
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {iconList.map((item, key) => {
        return (
          <TouchableOpacity key={key} onPress={() => jumpTypeCheckedHook(navigate, item)}>
            <View style={styles.item}>
              <Image style={styles.itemImage} source={{ uri: item.inconUrl }} />
              <Text style={[styles.itemText, { color: colors.text }]}>{item.navigationName}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden'
  },
  itemText: {
    marginTop: 10,
    fontSize: 14
  }
})

export default Struct
