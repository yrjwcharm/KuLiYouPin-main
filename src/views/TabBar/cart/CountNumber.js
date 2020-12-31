import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'

const CountNumber = (props) => {
  const { count, onAdd, onReduce } = props
  const { colors } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity disabled={count <= 1} onPress={() => onReduce()}>
        <View style={[styles.btn, { color: colors.desc }]}>
          <Icon name='minus' size={14} color={count <= 1 ? colors.desc : colors.text} />
        </View>
      </TouchableOpacity>
      <Text style={[styles.input, { color: colors.text }]}>{count}</Text>
      <TouchableOpacity onPress={() => onAdd()}>
        <View style={[styles.btn, { color: colors.desc }]}>
          <Icon name='plus' size={14} color={colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  btn: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: 40,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
    color: '#333'
  }
})

CountNumber.propTypes = {
  count: PropTypes.number,
  onAdd: PropTypes.func,
  onReduce: PropTypes.func
}

CountNumber.defaultProps = {
  count: 1,
  onAdd: () => {},
  onReduce: () => {}
}
export default CountNumber
