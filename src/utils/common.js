import { Platform, Dimensions, StatusBar } from 'react-native'
import DeviceInfo from 'react-native-device-info'

const isIPhoneX = () => {
  return Platform.OS === 'ios' && DeviceInfo.hasNotch()
}

const isIos = Platform.OS === 'ios'

const { height, width } = Dimensions.get('window')

const IPhoneXPaddingTop = 24
const iosStatusBarHeight = 20
const HeaderHeight = 44
const HeaderStatusBarHeight = isIPhoneX() ? (IPhoneXPaddingTop + iosStatusBarHeight) : isIos ? iosStatusBarHeight : StatusBar.currentHeight

// iPhoneX 底部高度兼容处理
function isIPhoneXFooter (number) {
  number = isNaN(+number) ? 0 : +number
  return number + (isIPhoneX ? 34 : 0)
}

export {
  isIPhoneX,
  isIos,
  HeaderStatusBarHeight,
  width,
  height,
  HeaderHeight,
  isIPhoneXFooter
}
