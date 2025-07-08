<script setup lang="ts">
import {getBanner, getHomeIntro} from '@/api'

const intro = ref()
onLoad(async () => {
  const res = await getBanner(15)
  const records = res.records || ['']
  intro.value = records[0]
})
</script>

<template>
  <view class="flex-1">
    <image class="h-full w-full" mode="widthFix" :src="intro?.url"/>
  </view>
</template>

<style scoped>

</style>

<route lang="json5">
{
style: {
navigationBarTitleText: '品牌中心',
}
}
</route>
