<script setup>
  import { ref, onMounted } from 'vue'
  import messageApi from '@/apis/message'

  // 是否加载完成
  const isTriggered = ref(false)

  // 是否还有更多数据
  const hasMore = ref(true)
  // 任务列表数据
  const notifyList = ref([])
  // 下一页页码
  const nextPage = ref(1)
  // 每页包含数据条数
  const pageSize = ref(5)
  // 是否为空列表
  const isEmpty = ref(false)

  function readAll() {
    console.log('我点')
    notifyList.value.forEach((notify) => {
      notify.isRead = 1
    })
  }
  // 下拉刷新
  async function onScrollViewRefresh() {
    console.log('到顶')
    isTriggered.value = true
    await getNotifyList()
    console.log('到顶了11')
    isTriggered.value = false
  }

  // 上拉分页
  function onScrollToLower() {
    if (!hasMore.value) return
    // 获取下一页数据
    getNotifyList(nextPage.value)
  }
  // 生命周期
  onMounted(() => {
    getNotifyList()
  })

  // 任务列表
  async function getNotifyList(page = 1, pageSize = 10) {
    const { code, data } = await messageApi.list(201, page, pageSize)
    // 检测接口是否调用成功
    if (code !== 200) return uni.utils.toast('获取通知失败，稍后重试!')
    // 渲染数据
    // 清空原始的数据
    if (page === 1) notifyList.value = []
    notifyList.value = [...notifyList.value, ...data.items]
    // 更新下一页页码
    nextPage.value = ++data.page
    // 是否还有更多数据
    hasMore.value = nextPage.value <= data.pages
    // 是否为空列表
    isEmpty.value = notifyList.value.length === 0
  }
</script>
<template>
  <scroll-view
    class="scroll-view"
    @refresherrefresh="onScrollViewRefresh"
    @scrolltolower="onScrollToLower"
    :refresher-triggered="isTriggered"
    refresher-enabled
    scroll-y
  >
    <view class="scroll-view-wrapper">
      <view class="message-action" @click="readAll">
        <text class="iconfont icon-clear"></text> 全部已读
      </view>
      <uni-card
        v-for="notify in notifyList"
        :key="notify.id"
        :border="false"
        :is-shadow="false"
      >
        <view class="brief">{{ notify.content }}</view>
        <view class="extra">
          <text class="time">{{ notify.created }}</text>
          <navigator
            hover-class="none"
            class="link"
            :url="`/subpkg_task/detail/index?id=${notify.id}`"
            >查看详情</navigator
          >
        </view>
        <template v-slot:title>
          <view :class="{ unread: !notify.isRead }" class="title"
            >您有新的运输任务</view
          >
        </template>
      </uni-card>
      <view v-if="isEmpty" class="message-blank">暂无消息</view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
