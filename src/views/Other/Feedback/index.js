import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import { getFeeBackTypeList, insertFeeBackData } from '~/service/mine'
import { launchImageLibrary } from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Feather'
import Toast from 'teaset/components/Toast/Toast'
import ModalIndicator from 'teaset/components/ModalIndicator/ModalIndicator'
import { formUploadHandle } from '~/utils/functional'
import { useSelector } from 'react-redux'

const Feedback = () => {
  const user = useSelector(state => state.user)
  const [typeList, setTypeList] = useState([])
  const [typeId, setTypeId] = useState(undefined)
  const [message, setMessage] = useState(undefined)
  const [files, setFiles] = useState([])

  // 图片选择器参数设置
  const options = {
    mediaType: 'photo'
  }

  const openImageSelect = () => {
    launchImageLibrary(options, (res) => {
      if (res.fileSize > 2 * 1024 * 1024) {
        Toast.fail('图片过大,请上传2M以内图片')
      } else if (!res.didCancel) {
        const _files = [...files]
        _files.push(res)
        setFiles(_files)
      }
    })
  }

  const submitHandle = async () => {
    if (!typeId) {
      Toast.fail('请选择意见类型!')
      return
    }
    if (!message) {
      Toast.fail('请输入反馈内容!')
      return
    }
    const _fileList = []
    ModalIndicator.show('正在提交请稍后...')
    if (files.length) {
      for (let k = 0; k < files.length; k++) {
        const data = await formUploadHandle(files[k], user.token)
        if (data) {
          _fileList.push(data)
        } else {
          ModalIndicator.hide()
          Toast.fail('图片上传失败！')
          return
        }
      }
    }

    const data = {
      feedbackTypeId: typeId,
      content: message,
      imgUrl1: _fileList[0],
      imgUrl2: _fileList[1],
      imgUrl3: _fileList[2]
    }
    insertFeeBackData(data).then(res => {
      const { rel } = res
      ModalIndicator.hide()
      if (rel) {
        Toast.success('提交成功')
        setTypeId(undefined)
        setMessage(undefined)
        setFiles([])
      } else {
        Toast.fail('提交失败')
      }
    })
  }

  const onLoad = () => {
    getFeeBackTypeList().then(res => {
      if (res.rel && res.data) {
        setTypeList(res.data)
      }
    })
  }
  useEffect(() => {
    onLoad()
  }, [])
  return (
    <View style={styles.page}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>意见类型</Text>
          <View style={styles.itemList}>
            {typeList.map((item, key) => {
              return (
                <TouchableOpacity key={key} onPress={() => setTypeId(item.id)}>
                  <Text style={[
                    styles.typeItem, {
                      backgroundColor: typeId === item.id ? 'red' : '#fff',
                      color: typeId === item.id ? '#fff' : '#666'
                    }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <Text style={styles.title}>描述文字/上传图片</Text>
          <View style={styles.info}>
            <TextInput
              value={message}
              style={styles.message}
              multiline
              onChangeText={v => setMessage(v)}
              placeholder='输入您的反馈内容，帮助我们更快处理您的问题'
            />
            <Text style={styles.title}>上传图片({files.length}/3)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              {files.map((item, key) => {
                return (
                  <TouchableOpacity key={key} onPress={() => {}}>
                    <Image style={{ width: 100, height: 100, marginRight: 10, marginBottom: 10 }} source={{ uri: item.uri }} />
                  </TouchableOpacity>
                )
              })}
              {files.length < 3 ? (
                <TouchableOpacity onPress={openImageSelect}>
                  <View style={styles.imageBox}>
                    <Icon name='plus' size={28} color='#999' />
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <TouchableOpacity onPress={submitHandle}>
            <Text style={styles.btn}>提交</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1
  },
  content: {
    padding: 10
  },
  title: {
    paddingTop: 14,
    paddingBottom: 8,
    fontSize: 12,
    color: '#666'
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  typeItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    marginRight: 5,
    fontWeight: '600'
  },
  info: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  message: {
    height: 120,
    textAlignVertical: 'top',
    lineHeight: 22
  },
  btn: {
    backgroundColor: 'red',
    color: '#fff',
    width: '100%',
    height: 44,
    textAlign: 'center',
    lineHeight: 44,
    marginTop: 10,
    fontSize: 16
  },
  imageBox: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f9f9f9'
  }
})

export default Feedback
