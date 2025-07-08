<script setup lang="ts">
import {imgRes} from '@/constants/imgRes.ts'

const safeTop = ref()
onMounted(async () => {
  const {
    height,
    top,
  } = wx.getMenuButtonBoundingClientRect()

  const result = top + height + 12
  safeTop.value = result
})
</script>

<script setup lang="ts">
</script>

<template>
  <wd-navbar :bordered="false" safe-area-inset-top fixed>
    <template #title>
      <wd-img :src="imgRes.brandLogo" custom-class="w-[150rpx] h-100%" mode="aspectFit"/>
    </template>
  </wd-navbar>
  <view :style="`padding-top: ${safeTop}px;`" class="w-full">
    <slot/>
  </view>
</template>
