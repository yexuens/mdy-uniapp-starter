import type {IProductDetailReq} from "@/api";

export type IProductDetailQueryParams = Omit<IProductDetailReq, 'userId' | 'storeId'>
export type IToggleProductFavoritePrams = {
  isFavorite: boolean // 是否已经是收藏状态
  collectId?: number,
  productId?: number
}
