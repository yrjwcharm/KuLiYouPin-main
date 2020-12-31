import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { editShopName, getCurrentShopInfo } from '~/service/user'
import Icon from 'react-native-vector-icons/Feather'
import Toast from 'teaset/components/Toast/Toast'
import { launchImageLibrary } from 'react-native-image-picker'
import { formUploadHandle } from '~/utils/functional'
import { useSelector } from 'react-redux'

const shopSettings = () => {
  const user = useSelector(state => state.user)
  const [name, setName] = useState(undefined)
  const [mobile, setMobile] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
  const [qrCode, setQrCode] = useState(undefined)
  const [btnLoading, setBtnLoading] = useState(false)
  // 图片选择器参数设置
  const options = {
    mediaType: 'photo'
  }

  const openImageSelect = (_name) => {
    launchImageLibrary(options, async (res) => {
      console.log(res)
      if (res.fileSize > 2 * 1024 * 1024) {
        Toast.fail('图片过大,请上传2M以内图片')
      } else if (!res.didCancel) {
        formUploadHandle(res, user.token).then(_url => {
          if (_name === 'logo') {
            setLogo(_url)
          } else {
            setQrCode(_url)
          }
        }).catch(() => {
          Toast.fail('图片上传失败')
        })
      }
    })
  }

  const handleSubmit = () => {
    setBtnLoading(true)
    editShopName({
      shopName: name,
      customerPhone: mobile,
      logoUrl: logo,
      customerPath: qrCode
    }).then(res => {
      const { rel, msg } = res
      if (rel) {
        Toast.success(msg)
      } else {
        Toast.fail(msg)
      }
    }).finally(() => {
      setBtnLoading(false)
    })
  }

  const initData = () => {
    getCurrentShopInfo().then(res => {
      const { rel, data: { shopName, customerPhone, logoUrl, customerQrcodePath } } = res
      if (rel) {
        setName(shopName)
        setMobile(customerPhone)
        if (logoUrl) {
          setLogo(logoUrl)
        }
        if (customerQrcodePath) {
          setQrCode(customerQrcodePath)
        }
      }
    })
  }

  useEffect(() => {
    initData()
  }, [])
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>店铺名称</Text>
          <TextInput style={styles.itemInput} value={name} onChangeText={v => setName(v)} placeholder='请输入店铺名称' />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>客服电话</Text>
          <TextInput style={styles.itemInput} value={mobile} onChangeText={v => setMobile(v)} placeholder='请输入客服电话' />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>店铺LOGO</Text>
          <TouchableOpacity style={styles.itemImageBtn} onPress={() => openImageSelect('logo')}>
            {logo ? <Image style={styles.itemImage} source={{ uri: logo }} /> : <Icon name='plus' size={32} color='#f5f5f9' />}
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>客服二维码</Text>
          <TouchableOpacity style={styles.itemImageBtn} onPress={() => openImageSelect('qrCode')}>
            {qrCode ? <Image style={styles.itemImage} source={{ uri: qrCode }} /> : <Icon name='plus' size={32} color='#f5f5f9' />}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.btn}>{btnLoading ? '提交中...' : '保存设置'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  content: {
    marginTop: 10
  },
  item: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemLabel: {
    width: 120,
    textAlign: 'center',
    lineHeight: 28,
    color: '#333'
  },
  itemInput: {
    flex: 1,
    height: 28
  },
  itemImage: {
    width: 80,
    height: 80
  },
  itemImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f5f5f9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    width: '100%',
    height: 44,
    backgroundColor: '#EF4034',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 44,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10
  }
})

export default shopSettings
