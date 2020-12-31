import * as React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { useTheme } from '@react-navigation/native'
import { HeaderHeight, HeaderStatusBarHeight, width } from '~/utils/common'
import Icon from 'react-native-vector-icons/Feather'

export default (props) => {
  const { onPress, title, statusBarStyle } = props
  const { colors } = useTheme()
  React.useEffect(() => {
    if (statusBarStyle) {
      StatusBar.setBarStyle(statusBarStyle)
    }
  })
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onPress}>
          <View
            style={[
              styles.wrapper,
              { backgroundColor: colors.descBg }
            ]}
          >
            <Icon name='search' size={20} color={colors.desc} />
            <Text
              style={[
                styles.text,
                { color: colors.desc }
              ]}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: HeaderStatusBarHeight
  },
  navBar: {
    width: width,
    height: HeaderHeight,
    paddingTop: 7,
    paddingRight: 10,
    paddingLeft: 10
  },
  wrapper: {
    width: '100%',
    height: 30,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
  },
  text: {
    marginLeft: 10,
    fontSize: 14
  }
})
