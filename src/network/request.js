import axios from 'axios'
import { Toast } from 'zarm'

const MODE = import.meta.env.MODE // 环境变量

export const BaseUrl = MODE == 'development' ? '/api' : 'http://124.220.24.244';

export function request(config) {
  
  const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    withCredentials: true,
  })

  instance.interceptors.request.use(config => {
    config.headers.Authorization = `${localStorage.getItem('token') || null}`
    return config
  }, err => {
    console.log(err)
  })

  instance.interceptors.response.use(
    res => {
      if (typeof res.data !== 'object') {
        Toast.show('服务端异常')
        return Promise.reject(res)
      }
      if (res.data.code !== 200) {
        if (res.data.msg) Toast.show(res.data.msg)
        if (res.data.code == 401) {
          window.location.href = '/login'
        }
        return Promise.reject(res.data)
      }
      return res.data
    },
    error => {
      console.log(error)
    }
  )

  return instance(config)
}