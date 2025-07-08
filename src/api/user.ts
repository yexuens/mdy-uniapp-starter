import type {IPageParm} from '@/api/typings.ts'
import {httpGet} from '@/libs/request'

interface IGetPhoneNumberReq {
  js_code: string
  encryptedData: string
  iv: string
}

interface IWxLoginReq {
  phone: number
  openId: string
  storeStatus: number
}

export const getPhone = async (data: IGetPhoneNumberReq) => await httpGet('/oe_getPhoneIt_.csp', data)

export async function wxLogin(data: IWxLoginReq) {
  const defaultLoginReq = {
    role: 0,
    storeId: 1,
    brandId: 2,
    sex: 0,
    wxName: '',
    wxPhoto: '',
    token: '',
    number: '',
    address: '',
    userId: '',
  }
  return await httpGet('/oe_wxLoginIt_.csp', {
    ...data,
    ...defaultLoginReq,
  })
}

export async function getHistoryPage(data: { userId: number } & IPageParm) {
  return await httpGet<any[]>('/oe_queryBrowseFootsIt_.csp', data)
}

// 记录产品浏览

export async function recordProductHistory(data: {
  timeSpent: number
  typeId: number
  userId: number
  state: number
}) {
  return await httpGet('/oe_saveBrowseFootst_.csp', {
    ...data,
    type: 1,
  })
}

// 记录案例浏览
export async function recordCaseHistory(data: {
  timeSpent: number
  typeId: number
  userId: number
  state: number
}) {
  return await httpGet('/oe_saveBrowseFootst_.csp', {
    ...data,
    type: 2,
  })
}

export async function getWxInfo(data:{openid:string}){
  return await httpGet('/oe_wxInfoIt_.csp',data)
}

export async function getCardInfo() {
  return await httpGet<any>('/oe_userGetCardInfoIt_.csp')
}

