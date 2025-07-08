<script setup lang="ts">
import { useMenuRectSize } from '@/composables/useMenuRectSize.ts'

defineProps({
  transparent: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  leftArrow: {
    type: Boolean,
    default: false,
  },
  titleClass: {
    type: String,
    default: '',
  },
})
const showHome = ref(false)
const menuRect = useMenuRectSize()

function handleBack() {
  uni.navigateBack({})
}

function handleBackHome() {
  uni.reLaunch({ url: '/pages/tabbar/index' })
}

function handleLeftArrowClick() {
  showHome.value ? handleBackHome() : handleBack()
}

onLoad(() => {
  showHome.value = getCurrentPages().length === 1
})
</script>

<template>
  <view
    :style="`pointer-events:none;padding-top:${menuRect.top + 8}px;height:${menuRect.top + menuRect.height + 8}px;${transparent ? 'background-color: transparent !important;' : 'background-color: white !important'}`"
    class="fixed top-0 z-991 w-screen flex px-16px"
  >
    <view v-if="leftArrow" style="pointer-events: all" @click="handleLeftArrowClick">
      <custom-icon v-if="!showHome" icon-name="leftArrowIcon" :size="16" />
      <custom-icon v-if="showHome" icon-name="homeIcon" :size="18" />
    </view>
    <view class="absolute left-1/2 -translate-x-1/2">
      {{ title }}
    </view>
  </view>
  <!--  <wd-navbar -->
  <!--    :custom-style="`${transparent ? 'background-color: transparent !important;' : ''}`" -->
  <!--    :bordered="false" -->
  <!--    safe-area-inset-top -->
  <!--    fixed -->
  <!--    :title="title" -->
  <!--    @click-left="handleLeftClick" -->
  <!--  > -->
  <!--    <template #left> -->
  <!--      <custom-icon v-if="leftArrow && !showHome" icon-name="leftArrowIcon" :size="16" /> -->
  <!--      <custom-icon v-if="leftArrow && showHome" icon-name="homeIcon" :size="18" /> -->
  <!--    </template> -->
  <!--  </wd-navbar> -->
</template>

<style scoped>
.rr {
  pointer-events: all;
}
</style>
