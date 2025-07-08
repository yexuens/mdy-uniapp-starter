<script setup lang="ts">
import type {ButtonOnGetphonenumberDetail} from '@uni-helper/uni-types'
import {getPhone} from '@/api'
import {textRes} from '@/constants'
import {useUserStore} from '@/store'
import {stringifyQuery} from "@/libs/queryString.ts";

interface IRedirectType {
  path: string,
  query: Record<string, string>
}

const redirect = ref<IRedirectType | null>(null)
const {
  height,
  top,
} = wx.getMenuButtonBoundingClientRect()
const approve = ref(false)
const user = useUserStore()

function redirectToPrevPage(_r: IRedirectType) {
  const {path, query} = _r
  uni.redirectTo({
    url: path + '?' + stringifyQuery(query),
  })
}

function navigateBack() {
  const pageStack = getCurrentPages()
  if (pageStack?.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({
      url: '/pages/tabbar/index',
    })
  }
}

async function getPhoneNumber(e: { detail: ButtonOnGetphonenumberDetail }) {
  await uni.showLoading({
    title: '登录中',
    icon: 'none',
  })
  try {
    const {detail} = e
    // 用户点击取消
    if (!detail?.errMsg?.includes('ok'))
      throw new Error('用户点击取消登录')
    await new Promise((resolve, reject) => wx.login({
      success: async (res) => {
        interface IGetPhoneResp {
          openid: string
          phoneNumber: number
          code: number
        }

        const data: IGetPhoneResp = await getPhone({
          js_code: res.code,
          encryptedData: detail.encryptedData!,
          iv: detail.iv!,
        }) as unknown as IGetPhoneResp
        if (data.code !== 1) {
          throw new Error('获取手机号码失败！')
        }
        await user.login({
          openId: data.openid,
          phone: data.phoneNumber,
          storeStatus: wx.getEnterOptionsSync().scene,
        })

        if (redirect.value?.path) {
          redirectToPrevPage(redirect.value)
        } else {
          navigateBack()
        }
        resolve(1)
      },
      fail(err) {
        console.error(err)
        reject(new Error('登录失败！'))
      },
    }))
  } catch (e) {
    uni.showToast({
      title: e as unknown as string,
      icon: 'none',
    })
  } finally {
    uni.hideLoading()
  }
}

function showApproveToast() {
  uni.showToast({
    title: '请先阅读隐私协议',
    icon: 'none',
  })
}
function navigateToPrivacy(){
  uni.navigateTo({
    url:'/pages/privacy'
  })
}
onLoad((opt) => {
  if (opt?.redirect) {
    redirect.value = JSON.parse(opt.redirect)
  }
})
</script>

<template>
  <!--  navBar -->
  <view :style="`margin-top: ${top}px;height:${height}px`" class="flex items-center">
    <image class="ml-20px h-16px w-16px" mode="aspectFit" :src="iconRes.leftArrowIcon" @click="navigateBack"/>
  </view>
  <!--  封面 -->
  <image class="absolute left-0 top-0 h-screen w-screen -z-1" mode="aspectFill" :src="imgRes.loginBackground"/>
  <view class="relative mt-96px px-20px">
    <view class="mb-28px text-[24px] text-[#313334] font-700 leading-[24px]">
      欢迎登录
    </view>
    <image class="h-[32px] w-[76px] shrink-0" :src="imgRes.brandLogo"/>
    <view class="mt-225px flex items-center">
      <wd-checkbox v-model="approve" checked-color="#000"/>
      <view class="text-12px">
        <text class="text-12px text-[#94989a]">
          已阅读并同意{{ textRes.brandName }}
        </text>
        <text @click="navigateToPrivacy">《用户协议及隐私协议》</text>
      </view>
    </view>
    <button
      v-if="approve" open-type="getPhoneNumber" class="mt-12px bg-[#000000] py-10px text-white"
      @getphonenumber="getPhoneNumber "
    >
      {{ "授权电话" }}
    </button>
    <button
      v-else
      class="mt-12px bg-[#000000] py-10px text-white"
      @click="showApproveToast"
    >
      {{ '一键快捷登录' }}
    </button>
  </view>
</template>

<route lang="json5">
{
layout:"empty",
hideFab:true,
style: {
navigationStyle: "custom"
}
}
</route>
