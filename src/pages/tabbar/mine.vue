<script setup lang="ts">
import {storeToRefs} from "pinia";
import {imgRes} from "@/constants/imgRes.ts";
import {getSafeTopHeight} from "@/libs";
import {useBrandStore, useUserStore} from "@/store";
import type {ButtonOpenType} from "@uni-helper/uni-types";
import type {IconResKeyType} from "@/constants";

interface IMenuType {
  leftText: string;
  rightText?: string;
  rightIcon?: IconResKeyType;
  needLogin?: boolean;
  openType?: ButtonOpenType;
  handleFunc: () => void;
  url?: string;
}

const safeTop = ref(0);
const {userInfo, isLogin} = storeToRefs(useUserStore());
const {brandInfo} = storeToRefs(useBrandStore());

const menuList: IMenuType[] = [
  {
    leftText: "我的收藏",
    rightIcon: "rightArrowIcon",
    needLogin: true,
    handleFunc: () => uni.navigateTo({url: "/pages/myFavorites"}),
    url: "/pages/myFavorites",
  },
  {
    leftText: "我的足迹",
    needLogin: true,
    handleFunc: () => uni.navigateTo({url: "/pages/myHistory"}),
    url: "/pages/myHistory",
  },
  {
    leftText: "联系我们",
    rightIcon: "phoneCallIcon",
    handleFunc() {
      if (brandInfo.value.phone)
        uni.makePhoneCall({
          phoneNumber: brandInfo.value.phone,
        })
    }
  },
  {
    leftText: "门店地址",
    rightIcon: "navigatorIcon",
    handleFunc: () => {
      const addressInfo = {
        lat: brandInfo.value.positionLatitude,
        lng: brandInfo.value.positionLongitude,
        address: brandInfo.value.address,
      }
      const lat = Number.parseFloat(addressInfo.lat)
      const lng = Number.parseFloat(addressInfo.lng)
      if (!(lat || lng))
        return
      uni.openLocation({
        latitude: lat,
        longitude: lng,
        scale: 16,
        name: '',
        address: addressInfo.address,
      })
    },
  },
];

function onMenuTab(index: number) {
  const menu = menuList[index];
  if (menu.needLogin && !isLogin.value) {
    uni.showModal({
      title: "请先登录！",
      success() {
        uni.navigateTo({url: "/pages/login"});
      },
    });
    return;
  }
  if (menu.url) uni.navigateTo({url: menu.url});
  else if (menu.handleFunc) menu.handleFunc();
}

function navigateToLogin() {
  uni.navigateTo({
    url: "/pages/login",
  });
}

onLoad(() => {
  safeTop.value = getSafeTopHeight();
});
</script>

<template>
  <view
    class="fullscreen h-100vh w-full flex-1 bg-gradient-linear bg-gradient-[180deg,#FFEAEA_0%,#F5F5F5_29.57%] px-20px"
  >
    <!--    导航栏 -->
    <view :style="`height: ${safeTop}px;`" class="flex">
      <image
        class="mt-auto h-50% w-[150rpx]"
        mode="aspectFit"
        :src="imgRes.brandLogo"
      />
    </view>
    <!--    用户信息 -->
    <view class="my-32px">
      <view v-if="isLogin" class="flex items-center gap-x-12px">
        <image :src="userInfo?.wxPhoto" class="h-56px w-56px rounded-full"/>
        <view class="flex flex-col gap-y-4px">
          <view class="text-[16px] text-[#323232] font-700">
            {{ userInfo?.wxName }}
          </view>
          <view class="text-[14px] text-[#323232]">
            {{ userInfo?.phone }}
          </view>
        </view>
      </view>
      <view
        v-else
        class="px-20px text-18px text-[#323232] font-700"
        @click="navigateToLogin"
      >
        立即登录
      </view>
    </view>
    <!--    用户菜单 -->
    <view class="flex flex-col rounded-12px bg-white px-20px">
      <button
        v-for="(item, index) in menuList"
        :key="index"
        :open-type="item.openType"
        class="w-full flex items-center justify-between border-0 bg-transparent px-0 py-20px"
        :class="[
          index !== menuList.length - 1
            ? 'border-b-0.5px border-b-[#E8EAEC] border-b-solid'
            : '',
        ]"
        @click="onMenuTab(index)"
      >
        <view class="text-[16px] text-[#323232] font-500 leading-[16px]">
          {{ item.leftText }}
        </view>
        <view class="flex items-center gap-x-8px">
          <!--          <image v-if="item.rightIcon" class="h-14px w-14px" :src="item.rightIcon" /> -->
          <custom-icon
            v-if="item.rightIcon"
            :icon-name="item.rightIcon"
            :size="16"
          />
          <view
            v-if="item.rightText"
            class="text-3.5 text-[#323232] font-500 lh-[100%]"
          >
            {{ item.rightText }}
          </view>
        </view>
      </button>
    </view>
  </view>
  <view class="absolute left-1/2 -translate-x-1/2 text-[#c9c6c6] text-14px absolute bottom-0">
    -蜜多云科技提供技术支持-
  </view>

  <button open-type="contact"
          class="flex flex-col items-center border-0 bg-transparent p-0 absolute bottom-150px z-11 right-20px ">
    <image
      :src="imgRes.serviceCall"
      class="h-44px w-44px"
    />
  </button>

</template>

<style scoped>
.fullscreen {
  overflow-y: hidden;
}
</style>

<route lang="json5">
{
layout: "empty",
hideFab: true,
style: {
navigationStyle: "custom",
},
}
</route>
