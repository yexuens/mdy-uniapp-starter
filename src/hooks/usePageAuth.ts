import {useUserStore} from "@/store";
import {currRoute} from "@/libs";

export const usePageAuthHook = () => {

  function checkLogin() {
    const {isLogin} = useUserStore()
    const curr = currRoute();
    if (!isLogin) {
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

  return {checkLogin}
}
