import {httpGet} from "@/libs/request";

export async function getBanner(module : number) {
  return await httpGet<any[]>('/oe_getBannerImages_.csp', {module: module})
}

export async function getBrandInfo() {
  return await httpGet<any>('/oe_selectEntityOne_.csp', {
    entity: 'store',
    id: 1
  })
}
