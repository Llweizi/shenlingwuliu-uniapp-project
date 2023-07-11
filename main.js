import App from './App'
import '@/utils/utils'
// 引入pinia
import { createPinia } from 'pinia'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import { createSSRApp } from 'vue'
export function createApp() {
  // 实例化pinia
  const pinia = createPinia()
  const app = createSSRApp(App)

  // 传递给项目应用
  app.use(pinia)

  // pinia持久化插件
  // pinia.use(piniaPluginPersistedstate)

  // 自定义pinia插件实例
  pinia.use(
    createPersistedState({
      key: (id) => `__persisted__${id}`,
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
        getItem(key) {
          return uni.getStorageSync(key)
        },
      },
    })
  )
  return {
    app,
  }
}
