/**
 * 登录管理工具
 * 处理微信授权登录、用户状态管理等
 */

import { storage } from './storage.js'
import { wechatApi } from './wechatApi.js'

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
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
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
      
      // 检查网络状态
      const isNetworkAvailable = await wechatApi.checkNetworkStatus()
      if (!isNetworkAvailable) {
        wechatApi.showNetworkError()
        throw new Error('网络连接不可用')
      }
      
      // 调用真实的后端登录接口
      const loginResult = await wechatApi.callLoginApi(authData)
      
      if (loginResult.success) {
        const { userInfo, accessToken, refreshToken } = loginResult.data
        
        // 保存令牌信息
        await storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        await storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
        
        // 保存登录状态
        await this.saveLoginStatus(LOGIN_STATUS.WECHAT, userInfo)
        
        return {
          success: true,
          message: '登录成功',
          data: userInfo
        }
      } else {
        throw new Error(loginResult.message || '登录失败')
      }
    } catch (error) {
      console.error('微信登录失败:', error)
      
      // 显示具体的错误信息
      if (error.message.includes('网络')) {
        wechatApi.showNetworkError()
      } else {
        wechatApi.showLoginError(error.message)
      }
      
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
      await storage.remove(STORAGE_KEYS.ACCESS_TOKEN)
      await storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
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

  /**
   * 获取访问令牌
   */
  async getAccessToken() {
    return await storage.get(STORAGE_KEYS.ACCESS_TOKEN)
  }

  /**
   * 获取刷新令牌
   */
  async getRefreshToken() {
    return await storage.get(STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * 刷新访问令牌
   */
  async refreshAccessToken() {
    try {
      const refreshToken = await this.getRefreshToken()
      
      if (!refreshToken) {
        throw new Error('刷新令牌不存在')
      }
      
      const result = await wechatApi.refreshToken(refreshToken)
      
      if (result.success) {
        const { accessToken, refreshToken: newRefreshToken } = result.data
        
        // 保存新的令牌
        await storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        await storage.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
        
        return {
          success: true,
          data: { accessToken, refreshToken: newRefreshToken }
        }
      } else {
        throw new Error(result.message || '刷新令牌失败')
      }
    } catch (error) {
      console.error('刷新访问令牌失败:', error)
      
      // 刷新失败，清除登录状态
      await this.logout()
      
      return {
        success: false,
        message: error.message || '刷新令牌失败'
      }
    }
  }

  /**
   * 验证令牌有效性
   */
  async validateToken() {
    try {
      const accessToken = await this.getAccessToken()
      
      if (!accessToken) {
        return false
      }
      
      // 调用后端接口验证令牌
      const result = await wechatApi.getUserInfo(accessToken)
      
      if (result.success) {
        // 更新用户信息
        await this.updateUserInfo(result.data)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('验证令牌失败:', error)
      return false
    }
  }

  /**
   * 自动刷新令牌（如果需要）
   */
  async autoRefreshTokenIfNeeded() {
    try {
      const accessToken = await this.getAccessToken()
      
      if (!accessToken) {
        return false
      }
      
      // 检查令牌是否即将过期（这里可以根据实际需求调整）
      // 暂时简单返回 true，实际项目中应该解析 JWT 令牌的过期时间
      return true
    } catch (error) {
      console.error('自动刷新令牌检查失败:', error)
      return false
    }
  }
}

// 创建单例实例
export const loginManager = new LoginManager()

// 导出类（用于测试）
export { LoginManager }
