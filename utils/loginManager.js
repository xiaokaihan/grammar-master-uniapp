/**
 * 登录管理工具
 * 处理微信授权登录、用户状态管理等
 */

import { storage } from './storage.js'

// 登录状态常量
export const LOGIN_STATUS = {
  GUEST: 'guest',
  WECHAT: 'wechat',
  LOGGED_OUT: 'logged_out'
}

// 存储键名
const STORAGE_KEYS = {
  LOGIN_STATUS: 'loginStatus',
  USER_INFO: 'userInfo',
  WECHAT_TOKEN: 'wechatToken',
  LOGIN_TIME: 'loginTime',
  SESSION_EXPIRE: 'sessionExpire'
}

// 会话过期时间（7天）
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

/**
 * 登录管理器
 */
class LoginManager {
  constructor() {
    this.currentUser = null
    this.loginStatus = LOGIN_STATUS.LOGGED_OUT
    this.init()
  }

  /**
   * 初始化登录管理器
   */
  async init() {
    try {
      await this.loadLoginStatus()
    } catch (error) {
      console.error('初始化登录管理器失败:', error)
      this.resetLoginStatus()
    }
  }

  /**
   * 加载登录状态
   */
  async loadLoginStatus() {
    try {
      const status = await storage.get(STORAGE_KEYS.LOGIN_STATUS)
      const userInfo = await storage.get(STORAGE_KEYS.USER_INFO)
      const loginTime = await storage.get(STORAGE_KEYS.LOGIN_TIME)

      if (status && userInfo) {
        // 检查会话是否过期
        if (this.isSessionExpired(loginTime)) {
          console.log('会话已过期，清除登录状态')
          this.resetLoginStatus()
          return
        }

        this.loginStatus = status
        this.currentUser = userInfo
        console.log('登录状态已加载:', status)
      }
    } catch (error) {
      console.error('加载登录状态失败:', error)
      this.resetLoginStatus()
    }
  }

  /**
   * 检查会话是否过期
   */
  isSessionExpired(loginTime) {
    if (!loginTime) return true
    
    const now = Date.now()
    const expireTime = loginTime + SESSION_DURATION
    
    return now > expireTime
  }

  /**
   * 微信登录
   */
  async wechatLogin(authData) {
    try {
      console.log('开始微信登录:', authData)
      
      // 模拟后端验证（实际项目中应该调用真实的后端API）
      const userInfo = await this.verifyWechatAuth(authData)
      
      // 保存登录状态
      await this.saveLoginStatus(LOGIN_STATUS.WECHAT, userInfo)
      
      return {
        success: true,
        message: '登录成功',
        data: userInfo
      }
    } catch (error) {
      console.error('微信登录失败:', error)
      return {
        success: false,
        message: error.message || '登录失败'
      }
    }
  }

  /**
   * 验证微信授权（模拟后端验证）
   */
  async verifyWechatAuth(authData) {
    return new Promise((resolve, reject) => {
      // 模拟网络请求延迟
      setTimeout(() => {
        try {
          // 这里应该调用真实的后端API进行验证
          // 现在使用模拟数据
          const mockUserInfo = {
            id: 'user_' + Date.now(),
            openid: 'openid_' + Math.random().toString(36).substr(2, 9),
            unionid: 'unionid_' + Math.random().toString(36).substr(2, 9),
            nickname: authData.userInfo.nickName || '微信用户',
            avatar: authData.userInfo.avatarUrl || '/static/images/avatar-default.svg',
            gender: authData.userInfo.gender || 0,
            country: authData.userInfo.country || '',
            province: authData.userInfo.province || '',
            city: authData.userInfo.city || '',
            language: authData.userInfo.language || 'zh_CN',
            createTime: Date.now(),
            lastLoginTime: Date.now(),
            loginCount: 1,
            isGuest: false
          }
          
          resolve(mockUserInfo)
        } catch (error) {
          reject(new Error('验证微信授权失败'))
        }
      }, 1000)
    })
  }

  /**
   * 设置游客模式
   */
  async setGuestMode() {
    try {
      const guestUser = {
        id: 'guest_' + Date.now(),
        nickname: '游客用户',
        avatar: '/static/images/avatar-default.svg',
        isGuest: true,
        createTime: Date.now(),
        lastLoginTime: Date.now(),
        loginCount: 1
      }
      
      await this.saveLoginStatus(LOGIN_STATUS.GUEST, guestUser)
      
      return {
        success: true,
        message: '游客模式已启用',
        data: guestUser
      }
    } catch (error) {
      console.error('设置游客模式失败:', error)
      return {
        success: false,
        message: error.message || '设置游客模式失败'
      }
    }
  }

  /**
   * 保存登录状态
   */
  async saveLoginStatus(status, userInfo) {
    try {
      const now = Date.now()
      
      // 保存到内存
      this.loginStatus = status
      this.currentUser = userInfo
      
      // 保存到本地存储
      await storage.set(STORAGE_KEYS.LOGIN_STATUS, status)
      await storage.set(STORAGE_KEYS.USER_INFO, userInfo)
      await storage.set(STORAGE_KEYS.LOGIN_TIME, now)
      await storage.set(STORAGE_KEYS.SESSION_EXPIRE, now + SESSION_DURATION)
      
      console.log('登录状态已保存:', status)
    } catch (error) {
      console.error('保存登录状态失败:', error)
      throw error
    }
  }

  /**
   * 检查登录状态
   */
  async checkLoginStatus() {
    try {
      // 如果内存中没有状态，尝试从存储加载
      if (!this.currentUser) {
        await this.loadLoginStatus()
      }
      
      const isLoggedIn = this.loginStatus === LOGIN_STATUS.WECHAT || 
                         this.loginStatus === LOGIN_STATUS.GUEST
      
      return isLoggedIn && this.currentUser !== null
    } catch (error) {
      console.error('检查登录状态失败:', error)
      return false
    }
  }

  /**
   * 获取当前用户信息
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
   * 更新用户信息
   */
  async updateUserInfo(updates) {
    try {
      if (!this.currentUser) {
        throw new Error('用户未登录')
      }
      
      // 更新用户信息
      this.currentUser = { ...this.currentUser, ...updates }
      
      // 保存到存储
      await storage.set(STORAGE_KEYS.USER_INFO, this.currentUser)
      
      return {
        success: true,
        message: '用户信息更新成功',
        data: this.currentUser
      }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return {
        success: false,
        message: error.message || '更新用户信息失败'
      }
    }
  }

  /**
   * 退出登录
   */
  async logout() {
    try {
      // 清除内存中的状态
      this.currentUser = null
      this.loginStatus = LOGIN_STATUS.LOGGED_OUT
      
      // 清除本地存储
      await storage.remove(STORAGE_KEYS.LOGIN_STATUS)
      await storage.remove(STORAGE_KEYS.USER_INFO)
      await storage.remove(STORAGE_KEYS.WECHAT_TOKEN)
      await storage.remove(STORAGE_KEYS.LOGIN_TIME)
      await storage.remove(STORAGE_KEYS.SESSION_EXPIRE)
      
      console.log('已退出登录')
      
      return {
        success: true,
        message: '退出登录成功'
      }
    } catch (error) {
      console.error('退出登录失败:', error)
      return {
        success: false,
        message: error.message || '退出登录失败'
      }
    }
  }

  /**
   * 重置登录状态
   */
  resetLoginStatus() {
    this.currentUser = null
    this.loginStatus = LOGIN_STATUS.LOGGED_OUT
  }

  /**
   * 刷新登录状态
   */
  async refreshLoginStatus() {
    try {
      await this.loadLoginStatus()
      return await this.checkLoginStatus()
    } catch (error) {
      console.error('刷新登录状态失败:', error)
      return false
    }
  }

  /**
   * 检查是否为游客模式
   */
  isGuestMode() {
    return this.loginStatus === LOGIN_STATUS.GUEST
  }

  /**
   * 检查是否为微信登录
   */
  isWechatLogin() {
    return this.loginStatus === LOGIN_STATUS.WECHAT
  }
}

// 创建单例实例
export const loginManager = new LoginManager()

// 导出类（用于测试）
export { LoginManager }
