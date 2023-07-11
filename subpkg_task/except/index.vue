<script setup>
  import { ref, computed, reactive } from 'vue'
  import { onLoad } from '@dcloudio/uni-app'
  import taskApi from '@/apis/task'
  // 组件 ref
  const popup = ref(null)
  // 文件提示
  const exceptionTime = computed(() => {
    return timePicker.value || '请选择'
  })
  // 异常日期
  const timePicker = ref('')

  // 上报位置数据
  const exceptionPlace = ref('')
  // 打开地图，选择位置
  async function onLocationChoose() {
    try {
      // 获取位置
      const { address } = await uni.chooseLocation({})
      exceptionPlace.value = address
    } catch (err) {}
  }

  // 定义 popup 组件展示的数据
  const exceptionTypes = reactive([
    '发动机启动困难',
    '不着车，漏油',
    '照明失灵',
    '排烟异常、温度异常',
    '其他问题',
  ])
  // 异常类型，多个选项间使用 | 拼接
  const exceptionType = ref('')

  // 临时记录异常类型选项（可以不必是响应式）

  // 临时记录异常类型选项（可以不必是响应式）
  const tempException = ref([])
  // 监听用户的选择操作
  function onCheckboxChange(ev) {
    // 将用户选择的异常类型存储到数组中
    tempException.value.push(ev.detail.value)
  }

  // 打开弹层
  function onPopupOpen() {
    popup.value.open()
  }

  // 关闭弹层
  function onPopupClose() {
    popup.value.close()
  }

  // 用户点击 popup 确定按钮
  function onPopupConfirm() {
    // 关闭 popup 弹层
    popup.value.close()
    // 将获取的异常类型拼凑成字符串
    exceptionType.value = tempException.value.join('|')
  }

  // 异常描述
  const exceptionDescribe = ref('')
  // 异常描述字数统计
  const wordsCount = computed(() => {
    return exceptionDescribe.value.length
  })
  function handleExceptionChange() {
    // 在这里访问exceptionDescribe的值
    console.log('我进来了')
    console.log('文本域值改变', exceptionDescribe.value)
  }

  // 货品图片
  const goodsPictrues = ref([])
  // 数据二次处理，只保留 url 属性
  const exceptionImagesList = computed(() => {
    return goodsPictrues.value.map(({ url }) => {
      return { url }
    })
  })

  // 运输任务ID
  const transportTaskId = ref('')

  onLoad((query) => {
    transportTaskId.value = query.transportTaskId
  })
  // 提交数据
  async function onFormSubmit() {
    console.log('我点')
    // 待提交的数据
    const formData = {
      transportTaskId: transportTaskId.value,
      exceptionTime: exceptionTime.value,
      exceptionPlace: exceptionPlace.value,
      exceptionType: exceptionType.value,
      exceptionDescribe: exceptionDescribe.value,
      exceptionImagesList: exceptionImagesList.value,
    }
    const { code } = await taskApi.except(formData)
    // 检测接口是否调用成功
    if (code !== 200) return uni.utils.toast('上报数据失败！')
    // 跳转到任务列表页面
    uni.reLaunch({ url: '/pages/task/index' })
  }
</script>

<template>
  <view class="page-container">
    <scroll-view class="scroll-view" scroll-y>
      <view class="scroll-view-wrapper">
        <uni-list :border="false">
          <uni-list-item show-arrow title="异常时间">
            <template v-slot:footer>
              <uni-datetime-picker v-model="timePicker">
                <view class="picker-value">{{ exceptionTime }}</view>
              </uni-datetime-picker>
            </template>
          </uni-list-item>
          <uni-list-item
            show-arrow
            clickable
            ellipsis="1"
            @click="onLocationChoose"
            title="上报位置"
            :right-text="exceptionPlace || '请选择'"
          />
          <uni-list-item
            show-arrow
            clickable
            @click="onPopupOpen"
            title="异常类型"
            :right-text="exceptionType || '请选择'"
          />
          <uni-list-item direction="column" title="异常描述">
            <template v-slot:footer>
              <view class="textarea-wrapper">
                <textarea
                  v-model="exceptionDescribe"
                  class="textarea"
                  @change="handleExceptionChange"
                  placeholder="请输入异常描述"
                ></textarea>
                <view class="words-count">{{ wordsCount }}/50</view>
              </view>
            </template>
          </uni-list-item>
        </uni-list>
        <uni-list class="upload-picture">
          <uni-list-item direction="column" title="上传图片（最多3张）">
            <template v-slot:footer>
              <uni-file-picker
                v-model="goodsPictrues"
                file-extname="jpg,webp,gif,png"
                limit="3"
              ></uni-file-picker>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
    </scroll-view>
    <view class="fixbar">
      <button class="button disable" @click="onFormSubmit">提交</button>
    </view>
    <uni-popup ref="popup" type="bottom">
      <uni-list class="popup-action-sheet">
        <uni-list-item>
          <template v-slot:header>
            <view style="margin-top: 4rpx; font-size: 32rpx; font-weight: 700"
              >选择类型</view
            >
          </template>
          <template v-slot:footer>
            <uni-icons
              @click="onPopupClose"
              type="closeempty"
              size="20"
            ></uni-icons>
          </template>
        </uni-list-item>
        <uni-list-item
          v-for="exceptionType in exceptionTypes"
          :key="exceptionType"
          :title="exceptionType"
        >
          <template v-slot:footer>
            <checkbox-group @change="onCheckboxChange" class="checkbox">
              <checkbox :value="exceptionType" color="#EF4F3F" />
            </checkbox-group>
          </template>
        </uni-list-item>
        <uni-list-item>
          <template v-slot:body>
            <button @click="onPopupConfirm" class="button">确定</button>
          </template>
        </uni-list-item>
      </uni-list>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
