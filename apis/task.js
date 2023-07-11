// apis/task.js
// 引入网络请求模块
import { uniFetch } from './uni-fetch'

export default {
  /**
   * 任务列表
   * @param {number} status - 任务状态
   * @param {string} page - 数据页码
   * @param {string} pageSize - 每页数据条件
   */
  list(status, page = 1, pageSize = 10) {
    return uniFetch.get('/driver/tasks/list', { status, page, pageSize })
  },

  detail(id) {
    if (!id) return { err: '请求出错了' }
    return uniFetch.get(`/driver/tasks/details/${id}`)
  },
  /**
   * 延迟提货
   * @param {Object} data - 接口参数
   */
  delay(data) {
    if (!data.id) return
    return uniFetch.put('/driver/tasks/delay', data)
  },
  /**
   * 提货
   * @property {Object} data - 接口参数
   */
  pickup(data) {
    if (!data.id) return
    return uniFetch.post('/driver/tasks/takeDelivery', data)
  },
  // 省略中间部分代码...

  /**
   * 上报异常
   * @param {Object} data - 接口数据
   */
  except(data) {
    return uniFetch.post('/driver/tasks/reportException', data)
  },
  deliver(data) {
    if (!data.id) return { error: '请求错误了' }
    return uniFetch.post('/driver/tasks/deliver', data)
  },
  record(data) {
    if (!data.id) return
    return uniFetch.post('/driver/tasks/truckRegistration', data)
  },
}
