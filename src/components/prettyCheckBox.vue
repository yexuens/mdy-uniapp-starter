<script setup>
defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps(['modelValue', 'list', 'label', 'iconName', 'itemClass', 'activeItemClass'])
const emit = defineEmits(['update:modelValue', 'change'])
const activeId = ref()
const shownList = computed(() => props.modelValue ? props.list : [{ id: null, name: '全部' }].concat(props.list))

watchEffect(() => {
  activeId.value = props.modelValue ? props.modelValue : null
})

function onItemChange(index) {
  if (index !== activeId.value) {
    emit('update:modelValue', index)
    emit('change', index)
    activeId.value = index
  }
}
</script>

<template>
  <view class="scrollbar-hide hide-scrollbar flex items-center gap-x-16px">
    <view v-show="label || iconName" class="flex shrink-0 items-center gap-x-8px">
      <custom-icon v-show="!!iconName" :size="16" :icon-name="iconName" />
      <view v-show="!!label" class="text-14px text-[#323232] font-500">
        {{ label }}
      </view>
    </view>
    <scroll-view
      :scroll-x="true"
      enhanced
      :show-scrollbar="false"
      class="min-w-0 flex-1"
    >
      <view class="flex items-center gap-x-16px whitespace-nowrap" style="min-width: max-content;">
        <view
          v-for="(item, index) in shownList" :key="index"
          class="shrink-0 rounded-[12px] text-14px transition-all duration-200"
          :class="[item.id === activeId
            ? activeItemClass ? activeItemClass : 'bg-primary text-[#FFF]'
            : 'text-[#323232]', itemClass ? itemClass : 'px-8px py-5px']"
          @click="onItemChange(item.id)"
        >
          {{ item.name }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.hide-scrollbar {
  /* Webkit browsers */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* 确保scroll-view能够正确滚动 */
scroll-view {
  width: 100%;
  overflow-x: auto;
}

/* 确保内容不会被压缩 */
.flex-1 {
  flex: 1;
}

.min-w-0 {
  min-width: 0;
}
</style>
