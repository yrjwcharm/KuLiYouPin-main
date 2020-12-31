import React, { Component } from 'react'
import { View, Animated, ViewPropTypes, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import PropTypes from 'prop-types'

class DefaultTabBar extends Component {
  itemView = []
  scrollW = 0
  scrollViewRef = undefined
  shouldUpdate = true
  initLoading = false

  constructor (props) {
    super(props)
    const { tabBarMaxNum, containerWidth, tabs } = this.props
    const len = tabs.length || tabBarMaxNum
    const itemWidth = tabBarMaxNum < len ? containerWidth / tabBarMaxNum : containerWidth / len
    this.state = {
      itemWidth,
      leftValue: new Animated.Value(0),
      index: -1
    }
  }

  shouldComponentUpdate () {
    if (!this.shouldUpdate) {
      return false
    }
    return !(this.shouldUpdate = false)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.activeTab !== this.props.activeTab) {
      this.setState({ index: nextProps.activeTab })
      setTimeout(() => {
        this.setIndex(nextProps.activeTab, true)
      }, 200)
    }
  }

  setLayout (layout, index) {
    this.itemView[index] = layout
    this.scrollW += layout.width
    if (this.itemView.length === this.props.tabs.length && !this.initLoading) {
      setTimeout(() => {
        this.setIndex(this.props.activeTab, true)
      }, 200)
    }
  }

  setIndex = (index, bl) => {
    const { containerWidth } = this.props
    const { itemWidth } = this.state
    if (!this.scrollViewRef) {
      return false
    }
    // 拿到当前项的位置数据
    const layout = this.itemView[index]
    // 屏幕一半宽度
    const rx = containerWidth / 2
    // 公式
    let sx = layout.x - rx + layout.width / 2
    let toLeftValue = 0
    if (sx < 0) {
      sx = 0
    }
    // 移动位置
    if (sx < this.scrollW - containerWidth) {
      if (sx === 0) {
        toLeftValue = layout.x + itemWidth / 2 / 2
      } else {
        toLeftValue = rx - itemWidth / 2 / 2
      }
      this.scrollViewRef.scrollTo({ x: sx, animated: bl })
    }
    if (this.props.tabs.length > this.props.tabBarMaxNum) {
      // 结尾部分直接移动到底
      if (sx >= this.scrollW - containerWidth) {
        toLeftValue = sx + itemWidth / 2 / 2
        this.scrollViewRef.scrollToEnd({ animated: bl })
      }
    } else {
      toLeftValue = layout.x + itemWidth / 2 / 2
      this.scrollViewRef.scrollToEnd({ animated: bl })
    }
    this.shouldUpdate = true
    this.initLoading = true
    this.props.goToPage(index)
    Animated.timing(this.state.leftValue, {
      toValue: toLeftValue,
      useNativeDriver: false,
      duration: 200
    }).start()
  }

  renderTab = (name, page, isTabActive) => {
    const { activeTextColor, inactiveTextColor, textStyle, tabStyle } = this.props
    const { itemWidth } = this.state
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    const fontWeight = isTabActive ? 'bold' : 'normal'
    return (
      <TouchableOpacity
        onPress={(e) => {
          e.persist()
          this.setIndex(page, true)
        }}
        key={page}
        style={{ flex: 1 }}
        onLayout={e => this.setLayout(e.nativeEvent.layout, page)}
      >
        <View style={[styles.item, { width: itemWidth }, tabStyle]}>
          <Text style={[styles.itemText, { fontWeight: fontWeight, color: textColor }, textStyle]}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const {
      backgroundColor,
      style,
      underlineStyle
    } = this.props
    return (
      <View style={[styles.tab, { backgroundColor: backgroundColor }, style]}>
        <ScrollView
          horizontal
          directionalLockEnabled
          ref={ref => { this.scrollViewRef = ref }}
          snapToAlignment='center'
          showsHorizontalScrollIndicator={false}
        >
          {this.props.tabs.map((item, page) => {
            const isTabActive = this.props.activeTab === page
            const renderTab = this.props.renderTab || this.renderTab
            return renderTab(item.title, page, isTabActive)
          })}
        </ScrollView>
        <Animated.View
          style={[
            styles.activeLine,
            {
              width: parseInt(this.state.itemWidth / 2) || 0,
              left: this.state.leftValue
            },
            underlineStyle
          ]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tab: {
    width: '100%',
    height: 40,
    position: 'relative'
  },
  item: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 14
  },
  activeLine: {
    height: 3,
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
    backgroundColor: '#fff'
  }
})

DefaultTabBar.defaultProps = {
  activeTextColor: 'white',
  inactiveTextColor: 'white',
  backgroundColor: null,
  activeTab: -1
}

DefaultTabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
  containerWidth: PropTypes.number,
  backgroundColor: PropTypes.string,
  activeTextColor: PropTypes.string,
  inactiveTextColor: PropTypes.string,
  textStyle: ViewPropTypes.style,
  underlineStyle: ViewPropTypes.style,
  tabBarMaxNum: PropTypes.number
}
export default DefaultTabBar
