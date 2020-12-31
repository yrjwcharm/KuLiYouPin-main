export function sum (arr) {
  const len = arr.length
  if (len === 0) {
    return 0
  } else if (len === 1) {
    return arr[0]
  } else {
    return arr[0] + sum(arr.slice(1))
  }
}

export function compare (property) {
  return function (a, b) {
    return (a[property] - b[property])
  }
}

export function toMoney (value) {
  if (value) {
    return (value * 1).toFixed(2)
  } else {
    return (0).toFixed(2)
  }
}

export function isURL (domain) {
  const name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
  return name.test(domain)
}

/**
 * 过滤推荐商品数据格式
 * @param data
 * @returns {this}
 */
export function filterActivityHandle (data) {
  const _list = []
  data.forEach(item => {
    const _index = _list.findIndex(
      _item => _item.activityName === item.actName && _item.goodsCount ===
        item.goodsCount)
    if (_index === -1) {
      _list.push({
        activityName: item.actName,
        displaySequence: +item.displaySequence,
        goodsCount: item.goodsCount,
        activityList: [item]
      })
    } else {
      _list[_index].activityList.push(item)
    }
  })
  return _list.sort(compare('displaySequence'))
}
