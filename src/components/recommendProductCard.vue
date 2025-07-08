<script setup lang="ts">
defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps(['name', 'cover', 'modelName', 'id'])

function navigateToProduct() {
  uni.navigateTo({
    url: `/pages/productDetail?id=${props.id}`,

  })
}
</script>

<template>
  <view  @click="navigateToProduct" class="h-[80px] w-[200px] flex shrink-0 items-center gap-x-6px rounded-[8px] bg-[#F9FAFA]">
    <image class="h-full w-[88px] shrink-0 rounded-l-[8px]" :src="cover" />
    <view class="flex flex-col items-center justify-center gap-y-6px">
      <view class="max-w-[100px] w-full truncate text-center text-12px text-[#323232] font-500">
        {{ name }}
      </view>
      <view class="text[#323232] truncate text-center text-12px">
        {{ modelName }}
      </view>
      <view
        class="rounded-8px bg-primary px-6px py-2.5px text-center text-10px text-white"
      >
        立即查看
      </view>
    </view>
  </view>
</template>

<style scoped>

</style>
