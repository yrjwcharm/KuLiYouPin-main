import React, { Component } from 'react'
import { View, ViewPropTypes, Animated, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import ViewPager from '@react-native-community/viewpager'
import { width } from '~/utils/common'
import SceneComponent from './SceneComponent'
import DefaultTabBar from './DefaultTabBar'

class ViewPagerTabs extends Component {
  constructor (props) {
    super(props)
    const position = new Animated.Value(props.initialPage)
    const offset = new Animated.Value(0)
    const scrollValue = Animated.add(position, offset)
    const callListeners = this._polyfillAnimatedValue(scrollValue)
    let positionValue = props.initialPage
    let offsetValue = 0

    position.addListener(({ value }) => {
      positionValue = value
      callListeners(positionValue + offsetValue)
    })
    offset.addListener(({ value }) => {
      offsetValue = value
      callListeners(positionValue + offsetValue)
    })
    const sceneKeys = this.newSceneKeys({ currentPage: props.initialPage })

    this.state = {
      // 默认页
      currentPage: props.initialPage,
      scrollValue,
      position,
      offset,
      containerWidth: width,
      sceneKeys
    }
  }

  scrollOnMountCalled = false
  scrollView = undefined

  goToPage (pageNumber) {
    if (this.scrollView) {
      if (this.props.scrollWithoutAnimation) {
        this.scrollView.setPageWithoutAnimation(pageNumber)
      } else {
        this.scrollView.setPage(pageNumber)
      }
    }
    const currentPage = this.state.currentPage
    this.updateSceneKeys({
      page: pageNumber,
      callback: this._onChangeTab.bind(this, currentPage, pageNumber)
    })
  }

  updateSceneKeys ({ page, children = this.props.children, callback = () => {} }) {
    const newKeys = this.newSceneKeys({
      previousKeys: this.state.sceneKeys,
      currentPage: page,
      children
    })
    this.setState({ currentPage: page, sceneKeys: newKeys }, callback)
  }

  /**
   * 创建页面keys
   * @param previousKeys
   * @param currentPage
   * @param children
   * @return {[]}
   */
  newSceneKeys ({ previousKeys = [], currentPage = 0, children = this.props.children }) {
    const newKeys = []
    this._children(children).forEach((child, idx) => {
      const key = this._makeSceneKey(child, idx)
      if (this._keyExists(previousKeys, key) || this._shouldRenderSceneKey(idx, currentPage)) {
        newKeys.push(key)
      }
    })
    return newKeys
  }

  /**
   * 动画事件监听
   * @param animatedValue
   * @return {function(*): *}
   * @private
   */
  _polyfillAnimatedValue (animatedValue) {
    const listeners = new Set()
    const addListener = (listener) => {
      listeners.add(listener)
    }
    const removeListener = (listener) => {
      listeners.delete(listener)
    }
    const removeAllListeners = () => {
      listeners.clear()
    }
    animatedValue.addListener = addListener
    animatedValue.removeListener = removeListener
    animatedValue.removeAllListeners = removeAllListeners

    return value => listeners.forEach(listener => listener({ value }))
  }

  _shouldRenderSceneKey (idx, currentPageKey) {
    const numOfSibling = this.props.prerenderSiblingsNumber
    return (idx < (currentPageKey + numOfSibling + 1) && idx > (currentPageKey - numOfSibling - 1))
  }

  _keyExists (sceneKeys, key) {
    return sceneKeys.find(sceneKey => key === sceneKey)
  }

  _makeSceneKey (child, idx) {
    return child.props.tabLabel + '_' + idx
  }

  renderScrollableContent () {
    const scenes = this._composeScenes()
    if (!scenes.length) {
      return false
    }
    return (
      <ViewPager
        key={this._children().length}
        style={styles.scrollableContent}
        initialPage={this.props.initialPage}
        onPageSelected={this.handleUpdateSelectPage.bind(this)}
        keyboardDismissMode='on-drag'
        scrollEnabled={!this.props.locked}
        onPageScroll={this.handlePageScroll}
        ref={scrollView => { this.scrollView = scrollView }}
        {...this.props.contentProps}
      >
        {scenes}
      </ViewPager>
    )
  }

  handlePageScroll = (e) => {
    e.persist()
    Animated.parallel([
      Animated.timing(this.state.position, {
        toValue: e.nativeEvent.position,
        useNativeDriver: true,
        duration: 3000
      }),
      Animated.timing(this.state.offset, {
        toValue: e.nativeEvent.offset,
        useNativeDriver: true,
        duration: 1000
      })
    ]).start(() => {
      this._onScroll(e)
    })
  }

  _composeScenes () {
    return this._children().map((child, idx) => {
      const key = this._makeSceneKey(child, idx)
      return (
        <SceneComponent
          key={idx}
          shouldUpdated={this._shouldRenderSceneKey(idx, this.state.currentPage)}
          style={{ width: this.state.containerWidth, flex: 1 }}
        >
          {this._keyExists(this.state.sceneKeys, key) ? child : <View tabLabel={child.props.tabLabel} />}
        </SceneComponent>
      )
    })
  }

  /**
   * 完成导航到所选页面后，将调用此回调
   * @param nextPage
   */
  handleUpdateSelectPage (nextPage) {
    const localNextPage = nextPage.nativeEvent.position
    const currentPage = this.state.currentPage
    this.updateSceneKeys({
      page: localNextPage,
      callback: this._onChangeTab.bind(this, currentPage, localNextPage)
    })
  }

  _onChangeTab (prevPage, currentPage) {
    this.props.onChangeTab({
      i: currentPage,
      ref: this._children()[currentPage],
      from: prevPage
    })
  }

  _onScroll (e) {
    const { position, offset } = e.nativeEvent
    this.props.onScroll(position + offset)
  }

  renderTabBar (props) {
    if (props.tabs.length) {
      if (this.props.renderTabBar === false) {
        return null
      } else if (this.props.renderTabBar) {
        return React.cloneElement(this.props.renderTabBar(props), props)
      } else {
        return <DefaultTabBar {...props} />
      }
    }
  }

  /**
   * 返回子节点集合
   * @param children 默认props.children
   * @return {Array<Exclude<*, boolean | null | undefined>>}
   * @private
   */
  _children (children = this.props.children) {
    return React.Children.map(children, child => child)
  }

  _handleLayout = (e) => {
    const { width } = e.nativeEvent.layout
    if (!width || width <= 0 || Math.round(width) === Math.round(this.state.containerWidth)) {
      return false
    }
    this.setState({ containerWidth: width })
    requestAnimationFrame(() => {
      this.goToPage(this.state.currentPage)
    })
  }

  render () {
    const { currentPage, containerWidth } = this.state
    const {
      style,
      tabBarBackgroundColor,
      tabBarActiveTextColor,
      tabBarInactiveTextColor,
      tabBarTextStyle,
      tabBarUnderlineStyle,
      tabBarMaxNum
    } = this.props
    const overlayTabs = (
      this.props.tabBarPosition === 'overlayTop' ||
      this.props.tabBarPosition === 'overlayBottom'
    )
    const tabBarProps = {
      goToPage: (index) => this.goToPage(index),
      tabs: this.props.tabs,
      activeTab: currentPage,
      containerWidth: containerWidth,
      tabBarMaxNum: tabBarMaxNum
    }
    if (tabBarBackgroundColor) {
      tabBarProps.backgroundColor = tabBarBackgroundColor
    }
    if (tabBarActiveTextColor) {
      tabBarProps.activeTextColor = tabBarActiveTextColor
    }
    if (tabBarInactiveTextColor) {
      tabBarProps.inactiveTextColor = tabBarInactiveTextColor
    }
    if (tabBarTextStyle) {
      tabBarProps.textStyle = tabBarTextStyle
    }
    if (tabBarUnderlineStyle) {
      tabBarProps.underlineStyle = tabBarUnderlineStyle
    }
    return (
      <View style={[styles.container, style]} onLayout={this._handleLayout.bind(this)}>
        {this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps)}
        {this.renderScrollableContent()}
        {(this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps)}
      </View>
    )
  }
}

ViewPagerTabs.defaultProps = {
  tabBarPosition: 'top',
  initialPage: 0,
  page: -1,
  onChangeTab: () => {},
  onScroll: () => {},
  contentProps: {},
  scrollWithoutAnimation: false,
  locked: false,
  prerenderSiblingsNumber: 1,
  tabBarMaxNum: 5,
  tabs: []
}

ViewPagerTabs.propTypes = {
  tabs: PropTypes.array,
  // tabs 位置
  tabBarPosition: PropTypes.oneOf(['top', 'bottom', 'overlayTop', 'overlayBottom']),
  // 默认第几页
  initialPage: PropTypes.number,
  // 当前选定的选项卡
  page: PropTypes.number,
  // tabs 切换
  onChangeTab: PropTypes.func,
  // 页面滑动调用接受参数int 当前页
  onScroll: PropTypes.func,
  // 自定义tabBar
  renderTabBar: PropTypes.any,
  // tabs 底部线条样式
  tabBarUnderlineStyle: ViewPropTypes.style,
  // tabs 背景颜色
  tabBarBackgroundColor: PropTypes.string,
  // tabs 选中颜色
  tabBarActiveTextColor: PropTypes.string,
  // tabs 默认颜色
  tabBarInactiveTextColor: PropTypes.string,
  // tabs 一页展示数量
  tabBarMaxNum: PropTypes.number,
  // tabs 文本样式
  tabBarTextStyle: PropTypes.object,
  // 容器样式
  style: ViewPropTypes.style,
  // content props
  contentProps: PropTypes.object,
  // 是否开启滚动动画
  scrollWithoutAnimation: PropTypes.bool,
  // 是否锁定滚动
  locked: PropTypes.bool,
  // 预渲染页数
  prerenderSiblingsNumber: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1
  },
  scrollableContent: {
    flex: 1
  }
})

export default ViewPagerTabs
