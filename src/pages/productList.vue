<script setup lang="ts">
import type {IPageStatus} from '@/typings.ts'
import {getProductPage, getProductTypeList} from '@/api'
import PrettyNavBar from '@/components/prettyNavBar.vue'
import {useMenuRectSize} from '@/composables/useMenuRectSize.ts'
import {useUserStore} from '@/store'

const sizename = ref('')

const pageData = ref<any[]>([])
const pageStatus = ref<IPageStatus>('loadMore')
const menuSize = useMenuRectSize()
const spaceList = ref<any[]>([])
const seriesList = ref<any[]>([])
const transparentNav = ref(false)

interface ISearchParamsType {
  size?: number
  space?: number
  series?: number
  craft?: number
  keyword: string
  curPage: number
}

const searchParams = reactive<ISearchParamsType>({
  curPage: 1,
  keyword: '',
})
const user = useUserStore()

async function fetchProductPage() {
  pageStatus.value = 'loading'
  try {
    const req = {
      storeId: 1,
      userId: user.userInfo.id,
      keyword: searchParams.keyword,
      size: searchParams.size,
      curPage: searchParams.curPage,
      space: searchParams.space,
      series: searchParams.series,
    }
    const {records, code} = await getProductPage(req)
    console.log(req)
    if (code !== 1) {
      return
    }
    if (!records || records?.length === 0) {
      pageStatus.value = 'noMore'
      return
    }
    pageData.value.push(...records)
    searchParams.curPage += 1
    pageStatus.value = 'loadMore'
  } catch (_) {
    pageStatus.value = 'error'
  }
}

onReachBottom(() => {
  if (pageStatus.value === 'loadMore')
    fetchProductPage()
})

function resetSearchParamsPage() {
  searchParams.curPage = 1
  pageData.value = []
}

function onSubmit() {
  resetSearchParamsPage()
  fetchProductPage()
}

async function fetchProductCraft() {
  const {code, data} = await getProductTypeList({
    size: searchParams.size!,
  })
  if (code !== 1)
    return
  if (!Array.isArray(data) || data.length === 0)
    return
  spaceList.value = data
  searchParams.space = spaceList.value[0].space
  console.log(spaceList.value)
}

async function fetchProductSeries() {
  const {code, data} = await getProductTypeList({
    size: searchParams.size,
    space: searchParams.space,
  })
  if (code !== 1)
    return
  if (!Array.isArray(data) || data.length === 0)
    return
  seriesList.value = data
  searchParams.series = seriesList.value[0].series
}

const seriesCheckBoxList = computed(() => seriesList.value?.map(item => ({
  id: item.series,
  name: item.name,
})))
onLoad(async (opt) => {
  if (opt?.sizename && opt?.size) {
    searchParams.size = opt.size
    sizename.value = opt.sizename
    await fetchProductCraft()
    await fetchProductSeries()
    await fetchProductPage()
  }
})

async function onSpaceChange(id: number) {
  if (Number(searchParams.space) === id)
    return
  searchParams.space = id
  await fetchProductSeries()
  onSubmit()
}

async function onSeriesChange() {
  onSubmit()
}

onPageScroll((e) => {
  transparentNav.value = e.scrollTop < 35
})
</script>

<template>
  <view class="absolute h-50vh w-screen bg-gradient-[180deg,#FFF_15%,#F5F5F5_35%] bg-gradient-linear -z-1"/>
  <pretty-nav-bar left-arrow :transparent="transparentNav" :title="sizename"/>
  <view class="px-16px" :style="`padding-top: ${menuSize.navHeight}px`">
    <search-input v-model="searchParams.keyword" placeholder="输入关键字搜索" @confirm="onSubmit"/>
    <view v-if="spaceList.length > 0" class="mt-16px flex items-center gap-x-15px">
      <view
        v-for="(item, index) in spaceList" :key="index" class="relative flex-1 rounded-8px"
        @click="onSpaceChange(item.space)"
      >
        <image
          class="relative h-88px w-164px rounded-8px"
          mode="aspectFill"
          :src="item.yuliuone"
        />
        <view
          :class="[searchParams.space == item.space ? 'mask' : '']"
          class="absolute left-0 top-0 z-99 h-88px w-164px flex flex-col items-center justify-center gap-y-8px rounded-8px text-white"
        >
          <view class="text-16px text-[#FEFEFE]">
            {{ item.name }}
          </view>
          <view class="text-12px text-white font-300">
            {{ sizename }}
          </view>
        </view>
      </view>
    </view>
    <pretty-check-box
      v-model="searchParams.series" :list="seriesCheckBoxList" item-class="px-15px py-7px mt-16px"
      @change="onSeriesChange"
    />
  </view>
  <view
    class="mt-20px min-h-40vh overflow-y-hidden rounded-16px bg-white px-16px px-16px py-20px shadow-[0px_-2px_12px_0px_rgba(0,0,0,0.02)]"
  >
    <view class="grid grid-cols-2 gap-16px">
      <product-card
        v-for="(item, index) in pageData" :id="item.id" :key="index"
        :model-name="item.productModel" :name="item.name" :cover="item.productUrl2"
      />
    </view>
  </view>
</template>

<style scoped>
view, text, image, button, input, textarea {
  box-sizing: border-box;
  font-size: 28rpx;
  overflow-x: hidden;
}

.mask {

  background-color: rgba(0, 0, 0, 0.5); /* 黑色 + 50% 透明 */
}
</style>

<route lang="json5">
{
layout:"empty",
hideFab:true,
style: {
navigationStyle: "custom"
}
}
</route>
