export function useMenuRectSize() {
  const {
    height,
    top,
  } = wx.getMenuButtonBoundingClientRect()

  return {
    height,
    top,
    navHeight: height + top + 16,
    safeArea: wx.getWindowInfo().safeArea,
  }
}
