<script setup lang="ts">
import type {IPageStatus} from '@/typings.ts'
import {getProductPage, getProductTypeTree} from '@/api'
import {imgRes} from '@/constants'
import {useUserStore} from '@/store'
import {useQuery} from "@tanstack/vue-query";

interface ISearchParamsType {
  size: number | null
  space: number | null
  series: number | null
  craft: number | null
  keyword: string
  curPage: number
}

interface FilterConfig {
  field: 'size' | 'space' | 'series' | 'craft'
  iconName: string
}

interface FilterOption {
  id: number
  name: string
}

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

const INITIAL_SEARCH_PARAMS: Pick<ISearchParamsType, 'curPage'> = {
  curPage: 1,
}
const productFilterMap = ref<Map<{ id: number, name: string }, FilterOption[]>>()
const user = useUserStore()
const searchParams = reactive<ISearchParamsType>({
  ...INITIAL_SEARCH_PARAMS,
  size: null,
  craft: null,
  space: null,
  series: null,
  keyword: '',
})
const pageData = ref<any[]>([])
const pageStatus = ref<IPageStatus>('loadMore')

// 计算属性
const hasData = computed(() => pageData.value.length > 0)
const isLoading = computed(() => pageStatus.value === 'loading')
const canLoadMore = computed(() => pageStatus.value === 'loadMore')

// 方法
const handleSearch = () => onSubmit()

function onCheckboxChange({id, rootId}: { id: number, rootId: number }) {
  const config = NEW_FILTER_CONFIG[rootId]
  if (config) {
    searchParams[config.field] = id
    onSubmit()
  }
}

function resetPageInfo() {
  Object.assign(searchParams, INITIAL_SEARCH_PARAMS, {keyword: searchParams.keyword})
  pageStatus.value = 'loadMore'
  pageData.value = []
}

function onSubmit() {
  resetPageInfo()
  fetchProductPage()
}

async function fetchProductPage() {
  pageStatus.value = 'loading'

  try {
    const {records, code} = await getProductPage({
      storeId: 1,
      userId: user.userInfo.id,
      ...searchParams,
    })

    if (code !== 1) {
      throw new Error('获取产品列表失败')
    }

    if (!records?.length) {
      throw new Error('没有更多数据')
    }

    pageData.value.push(...records)
    searchParams.curPage += 1
    pageStatus.value = 'loadMore'
  } catch (error) {
    pageStatus.value = 'noMore'
    throw error
  }
}

function treeToMap(tree: any[], map = new Map(), isRoot = true) {
  if (!Array.isArray(tree))
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

async function fetchProductTypeTree() {
  const {data} = await getProductTypeTree()
  productFilterMap.value = treeToMap(data || [])
}

// 生命周期
onReachBottom(() => {
  if (canLoadMore.value) {
    fetchProductPage()
  }
})

onLoad(() => {
  fetchProductPage()
  fetchProductTypeTree()
})
</script>

<template>
  <scroll-view
    scroll-y
    enhanced
    :show-scrollbar="false"
  >
    <view class="mx-auto w-[calc(100vw-32px)] pb-30px pt-16px">
      <!-- 搜索框 -->
      <search-input
        v-model="searchParams.keyword"
        placeholder="输入关键字搜索"
        @confirm="handleSearch"
      />

      <!-- 筛选器 -->
      <view class="flex flex-col gap-y-20px py-28px">
        <pretty-check-box
          v-for="[filterObj, list] in productFilterMap"
          :key="filterObj.id"
          :icon-name="NEW_FILTER_CONFIG[filterObj.id]?.iconName"
          :list="list"
          :label="filterObj.name"
          @change="(id) => onCheckboxChange({ id, rootId: filterObj.id })"
        />
      </view>

      <!-- 数据展示 -->
      <view v-if="hasData" class="grid grid-cols-2 mt-16px gap-16px">
        <product-card
          v-for="(item, index) in pageData"
          :id="item.id"
          :key="`${item.id}-${index}`"
          :model-name="item.productModel"
          :name="item.seriesName"
          :cover="item.productUrl2"
        />
      </view>
    </view>
    <!-- 空状态 -->
    <view v-if="!hasData"  class="mt-40px w-screen flex items-center justify-center">
      <wd-loading v-if="isLoading" custom-class="mt-100px" :size="50"/>
      <wd-status-tip v-else :image="imgRes.emptyContentStatusTip" tip="暂无产品"/>
    </view>

  </scroll-view>
</template>

<style scoped>
</style>

<route lang="json5">
{
layout: "default",
style: {
navigationBarTitleText: '产品中心',
}
}
</route>
