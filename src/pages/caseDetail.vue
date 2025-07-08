<script setup lang="ts">
import {recordCaseHistory} from "@/api";
import {addCaseToFavorite, getCase, removeCaseFromFavorite,} from "@/api/case.ts";
import {useTimer} from "@/composables/useTimer.ts";
import {useUserStore} from "@/store";

const current = ref<number>(0);
const {start, getAndClear} = useTimer();
const caseDetail = ref<any>();
const transparentNav = ref(true);
const isFavorite = ref(false);
const user = useUserStore();
const isFavoriteLoading = ref(false);
const collectId = ref<number>();

function recordHistory(timeSpent: number) {
  if (timeSpent === 0)
    return
  recordCaseHistory({
    timeSpent,
    userId: user.userInfo.id,
    typeId: caseDetail.value.id,
    state: -1,
  });
}

async function toggleFavorite() {
  user.checkLogin()
  const favoriteFlag = isFavorite.value;
  isFavoriteLoading.value = true;

  interface IFavoriteOperationReq {
    caseTypeId: number;
    userId: number;
    brandId: number;
    id?: number;
    caseId?: number;
  }

  const req: IFavoriteOperationReq = {
    caseTypeId: 1,
    brandId: 2,
    userId: user.userInfo.id,
  };
  try {
    if (favoriteFlag && collectId.value) {
      const {code} = await removeCaseFromFavorite({
        ...req,
        id: collectId.value,
      });
      if (code !== 1) throw new Error("Failed to remove product");
    } else {
      const {code, collect} = await addCaseToFavorite({
        ...req,
        caseId: caseDetail.value.id,
      });
      if (code !== 1) throw new Error("Failed to remove product");
      collectId.value = collect;
    }
    await uni.showToast({
      title: favoriteFlag ? "取消成功" : "添加成功",
      icon: "none",
    });
    isFavorite.value = !favoriteFlag;
  } catch (_) {
    await uni.showToast({
      title: "操作失败",
    });
  } finally {
    isFavoriteLoading.value = false;
  }
}

function getIsFavorite() {
  isFavorite.value = !!collectId.value;
}

async function fetchCase(id: number) {
  const {records, code} = await getCase({id, userId: user.userInfo.id});
  if (code !== 1) return;
  const data = records?.pop();
  data.photo = JSON.parse(data.photo);
  const photoList = data.photo?.map((item: any) => item.url);
  data.swiperItems = [data.zhuye, ...photoList];
  data.swiperItems = data.swiperItems.filter((item: any) => item !== "");
  data.realCaseResList = [...photoList];
  data.caseVideo = data.caseVideo ? JSON.parse(data.caseVideo) : ''
  caseDetail.value = data;
  collectId.value = caseDetail.value.collect;
  getIsFavorite();
}

onPageScroll((e) => {
  transparentNav.value = e.scrollTop < 35;
});
onShow(() => {
  if (user.isLogin)
    start();
});
onHide(() => {
  recordHistory(getAndClear());
});
onUnload(() => {
  recordHistory(getAndClear());
});
onLoad((opt) => {
  if (opt?.id) fetchCase(opt.id);
});
onShareAppMessage((res) => {
  return {
    title: caseDetail.value.name,
    imageUrl: caseDetail.value.zhuye,
  };
});
</script>

<template>
  <pretty-nav-bar
    :title-class="transparentNav ? 'text-white' : 'text-black'"
    title="案例详情"
    left-arrow
    :transparent="transparentNav"
  />
  <view
    v-show="transparentNav"
    class="absolute z-999 h-22 w-93.75 bg-gradient-[180deg,rgba(0,0,0,0.80)_0%,rgba(0,0,0,0.00)_100%] bg-gradient-linear"
  />
  <view v-if="caseDetail?.swiperItems" class="relative">
    <wd-swiper
      v-model:current="current"
      height="400"
      :list="caseDetail.swiperItems"
      autoplay
      :indicator="{ type: 'fraction' }"
      indicator-position="bottom-right"
    >
      <template #indicator="{ current, total }">
        <view
          style="position: absolute; bottom: 32rpx"
          class="custom-indicator left-1/2 -translate-x-1/2"
        >
          {{ current + 1 }}/{{ total }}
        </view>
      </template>
    </wd-swiper>
  </view>
  <!--  内容 -->
  <view v-if="caseDetail" class="px-16px pb-115px">
    <!--    案例详情 -->
    <view class="flex flex-col gap-y-24px pt-20px">
      <view class="title">
        {{ caseDetail.name }}
      </view>
      <view v-if="caseDetail.caseDetail" class="content pb-16px text-justify">
        {{ caseDetail.caseDetail }}
      </view>
    </view>
    <!--    案例实拍 -->
    <view class="mt-24px" v-if="caseDetail?.realCaseResList?.length > 0">
      <view class="sub-title"> 案例实拍</view>
      <view class="flex flex-col gap-y-4px pt-16px">
        <image
          v-for="(item, index) in caseDetail.realCaseResList"
          :key="index"
          :src="item"
          mode="widthFix"
          class="w-full rounded-2px"
        />
        <template v-if="Array.isArray(caseDetail.caseVideo)">
          <video
            v-for="(url,index) in caseDetail.caseVideo"
            class="h-330px w-full"
            :src="url"
          />
        </template>
        <template v-else-if="caseDetail.caseVideo">
          <video
            class="h-330px w-full"
            :src="caseDetail.caseVideo"
          />
        </template>
      </view>
    </view>

    <!--    推荐产品 -->
    <view v-if="caseDetail?.product?.length > 0" class="mt-40px">
      <view class="sub-title">推荐产品</view>
      <view
        class="product-scroll mt-16px flex items-center gap-x-12px overflow-x-auto"
      >
        <recommend-product-card
          v-for="(item, index) in caseDetail.product"
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
      <button
        class="flex flex-col items-center border-0 bg-transparent p-0"
        open-type="share"
      >
        <image
          src="https://cdn.juesedao.cn/mdy/3b9e5af65b7b41bea83a7f228a82d3b6"
          class="h-18px w-18px"
        />
        <view class="text-12px text-[#323232]"> 分享</view>
      </button>
      <button
        :class="[
          isFavorite ? 'bg-[#F9FAFA] text-[#323232]' : 'bg-primary text-white',
        ]"
        class="w-280px rounded-8px py-4px pr-16px !border-0"
        @click="toggleFavorite"
      >
        {{ isFavorite ? "取消收藏" : "收藏产品" }}
      </button>
    </view>
  </view>
</template>

<style scoped>
.product-scroll::-webkit-scrollbar {
  display: none;
}

.title {
  @apply text-18px text-[#323232] font-700;
}

.sub-title {
  @apply text-[16px] text-[#323232] font-700;
}

.content {
  @apply text-[14px] text-[#323232] op-80;
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
layout: "empty",
style: {
navigationStyle: "custom",
},
}
</route>
