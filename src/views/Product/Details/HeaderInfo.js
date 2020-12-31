import * as React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { useTheme } from '@react-navigation/native'

const HeaderInfo = (props) => {
  const { activeNames, productName, labels } = props
  const { colors } = useTheme()
  return (
    <View style={[styles.topContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.productName, { color: colors.text }]}>
        {activeNames ? (
          <Text
            style={{
              backgroundColor: colors.brand,
              color: colors.brandText,
              fontSize: 12,
              lineHeight: 18
            }}
          >
            &nbsp;{activeNames}&nbsp;
          </Text>
        ) : null}
        &nbsp;{productName}
      </Text>
      {labels.length ? (
        <View style={styles.topLabels}>
          {labels.map((item, key) => {
            return <Text style={[styles.topLabelItem, { backgroundColor: 'rgba(239,64,52,0.2)', color: colors.brand }]} key={key}>{item}</Text>
          })}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    paddingTop: 10,
    paddingBottom: 10
  },
  productName: {
    fontSize: 16,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 18
  },
  topLabels: {
    flexDirection: 'row'
  },
  topLabelItem: {
    marginLeft: 10,
    fontSize: 12,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8
  }
})

export default HeaderInfo
