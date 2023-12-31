// apis/uni-fetch.js

// 导入安装好的 uni-app-fetch 模块
import { createUniFetch } from 'uni-app-fetch'
import { useUserStore } from '@/stores/user'

const tabBarPagePaths = [
  'pages/task/index',
  'pages/message/index',
  'pages/my/index',
]
// 配置符合自身业务的请求对象
export const uniFetch = createUniFetch({
  loading: { title: '正在加载...' },
  baseURL: 'https://slwl-api.itheima.net',
  intercept: {
    // 请求拦截器
    request(options) {
      const userState = useUserStore()
      // 全局公共头信息
      const defaultHeaders = {
        Authorization: userState.token,
      }
      // 自定义头信息（token）
      options.header = Object.assign({}, defaultHeaders, options.header)

      return options
    },
    // 响应拦截器

    response({ data, statusCode }) {
      const pageStack = getCurrentPages()
      const redirectURL = pageStack[pageStack.length - 1].route

      const routeType = tabBarPagePaths.includes(redirectURL)
        ? 'switchTab'
        : 'redirectTo'
      if (statusCode === 401) {
        return uni.redirectTo({
          url: `/pages/login/index?routeType=${routeType}&redirectURL=/${redirectURL}`,
        })
      }

      // 过滤多余的数据
      return data
    },
  },
})
