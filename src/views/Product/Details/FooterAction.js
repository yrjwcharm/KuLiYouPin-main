import * as React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Badge from 'teaset/components/Badge/Badge'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const FooterAction = (props) => {
  const { onAddCart, onSave, onShare, saveData } = props
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const base = useSelector(state => state.base)
  return (
    <SafeAreaView style={[styles.footerBar, { backgroundColor: colors.card }]}>
      <View style={styles.footerBarContainer}>
        <TouchableOpacity onPress={() => navigate('home')}>
          <View style={styles.footerBarBtn}>
            <AntDesign name='home' size={20} color={colors.text} />
            <Text style={[styles.footerBarBtnText, { color: colors.text }]}>首页</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSave(saveData)}>
          <View style={styles.footerBarBtn}>
            <AntDesign name={saveData ? 'heart' : 'hearto'} size={20} color={saveData ? colors.brand : colors.text} />
            <Text style={[styles.footerBarBtnText, { color: colors.text }]}>
              {saveData ? '已收藏' : '收藏'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigate('cart')}>
          <View style={styles.footerBarBtn}>
            <Badge count={base.cartNumber} style={styles.footerBarBtnBadge} />
            <AntDesign name='shoppingcart' size={20} color={colors.text} />
            <Text style={[styles.footerBarBtnText, { color: colors.text }]}>购物车</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.footerBarAcrBtns}>
          <TouchableOpacity
            onPress={() => onShare()}
            activeOpacity={0.9}
            style={{
              flex: 1,
              borderBottomLeftRadius: 20,
              borderTopLeftRadius: 20,
              overflow: 'hidden'
            }}
          >
            <Text style={[styles.footerBarAcrBtn, { backgroundColor: '#ff8917' }]}>
              转发
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onAddCart()}
            style={{
              flex: 1,
              borderBottomRightRadius: 20,
              borderTopRightRadius: 20,
              overflow: 'hidden'
            }}
          >
            <Text style={[styles.footerBarAcrBtn, { backgroundColor: '#ee0a24' }]}>
              立即购买
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  footerBar: {
    width: '100%',
    backgroundColor: '#fff'
  },
  footerBarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 48
  },
  footerBarBtn: {
    width: 58,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  footerBarBtnBadge: {
    position: 'absolute',
    right: 8,
    top: 2,
    zIndex: 9999
  },
  footerBarBtnText: {
    fontSize: 12,
    marginTop: 4
  },
  footerBarAcrBtns: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center'
  },
  footerBarAcrBtn: {
    height: 40,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 40,
    width: '100%',
    textAlign: 'center'
  }
})

export default FooterAction
