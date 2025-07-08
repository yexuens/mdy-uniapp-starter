import {defineManifestConfig} from '@uni-helper/vite-plugin-uni-manifest'

export default defineManifestConfig({
  'name': 'yajun-uniapp',
  'appid': 'wxde47dfe2b7e7ad33',
  'description': '',
  'versionName': '1.0.0',
  'versionCode': '100',
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: 'wxde47dfe2b7e7ad33',
    setting: {
      urlCheck: false,
    },
    usingComponents: true,
    darkmode: false,
    themeLocation: 'theme.json',
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示',
      },
      'scope.userLocationBackground': {
        desc: '你的位置信息将用于小程序后台定位功能',
      },
      'scope.userFuzzyLocation': {
        desc: '你的位置信息将用于小程序模糊定位功能',
      },
    },
    requiredPrivateInfos: ['getLocation', 'chooseLocation'],
  },
  'h5': {
    darkmode: false,
    themeLocation: 'theme.json',
  },
  'uniStatistics': {
    enable: false,
  },
  'vueVersion': '3',
})
