<script setup lang="ts">
const props = defineProps(['name', 'cover', 'modelName', 'id', 'disableNavigate'])
const emit = defineEmits(['click'])

function navigateToProduct() {
  if (!props.disableNavigate) {
    uni.navigateTo({
      url: `/pages/productDetail?id=${props.id}`,
    })
  }
  else {
    emit('click', props.id)
  }
}
</script>

<template>
  <view @click="navigateToProduct">
    <image
      mode="aspectFill"
      class="w-full rounded-t-8px"
      style="aspect-ratio: 4/3; max-height: 260px;"
      :src="cover"
    />
    <view class="flex flex-col items-center justify-center gap-y-8px rounded-b-8px bg-[#F9FAFA] px-4px py-12px">
      <view class="w-full truncate text-center font-500">
        {{ name }}
      </view>
      <view class="w-full truncate text-center text-[#323232]">
        {{ modelName }}
      </view>
    </view>
  </view>
</template>

<style scoped>

</style>
