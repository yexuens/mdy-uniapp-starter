import {env} from '@/constants'
import {stringifyQuery} from '@/libs/queryString'

export interface IUniUploadFileOptions {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

export type CustomRequestOptions = UniApp.RequestOptions & {
  query?: Record<string, any>
  data: Record<string, any>
  /** 出错时是否隐藏错误提示 */
  hideErrorToast?: boolean
} & IUniUploadFileOptions // 添加uni.uploadFile参数类型

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 接口请求支持通过 query 参数配置 queryString
    if (options.method === 'GET' || options.method === 'DELETE') {
      if (options.query) {
        options.query.dbName = env.dbName
      } else {
        options.query = {
          dbName: env.dbName,
        }
      }
    }
    if (options.method === 'POST' || options.method === 'PUT') {
      if (options.data) {
        options.data['dbName'] = env.dbName
      } else {
        options.data = {
          dbName: env.dbName,
        }
      }
    }

    if (options.query) {
      const queryStr = stringifyQuery(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      } else {
        options.url += `?${queryStr}`
      }
    }
    options.url = `${env.baseUrl}${options.url}`
    // 1. 请求超时
    options.timeout = 10000 // 10s
    // 2. （可选）添加小程序端请求头标识
    options.header = {
      ...options.header,
      xcx: 1,
    }
    // 3. 添加 token 请求头标识
    // const userStore = useUserStore()
    // const { token } = userStore.userInfo as unknown
    // if (token) {
    //   options.header.Authorization = `Bearer ${token}`
    // }
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
