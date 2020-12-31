/**
 * 首页二级分类
 * @author echooys@qq.com
 */
import * as React from 'react'
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { useNavigation, useTheme } from '@react-navigation/native'
import { width } from '~/utils/common'

const SecondaryClass = ({ list }) => {
  const { navigate } = useNavigation()
  const { colors } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <ScrollView horizontal>
        {list.map((item, key) => {
          return (
            <TouchableOpacity key={key} onPress={() => navigate('secondary', { id: item.categoryId })}>
              <View style={styles.item}>
                {item.iconUrl ? (
                  <Image style={styles.itemImage} source={{ uri: item.iconUrl }} />
                ) : (
                  <View style={styles.itemImage} />
                )}
                <Text style={[styles.itemText, { color: colors.text }]}>{item.categoryName}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    width: width / 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  itemImage: {
    width: 50,
    height: 50
  },
  itemText: {
    fontSize: 14,
    marginTop: 6
  }
})

SecondaryClass.propTypes = {
  list: PropTypes.array
}

export default SecondaryClass
