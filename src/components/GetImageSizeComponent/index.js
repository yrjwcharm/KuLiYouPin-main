import * as React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'

const GetImageSizeComponent = ({ url, imageWidth, onPress }) => {
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
  return <TouchableOpacity style={{ width, height }} onPress={onPress}>
    <Image source={{ uri: url }} style={{ width, height }} />
  </TouchableOpacity>
}

GetImageSizeComponent.propTypes = {
  url: PropTypes.string,
  imageWidth: PropTypes.number,
  onPress: PropTypes.func
}
GetImageSizeComponent.defaultProps = {
  onPress: () => {}
}

export default GetImageSizeComponent
