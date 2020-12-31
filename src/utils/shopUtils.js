
/**
 * 生成商品sku
 * @param DTOList
 * @returns {[]|*[]}
 */
export function handleGenerateSkuDTOList (DTOList) {
  if (!DTOList || !DTOList.length) {
    return []
  }
  const list = []
  DTOList.forEach((item, index) => {
    list.push({
      id: item.skuId, // skuId，下单时后端需要
      countDown: item.countdown || 0, // 秒杀倒计时
      costPrice: item.costPrice ? item.costPrice * 100 : 0,
      seckillPrice: item.seckillPrice ? item.seckillPrice * 100 : 0, // 秒杀价
      price: item.seckillPrice ? item.seckillPrice * 100 : item.salePrice *
        100, // 价格（单位分）
      activityPrice: item.activityPrice || false,
      s1: item.specId, // 规格类目 k_s 为 s1 的对应规格值 id
      s2: item.specId2, // 规格类目 k_s 为 s2 的对应规格值 id
      taxRate: item.taxRate ? item.taxRate.toFixed(2) : 0, // 是否存在税费
      weight: item.packageWeight, // 最多包含3个规格值，为0表示不存在该规格
      stock_num: item.skuQuantity, // 当前 sku 组合对应的库存
      img: item.imageUrl || item.imageUrl1
    })
  })
  return list
}

/**
 * 生成商品规格组
 * @param skuList
 * @returns {[]|*[]}
 */
export function handleGenerateSkuTree (skuList) {
  if (!skuList || !skuList.length) {
    return []
  }
  // 规格组
  const tree = []
  skuList.forEach(item => {
    // 是否存在
    const _i = tree.findIndex(skuItem => skuItem.k === item.parentSpecName)
    if (_i === -1) {
      tree.push({
        k: item.parentSpecName,
        v: [
          {
            id: item.id, // 规格值 id
            name: item.specName, // skuValueName：规格值名称
            imgUrl: item.imgUrl, // 规格类目图片，只有第一个规格类目可以定义图片
            previewImgUrl: item.imgUrl // 用于预览显示的规格类目图片
          }
        ],
        k_s: `s${item.parentSkuSpecId + 1}`
      })
    } else {
      tree[_i].v.push({
        id: item.id, // 规格值 id
        name: item.specName, // skuValueName：规格值名称
        imgUrl: item.imgUrl, // 规格类目图片，只有第一个规格类目可以定义图片
        previewImgUrl: item.imgUrl // 用于预览显示的规格类目图片
      })
    }
  })
  return tree
}
