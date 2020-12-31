import config from '~/config'
import http from '~/utils/http'

/**
 * 验证码身份证输入是否正确
 * @param id
 * @return {boolean}
 */
export function validateCard (id) {
  // true "验证通过", false //校验不通过
  const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
  // 号码规则校验
  if (!format.test(id)) {
    return false
  }
  // 出生年月日校验前正则限制起始年份为1900;
  const year = id.substr(6, 4) // 身份证年
  const month = id.substr(10, 2) // 身份证月
  const date = id.substr(12, 2) // 身份证日
  const time = Date.parse(month + '-' + date + '-' + year) // 身份证日期时间戳date
  const nowTime = Date.parse(new Date()) // 当前时间戳
  const dates = (new Date(year, month, 0)).getDate()// 身份证当月天数
  if (time > nowTime || date > dates) {
    return false
  }
  // 校验码判断
  const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
  const b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
  const idArray = id.split('')
  let sum = 0
  for (let k = 0; k < 17; k++) {
    sum += parseInt(idArray[k]) * parseInt(c[k])
  }
  return idArray[17].toUpperCase() === b[sum % 11].toUpperCase()
}

/**
 * 上传图片
 * @param file
 * @param token
 * @returns {Promise<unknown>}
 */
export function formUploadHandle (file, token) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.fileName
    })
    const _config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    http.post('/upload/oss', formData, _config).then(res => {
      const { data, rel } = res
      if (rel) {
        resolve(data[0])
      }
    }).catch(error => {
      reject(error)
    })
  })
}
