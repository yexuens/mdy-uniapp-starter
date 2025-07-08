import {defineStore} from 'pinia'
import {ref} from 'vue'
import {getWxInfo, wxLogin} from '@/api'
import {currRoute} from "@/libs";

interface IUserInfo {
  address: string;
  brandId: number;
  createTime: string;
  id: number;
  integral: number;
  joinTime: string;
  name: string;
  openId: string;
  phone: string;
  role: number;
  score: number;
  sex: number;
  storeId: number;
  storeStatus: number;
  token: string;
  updateTime: string;
  wxName: string;
  wxPhoto: string;
}

interface IWxLoginReq {
  openId: string
  phone: number
  storeStatus: number
}


interface IWxLoginResp {
  code: number
  user: IUserInfo
}

const initUser: IUserInfo = {
  address: "",
  brandId: 0,
  createTime: '',
  id: 0,
  integral: 0,
  joinTime: "",
  name: "",
  openId: "",
  phone: "",
  role: 0,
  score: 0,
  sex: 0,
  storeId: 0,
  storeStatus: 1001,
  token: "",
  updateTime: '',
  wxName: "",
  wxPhoto: "",
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfo>(initUser)
    const isLogin = computed(() => !!userInfo.value.id)

    async function login(req: IWxLoginReq) {
      const {code, user}: IWxLoginResp = await wxLogin({...req}) as unknown as IWxLoginResp
      if (code !== 1) {
        throw new Error('登录失败！')
      }
      userInfo.value = {...user}
      await updateUser()
    }


    function checkLogin() {
      const curr = currRoute();
      if (!isLogin.value) {
        uni.showModal({
          title: '暂未登录，请登录后在访问',
          cancelText: '稍后登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm)
              uni.redirectTo({
                url: '/pages/login?redirect=' + JSON.stringify(curr),
              })
          },
        })
        throw new Error("user Not Logged In")
      }
    }

    async function updateUser() {
      if (!isLogin.value)
        return
      const {record, msg} = await getWxInfo({openid: userInfo.value.openId})
      if (msg === '成功') {
        userInfo.value = {...record as unknown as IUserInfo}
      }
    }

    return {
      userInfo,
      login,
      isLogin,
      checkLogin,
      updateUser
    }
  },
  {
    persist: true,
  },
)
