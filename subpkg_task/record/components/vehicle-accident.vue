<script setup>
  import { ref } from 'vue'
  import { useTaskStore } from '@/stores/task'
  import vehicleOptions from './vehicle-options'

  // 被选中标签的索引值
  const tabIndex = ref(-1)
  const taskStore = useTaskStore()
  // 是不显示详细的选项
  const show = ref(false)

  // 事故类型
  const types = ref([
    { id: 1, text: '直行事故' },
    { id: 2, text: '追尾事故' },
    { id: 3, text: '超车事故' },
    { id: 4, text: '左转弯事故' },
    { id: 5, text: '右转弯事故' },
    { id: 6, text: '弯道事故' },
    { id: 7, text: '坡道事故' },
    { id: 8, text: '会车事故' },
    { id: 9, text: '其他' },
  ])
  function onRadioChange(ev) {
    // 展开详细的选项
    show.value = !!parseInt(ev.detail.value)
    // 清空已选中的选项
    tabIndex.value = -1
    taskStore.recordData.isFault = show.value
    // 传递数据到父组件
  }

  function onOptionSelect(index) {
    // 设置选中状态
    tabIndex.value = index

    // 传递选中的数据
  }
</script>

<template>
  <view class="vehicle-panel">
    <view class="vehicle-panel-header">
      <view class="label">车辆事件</view>
      <radio-group class="radio-group" @change="onRadioChange">
        <label class="label">
          <radio class="radio" value="1" color="#EF4F3F" />
          <text>是</text>
        </label>
        <label class="label">
          <radio class="radio" checked value="0" color="#EF4F3F" />
          <text>否</text>
        </label>
      </radio-group>
    </view>
    <view v-show="show" class="vehicle-panel-body">
      <uni-list>
        <uni-list-item direction="column" :border="false" title="事故类型">
          <template v-slot:footer>
            <vehicle-options data-key="accidentType" :types="types" />
            <view class="textarea-wrapper">
              <textarea
                v-model="taskStore.recordData.accidentDescription"
                class="textarea"
                placeholder="请输入异常描述"
              ></textarea>
              <view class="words-count">0/50</view>
            </view>
          </template>
        </uni-list-item>
        <uni-list-item
          direction="column"
          :border="false"
          title="请上传事故现场照片"
        >
          <template v-slot:footer>
            <uni-file-picker
              v-model="taskStore.recordData.accidentImagesList"
              file-extname="jpg,webp,gif,png"
              limit="3"
            ></uni-file-picker>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  @import './styles/vehicle-panel.scss';
  @import './styles/vehicle-accident.scss';
</style>
