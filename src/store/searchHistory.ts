import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchHistoryStore = defineStore(
  'searchHistory',
  () => {
    const historyList = ref<string[]>([])

    function addHistory(value: string) {
      historyList.value.unshift(value)
    }

    function delByIndex(index: number) {
      historyList.value.splice(index, 1)
    }

    function clearHistory() {
      historyList.value = []
    }

    return {
      addHistory,
      historyList,
      delByIndex,
      clearHistory,
    }
  },
  {
    persist: true,
  },
)
