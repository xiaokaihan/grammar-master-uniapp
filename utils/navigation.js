/**
 * 通用导航工具
 * 自动判断目标页面类型并使用合适的导航方法
 */

// tabBar 页面列表
const TABBAR_PAGES = [
  '/pages/index/index',
  '/pages/learn/index',
  '/pages/practice/index',
  '/pages/review/index',
  '/pages/profile/index'
]

/**
 * 智能导航方法
 * @param {string} path - 目标页面路径
 * @param {object} options - 导航选项
 */
export function smartNavigate(path, options = {}) {
  // 检查是否为 tabBar 页面
  if (TABBAR_PAGES.includes(path)) {
    // 如果是 tabBar 页面，使用 switchTab
    uni.switchTab({
      url: path,
      ...options
    })
  } else {
    // 如果不是 tabBar 页面，使用 navigateTo
    uni.navigateTo({
      url: path,
      ...options
    })
  }
}

/**
 * 导航到 tabBar 页面
 * @param {string} path - 目标页面路径
 * @param {object} options - 导航选项
 */
export function navigateToTab(path, options = {}) {
  if (!TABBAR_PAGES.includes(path)) {
    console.warn(`页面 ${path} 不是 tabBar 页面，建议使用 smartNavigate`)
  }
  
  uni.switchTab({
    url: path,
    ...options
  })
}

/**
 * 导航到非 tabBar 页面
 * @param {string} path - 目标页面路径
 * @param {object} options - 导航选项
 */
export function navigateToPage(path, options = {}) {
  if (TABBAR_PAGES.includes(path)) {
    console.warn(`页面 ${path} 是 tabBar 页面，建议使用 navigateToTab`)
  }
  
  uni.navigateTo({
    url: path,
    ...options
  })
}

/**
 * 返回上一页
 * @param {number} delta - 返回的页面数，默认为1
 */
export function goBack(delta = 1) {
  uni.navigateBack({
    delta
  })
}

/**
 * 重定向到页面
 * @param {string} path - 目标页面路径
 * @param {object} options - 导航选项
 */
export function redirectTo(path, options = {}) {
  uni.redirectTo({
    url: path,
    ...options
  })
}

/**
 * 重启到页面
 * @param {string} path - 目标页面路径
 * @param {object} options - 导航选项
 */
export function reLaunch(path, options = {}) {
  uni.reLaunch({
    url: path,
    ...options
  })
}
