<script setup lang="ts">
import { iconRes, type IconResKeyType } from '@/constants'

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const { iconName, size, customClass } = withDefaults(defineProps<Props>(), {
  size: 16,
})

interface Props {
  iconName: IconResKeyType
  size?: number
  customClass?: string
}
</script>

<template>
  <image
    :style="`width: ${size * 2}rpx;height: ${size * 2}rpx`"
    :class="customClass"
    :src="iconRes[iconName]"
  />
</template>

<style scoped>

</style>
