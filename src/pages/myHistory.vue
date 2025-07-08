<script setup lang="ts">
import type { IPageStatus } from '@/typings.ts'
import { getHistoryPage } from '@/api'
import { useUserStore } from '@/store'

const pageData = ref<any[]>([])
const pageStatus = ref<IPageStatus>('loadMore')
const searchParams = reactive({
  curPage: 1,
})
const user = useUserStore()

async function fetchHistoryPage() {
  pageStatus.value = 'loading'
  try {
    const { records, code } = await getHistoryPage({
      userId: user.userInfo.id,
      curPage: searchParams.curPage,
    })
    if (code !== 1) {
      throw new Error('no More Data')
    }
    if (records?.length === 0) {
      throw new Error('No More Data')
    }
    searchParams.curPage += 1
    pageData.value.push(...records)
    pageStatus.value = 'loadMore'
  }
  catch (_) {
    pageStatus.value = 'error'
  }
}

onReachBottom(() => {
  if (pageStatus.value === 'loadMore')
    fetchHistoryPage()
})

onLoad(() => {
  fetchHistoryPage()
})

function navigateToProduct(type: number, id: number) {
  if (type === 1) {
    uni.navigateTo({
      url: `/pages/productDetail?id=${id}`,
    })
  }
  if (type === 2) {
    uni.navigateTo({
      url: `/pages/caseDetail?id=${id}`,
    })
  }
}
</script>

<template>
  <view class="h-full flex flex-col gap-y-16px bg-gray-1 px-16px py-10px">
    <view
      v-for="(item, index) in pageData"
      :key="index" class="h-120px flex items-center justify-between gap-x-10px rounded-4px bg-white px-8px py-10px"
      @click="navigateToProduct(item.type, item.typeId)"
    >
      <view class="h-full w-110px">
        <image :src="item.image" class="h-full w-110px" mode="aspectFill" />
      </view>
      <view class="h-full flex flex-1 flex-col justify-between">
        <view class="flex items-center justify-between text-12px">
          <view class="text-12px">
            {{ item.wxName }}
          </view>
          <view class="text-12px">
            浏览了
          </view>
          <view class="text-12px">
            {{ item.createTime }}
          </view>
        </view>
        <view class="text-16px font-600">
          {{ item.title }}
        </view>
        <view class="ml-auto text-14px">
          停留：{{ item.timeSpent }}s
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>

</style>

<route lang="json5">
{
layout:"default",
needLogin:true,
style: {
navigationBarTitleText: '我的痕迹',
}
}
</route>
