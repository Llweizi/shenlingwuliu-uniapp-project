<!-- subpkg_task/pickup/index.vue -->
<script setup>
  import { onLoad } from '@dcloudio/uni-app'
  import { ref, computed } from 'vue'
  import taskApi from '@/apis/task'
  // 数据验证
  const enableSubmit = computed(() => {
    return goodsPictrues.value.length > 0 && receiptPictrues.value.length > 0
  })
  // "https://mp-664d2554-cfa5-4427-9adf-d14025991d5f.cdn.bspapp.com/cloudstorage/40edf9ed-9f29-48b7-ab29-425abe351dea.jpg"

  // 任务ID
  const id = ref('')

  onLoad((query) => {
    id.value = query.id
    console.log('ID为', id.value)
  })
  // 提货凭证图片
  const receiptPictrues = ref([])
  // 数据二次处理，只保留 url 属性
  const cargoPickUpPictureList = computed(() => {
    return receiptPictrues.value.map(({ url }) => {
      return { url }
    })
  })

  // 货品图片
  const goodsPictrues = ref([])
  // 数据二次处理，只保留 url 属性
  const cargoPictureList = computed(() => {
    return goodsPictrues.value.map(({ url }) => {
      return { url }
    })
  })

  // 提交表单数据
  async function onSubmitForm() {
    // 表单数据
    const formData = {
      id: id.value,
      cargoPickUpPictureList: cargoPickUpPictureList.value,
      cargoPictureList: cargoPictureList.value,
    }
    const { code } = await taskApi.pickup(formData)
    if (code !== 200) return uni.utils.toast('提交数据失败！')
    // 去到任务列表
    uni.reLaunch({ url: '/subpkg_task/detail/index?id=' + id.value })
  }
</script>

<template>
  <view class="page-container">
    <view class="receipt-info">
      <uni-file-picker
        v-model="receiptPictrues"
        file-extname="jpg,webp,gif,png"
        limit="3"
        title="请拍照上传回单凭证"
      ></uni-file-picker>
      <uni-file-picker
        file-extname="jpg,webp,gif,png"
        v-model="goodsPictrues"
        limit="3"
        title="请拍照上传货品照片"
      ></uni-file-picker>
    </view>
    <button @click="onSubmitForm" :disabled="!enableSubmit" class="button">
      提交
    </button>
  </view>
</template>

<style lang="scss" scoped>
  .page-container {
    padding: 30rpx;
  }

  .receipt-info {
    min-height: 600rpx;
    background-color: #fff;
    padding: 20rpx 30rpx;
    border-radius: 16rpx;

    ::v-deep .uni-file-picker {
      margin-bottom: 30rpx;
    }
  }

  .button {
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    /* #ifdef APP */
    padding-top: 4rpx;
    /* #endif */
    border-radius: 100rpx;
    margin-top: 60rpx;
    color: #fff;
    font-size: $uni-font-size-big;
    background-color: $uni-primary;

    &[disabled] {
      color: #fff;
      background-color: #fadcd9;
    }
  }
</style>
