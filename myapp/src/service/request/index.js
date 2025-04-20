import axios from 'axios'
import { BASE_URL,TIMEOUT } from './config'
import useMainStore from '@/store/modules/main'

const mainstore = useMainStore()

class HYRequest {
  constructor(baseURL, timeout=10000) {
    this.instance = axios.create({
      baseURL,
      timeout
    })

    // 拦截器是针对axios实例写的,axios.interceptors.XXX.use()
    // 1.发送前,拦截器都是两个回调,成功的和失败的回调函数
    this.instance.interceptors.request.use((config)=>{
      mainstore.isLoading = true // 发送成功
      return config
    },err => {
      return err
    })
    // 2.响应后(无论请求成功或失败,都需要隐藏掉isLoading)
    this.instance.interceptors.response.use((res)=>{
      mainstore.isLoading = false // 接受成功
      return res
    },err => {
      mainstore.isLoading = false // 接受失败
      return err
    })
  }

  request(config) {
    return new Promise((resolve, reject) => {
      this.instance.request(config).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }

  get(config) {
    return this.request({ ...config, method: "get" })
  }

  post(config) {
    return this.request({ ...config, method: "post" })
  }
}

export default new HYRequest(BASE_URL,TIMEOUT)

