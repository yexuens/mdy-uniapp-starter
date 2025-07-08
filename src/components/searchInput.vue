<script setup>
defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  customClass: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'confirm', 'click'])

function onInput(e) {
  emit('update:modelValue', e.detail.value)
}

function onConfirm(e) {
  const { value } = e.detail
  emit('confirm', value)
}

function onInputClick() {
  emit('click')
}
</script>

<template>
  <view :class="customClass" class="relative h-40px flex items-center">
    <input
      :disabled="disabled"
      :value="modelValue"
      :placeholder="placeholder"
      class="h-full w-full shrink-0 border-1 border-[#F3F3F3] border-rd-2 border-solid bg-[#F5F6F7] pl-32px text-14px"
      placeholder-style="font-size:28rpx"
      @click="onInputClick"
      @input="onInput"
      @confirm="onConfirm"
    >
    <!--    <image class="absolute left-12px h-12px w-12px" :src="iconRes.searchInputLeftIcon" /> -->
    <custom-icon custom-class="absolute left-12px" icon-name="searchInputLeftIcon" size="12" />
  </view>
</template>
