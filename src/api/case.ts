import type {IPageParm} from '@/api/typings.ts'
// 获取我的产品收藏分页
import {httpGet} from '@/libs/request'

export async function getFavoriteCasePage(data: IPageParm & { userId: number }) {
  return await httpGet<any>('/oe_findCaseCollectionByUserIdIt_.csp', data)
}

export async function getCase(data: { id: number, userId?: number }) {
  return await httpGet<any[]>('/oe_queryAllCaseItemIt_.csp', data)
}

export async function addCaseToFavorite(data: {
                                          caseTypeId: number
                                          userId: number
                                          caseId: number
                                          brandId: number
                                        },
) {
  return await httpGet<any>('/oe_collectCase_.csp', {
    ...data,
    saveFlag: 'add',
  })
}

export async function removeCaseFromFavorite(data: {
                                               caseTypeId: number
                                               userId: number
                                               id: number
                                               brandId: number

                                             },
) {
  return await httpGet<any>('/oe_collectCase_.csp', {
    ...data,
    saveFlag: 'edit',
  })
}
