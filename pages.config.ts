import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [
    {
      path: 'pages/tabbar/index',
      type: 'home',
    },
    {
      path: 'pages/tabbar/logo',
    },

    {
      path: 'pages/tabbar/mine',
      type: 'page',
    },
    {
      path: 'pages/tabbar/prod',
      type: 'page',
    },
  ],
  globalStyle: {
    backgroundColor: '#F6F6F6',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '雅俊瓷砖',
  },
  tabBar: {
    height: '180rpx',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    color: '#B3B3B3',
    selectedColor: '#D81B17',
    spacing: '16px',
    iconWidth: '22',
    list: [
      {
        pagePath: 'pages/tabbar/index',
        text: '产品中心',
        iconPath: 'static/tabbar_icon/index.png',
        selectedIconPath: 'static/tabbar_icon/indexA.png',
      },
      {
        pagePath: 'pages/tabbar/prod',
        text: '产品筛选',
        iconPath: 'static/tabbar_icon/prod.png',
        selectedIconPath: 'static/tabbar_icon/prodA.png',
      },
      {
        pagePath: 'pages/tabbar/logo',
        text: '品牌中心',
        iconPath: 'static/tabbar_icon/logo.png',
        selectedIconPath: 'static/tabbar_icon/logoA.png',
      },
      {
        pagePath: 'pages/tabbar/mine',
        text: '我的',
        iconPath: 'static/tabbar_icon/mine.png',
        selectedIconPath: 'static/tabbar_icon/mineA.png',
      },
    ],
  },
  easycom: {
    custom: {
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)': 'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
})
