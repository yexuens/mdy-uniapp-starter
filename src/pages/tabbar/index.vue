<script setup lang="ts">
import {useProductUnitQuery} from "@/composables/useProductQuery.ts";
import {useBannerQuery} from "@/composables/useSystemQuery.ts";

const {data: bannerVideo} = useBannerQuery(1)
const {data: productUnitList, isLoading} = useProductUnitQuery()

function navigateToProductList(sizename: string, size: string) {
  uni.navigateTo({
    url: `../productList?sizename=${sizename}&size=${size}`,
  });
}

function navigateToProductSearch() {
  uni.navigateTo({
    url: `/pages/productSearch`,
  });
}

</script>

<template>
  <view v-if="bannerVideo" style="pointer-events: none" class="bg-white">
    <video
      show-mute-btn
      muted
      loop
      autoplay
      :controls="false"
      class="w-full !bg-white"
      :src="bannerVideo"
    />
  </view>
  <view class="mx-auto w-[calc(100vw-32px)] pb-30px">
    <!--      标题介绍 -->
    <view>
      <view class="mb-12px mt-32px text-7 text-[#323232] font-700">
        PRODUCT
      </view>
      <view class="text-4.5 text-[#323232] font-400"> 产品中心</view>
    </view>
    <!--      搜索框 -->
    <SearchInput
      disabled
      custom-class="my-20px"
      placeholder="输入关键词搜索"
      @click="navigateToProductSearch"
    />
    <!--      规格列表 -->
    <view class="grid grid-cols-2 gap-15px" v-if="!isLoading">
      <!--        Item -->
      <view
        v-for="(item, index) in productUnitList"
        :key="index"
        class="flex flex-col rounded-8px"
        @click="() => navigateToProductList(item.sizename, item.size)"
      >
        <image
          class="h-[88px] w-[164px] rounded-t-8px"
          :src="item.url"
          mode="aspectFill"
        />
        <view
          class="h-[36px] w-full flex items-center justify-between gap-x-2px rounded-8px bg-[#F5F6F7] px-12px"
        >
          <view class="truncate text-[14px] text-[#323232]">
            {{ item.sizename }}
          </view>
          <custom-icon icon-name="nextLeftAroundIcon" :size="18"/>
        </view>
      </view>
    </view>
  </view>
  <view class="text-center text-[#c9c6c6] text-14px bottom-10px">
    -蜜多云科技提供技术支持-
  </view>
</template>
<route type="home" lang="json5">
{
layout: "home",
style: {
navigationStyle: "custom",
},
}
</route>
