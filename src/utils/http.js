import axios from 'axios'
import Config from '~/config'
import storage from '@react-native-community/async-storage'
import httpStatus from '~/utils/httpStatus'
import { navigate } from '~/utils/navigation'

const service = axios.create({
  baseURL: Config.server.API_DOMAIN,
  timeout: Config.server.SESSION_TIMEOUT
})

service.interceptors.request.use(async configs => {
  configs.headers['Content-Type'] = 'application/json'
  configs.headers.HOSTURL = Config.header.HOST_URL
  configs.headers.STORECODE = Config.header.STORE_CODE
  const token = await storage.getItem('token')
  if (token) {
    configs.headers.Authorization = token
  }
  return configs
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  const resp = response.data
  if (response.status === 200) {
    return response.data
  } else {
    return resp
  }
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case httpStatus.AUTHENTICATE:
        if (storage.getItem('token')) {
          navigate('mobileLogin')
        }
        // 失败了
        // navigate('mobileLogin')
        break
    }
    return Promise.reject(error)
  }
})

export default service
