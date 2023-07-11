// apis/user.js
// 引入网络请求模块
import { uniFetch } from './uni-fetch'
export default {
  /**
   * @param {Object} data 用户账号和用户密码
   */
  login(data) {
    if (!data.account || !data.password) return
    // 根据接口文档来调用接口
    return uniFetch.post('/driver/login/account', data)
  },
  profile() {
    return uniFetch.get('/driver/users')
  },
  task(year, month) {
    return uniFetch.get('/driver/users/taskReport', { year, month })
  },

  truck() {
    return uniFetch.get('/driver/users/truck')
  },
}
