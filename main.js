import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  // 全局登录状态检查
  app.config.globalProperties.$checkAuth = async () => {
    try {
      const { getAppStatus } = await import('./utils/appInit.js')
      return getAppStatus()
    } catch (error) {
      console.error('权限检查失败:', error)
      return false
    }
  }
  
  // 全局页面导航方法
  app.config.globalProperties.$navigate = async (path) => {
    try {
      const { NAVIGATION_METHODS } = await import('./utils/pageRoutes.js')
      return NAVIGATION_METHODS.smartNavigate(path)
    } catch (error) {
      console.error('导航失败:', error)
    }
  }
  
  // 全局页面路由信息
  app.config.globalProperties.$getPageInfo = async (path) => {
    try {
      const { getPageInfo } = await import('./utils/pageRoutes.js')
      return getPageInfo(path)
    } catch (error) {
      console.error('获取页面信息失败:', error)
      return null
    }
  }
  
  return {
    app
  }
}
