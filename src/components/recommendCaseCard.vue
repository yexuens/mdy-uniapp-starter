<script setup lang="ts">
defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps({
  height: {
    type: Number,
    default: 200,
  },
  name: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
})

function navigateToCaseDetail() {
  uni.navigateTo({
    url: `/pages/caseDetail?id=${props.id}`,
  })
}
</script>

<template>
  <view
    class="flex min-w-164px flex-col items-center bg-[#F5F6F7]"
    @click="navigateToCaseDetail"
  >
    <image
      :src="cover" class="h-180px w-full rounded-t-8px"
      mode="aspectFill"
    />
    <view class="w-full flex items-center justify-center rounded-b-8px bg-[#F5F6F7] py-12px">
    <view class=" text-12px text-[#280904] px-4px">
        {{ name }}
      </view>
    </view>
  </view>
</template>

<style scoped>

</style>
