import type {IPageParm, IStoreInfo} from '@/api/typings.ts'
import {httpGet} from '@/libs/request'
import type {nullableNumber} from "@/typings.ts";


export interface IProductDetailReq {
  id: nullableNumber
  storeId: nullableNumber
  userId: nullableNumber
}

export type IAddProductFavoriteReq = { userId: number, productId: number, brandId: number }
export type IRemoveProductFavoriteReq = Omit<IAddProductFavoriteReq, 'productId'> & { id: number }

// 获取产品规格列表
export const getProductUnitList = async () => await httpGet<any[]>('/oe_querySeriesDJL_.csp')

// 获取产品分页
export async function getProductPage(data: IPageParm & IStoreInfo & {
  keyword: string
  size: nullableNumber
  series: nullableNumber
  craft: nullableNumber
  space: nullableNumber
}) {
  return await httpGet<any[]>('/oe_productContenDjl_.csp', data)
}

// 获取产品详情
export async function getProduct(data: IProductDetailReq) {
  return await httpGet<any[]>('/oe_queryproductItemIt_.csp', data)
}

// 收藏产品
export async function addProductToFavorite(data: IAddProductFavoriteReq) {
  return await httpGet<any>('/oe_productCollection_.csp', {...data, saveFlag: 'add'})
}

// 取消收藏
export async function removeProductFromFavorite(data: IRemoveProductFavoriteReq) {
  return await httpGet<any>('/oe_productCollection_.csp', {...data, saveFlag: 'edit'})
}

// 添加产品浏览足迹
export async function addProductHistory(data: { productId: number, storeId: number }) {
  return await httpGet<any>('/oe_clickRate_.csp', data)
}

// 获取我的产品收藏分页
export async function getFavoriteProductPage(data: IPageParm & {
  userId: number
}) {
  return await httpGet<any>('/oe_findproductCollectionByUserIdIt_.csp', data)
}

// 获取产品筛选树
export async function getProductTypeTree() {
  return await httpGet<any[]>('/oe_queryProductTypeIt_.csp')
}

// 获取产品筛选列表
export async function getProductTypeList(data: { size?: number, space?: number }) {
  return await httpGet<any[]>('/oe_QueryProductTypes_.csp', {
    brandId: 2,
    ...data,
  })
}
