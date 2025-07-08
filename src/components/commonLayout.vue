<script setup lang="ts">
import type { ConfigProviderThemeVars } from 'wot-design-uni'
import { storeToRefs } from 'pinia'
import { getAllPages, getNeedLoginPages } from '@/libs'
import { useUserStore } from '@/store'

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})

const themeVars = reactive<ConfigProviderThemeVars>({
  swiperRadius: '0',
})
const { isLogin } = storeToRefs(useUserStore())
const hideFab = ref(true)
onLoad(() => {
  const curr = currRoute()
  if (getNeedLoginPages().includes(curr.path) && !isLogin.value) {
    uni.showModal({
      title: '暂未登录，请登录后在访问',
      success() {
        uni.reLaunch({
          url: '/pages/login',
        })
      },
    })
  }
  const hideFabPages = getAllPages('hideFab')
  if (!hideFabPages.find(page => page.path === curr.path)) {
    hideFab.value = false
  }
})

function relaunchToHome() {
  uni.reLaunch({
    url: '/pages/tabbar/index',
  })
}
</script>

<template>
  <wd-config-provider theme="light" :theme-vars="themeVars">
    <view class="w-screen flex-1">
      <slot />
      <view v-if="!hideFab" class="fixed bottom-15% right-12px z-99 flex flex-col items-center">
        <view class="mask flex items-center justify-center rounded-full p-8px" @click="relaunchToHome">
          <custom-icon icon-name="homeFabIcon" :size="18" />
        </view>
      </view>
    </view>
  </wd-config-provider>
</template>

<style scoped>
.mask {
  background: rgba(0, 0, 0, 0.5);
}
</style>
