<script setup lang="ts">
import {recordProductHistory} from '@/api'
import {useTimer} from '@/composables/useTimer.ts'
import {useUserStore} from '@/store'
import {useProductDetailQuery, useToggleFavoriteMutation} from "@/composables/useProductQuery.ts";
import type {IProductDetailQueryParams} from "@/composables/typing.ts";
import {imgRes} from "@/constants";

const current = ref<number>(0)
const transparentNav = ref(true)
const isFavorite = ref(false)
const isFavoriteLoading = ref(false)
const collectId = ref<number>()
const user = useUserStore()
const params = reactive<IProductDetailQueryParams>({
  id: null,
})
const {data: product} = useProductDetailQuery(params)
const {start, getAndClear} = useTimer()
const {mutateAsync: tFavorite} = useToggleFavoriteMutation()

watchEffect(() => {
  collectId.value = Number(product.value?.collect)
  isFavorite.value = !!product.value?.collect
})

async function toggleFavorite() {
  const collect = await tFavorite({
    isFavorite: isFavorite.value,
    productId: product.value?.id,
    collectId: collectId.value
  })
  collectId.value = collect || collectId.value
  isFavorite.value = !isFavorite.value
  console.log(isFavorite.value)
}

function showVR() {
  uni.showModal({
    title: '暂未开放VR',
  })
}


function recordHistory(timeSpent: number) {
  if (timeSpent === 0 || !product.value)
    return
  recordProductHistory({
    timeSpent,
    userId: user.userInfo.id,
    typeId: product.value.id!,
    state: -1,
  })
}

function previewImg(url: string, images: string[]) {
  uni.previewImage({
    urls: images,
    current: url
  })
}

onShow(() => {
  if (user.isLogin)
    start()
})
onHide(() => {
  recordHistory(getAndClear())
})
onUnload(() => {
  recordHistory(getAndClear())
})

onLoad((opt) => {
  if (opt?.id) {
    params.id = opt.id
  }
})
onPageScroll((e) => {
  transparentNav.value = e.scrollTop < 35
})
onShareAppMessage(() => {
  if (!product.value)
    return {}
  return {
    title: product.value.name,
    imageUrl: product.value.productImage,
  }
})
</script>

<template>
  <pretty-nav-bar
    title-class="text-black" title="产品详情" left-arrow
    :transparent="transparentNav"
  />
  <view v-if="product?.swiperImages" class="relative">
    <wd-swiper
      v-model:current="current"
      height="400"
      :list="product.swiperImages"
      autoplay
      :indicator="{ type: 'fraction' }"
      indicator-position="bottom-right"
    >
      <template #indicator="{ current, total }">
        <view class="custom-indicator" style="position: absolute; bottom: 32rpx; right: 32rpx">
          {{
            current + 1
          }}/{{ total }}
        </view>
      </template>
    </wd-swiper>
    <view
      class="op absolute bottom-26rpx left-1/2 z-9 h-28px w-136px flex border-rd-4 bg-[#000] text-white -translate-x-1/2"
    >
      <view
        class="flex flex-shrink items-center justify-center border-rd-4 bg-primary px-16px py-8px text-12px"
      >
        照片
      </view>
      <view class="flex flex-1 items-center justify-center gap-x-6px border-rd-4 text-12px">
        <custom-icon icon-name="vrIcon" :size="16"/>
        <view class="text-12px" @click="showVR">
          全景VR
        </view>
      </view>
    </view>
  </view>
  <!--  内容 -->
  <view v-if="product" class="h-full px-16px pb-115px">
    <!--    产品名字和品牌LOGO -->
    <view class="flex items-center justify-between border-b-0.8px border-b-[#EEE] border-b-solid pb-16px pt-24px">
      <view class="flex flex-col gap-y-8px">
        <view class="title">
          {{ product.name }}
        </view>
        <view class="content">
          {{ product.productModel }}
        </view>
      </view>
      <image class="h-32px w-76px shrink-0" :src="imgRes.brandLogo"/>
    </view>
    <!--    规格参数 -->
    <view class="mt-48px flex flex-col gap-y-16px">
      <view class="sub-title">
        规格参数
      </view>
      <view class="content flex flex-wrap items-center gap-x-58px gap-y-4px">
        <view>系列：{{ product.seriesname }}</view>
        <view>规格：{{ product.sizename }}</view>
      </view>
    </view>
    <!--    产品元素图 -->
    <view class="mt-48px w-full" v-if="product?.elementImages?.length > 0">
      <view class="sub-title">
        产品元素图
      </view>

      <view
        class="mt-16px w-full flex flex-nowrap gap-x-2px"
      >
        <image
          v-for="(url, index) in product.elementImages"
          :key="index"
          class=" max-h-250px"
          mode="widthFix"
          @click="previewImg(url,product.elementImages)"
          :src="url"
        />
      </view>
    </view>
    <!--    产品实拍 -->
    <view class="mt-36px" v-if="product?.swiperImages?.length > 0">
      <view class="sub-title">
        产品实拍
      </view>
      <image v-for="(url,index) in product.swiperImages" :key="index"
             :src="url" mode="aspectFill"
             @click="previewImg(url,product.swiperImages)"
             class="mt-16px h-200px w-full"
      />
    </view>
    <!--    相关案例 -->
    <view v-if="product?.case?.length > 0" class="mt-40px">
      <view class="sub-title">
        相关案例
      </view>
      <view class="mt-16px flex flex-nowrap gap-x-11px overflow-x-auto py-8px">
        <recommend-case-card
          v-for="(item, index) in product.case"
          :id="item.id"
          :key="index"
          :name="item.name"
          :cover="item.zhuye"
        />
      </view>
    </view>
    <!--    相关产品 -->
    <view v-if="product?.productList2?.length > 0" class="mt-40px">
      <view class="sub-title"> 相关产品</view>
      <view
        class="product-scroll mt-16px flex items-center gap-x-12px overflow-x-auto"
      >
        <recommend-product-card
          v-for="(item, index) in product.productList2"
          :id="item.id"
          :key="index"
          :cover="item.productImage"
          :model-name="item.productModel"
          :name="item.name"
        />
      </view>
    </view>
  </view>
  <view class="fixed bottom-0 left-0 h-85px w-screen bg-white">
    <view class="mt-12px flex items-center justify-between gap-x-29px px-20px">
      <!--      分享按钮 -->
      <button class="flex flex-col items-center border-0 bg-transparent p-0" open-type="share">
        <image src="https://cdn.juesedao.cn/mdy/3b9e5af65b7b41bea83a7f228a82d3b6" class="h-18px w-18px"/>
        <view class="text-12px text-[#323232]">
          分享
        </view>
      </button>
      <button
        :class="[isFavorite ? 'bg-[#F9FAFA] text-[#323232]' : 'bg-primary text-white']"
        class="w-280px rounded-8px py-4px pr-16px"
        :disabled="isFavoriteLoading"
        @click="toggleFavorite"
      >
        {{ isFavorite ? '取消收藏' : '收藏产品' }}
      </button>
    </view>
  </view>
</template>

<style scoped>
.title {
  @apply text-18px text-[#323232] font-700;
}

.sub-title {
  @apply text-[16px] text-[#323232] font-700;
}

.content {
  @apply text-[14px] text-[#323232] op-80;
}

.op {
  background-color: hsla(0, 0%, 0%, 0.3);
}

.custom-indicator {
  padding: 0 28rpx;
  height: 42rpx;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  background: #000;
  color: #ffffff;
  font-size: 24rpx;
}
</style>

<route lang="json5">
{
layout:"empty",
style: {
navigationStyle: "custom"
}
}
</route>
