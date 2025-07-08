export interface BaseResponse<T> {
  code: number | string
  msg: string
  collect: number // 收藏记录id
  records?: T
  record?: T
  data?: T
}
