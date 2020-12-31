export function jumpTypeCheckedHook (navigate, data) {
  console.log(data)
  const { itemType, itemName, fixValue, itemValue, pageUrl, seckillId, signInId, creditId } = data
  const _itemType = +itemType
  if (_itemType) {
    switch (_itemType) {
      case 1:
        // 跳转商品详情
        navigate('details', { id: fixValue || itemValue })
        break
      case 2:
        // 跳转二级分类页
        navigate('secondary', { id: fixValue | itemValue, name: itemName })
        break
      case 3:
        // 跳转品牌
        navigate('brand', { brandId: fixValue || itemValue })
        break
      case 4:
        // 跳转活动页面
        navigate('routine', { actId: fixValue || itemValue, iconType: 4 })
        break
      case 5:
        switch (pageUrl) {
          // 免费领
          case '/gift/list':
            navigate('giftCenter', { id: creditId, itemValue })
            break
          // 签到
          case '/attendance':
            navigate('signIn', { id: signInId })
            break
          // 积分换购
          case '/activity/point':
            navigate('point', { id: creditId, itemValue })
            break
          case '/updateVip':
            navigate('updateVip', { hideHeader: true })
        }
        break
      default:
        break
    }
  }
}
