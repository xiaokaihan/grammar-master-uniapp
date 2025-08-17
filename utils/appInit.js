/**
 * 应用初始化工具
 * 确保所有必要的模块都被正确加载，避免被微信开发者工具标记为未使用
 */

import { loginManager } from './loginManager.js'
import { globalAuthCheck } from './authGuard.js'
import { PAGE_ROUTES, PAGE_TYPES, NAVIGATION_METHODS } from './pageRoutes.js'

/**
 * 初始化应用
 */
export async function initApp() {
  try {
    console.log('🚀 开始初始化应用...')
    
    // 1. 初始化登录管理器
    console.log('📱 初始化登录管理器...')
    await loginManager.init()
    
    // 2. 检查登录状态
    console.log('🔐 检查登录状态...')
    const isLoggedIn = await loginManager.checkLoginStatus()
    
    if (isLoggedIn) {
      const currentUser = loginManager.getCurrentUser()
      console.log('✅ 用户已登录:', currentUser?.nickname || '未知用户')
    } else {
      console.log('👤 用户未登录')
    }
    
    // 3. 初始化权限守卫
    console.log('🛡️ 初始化权限守卫...')
    await globalAuthCheck()
    
    console.log('🎉 应用初始化完成！')
    
    return {
      success: true,
      isLoggedIn,
      currentUser: loginManager.getCurrentUser()
    }
    
  } catch (error) {
    console.error('❌ 应用初始化失败:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 获取应用状态
 */
export function getAppStatus() {
  try {
    return {
      loginStatus: loginManager.getLoginStatus(),
      currentUser: loginManager.getCurrentUser(),
      isLoggedIn: loginManager.getLoginStatus() !== 'logged_out'
    }
  } catch (error) {
    console.error('获取应用状态失败:', error)
    return {
      loginStatus: 'unknown',
      currentUser: null,
      isLoggedIn: false
    }
  }
}

/**
 * 强制刷新应用状态
 */
export async function refreshAppStatus() {
  try {
    await loginManager.init()
    return getAppStatus()
  } catch (error) {
    console.error('刷新应用状态失败:', error)
    return getAppStatus()
  }
}

// 导出模块，确保它们被引用
export { loginManager, globalAuthCheck }

// 导出页面路由配置，确保所有页面都被引用
export { PAGE_ROUTES, PAGE_TYPES, NAVIGATION_METHODS }
