<script setup lang="ts">
import type { ConfigProviderThemeVars } from 'wot-design-uni'

const themeVars = reactive<ConfigProviderThemeVars>({
  swiperRadius: '0',
  tabsNavLineBgColor: '#D81B17',
  tabsNavActiveColor: '#D81B17',
})
</script>

<template>
  <wd-config-provider theme="light" :theme-vars="themeVars">
    <slot />
  </wd-config-provider>
</template>
