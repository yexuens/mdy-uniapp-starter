<script setup lang="ts">
import type {IPageStatus} from '@/typings.ts'
import {storeToRefs} from 'pinia'
import {getProductPage, getProductTypeTree} from '@/api'
import {useSearchHistoryStore, useUserStore} from '@/store'

interface FilterConfig {
  field: 'size' | 'space' | 'series' | 'craft'
  iconName: string
}

interface FilterOption {
  id: number
  name: string
}

interface ISearchParamsType {
  size: number | null
  space: number | null
  series: number | null
  craft: number | null
  keyword: string
  curPage: number
}

const showProduct = ref(false)
const searchParams = reactive<ISearchParamsType>({
  curPage: 1,
  keyword: '',
  size: null,
  space: null,
  series: null,
  craft: null
})
const NEW_FILTER_CONFIG: Record<number, FilterConfig> = {
  3: {
    field: 'series',
    iconName: 'seriesCheckBoxIcon',
  },
  2: {
    field: 'craft',
    iconName: 'glazeCheckBoxIcon',
  },
  112: {
    field: 'size',
    iconName: 'unitCheckBoxIcon',
  },
  143: {
    field: 'space',
    iconName: 'glossCheckBoxIcon',
  },
} as const

const productFilterMap = ref<Map<{ id: number, name: string }, FilterOption[]>>()

const pageData = ref<any[]>([])
const pageStatus = ref<IPageStatus>('loadMore')
const {addHistory, delByIndex, clearHistory} = useSearchHistoryStore()
const {historyList} = storeToRefs(useSearchHistoryStore())
const user = useUserStore()

async function fetchProductSearch() {
  pageStatus.value = 'loading'
  try {
    const {code, records} = await getProductPage({
      curPage: searchParams.curPage,
      keyword: searchParams.keyword,
      storeId: 1,
      userId: user.userInfo.id,
      size: searchParams.size,
      craft: searchParams.craft,
      series: searchParams.series,
      space: searchParams.space,
    })
    if (code !== 1)
      throw new Error('failed to fetch products')
    if (records?.length === 0)
      throw new Error('no more records ')
    pageData.value.push(...records!)
    searchParams.curPage += 1
    pageStatus.value = 'loadMore'
  } catch (_) {
    pageStatus.value = 'noMore'
  }
}

function reset() {
  pageData.value = []
  searchParams.curPage = 1
  pageStatus.value = 'loadMore'
}

function handleHistorySearch(keyword: string, index: number) {
  delByIndex(index)
  handleSearch(keyword)
  showProduct.value = true
}

async function handleSearch(keyword: string) {
  showProduct.value = true
  reset()
  if (keyword !== '') {
    const index = historyList.value.indexOf(keyword)
    if (index >= 0) {
      delByIndex(index)
    }
    addHistory(keyword)
  }
  await fetchProductSearch()
}

function handleConfirm(keyword: string) {
  handleSearch(keyword)
}

function onCheckboxChange({id, rootId}: { id: number, rootId: number }) {
  const config = NEW_FILTER_CONFIG[rootId]
  if (config) {
    searchParams[config.field] = id
    onSubmit()
  }
}

async function fetchProductTypeTree() {
  const {data} = await getProductTypeTree()
  productFilterMap.value = treeToMap(data)
  console.log(productFilterMap.value)
}

function onSubmit() {
  reset()
  fetchProductSearch()
}

function treeToMap(tree?: any[], map = new Map(), isRoot = true) {
  if (!Array.isArray(tree) || !tree)
    return map
  for (const node of tree) {
    // 跳过根节点（只在第一次递归时生效）
    if (isRoot) {
      if (Array.isArray(node.children) && node.children.length > 0) {
        treeToMap(node.children, map, false)
      }
      continue
    }
    if (node.title) {
      if (Array.isArray(node.children) && node.children.length > 0) {
        const arr = node.children.map((child: any) => ({
          id: child.id,
          name: child.title,
        }))
        map.set({
          id: node.id,
          name: node.title,
        }, arr)
        // 递归处理子节点
        treeToMap(node.children, map, false)
      }
    }
  }
  return map
}

onLoad(() => {
  fetchProductTypeTree()
})
onReachBottom(() => {
  if (pageStatus.value === 'loadMore' && pageData.value.length !== 0)
    fetchProductSearch()
})
</script>

<template>
  <scroll-view
    scroll-y
    enhanced
    :show-scrollbar="false"
  >
    <view class="px-16px py-10px">
      <search-input v-model="searchParams.keyword" placeholder="输入关键词搜索" @confirm="handleConfirm"/>
      <view v-if="!showProduct" class="mt-48px">
        <view class="flex items-center justify-between px-4px">
          <view class="text-[#071C1A]">
            搜索历史
          </view>
          <view v-if="historyList.length > 0" class="text-[14px] text-[#888]" @click="clearHistory">
            清空
          </view>
        </view>
        <view class="gap-x- mt-20px flex flex-wrap items-center gap-x-12px gap-y-16px">
          <view
            v-for="(text, index) in historyList"
            :key="index"
            class="rounded-[4px] bg-[#F5F6F7] px-7px py-5px text-[#323232]"
            @click="handleHistorySearch(text, index)"
          >
            {{ text }}
          </view>
        </view>
      </view>
      <view v-else class="mt-28px">
        <view class="flex flex-col gap-y-15px">
          <pretty-check-box
            v-for="[filterObj, list] in productFilterMap"
            :key="filterObj.id"
            :list="list"
            @change="(id) => onCheckboxChange({ id, rootId: filterObj.id })"
          />
        </view>
        <view v-if="pageData.length !== 0" class="grid grid-cols-2 mt-40px gap-16px">
          <product-card
            v-for="(item, index) in pageData" :id="item.id" :key="index"
            :model-name="item.productModel" :name="item.seriesName" :cover="item.productUrl2"
          />
        </view>
      </view>
    </view>
    <view v-if="pageData.length === 0 && showProduct" class="mt-100px w-screen flex items-center justify-center">
      <wd-loading v-if="pageStatus === 'loading'" :size="50"/>
      <wd-status-tip v-else :image="imgRes.emptyContentStatusTip" tip="暂无产品"/>
    </view>
  </scroll-view>
</template>

<style scoped>

</style>

<route lang="json5">
{
layout:"default",
style: {
navigationBarTitleText: '搜索产品',
}
}
</route>
