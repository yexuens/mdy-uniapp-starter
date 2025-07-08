<script setup lang="ts">
import type { IPageStatus } from '@/typings.ts'
import { getFavoriteProductPage } from '@/api'
import { getFavoriteCasePage } from '@/api/case.ts'
import { useUserStore } from '@/store'

const tab = ref<number>(0)
const tabList = ['产品', '案例']
const searchParams = reactive({
  curPage: 1,
})
const pageData = ref<any[]>([])
const pageStatus = ref<IPageStatus>('loadMore')
const user = useUserStore()

async function fetchDataByTab() {
  pageStatus.value = 'loading'
  try {
    const req = {
      curPage: searchParams.curPage,
      userId: user.userInfo.id,
    }
    const { code, records } = tab.value === 0 ? await getFavoriteProductPage(req) : await getFavoriteCasePage(req)
    if (code !== 1) {
      throw new Error('no More Data')
    }
    pageData.value.push(...records)
    searchParams.curPage += 1
    pageStatus.value = 'loadMore'
  }
  catch (_) {
    pageStatus.value = 'noMore'
  }
}

function reset() {
  searchParams.curPage = 1
  pageData.value = []
}

onReachBottom(() => {
  if (pageStatus.value === 'loadMore')
    fetchDataByTab()
})
watch(
  () => tab.value,
  () => {
    reset()
    fetchDataByTab()
  },
)
onLoad(() => {
  fetchDataByTab()
})

function navigateToCase(id: number) {
  uni.navigateTo({
    url: `/pages/caseDetail?id=${id}`,
  })
}
</script>

<template>
  <view class="mt-24px">
    <wd-tabs v-model="tab" swipeable>
      <block v-for="(tabName, index) in tabList " :key="index">
        <wd-tab :title="tabName">
          <view v-if="pageData.length > 0" class="grid grid-cols-2 mt-40px gap-16px px-16px">
            <product-card
              v-for="(item, index) in pageData"
              :id="item.id" :key="index" :disable-navigate="tab === 1"
              :model-name="tab === 0 ? item.productModel : item.huxing" :name="item.name"
              :cover="tab === 0 ? item.productUrl2 : item.zhuye"
              @click="navigateToCase"
            />
          </view>
          <view v-else class="mt-46 w-screen flex items-center justify-center">
            <wd-loading v-if="pageStatus === 'loading'" :size="50" />
            <wd-status-tip v-else :image="imgRes.emptyContentStatusTip" tip="暂无收藏" />
          </view>
        </wd-tab>
      </block>
    </wd-tabs>
  </view>
</template>

<style scoped>
</style>

<route lang="json5">
{
layout:"default",
needLogin:true,
style: {
navigationBarTitleText: '我的收藏',
}
}
</route>
