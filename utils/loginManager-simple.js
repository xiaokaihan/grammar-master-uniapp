/**
 * 简化版登录管理器 - 用于测试导入
 */

// 登录状态常量
export const LOGIN_STATUS = {
  GUEST: 'guest',
  WECHAT: 'wechat',
  LOGGED_OUT: 'logged_out'
}

/**
 * 简化的登录管理器
 */
class LoginManager {
  constructor() {
    this.currentUser = null
    this.loginStatus = LOGIN_STATUS.LOGGED_OUT
    console.log('✅ LoginManager 构造函数执行成功')
  }

  /**
   * 初始化登录管理器
   */
  async init() {
    try {
      console.log('🚀 开始初始化登录管理器...')
      
      // 模拟初始化过程
      await new Promise(resolve => setTimeout(resolve, 100))
      
      console.log('✅ 登录管理器初始化完成')
      return true
    } catch (error) {
      console.error('❌ 登录管理器初始化失败:', error)
      return false
    }
  }

  /**
   * 检查登录状态
   */
  async checkLoginStatus() {
    console.log('🔐 检查登录状态...')
    return this.loginStatus !== LOGIN_STATUS.LOGGED_OUT
  }

  /**
   * 获取当前用户
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * 获取登录状态
   */
  getLoginStatus() {
    return this.loginStatus
  }

  /**
   * 设置游客模式
   */
  async setGuestMode() {
    console.log('👤 设置游客模式...')
    this.loginStatus = LOGIN_STATUS.GUEST
    this.currentUser = {
      id: 'guest_' + Date.now(),
      nickname: '游客用户',
      avatar: '/static/images/avatar-default.svg',
      isGuest: true,
      createTime: Date.now()
    }
    return true
  }
}

// 创建单例实例
export const loginManager = new LoginManager()

// 导出类（用于测试）
export { LoginManager }

console.log('📦 loginManager-simple.js 模块加载完成')
console.log('📦 loginManager 实例:', loginManager)
