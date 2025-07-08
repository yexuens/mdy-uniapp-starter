/**
 * 将尺寸字符串（如 "100x400x6MM"）按 x 分隔并转换为数字数组
 * @param size 尺寸字符串
 */
function parseSize(size: string): number[] {
  const clean = size.replace(/[^0-9x]/gi, '') // 移除非数字/非x字符
  return clean.split('x').map(Number)
}

/**
 * 对尺寸字符串数组进行升序排序（按顺序比较每一维）
 */
export function sortSizesAsc(sizes: string[]): string[] {
  return sizes.sort((a, b) => {
    const aParts = parseSize(a)
    const bParts = parseSize(b)

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const diff = (aParts[i] || 0) - (bParts[i] || 0)
      if (diff !== 0)
        return diff
    }

    return 0 // 全部相等
  })
}
