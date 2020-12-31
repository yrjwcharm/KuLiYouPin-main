import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { useTheme, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign'

const Header = (props) => {
  const { colors } = useTheme()
  const { navigate } = useNavigation()
  const {
    user: { avatar, discount, isUpgradeVip, userId, shopId, nickName, mobile, isMarketTing, isJuniorShop, invitecode, levelName },
    app: { dsp, rate }
  } = props

  const {
    user: { numberOfFans, balanceMoney, consumeBalance, payPoints, couponNum }
  } = props
  // 高级店铺升级vip
  const gjIsVip = !isMarketTing && !isJuniorShop && rate > 0 && dsp === 2 &&
    userId === shopId
  // 其他小店升级vip
  const isVip = userId !== shopId && !isMarketTing && !isJuniorShop && rate >
    0 && isUpgradeVip
  return (
    <View style={[styles.header, { backgroundColor: colors.brand }]}>
      <View style={styles.top}>
        <View style={styles.topContent}>
          <Image
            style={styles.avatar}
            source={{ uri: avatar }}
          />
          <View style={styles.topInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.brandText
              }}
              >
                {nickName || mobile}
              </Text>
              {levelName ? (
                <Text style={{
                  fontSize: 12,
                  color: colors.brandText,
                  backgroundColor: '#e1b76e',
                  marginLeft: 10,
                  borderRadius: 3,
                  overflow: 'hidden',
                  paddingVertical: 3,
                  paddingHorizontal: 6
                }}
                >
                  {levelName}
                </Text>
              ) : null}
            </View>
            <View style={styles.topDesc}>
              {(!isMarketTing && !isJuniorShop) ? <Text style={{ fontSize: 12, color: '#fff' }}>普通会员</Text> : null}
              {(invitecode && (isMarketTing || isJuniorShop)) ? (
                <Text style={{ fontSize: 12, color: '#fff' }}>我的邀请码：{invitecode}</Text>
              ) : null}
              {gjIsVip ? (
                <TouchableOpacity onPress={() => navigate('updateVip', { hideHeader: true })}>
                  <Text style={styles.topBtn}>升级VIP</Text>
                </TouchableOpacity>
              ) : null}
              {isVip ? (
                <TouchableOpacity onPress={() => navigate('updateVip', { hideHeader: true })}>
                  <Text style={styles.topBtn}>
                    升级VIP享{(((1 / (1 + (rate / 100))) * 10) / discount).toFixed(1)}折
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigate('settings')}>
          <Icon name='setting' size={28} color={colors.brandText} />
        </TouchableOpacity>
      </View>
      <View style={styles.struct}>
        <TouchableOpacity style={styles.structBtn} onPress={() => navigate('fans')}>
          <View style={styles.structItem}>
            <Text style={[styles.structText, { color: colors.brandText }]}>{numberOfFans || 0}</Text>
            <Text style={[
              styles.structText,
              {
                color: colors.brandText,
                marginTop: 6
              }]}
            >
              粉丝
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.structBtn} onPress={() => navigate('balance', { index: 1 })}>
          <View style={styles.structItem}>
            <Text style={[styles.structText, { color: colors.brandText }]}>{balanceMoney || 0}</Text>
            <Text style={[
              styles.structText,
              {
                color: colors.brandText,
                marginTop: 6
              }]}
            >
              余额
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.structBtn} onPress={() => navigate('balance', { index: 0 })}>
          <View style={styles.structItem}>
            <Text style={[styles.structText, { color: colors.brandText }]}>{consumeBalance || 0}</Text>
            <Text style={[
              styles.structText,
              {
                color: colors.brandText,
                marginTop: 6
              }]}
            >
              红包
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.structBtn} onPress={() => navigate('integral')}>
          <View style={styles.structItem}>
            <Text style={[styles.structText, { color: colors.brandText }]}>{payPoints || 0}</Text>
            <Text style={[
              styles.structText,
              {
                color: colors.brandText,
                marginTop: 6
              }]}
            >
              积分
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.structBtn} onPress={() => navigate('coupon', { index: 1 })}>
          <View style={styles.structItem}>
            <Text style={[styles.structText, { color: colors.brandText }]}>{couponNum || 0}</Text>
            <Text style={[
              styles.structText,
              {
                color: colors.brandText,
                marginTop: 6
              }]}
            >
              优惠劵
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 40,
    paddingTop: 10
  },
  top: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  topContent: {
    flexDirection: 'row',
    flex: 1
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff'
  },
  topInfo: {
    height: 60,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  topDesc: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  topBtn: {
    fontSize: 12,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    marginLeft: 10
  },
  struct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    marginTop: 10
  },
  structBtn: {
    flex: 1
  },
  structItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 70
  },
  structText: {
    fontSize: 14
  }
})

export default Header
