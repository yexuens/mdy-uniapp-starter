import {useMutation, useQuery} from "@tanstack/vue-query";
import {sortSizesAsc} from "@/libs";
import {addProductToFavorite, getProduct, getProductUnitList, removeProductFromFavorite} from "@/api";
import {useUserStore} from "@/store";
import type {IProductDetailQueryParams, IToggleProductFavoritePrams} from "@/composables/typing.ts";

function getSortedUnitList(records: any[]) {
  const sortedSizeName = sortSizesAsc(
    records
      .filter((item) => item?.url)
      .map((record) => record.sizename) as string[],
  );
  return sortedSizeName.map((sizename) =>
    records.find((record) => record.sizename === sizename),
  );
}

export const useProductUnitQuery = () => useQuery({
  queryKey: ['productUnitList'],
  queryFn: getProductUnitList,
  select: (data) => Array.isArray(data?.record) ? getSortedUnitList(data.record) : []
})

export const useProductDetailQuery = (params: IProductDetailQueryParams) => {
  const user = useUserStore()

  return {
    ...useQuery({
      queryKey: ['productDetail', () => Number(params?.id), () => user.userInfo.id],
      queryFn: () => getProduct({
        ...params,
        storeId: 2,
        userId: user.userInfo.id
      }),
      enabled: computed(() => !!params?.id),
      select(dataRaw) {
        const rawData = dataRaw.records?.at(0)
        if (!rawData)
          throw new Error('Failed to fetch product')
        rawData.productImages = JSON.parse(rawData.productImages)
        rawData.swiperImages = rawData.productImages?.length > 0 ? rawData.productImages.map((item: any) => item.url) : []
        rawData.productGuige = JSON.parse(rawData.productGuige)
        rawData.elementImages = rawData.productGuige?.length > 0 ? rawData.productGuige[0]?.images?.map((item: any) => item.url) : []
        return rawData
      }
    }),
  }
}
export const useToggleFavoriteMutation = () => {
  const user = useUserStore()
  const mutation = useMutation({
    mutationFn: async (params: IToggleProductFavoritePrams): Promise<number | null> => {
      user.checkLogin()

      if (params.isFavorite) {
        const {code} = await removeProductFromFavorite({
          id: params.collectId!,
          userId: user.userInfo.id,
          brandId: 2,
        })
        if (code !== 1)
          throw new Error('Failed to remove product')
        return null
      } else {
        const {code, collect} = await addProductToFavorite({
          userId: user.userInfo.id,
          brandId: 2,
          productId: params.productId!,
        })
        if (code !== 1)
          throw new Error('Failed to add product')
        return collect
      }
    },
    onError(_, params) {
      uni.showToast({
        title: params.isFavorite ? '取消失败' : '添加失败',
        icon: 'none',
      })
    },
    onSuccess(_, params) {
      uni.showToast({
        title: params.isFavorite ? '取消成功' : '添加成功',
        icon: 'none',
      })
    }
  })

  return {
    ...mutation
  }
}
