import http from '~/utils/http'

/**
 * 获取轮播
 * @param id 分类id
 * @returns {Promise<void>}
 */
export function getSwipeList (id) {
  return http({
    url: '/ActivityGoodsItems/queryAllItems',
    method: 'get',
    params: {
      actRange: id
    }
  })
}

/**
 * 获取icon活动
 * @returns {Promise<void>}
 */
export function getIconShortcutList () {
  return http({
    url: '/ActivityNavigation/selectNavigation',
    method: 'get'
  })
}

/**
 * 获取热门商品
 * @param id 分类id
 * @returns {Promise<void>}
 */
export function getHotProduct (id) {
  return http({
    url: '/ActivityGoodsItems/RecommendAll',
    method: 'get',
    params: {
      actRange: id
    }
  })
}

/**
 * 获取首页商品展示方式
 * @returns {Promise<void>}
 */
export function getHomeViewType () {
  return http({
    url: '/sysBaseConfigValue/querySysBase',
    method: 'get'
  })
}

/**
 * 根据名称分页查询商品
 * @param params 分页查询
 * @param mode 类型
 * @returns {Promise<void>}
 */
export function selectByCategory (params, mode) {
  return http({
    url: mode === 2 ? '/distributorsBrand/getPage' : '/goods/selectByCategory',
    method: 'get',
    params: params
  })
}

/**
 * 获取品牌列表
 * @param data
 * @returns {Promise<void>}
 */
export function getBrandHotList (data) {
  return http({
    url: '/distributorsBrand/getQueryBrand',
    method: 'get',
    params: data
  })
}

/**
 * 获取品牌秀列表 不分页
 * @returns Promise
 */
export function getNovelBrandList (params) {
  return http({
    url: '/distributorsBrand/getCategoryPageIsShow',
    method: 'get',
    params
  })
}

/**
 * 根据分类分页查询商品
 * @param params 分页查询
 * @returns {Promise<void>}
 */
export function categoryQueryProduct (params) {
  return http({
    url: '/goods/selectByCategory',
    method: 'get',
    params
  })
}


/**
 * 获取首页秒杀数据
 * @returns {Promise<void>}
 */
export function getHomeSeckills () {
  return http({
    url: '/seckill/getRandomSeckillGoods',
    method: 'get'
  })
}
