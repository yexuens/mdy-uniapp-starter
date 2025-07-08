import {useQuery} from "@tanstack/vue-query";
import {getBanner} from "@/api";

export const useBannerQuery = (module: Ref<number> | number) => useQuery({
  queryKey: ['banner', typeof module === 'number' ? module : module.value],
  queryFn: () => getBanner(typeof module === 'number' ? module : module.value),
  select: (data) => data?.records?.pop()?.url || '',
  enabled: typeof module === 'number' ? true : module.value !== undefined
})
