import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态数据（相当于 state）
    const token = ref('')
    return {
      token,
    }
  },
  {
    paths: ['token'],
  }
)
