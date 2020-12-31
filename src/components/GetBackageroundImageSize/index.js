import * as React from 'react'
import { Image, ImageBackground, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'

const GetBackageroundImageSize = ({ url, imageWidth, onPress, children }) => {
  let flag = false
  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)
  React.useEffect(() => {
    Image.getSize(url, (w, h) => {
      const pax = w / imageWidth
      !flag && setWidth(imageWidth)
      !flag && setHeight(Math.floor(h / pax))
    })
    return () => {
      flag = true
    }
  }, [])
  return (
    <TouchableOpacity style={{ width, height }} onPress={onPress}>
      <ImageBackground source={{ uri: url }} style={{ width, height }}>
        <View style={{ width: '100%', height: height, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {children}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

GetBackageroundImageSize.propTypes = {
  url: PropTypes.string,
  imageWidth: PropTypes.number,
  onPress: PropTypes.func
}
GetBackageroundImageSize.defaultProps = {
  onPress: () => {}
}

export default GetBackageroundImageSize
