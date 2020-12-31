import React from 'react'

import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native'

const GiftActivityContent = ({ data }) => {
  const CycleType = {
    1: '单次',
    2: '每周',
    3: '每月'
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {data.map((item, key) => {
          return (
            <View key={key}>
              {item.resultGiveList.map((_item, _key) => {
                return (
                  <View key={_key}>
                    <View style={styles.row}>
                      <Text style={styles.label}>规则</Text>
                      <View style={styles.content}>
                        <Text style={styles.contentText}>
                          {item.getCondition === 1 ? '支付金额' : '购买数量'}满
                          {_item.getConditionValue}{item.getCondition === 1 ? '元' : '件'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>赠</Text>
                      <View style={styles.content}>
                        <Text style={styles.productName}>{_item.productName}</Text>
                        <View style={styles.tags}>
                          {_item?.specName.map((__item, __key) => {
                            return <Text style={styles.tagItem} key={__key}>{__item}</Text>
                          })}
                        </View>
                        {_item?.specName.length > 1 ? (
                          <Text style={styles.tagItem}>多规格任选其一</Text>
                        ) : null}
                        <Text style={styles.itemLabel}>
                          {CycleType[item.getCycle]}赠送
                          {item.getCycle !== 1 ? (
                            <Text>(共赠送{item.userGetQuantityMax}次)</Text>
                          ) : null}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              })}
              {item.consumptionMoney ? (
                <View style={styles.row}>
                  <Text style={styles.label}>返</Text>
                  <View style={styles.content}>
                    <Text style={styles.contentText}>订单完成返{item.consumptionMoney}元</Text>
                  </View>
                </View>
              ) : null}
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  label: {
    width: 80,
    height: 30,
    lineHeight: 30,
    textAlign: 'center',
    fontSize: 14,
    color: '#333'
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'center'
  },
  contentText: {
    lineHeight: 24,
    fontSize: 12,
    color: '#333'
  },
  productName: {
    fontSize: 12,
    color: '#333',
    lineHeight: 24
  },
  tags: {
    flexDirection: 'row',
    paddingVertical: 6
  },
  tagItem: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: '#f5f5f9',
    color: '#555',
    fontSize: 12,
    marginRight: 10
  },
  itemLabel: {
    backgroundColor: '#FF8F00',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: 12,
    marginTop: 6
  }
})

export default GiftActivityContent
