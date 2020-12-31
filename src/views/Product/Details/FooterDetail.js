import * as React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import HtmlView from 'react-native-htmlview'
import PropTypes from 'prop-types'
import GetImageSizeComponent from '~/components/GetImageSizeComponent'
import { width } from '~/utils/common'
import { useTheme } from '@react-navigation/native'

const FooterDetail = (props) => {
  const { detailUrls, description, templateTop, goodsTop, templateBottom, goodsBottom } = props
  const { colors } = useTheme()
  return (
    <View style={styles.detail_container}>
      <View style={styles.detail_title}>
        <Text style={[styles.detail_title_text, { color: colors.text }]}>商品详情</Text>
      </View>
      <View>
        {description ? (
          <Text style={[styles.detail_desc, { color: colors.text }]}>{description}</Text>
        ) : null}
        {templateTop ? <HtmlView value={templateTop} /> : null}
        {goodsTop ? <HtmlView value={goodsTop} /> : null}
        {detailUrls.map((item, key) => {
          return <GetImageSizeComponent url={item.url} key={key} imageWidth={width} />
        })}
        {templateBottom ? <HtmlView value={templateBottom} /> : null}
        {goodsBottom ? <HtmlView value={goodsBottom} /> : null}
      </View>
    </View>
  )
}
FooterDetail.propTypes = {
  detailUrls: PropTypes.array,
  description: PropTypes.string,
  templateTop: PropTypes.any,
  goodsTop: PropTypes.any,
  templateBottom: PropTypes.any,
  goodsBottom: PropTypes.any
}

const styles = StyleSheet.create({
  detail_container: {
    marginTop: 10
  },
  detail_title: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  detail_title_text: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  detail_desc: {
    fontSize: 14,
    lineHeight: 20,
    padding: 10
  }
})

export default FooterDetail
