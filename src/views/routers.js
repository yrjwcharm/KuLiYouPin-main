import * as React from 'react'
import { Login, SettingsPage } from '~/views/Personal'
import { SearchPage, DetailsPage, SearchList } from '~/views/Product'
import { BrandPage } from '~/views/Other'
import { TouchableOpacity, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import Routine from '~/views/Activity/Routine'
import Point from '~/views/Activity/Point'
import GiftCenter from '~/views/Activity/GiftCenter'
import SignIn from '~/views/Activity/SignIn'
import UpdateVip from '~/views/Activity/UpdateVip'
import Secondary from '~/views/Other/Secondary'
import AddressEditAndAdd from '~/views/Personal/AddressEditAndAdd'
import Address from '~/views/Personal/Address'
import ConfirmedOrder from '~/views/Order/Confirmed'
import GiftInfo from '~/views/Activity/GiftInfo'
import Fans from '~/views/Personal/Fans'
import OrderList from '~/views/Order/List'
import Coupon from '~/views/Personal/Coupon'
import PersonalGiftCenter from '~/views/Personal/GiftCenter'
import Profit from '~/views/Personal/Profit'
import OrderDetails from '~/views/Order/Details'
import OrderCashier from '~/views/Order/Cashier'
import OrderSuccess from '~/views/Order/Success'
import OrderSelectService from '~/views/Order/SelectService'
import OrderService from '~/views/Order/Service'
import Integral from '~/views/Personal/Integral'
import Balance from '~/views/Personal/Balance'
import WithDrawal from '~/views/Personal/WithDrawal'
import { navigate } from '~/utils/navigation'
import WidthDrawalContent from '~/views/Personal/WithDrawalDetails'
import WithDrawalAddCard from '~/views/Personal/WithDrawalAddCard'
import changeMobile from '~/views/Personal/ChangeMobile'
import shopSettings from '~/views/Personal/ShopSettings'
import CeremonyPeople from '~/views/Other/CeremonyPeople'
import Message from '~/views/Other/Message'
import AuthReal from '~/views/Other/AuthReal'
import GiftConfirmed from '~/views/Order/GiftConfirmed'
import Feedback from '~/views/Other/Feedback'
import FeedbackList from '~/views/Other/FeedbackList'

const HeaderLeft = (props) => {
  const { navigate } = useNavigation()
  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <TouchableOpacity {...props} style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name='arrowleft' size={22} />
      </TouchableOpacity>
      <TouchableOpacity {...props} onPress={() => navigate('home')} style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
        <Icon name='home' size={22} />
      </TouchableOpacity>
    </View>
  )
}

const routers = [
  /*
  * other
  * */
  {
    name: 'brand',
    component: BrandPage,
    options: {
      title: '品牌特卖'
    }
  },
  {
    name: 'secondary',
    component: Secondary
  },
  /**
   * Personal 个人中心路由
   */
  {
    name: 'settings',
    component: SettingsPage,
    options: { title: '设置' }
  },
  {
    name: 'mobileLogin',
    component: Login,
    options: {
      title: '登陆',
      headerLeft: HeaderLeft
    }
  },
  {
    name: 'changeMobile',
    component: changeMobile,
    options: {
      title: '修改手机号'
    }
  },
  {
    name: 'shopSettings',
    component: shopSettings,
    options: {
      title: '小店设置'
    }
  },
  {
    name: 'ceremonyPeople',
    component: CeremonyPeople,
    options: {
      title: '新人一元购'
    }
  },
  {
    name: 'search',
    component: SearchPage,
    options: {
      headerShown: false
    }
  },
  {
    name: 'searchList',
    component: SearchList,
    options: {
      headerShown: false
    }
  },
  {
    name: 'details',
    component: DetailsPage,
    options: {
      headerShown: false
    }
  },
  // 活动
  {
    name: 'routine',
    component: Routine,
    options: {
      title: '加载中...'
    }
  },
  {
    name: 'point',
    component: Point,
    options: {
      title: '加载中...'
    }
  },
  {
    name: 'giftCenter',
    component: GiftCenter
  },
  {
    name: 'giftInfo',
    component: GiftInfo,
    options: {
      title: '赠品活动'
    }
  },
  {
    name: 'signIn',
    component: SignIn,
    options: {
      title: '签到'
    }
  },
  {
    name: 'updateVip',
    component: UpdateVip,
    options: {
      title: '升级VIP店主'
    }
  },
  // 收货地址
  {
    name: 'addressEditAndAdd',
    component: AddressEditAndAdd
  },
  {
    name: 'address',
    options: {
      title: '收货地址'
    },
    component: Address
  },
  {
    name: 'confirmedOrder',
    component: ConfirmedOrder,
    options: {
      title: '订单确认'
    }
  },
  {
    name: 'giftConfirmedOrder',
    component: GiftConfirmed,
    options: {
      title: '订单确认'
    }
  },
  {
    name: 'fans',
    component: Fans,
    options: {
      title: '粉丝'
    }
  },
  {
    name: 'orderList',
    component: OrderList,
    options: {
      title: '我的订单'
    }
  },
  {
    name: 'orderDetails',
    component: OrderDetails,
    options: {
      title: '订单详情'
    }
  },
  {
    name: 'orderCashier',
    component: OrderCashier,
    options: {
      title: '收银台'
    }
  },
  {
    name: 'orderSuccess',
    component: OrderSuccess,
    options: {
      title: '支付成功'
    }
  },
  {
    name: 'orderSelectService',
    component: OrderSelectService,
    options: {
      title: '选择售后服务'
    }
  },
  {
    name: 'orderService',
    component: OrderService,
    options: {
      title: '售后服务'
    }
  },
  {
    name: 'coupon',
    component: Coupon,
    options: {
      title: '优惠劵'
    }
  },
  {
    name: 'myGiftCenter',
    component: PersonalGiftCenter,
    options: {
      title: '礼品中心'
    }
  },
  {
    name: 'profit',
    component: Profit,
    options: {
      title: '我的收益'
    }
  },
  {
    name: 'integral',
    component: Integral,
    options: {
      title: '消费积分'
    }
  },
  {
    name: 'balance',
    component: Balance,
    options: {
      title: '加载中...'
    }
  },
  {
    name: 'withDrawal',
    component: WithDrawal,
    options: {
      title: '余额提现',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigate('withDrawalDetails')}>
          <Text style={{ paddingHorizontal: 12 }}>提现明细</Text>
        </TouchableOpacity>
      )
    }
  },
  {
    name: 'withDrawalDetails',
    component: WidthDrawalContent,
    options: {
      title: '提现明细'
    }
  },
  {
    name: 'withDrawalAddCard',
    component: WithDrawalAddCard,
    options: {
      title: '添加银行卡'
    }
  },
  {
    name: 'message',
    component: Message,
    options: {
      title: '消息'
    }
  },
  {
    name: 'authReal',
    component: AuthReal,
    options: {
      title: '实名认证'
    }
  },
  {
    name: 'feedback',
    component: Feedback,
    options: {
      title: '意见反馈',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigate('feedbackList')}>
          <Text style={{ paddingHorizontal: 12 }}>我的反馈</Text>
        </TouchableOpacity>
      )
    }
  },
  {
    name: 'feedbackList',
    component: FeedbackList,
    options: {
      title: '我的反馈'
    }
  }
]

export default routers
