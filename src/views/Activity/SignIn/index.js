import * as React from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Image, Text, TouchableOpacity } from 'react-native'
import LikeMore from '~/components/LikeMore'
import { addActSignIn, getAttendanceInfo, getAttendanceRate } from '~/service/activity'
import Toast from 'teaset/components/Toast/Toast'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/EvilIcons'
import { DefaultTheme } from '~/themes'
import { width } from '~/utils/common'
import { navigate } from '~/utils/navigation'

@connect(({ user }) => ({
  user
}))
class SignIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // 15天活动范围
      mapList: [],
      // 活动规则 连续天数，总天数赠送积分
      actSignInItemsList: [],
      // 签到详情列表-> 以前那些天
      actSignInUserStatDetail: [],
      // 当前活动时间
      actSingnIn: { timeEnd: '', timeStart: '' },
      // 当前
      active: 8,
      currentData: '',
      countSerial: 0,
      countTotal: 0,
      // 本期活动积分
      activityIntegral: 0,
      payPoints: 0,
      actionValueId: undefined,
      loading: true,
      rateValue: 0,

      everydayAttendanceList: [],
      continuityAttendanceList: [],
      totalAttendanceList: [],
      isCurrentAttendance: false,
      currentAttendanceTime: { integral: 0 },
      scrollIntoView: undefined
    }
  }

  scrollView = undefined

  async componentDidMount () {
    const { route: { params: { id } } } = this.props
    this.initCurrentData()
    this.getAttendanceRate()
    await this.getInitData(id)
  }

  /**
   * 获取积分兑换比例
   */
  getAttendanceRate () {
    // 获取积分兑换比例
    getAttendanceRate().then(res => {
      const { rel, data } = res
      if (rel) {
        this.setState({ rateValue: data.bcKeyValue })
      }
    })
  }

  /**
   * 获取当前签到活动
   */
  async getInitData (id) {
    const { rel, data } = await getAttendanceInfo(id)
    if (rel) {
      const _content = {
        // 当前活动商品
        actionValueId: data.actionValueId,
        // 签到获得积分
        mapList: data.mapList,
        // 活动规则 连续天数，总天数赠送积分
        actSignInItemsList: data.actSignInItemsList,
        // 已签到列表
        actSignInUserStatDetail: data.actSignInUserStatDetail || [],
        // 当前签到活动信息-> 开始时间 结束时间
        actSingnIn: data.actSingnIn || { timeEnd: '', timeStart: '' },
        // 用户总积分
        payPoints: data.payPoints || 0,
        activityIntegral: data.activityIntegral || 0
      }
      if (data.actSignInUserStat) {
        _content.countSerial = data.actSignInUserStat.countSerial || 0
        _content.countTotal = data.actSignInUserStat.countToal || 0
      }
      this.setState(_content, () => {
        setTimeout(() => {
          if (this.scrollView) {
            this.scrollView.scrollTo({ x: width / 6 * 3.5, animated: true })
          }
        }, 1000)
        // 过滤签到类型
        this.filterSignTypeHandle()
      })
    }
  }

  /**
   * 过滤签到类型
   */
  filterSignTypeHandle () {
    const { actSignInUserStatDetail, actSignInItemsList, mapList, actSingnIn, currentData } = this.state
    // 每日签到
    const everydayAttendanceList = actSignInItemsList.filter(
      item => item.itemType === 1)
    // 连续签到
    const continuityAttendanceList = actSignInItemsList.filter(
      item => item.itemType === 2)
    // 累计签到
    const totalAttendanceList = actSignInItemsList.filter(
      item => item.itemType === 3)
    // 今日是否签到
    const isCurrentAttendance = !!actSignInUserStatDetail.filter(
      item => item.signInTime.indexOf(currentData) !== -1).length
    // 今日签到积分
    let currentAttendanceTime = { integral: 0 }

    if (mapList.length) {
      mapList.forEach(item => {
        if (item.date.indexOf(currentData) !== -1) {
          currentAttendanceTime = item
        }
      })
    }
    this.setState({
      everydayAttendanceList,
      continuityAttendanceList,
      totalAttendanceList,
      isCurrentAttendance,
      currentAttendanceTime
    }, () => {
      setTimeout(() => {
        this.setState({ scrollIntoView: 'item3' })
      }, 2000)
      // 是否自动签到
      if (actSingnIn?.isSignInAuto) {
        const { isCurrentAttendance: _isCurrentAttendance } = this.state
        // 今日是否签到
        if (!_isCurrentAttendance) {
          this.onAddActSignHandle().then(r => {})
        }
      }
    })
  }

  /**
   * 确认签到
   */
  async onAddActSignHandle () {
    const { route: { params: { id } } } = this.props
    // 签到
    const { rel, data } = await addActSignIn({ signInId: id })
    if (rel) {
      // 成功
      if (data?.resultFeedback === 0) {
        Toast.success(`恭喜签到完成，今日获得${this.state.currentAttendanceTime.integral}积分`)
        this.setState({
          // 15天活动范围
          mapList: [],
          // 活动规则 连续天数，总天数赠送积分
          actSignInItemsList: [],
          // 签到详情列表-> 以前那些天
          actSignInUserStatDetail: [],
          // 当前活动时间
          actSingnIn: { timeEnd: '', timeStart: '' },
          // 当前
          active: 8,
          currentData: '',
          countSerial: 0,
          countTotal: 0,
          // 本期活动积分
          activityIntegral: 0,
          payPoints: 0,
          actionValueId: undefined,
          loading: true,
          rateValue: 0,

          everydayAttendanceList: [],
          continuityAttendanceList: [],
          totalAttendanceList: [],
          isCurrentAttendance: false,
          currentAttendanceTime: { integral: 0 },
          scrollIntoView: undefined
        }, () => {
          this.initCurrentData()
          this.getAttendanceRate()
          this.getInitData(id)
        })
      }
    }
  }

  /**
   * 获取当前年月日
   */
  initCurrentData () {
    const date = new Date()
    const year = date.getFullYear()
    const month = this.dataPatchPosition(+date.getMonth() + 1)
    const _date = this.dataPatchPosition(date.getDate())
    // 当前年月日
    this.setState({ currentData: `${year}-${month}-${_date}` })
  }

  /**
   * 未满两位补0
   * @param value
   * @returns {string}
   */
  dataPatchPosition (value) {
    return value < 10 ? '0' + value : value
  }

  /**
   * 截取时间年月日
   * @param value
   * @returns {string}
   */
  slideData (value) {
    return value.substring(0, 10)
  }

  /**
   * 检测当前日期
   * @param _d
   * @returns {boolean}
   */
  checkedAttendanceHandle (_d) {
    const { actSignInUserStatDetail } = this.state
    return !!actSignInUserStatDetail.filter(item => item.signInTime.slice(0, 10) === _d.slice(0, 10)).length
  }

  renderHeader () {
    const {
      user: {
        avatar,
        nickName,
        payPoints,
        sex
      }
    } = this.props
    const { rateValue } = this.state
    return (
      <ImageBackground style={styles.header} source={require('~/assets/attendance-bg.jpg')}>
        <View style={styles.headerContent}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <View style={styles.headerName}>
              <Image style={styles.sexImage} source={sex ? require('~/assets/man-icon.png') : require('~/assets/garl-icon.png')} />
              <Text style={{ color: '#fff', marginLeft: 10, fontSize: 18 }}>{nickName}</Text>
            </View>
            <Text style={{ color: '#fff', marginTop: 6 }}>积分值：{payPoints || 0}</Text>
            <Text style={{ color: '#fff', marginTop: 6, fontSize: 12 }}>每{rateValue}积分可抵扣1元</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }

  renderCondition () {
    const { currentAttendanceTime, activityIntegral, countSerial, countTotal, isCurrentAttendance } = this.state
    return (
      <View style={styles.conContent}>
        <View style={styles.conInfo}>
          <Text style={{ fontSize: 16, color: '#111' }}>
            今日获取
            <Text style={styles.conText}>{currentAttendanceTime.integral || 0}</Text>积分 本期累计
            <Text style={styles.conText}>{activityIntegral}</Text>
            积分
          </Text>
          <Text style={{ fontSize: 12, color: '#777', marginTop: 10 }}>
            已连续签到
            <Text style={styles.conText}>{countSerial}</Text>天,累计
            <Text style={styles.conText}>{countTotal}</Text>天,再接再厉哦！
          </Text>
        </View>
        <TouchableOpacity disabled={isCurrentAttendance} onPress={() => this.onAddActSignHandle()}>
          <Text style={styles.btn}>{isCurrentAttendance ? '已签到' : '签到'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderCalendar () {
    const { mapList, currentData } = this.state
    return (
      <View style={styles.calendar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={(ref) => { this.scrollView = ref }}>
          {mapList.map((item, key) => {
            const bgColor = this.slideData(item.date) === currentData ? DefaultTheme.colors.brand : '#888'
            return (
              <TouchableOpacity key={key}>
                <View style={styles.calendarItem}>
                  <Text style={{ fontSize: 14, color: '#333' }}>{item.date.slice(5, 10).replace('-', '.')}</Text>
                  <View style={styles.calendarItemInfo}>
                    <View style={[styles.integral, { backgroundColor: bgColor }]}>
                      {item.commodityId ? (
                        <Image style={styles.dateIcon} source={require('~/assets/gift-icon2.png')} />
                      ) : (
                        <Text style={{ fontSize: 12, color: '#fff' }}>{item.integral}</Text>
                      )}
                    </View>
                    {this.checkedAttendanceHandle(item.date) ? (
                      <View style={[styles.calendarSuccess, { backgroundColor: DefaultTheme.colors.brand }]}>
                        {item.commodityId ? (
                          <Image style={styles.dateIcon} source={require('~/assets/gift-icon2.png')} />
                        ) : <Icon name='check' size={26} color='#fff' />}
                      </View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  renderSignInfo () {
    const { navigation: { navigate } } = this.props
    const { actSingnIn, everydayAttendanceList, continuityAttendanceList, totalAttendanceList } = this.state
    return (
      <View style={styles.signInfo}>
        <Text style={styles.signInfoTitle}>活动说明</Text>
        <Text style={styles.signInfoText}>本期签到活动时间：{actSingnIn.timeStart.slice(0, 10)}~{actSingnIn.timeEnd.slice(0, 10)}</Text>
        {everydayAttendanceList.map((item, index) => {
          return (
            <Text key={index} style={styles.signInfoText}>
              每日签到您将获得：<Text style={{ color: DefaultTheme.colors.brand }}>{item.itemTypeValue}</Text> 积分
            </Text>
          )
        })}
        {continuityAttendanceList.map((item, key) => {
          return (
            <View key={key} style={{ flexDirection: 'row' }}>
              <Text style={styles.signInfoText}>连续{item.itemTypeKey}</Text><Text style={styles.signInfoText}>天见到您将获得</Text>
              {item.productId ? (
                <TouchableOpacity onPress={() => navigate('details', { id: item.productId, skuId: item.skuId })}>
                  <Image style={styles.giftIcon} source={require('~/assets/gift-icon.png')} />
                </TouchableOpacity>
              ) : (
                <Text style={styles.signInfoText}>
                  <Text style={{ color: DefaultTheme.colors.brand }}>{item.itemTypeValue}</Text>
                  <Text>积分</Text>
                </Text>
              )}
            </View>
          )
        })}
        {totalAttendanceList.map((item, key) => {
          return (
            <View key={key} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={styles.signInfoText}>连续{item.itemTypeKey}天见到您将获得</Text>
              {item.productId ? (
                <TouchableOpacity onPress={() => navigate('details', { id: item.productId, skuId: item.skuId })}>
                  <Image style={styles.giftIcon} source={require('~/assets/gift-icon.png')} />
                </TouchableOpacity>
              ) : (
                <Text style={styles.signInfoText}>{item.itemTypeValue} <Text>积分</Text></Text>
              )}
            </View>
          )
        })}
      </View>
    )
  }

  render () {
    return (
      <View style={styles.page}>
        <ScrollView>
          {this.renderHeader()}
          {this.renderCondition()}
          {this.renderCalendar()}
          {this.renderSignInfo()}
          <LikeMore title='今日推荐' />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  header: {},
  headerContent: {
    paddingTop: 34,
    flexDirection: 'row',
    paddingBottom: 34,
    paddingLeft: 20,
    paddingRight: 20
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden'
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10
  },
  headerName: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  sexImage: {
    width: 16,
    height: 16
  },

  conContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  conInfo: {
    flex: 1
  },
  conText: {
    fontSize: 14,
    marginTop: 6,
    color: DefaultTheme.colors.brand
  },
  btn: {
    backgroundColor: DefaultTheme.colors.brand,
    color: '#fff',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 14,
    borderRadius: 12,
    overflow: 'hidden'
  },
  signInfo: {
    backgroundColor: '#fff',
    padding: 10
  },
  calendar: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10
  },
  calendarItem: {
    backgroundColor: '#fff',
    width: width / 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarItemInfo: {
    width: 40,
    height: 40,
    marginTop: 6,
    position: 'relative'
  },
  integral: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarSuccess: {
    position: 'absolute',
    width: 40,
    height: 40,
    left: 0,
    top: 0,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
  dateIcon: {
    width: 20,
    height: 20
  },
  giftIcon: {
    width: 15,
    height: 15
  },
  signInfoTitle: {
    fontSize: 16,
    lineHeight: 32
  },
  signInfoText: {
    fontSize: 14,
    lineHeight: 28,
    color: '#666'
  }
})

export default SignIn
