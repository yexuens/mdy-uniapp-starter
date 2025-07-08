import { presetUni } from '@uni-helper/unocss-preset-uni'
import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#D81B17', // 定义 primary 颜色
    },
  },
  presets: [
    presetUni(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      // HBuilderX 必须针对要使用的 Collections 做异步导入
      // collections: {
      //   carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
      // },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  postprocess: (util) => {
    // 自动将 px 替换为 2 倍 rpx
    util.entries = util.entries.map(([key, value]) => {
      if (typeof value === 'string' && value.includes('px')) {
        // 匹配 14px 这种单位，转为 28rpx
        value = value.replace(/(\d+(\.\d+)?)px/g, (_, num) => `${Number.parseFloat(num) * 2}rpx`)
      }
      return [key, value]
    })
  },
})
