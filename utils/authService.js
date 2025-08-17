/**
 * 认证服务类
 * 统一管理登录、用户状态和权限验证
 */

import { loginManager } from './loginManager.js'
import { smartNavigate } from './navigation.js'

// 登录状态枚举
export const AUTH_STATUS = {
  UNKNOWN: 'unknown',
  LOGGED_OUT: 'logged_out',
  GUEST: 'guest',
  WECHAT: 'wechat',
  LOADING: 'loading',
  ERROR: 'error'
}

// 用户权限级别
export const USER_PERMISSIONS = {
  GUEST: {
    canLearn: true,
    canPractice: true,
    canReview: false,
    canAccessProfile: true,
    canSaveProgress: false,
    canSyncData: false
  },
  WECHAT: {
    canLearn: true,
    canPractice: true,
    canReview: true,
    canAccessProfile: true,
    canSaveProgress: true,
    canSyncData: true
  }
}

/**
 * 认证服务类
 */
class AuthService {
  constructor() {
    this.currentStatus = AUTH_STATUS.UNKNOWN
    this.currentUser = null
    this.permissions = null
    this.isInitialized = false
    this.statusListeners = []
  }

  /**
   * 初始化认证服务
   */
  async init() {
    if (this.isInitialized) return
    
    try {
      this.currentStatus = AUTH_STATUS.LOADING
      this.notifyStatusChange()
      
      // 检查现有登录状态
      const isLoggedIn = await loginManager.checkLoginStatus()
      
      if (isLoggedIn) {
        const user = loginManager.getCurrentUser()
        const status = loginManager.getLoginStatus()
        
        this.currentUser = user
        this.currentStatus = status === 'guest' ? AUTH_STATUS.GUEST : AUTH_STATUS.WECHAT
        this.updatePermissions()
      } else {
        this.currentStatus = AUTH_STATUS.LOGGED_OUT
        this.currentUser = null
        this.permissions = null
      }
      
      this.isInitialized = true
      this.notifyStatusChange()
      
      console.log('认证服务初始化完成:', this.currentStatus)
    } catch (error) {
      console.error('认证服务初始化失败:', error)
      this.currentStatus = AUTH_STATUS.ERROR
      this.notifyStatusChange()
    }
  }

  /**
   * 获取当前认证状态
   */
  getStatus() {
    return this.currentStatus
  }

  /**
   * 获取当前用户信息
   */
  getUser() {
    return this.currentUser
  }

  /**
   * 获取用户权限
   */
  getPermissions() {
    return this.permissions
  }

  /**
   * 检查是否有特定权限
   */
  hasPermission(permission) {
    return this.permissions?.[permission] || false
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    return this.currentStatus === AUTH_STATUS.WECHAT || this.currentStatus === AUTH_STATUS.GUEST
  }

  /**
   * 检查是否为微信用户
   */
  isWechatUser() {
    return this.currentStatus === AUTH_STATUS.WECHAT
  }

  /**
   * 检查是否为游客
   */
  isGuest() {
    return this.currentStatus === AUTH_STATUS.GUEST
  }

  /**
   * 微信登录
   */
  async wechatLogin(userInfo) {
    try {
      this.currentStatus = AUTH_STATUS.LOADING
      this.notifyStatusChange()
      
      // 获取微信授权
      const authData = await this.getWechatAuth(userInfo)
      
      // 调用登录管理器
      const result = await loginManager.wechatLogin(authData)
      
      if (result.success) {
        this.currentUser = result.data
        this.currentStatus = AUTH_STATUS.WECHAT
        this.updatePermissions()
        
        console.log('微信登录成功:', this.currentUser)
        return { success: true, user: this.currentUser }
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('微信登录失败:', error)
      this.currentStatus = AUTH_STATUS.ERROR
      this.notifyStatusChange()
      throw error
    } finally {
      this.notifyStatusChange()
    }
  }

  /**
   * 游客登录
   */
  async guestLogin() {
    try {
      this.currentStatus = AUTH_STATUS.LOADING
      this.notifyStatusChange()
      
      await loginManager.setGuestMode()
      
      this.currentUser = loginManager.getCurrentUser()
      this.currentStatus = AUTH_STATUS.GUEST
      this.updatePermissions()
      
      console.log('游客登录成功:', this.currentUser)
      return { success: true, user: this.currentUser }
    } catch (error) {
      console.error('游客登录失败:', error)
      this.currentStatus = AUTH_STATUS.ERROR
      this.notifyStatusChange()
      throw error
    } finally {
      this.notifyStatusChange()
    }
  }

  /**
   * 退出登录
   */
  async logout() {
    try {
      this.currentStatus = AUTH_STATUS.LOADING
      this.notifyStatusChange()
      
      const result = await loginManager.logout()
      
      if (result.success) {
        this.currentUser = null
        this.currentStatus = AUTH_STATUS.LOGGED_OUT
        this.permissions = null
        
        console.log('退出登录成功')
        return { success: true }
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('退出登录失败:', error)
      throw error
    } finally {
      this.notifyStatusChange()
    }
  }

  /**
   * 刷新用户信息
   */
  async refreshUserInfo() {
    try {
      if (!this.isLoggedIn()) return
      
      const user = loginManager.getCurrentUser()
      if (user) {
        this.currentUser = user
        this.updatePermissions()
        this.notifyStatusChange()
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error)
    }
  }

  /**
   * 获取微信授权
   */
  async getWechatAuth(userInfo) {
    try {
      // 获取微信登录凭证
      const code = await this.getWechatCode()
      
      return {
        code,
        userInfo
      }
    } catch (error) {
      console.error('获取微信授权失败:', error)
      throw error
    }
  }

  /**
   * 获取微信登录凭证
   */
  getWechatCode() {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('获取微信登录凭证超时'))
      }, 10000)
      
      uni.login({
        provider: 'weixin',
        success: (res) => {
          clearTimeout(timeoutId)
          if (res.code) {
            resolve(res.code)
          } else {
            reject(new Error('获取微信登录凭证失败'))
          }
        },
        fail: (err) => {
          clearTimeout(timeoutId)
          console.error('微信登录失败:', err)
          reject(new Error('微信登录失败'))
        }
      })
    })
  }

  /**
   * 获取用户信息 - 必须在用户点击事件中直接调用
   */
  getUserProfile() {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('获取用户信息超时'))
      }, 10000)
      
      uni.getUserProfile({
        desc: '用于完善用户资料',
        lang: 'zh_CN',
        success: (res) => {
          clearTimeout(timeoutId)
          console.log('获取用户信息成功:', res)
          resolve(res.userInfo)
        },
        fail: (err) => {
          clearTimeout(timeoutId)
          console.error('获取用户信息失败:', err)
          
          // 根据具体错误类型提供不同的提示
          let errorMessage = '获取用户信息失败'
          
          if (err.errMsg) {
            if (err.errMsg.includes('deny')) {
              errorMessage = '用户拒绝授权，请允许获取用户信息后重试'
            } else if (err.errMsg.includes('timeout')) {
              errorMessage = '获取用户信息超时，请重试'
            } else if (err.errMsg.includes('cancel')) {
              errorMessage = '用户取消授权'
            } else if (err.errMsg.includes('can only be invoked by user TAP gesture')) {
              errorMessage = '获取用户信息失败，请重新点击登录按钮'
            } else if (err.errMsg.includes('desc length does not meet the requirements')) {
              errorMessage = '授权描述参数错误，请重试'
            }
          }
          
          reject(new Error(errorMessage))
        }
      })
    })
  }

  /**
   * 更新用户权限
   */
  updatePermissions() {
    if (this.currentStatus === AUTH_STATUS.WECHAT) {
      this.permissions = USER_PERMISSIONS.WECHAT
    } else if (this.currentStatus === AUTH_STATUS.GUEST) {
      this.permissions = USER_PERMISSIONS.GUEST
    } else {
      this.permissions = null
    }
  }

  /**
   * 添加状态变化监听器
   */
  addStatusListener(listener) {
    this.statusListeners.push(listener)
  }

  /**
   * 移除状态变化监听器
   */
  removeStatusListener(listener) {
    const index = this.statusListeners.indexOf(listener)
    if (index > -1) {
      this.statusListeners.splice(index, 1)
    }
  }

  /**
   * 通知状态变化
   */
  notifyStatusChange() {
    this.statusListeners.forEach(listener => {
      try {
        listener(this.currentStatus, this.currentUser, this.permissions)
      } catch (error) {
        console.error('状态监听器执行失败:', error)
      }
    })
  }

  /**
   * 检查页面访问权限
   */
  checkPageAccess(pagePath) {
    if (!this.isLoggedIn()) {
      return { allowed: false, reason: '需要登录' }
    }
    
    // 根据页面路径检查权限
    switch (pagePath) {
      case '/pages/review/index':
        if (!this.hasPermission('canReview')) {
          return { allowed: false, reason: '游客模式无法使用复习功能' }
        }
        break
      case '/pages/profile/index':
        if (!this.hasPermission('canAccessProfile')) {
          return { allowed: false, reason: '无法访问个人中心' }
        }
        break
    }
    
    return { allowed: true }
  }

  /**
   * 导航到指定页面（带权限检查）
   */
  async navigateToPage(pagePath, options = {}) {
    const accessCheck = this.checkPageAccess(pagePath)
    
    if (!accessCheck.allowed) {
      uni.showModal({
        title: '访问受限',
        content: accessCheck.reason,
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 跳转到登录页面
            smartNavigate('/pages/login/index')
          }
        }
      })
      return false
    }
    
    try {
      await smartNavigate(pagePath, options)
      return true
    } catch (error) {
      console.error('页面导航失败:', error)
      return false
    }
  }
}

// 创建单例实例
export const authService = new AuthService()

// 导出类（用于测试）
export { AuthService }
