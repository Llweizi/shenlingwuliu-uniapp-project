<script setup>
  import { ref, reactive } from 'vue'
  import userApi from '@/apis/user'
  import { useUserStore } from '@/stores/user'
  import { onLoad } from '@dcloudio/uni-app'

  const userStore = useUserStore()
  // 表单元素的 ref 属性
  const accountForm = ref('')

  // 回跳地址
  const redirectURL = ref('')
  // 跳转地址方式
  const routeType = ref('')

  // 获取地址中的参数
  onLoad((query) => {
    redirectURL.value = query.redirectURL
    routeType.value = query.routeType
    console.log('query.routeType值', query.routeType)
    console.log('query..redirectURL值', query.redirectURL)
  })

  // 表单数据
  const formData = reactive({
    account: 'lwz123',
    password: '123456',
  })

  // 定义表单数据验证规则
  const accountRules = reactive({
    account: {
      rules: [
        { required: true, errorMessage: '请输入登录账号' },
        { pattern: '^[a-zA-Z0-9]{6,8}$', errorMessage: '登录账号格式不正确' },
      ],
    },
    password: {
      rules: [
        { required: true, errorMessage: '请输入登录密码' },
        { pattern: '^\\d{6}$', errorMessage: '登录密码格式不正确' },
      ],
    },
  })
  // 监听表单的提交
  async function onFormSubmit() {
    try {
      // 验证通过
      const formData = await accountForm.value.validate()
      const { code, data } = await userApi.login(formData)
      if (code !== 200) return uni.utils.toast('登录失败，请重试！')
      // 持久化存储用户登录状态
      userStore.token = data
      console.log('token有没有', userStore.token)
      console.log('routeType.value', routeType.value)
      uni[routeType.value]({ url: redirectURL.value })

      // 表单的数据
    } catch (err) {
      // 验证失败
      console.log(err)
    }
  }
</script>
<template>
  <uni-forms
    class="login-form"
    ref="accountForm"
    :rules="accountRules"
    :modelValue="formData"
  >
    <uni-forms-item name="account">
      <input
        type="text"
        v-model="formData.account"
        placeholder="请输入账号"
        class="uni-input-input"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <uni-forms-item name="password">
      <input
        type="text"
        placeholder="请输入密码"
        class="uni-input-input"
        v-model="formData.password"
        placeholder-style="color: #818181"
      />
    </uni-forms-item>
    <button class="submit-button" @click="onFormSubmit">登录</button>
  </uni-forms>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
