/**
 * 登录状态守卫
 * 用于检查页面访问权限和登录状态
 */

import { loginManager } from './loginManager.js'

// 需要登录的页面路径
const PROTECTED_PAGES = [
  '/pages/profile/index',
  '/pages/practice/exercise',
  '/pages/assessment/index'
]

// 不需要登录的页面路径
const PUBLIC_PAGES = [
  '/pages/login/index',
  '/pages/index/index'
]

/**
 * 检查页面是否需要登录
 * @param {string} pagePath - 页面路径
 * @returns {boolean} 是否需要登录
 */
export function isPageProtected(pagePath) {
  return PROTECTED_PAGES.includes(pagePath)
}

/**
 * 检查页面是否为公开页面
 * @param {string} pagePath - 页面路径
 * @returns {boolean} 是否为公开页面
 */
export function isPublicPage(pagePath) {
  return PUBLIC_PAGES.includes(pagePath)
}

/**
 * 页面访问权限检查
 * @param {string} pagePath - 页面路径
 * @returns {Promise<boolean>} 是否有权限访问
 */
export async function checkPageAccess(pagePath) {
  try {
    // 如果是公开页面，直接允许访问
    if (isPublicPage(pagePath)) {
      return true
    }
    
    // 检查登录状态
    const isLoggedIn = await loginManager.checkLoginStatus()
    
    if (!isLoggedIn) {
      // 未登录，跳转到登录页面
      uni.redirectTo({
        url: '/pages/login/index'
      })
      return false
    }
    
    return true
  } catch (error) {
    console.error('页面访问权限检查失败:', error)
    return false
  }
}

/**
 * 全局登录状态检查
 * 在应用启动时调用
 */
export async function globalAuthCheck() {
  try {
    const isLoggedIn = await loginManager.checkLoginStatus()
    
    if (!isLoggedIn) {
      // 检查当前页面是否需要登录
      const pages = getCurrentPages()
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1]
        const currentPath = '/' + currentPage.route
        
        if (isPageProtected(currentPath)) {
          // 当前页面需要登录，跳转到登录页面
          uni.redirectTo({
            url: '/pages/login/index'
          })
        }
      }
    }
    
    return isLoggedIn
  } catch (error) {
    console.error('全局登录状态检查失败:', error)
    return false
  }
}

/**
 * 路由守卫中间件
 * 在页面跳转前调用
 */
export async function routeGuard(to, from) {
  try {
    // 检查目标页面是否需要登录
    if (isPageProtected(to)) {
      const isLoggedIn = await loginManager.checkLoginStatus()
      
      if (!isLoggedIn) {
        // 未登录，跳转到登录页面
        uni.redirectTo({
          url: '/pages/login/index'
        })
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('路由守卫检查失败:', error)
    return false
  }
}

/**
 * 获取当前页面路径
 */
export function getCurrentPagePath() {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    return '/' + currentPage.route
  }
  return ''
}

/**
 * 检查当前页面是否需要登录
 */
export async function checkCurrentPageAuth() {
  const currentPath = getCurrentPagePath()
  return await checkPageAccess(currentPath)
}

/**
 * 登录成功后的处理
 */
export function handleLoginSuccess() {
  // 检查是否有待访问的页面
  const pendingPage = uni.getStorageSync('pendingPage')
  
  if (pendingPage) {
    uni.removeStorageSync('pendingPage')
    uni.redirectTo({
      url: pendingPage
    })
  } else {
    // 默认跳转到首页
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}

/**
 * 保存待访问的页面
 */
export function savePendingPage(pagePath) {
  if (pagePath && !isPublicPage(pagePath)) {
    uni.setStorageSync('pendingPage', pagePath)
  }
}
