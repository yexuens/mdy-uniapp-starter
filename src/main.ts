import {extend, locale} from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import {createSSRApp} from 'vue'
import {prototypeInterceptor, requestInterceptor, routeInterceptor} from '@/libs/interceptors'
import store from '@/store'
import App from './App.vue'
import 'uno.css'
import 'dayjs/locale/zh-cn'
import {VueQueryPlugin} from '@tanstack/vue-query'
// 扩展功能插件
extend(relativeTime)
extend(duration)

// 本地化语言
locale('zh-cn')

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  // app.use(store)
  // app.use(routeInterceptor)
  // app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  app.use(requestInterceptor)
  app.use(routeInterceptor)
  app.use(VueQueryPlugin)
  return {
    app,
  }
}
