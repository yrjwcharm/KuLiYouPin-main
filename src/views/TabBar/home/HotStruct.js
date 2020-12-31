import * as React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { filterActivityHandle } from '~/utils/tools'
import { getHotProduct } from '~/service/home'
import { width as _width } from '~/utils/common'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { useNavigation } from '@react-navigation/native'
import { jumpTypeCheckedHook } from '~/hooks/useTypeCheckedHook'

const HotStruct = ({ id }) => {
  const { navigate } = useNavigation()
  const [list, setList] = React.useState([])
  React.useEffect(() => {
    let flag = false
    if (!list.length) {
      getHotProduct(id).then(({ rel, data }) => {
        if (rel && data && data.length) {
          !flag && setList(filterActivityHandle(data))
        }
      })
    }
    return () => {
      flag = true
    }
  }, [])
  return (
    <View style={styles.container}>
      {list.map((item, key) => {
        return (
          <View key={key} style={styles.item}>
            {item.goodsCount === 1 ? (
              <View>
                <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[0])} url={item.activityList[0].picAddress} imageWidth={_width} />
              </View>
            ) : null}
            {item.goodsCount === 2 ? (
              <View style={{ flexDirection: 'row' }}>
                <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[0])} url={item.activityList[0].picAddress} imageWidth={_width / 2} />
                <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[1])} url={item.activityList[1].picAddress} imageWidth={_width / 2} />
              </View>
            ) : null}
            {item.goodsCount === 3 ? (
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[0])} url={item.activityList[0].picAddress} imageWidth={_width / 2} />
                <View style={{ width: _width / 2 }}>
                  <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[1])} url={item.activityList[1].picAddress} imageWidth={_width / 2} />
                  <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, item.activityList[2])} url={item.activityList[2].picAddress} imageWidth={_width / 2} />
                </View>
              </View>
            ) : null}
            {(item.goodsCount === 4 || item.goodsCount === 5 || item.goodsCount === 6 || item.goodsCount === 7) ? (
              <View style={{ flexDirection: 'row' }}>
                {item.activityList.map((_item, key) => {
                  const _imageWidth = _width / item.activityList.length
                  return <GetImageSizeComponent onPress={() => jumpTypeCheckedHook(navigate, _item)} key={key} url={_item.picAddress} imageWidth={parseInt(_imageWidth)} />
                })}
              </View>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flex: 1
  }
})

HotStruct.propTypes = {
  id: PropTypes.number
}

export default HotStruct
