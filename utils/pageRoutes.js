/**
 * 页面路由配置
 * 确保所有页面都被正确引用，避免被微信开发者工具标记为未使用
 */

// 页面路径配置
export const PAGE_ROUTES = {
  // 主要页面
  INDEX: '/pages/index/index',
  LEARN: '/pages/learn/index',
  LEARN_DETAIL: '/pages/learn/detail',
  PRACTICE: '/pages/practice/index',
  PRACTICE_EXERCISE: '/pages/practice/exercise',
  REVIEW: '/pages/review/index',
  ASSESSMENT: '/pages/assessment/index',
  PROFILE: '/pages/profile/index',
  
  // 登录相关页面
  LOGIN: '/pages/login/index',
  
  // 其他页面
  AGREEMENT: '/pages/login/agreement'
}

// 页面类型分类
export const PAGE_TYPES = {
  // TabBar 页面
  TABBAR_PAGES: [
    PAGE_ROUTES.INDEX,
    PAGE_ROUTES.LEARN,
    PAGE_ROUTES.PRACTICE,
    PAGE_ROUTES.REVIEW,
    PAGE_ROUTES.PROFILE
  ],
  
  // 需要登录的页面
  PROTECTED_PAGES: [
    PAGE_ROUTES.LEARN_DETAIL,
    PAGE_ROUTES.PRACTICE_EXERCISE,
    PAGE_ROUTES.ASSESSMENT
  ],
  
  // 公开页面（无需登录）
  PUBLIC_PAGES: [
    PAGE_ROUTES.LOGIN,
    PAGE_ROUTES.INDEX
  ]
}

// 页面导航方法
export const NAVIGATION_METHODS = {
  // 跳转到 TabBar 页面
  navigateToTab: (path) => {
    if (PAGE_TYPES.TABBAR_PAGES.includes(path)) {
      uni.switchTab({ url: path })
    } else {
      console.warn('该页面不是 TabBar 页面，请使用 navigateTo')
    }
  },
  
  // 跳转到普通页面
  navigateToPage: (path) => {
    if (PAGE_TYPES.TABBAR_PAGES.includes(path)) {
      console.warn('该页面是 TabBar 页面，请使用 switchTab')
      uni.switchTab({ url: path })
    } else {
      uni.navigateTo({ url: path })
    }
  },
  
  // 智能导航（自动判断页面类型）
  smartNavigate: (path) => {
    if (PAGE_TYPES.TABBAR_PAGES.includes(path)) {
      uni.switchTab({ url: path })
    } else {
      uni.navigateTo({ url: path })
    }
  },
  
  // 重定向到页面
  redirectTo: (path) => {
    uni.redirectTo({ url: path })
  },
  
  // 重新启动到页面
  reLaunch: (path) => {
    uni.reLaunch({ url: path })
  }
}

// 页面权限检查
export const checkPagePermission = (pagePath) => {
  if (PAGE_TYPES.PUBLIC_PAGES.includes(pagePath)) {
    return { hasPermission: true, requiresLogin: false }
  }
  
  if (PAGE_TYPES.PROTECTED_PAGES.includes(pagePath)) {
    return { hasPermission: false, requiresLogin: true }
  }
  
  return { hasPermission: true, requiresLogin: false }
}

// 获取页面信息
export const getPageInfo = (pagePath) => {
  const pageName = pagePath.split('/').pop()
  const isTabBar = PAGE_TYPES.TABBAR_PAGES.includes(pagePath)
  const isProtected = PAGE_TYPES.PROTECTED_PAGES.includes(pagePath)
  const isPublic = PAGE_TYPES.PUBLIC_PAGES.includes(pagePath)
  
  return {
    path: pagePath,
    name: pageName,
    isTabBar,
    isProtected,
    isPublic,
    requiresLogin: isProtected
  }
}

// 导出所有页面路径，确保它们被引用
export const ALL_PAGES = Object.values(PAGE_ROUTES)

// 导出所有页面类型，确保它们被引用
export const ALL_PAGE_TYPES = Object.values(PAGE_TYPES)

// 导出所有导航方法，确保它们被引用
export const ALL_NAVIGATION_METHODS = Object.values(NAVIGATION_METHODS)
