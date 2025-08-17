/**
 * 登录管理工具 - uniCloud 版本
 * 使用云函数和云数据库，无需自建服务器
 */

import StorageManager from './storage.js'

// 创建简化的 storage 接口
const storage = {
  get: (key) => {
    try {
      return uni.getStorageSync(key)
    } catch (error) {
      console.error(`获取存储失败: ${key}`, error)
      return null
    }
  },
  set: (key, value) => {
    try {
      uni.setStorageSync(key, value)
      return true
    } catch (error) {
      console.error(`设置存储失败: ${key}`, error)
      return false
    }
  },
  remove: (key) => {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (error) {
      console.error(`删除存储失败: ${key}`, error)
      return false
    }
  }
}

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
  USER_TOKEN: 'userToken',
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
    // 不在构造函数中调用异步方法
  }

  /**
   * 初始化登录管理器
   */
  async init() {
    try {
      const savedStatus = await storage.get(STORAGE_KEYS.LOGIN_STATUS)
      const savedUser = await storage.get(STORAGE_KEYS.USER_INFO)
      const loginTime = await storage.get(STORAGE_KEYS.LOGIN_TIME)
      
      if (savedStatus && savedUser && loginTime) {
        if (!this.isSessionExpired(loginTime)) {
          this.loginStatus = savedStatus
          this.currentUser = savedUser
        } else {
          // 会话过期，清除登录状态
          await this.clearLoginStatus()
        }
      }
    } catch (error) {
      console.error('初始化登录管理器失败:', error)
    }
  }

  /**
   * 检查会话是否过期
   */
  isSessionExpired(loginTime) {
    const now = Date.now()
    const expireTime = loginTime + SESSION_DURATION
    return now > expireTime
  }

  /**
   * 微信登录 - uniCloud 版本
   */
  async wechatLogin(authData) {
    try {
      console.log('开始微信登录:', authData)
      
      // 调用 uniCloud 云函数
      const result = await uniCloud.callFunction({
        name: 'login',
        data: {
          code: authData.code,
          userInfo: authData.userInfo
        }
      })
      
      if (result.result && result.result.success) {
        const { userInfo, token, openId } = result.result.data
        
        // 保存登录状态
        await this.saveLoginStatus(LOGIN_STATUS.WECHAT, userInfo, token)
        
        return {
          success: true,
          message: '登录成功',
          data: userInfo
        }
      } else {
        throw new Error(result.result?.message || '登录失败')
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
   * 保存登录状态
   */
  async saveLoginStatus(status, userInfo, token = null) {
    try {
      this.loginStatus = status
      this.currentUser = userInfo
      
      await storage.set(STORAGE_KEYS.LOGIN_STATUS, status)
      await storage.set(STORAGE_KEYS.USER_INFO, userInfo)
      if (token) {
        await storage.set(STORAGE_KEYS.USER_TOKEN, token)
      }
      await storage.set(STORAGE_KEYS.LOGIN_TIME, Date.now())
      await storage.set(STORAGE_KEYS.SESSION_EXPIRE, Date.now() + SESSION_DURATION)
      
      return true
    } catch (error) {
      console.error('保存登录状态失败:', error)
      return false
    }
  }

  /**
   * 检查登录状态
   */
  async checkLoginStatus() {
    try {
      // 添加超时保护
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('检查登录状态超时')), 3000)
      })
      
      const checkPromise = this._checkLoginStatusInternal()
      
      return await Promise.race([checkPromise, timeoutPromise])
    } catch (error) {
      console.error('检查登录状态失败:', error)
      // 超时或其他错误时，返回 false 而不是抛出异常
      return false
    }
  }

  /**
   * 内部检查登录状态方法
   */
  async _checkLoginStatusInternal() {
    if (this.loginStatus === LOGIN_STATUS.LOGGED_OUT) {
      return false
    }
    
    const loginTime = await storage.get(STORAGE_KEYS.LOGIN_TIME)
    if (loginTime && this.isSessionExpired(loginTime)) {
      await this.clearLoginStatus()
      return false
    }
    
    return true
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
    const guestUser = {
      id: 'guest_' + Date.now(),
      nickname: '游客用户',
      avatar: '/static/images/avatar-default.svg',
      isGuest: true,
      createTime: Date.now()
    }
    
    await this.saveLoginStatus(LOGIN_STATUS.GUEST, guestUser)
  }

  /**
   * 退出登录
   */
  async logout() {
    try {
      await this.clearLoginStatus()
      return {
        success: true,
        message: '退出登录成功'
      }
    } catch (error) {
      console.error('退出登录失败:', error)
      return {
        success: false,
        message: '退出登录失败'
      }
    }
  }

  /**
   * 清除登录状态
   */
  async clearLoginStatus() {
    try {
      this.currentUser = null
      this.loginStatus = LOGIN_STATUS.LOGGED_OUT
      
      await storage.remove(STORAGE_KEYS.LOGIN_STATUS)
      await storage.remove(STORAGE_KEYS.USER_INFO)
      await storage.remove(STORAGE_KEYS.USER_TOKEN)
      await storage.remove(STORAGE_KEYS.LOGIN_TIME)
      await storage.remove(STORAGE_KEYS.SESSION_EXPIRE)
      
      return true
    } catch (error) {
      console.error('清除登录状态失败:', error)
      return false
    }
  }

  /**
   * 检查是否为微信登录
   */
  isWechatLogin() {
    return this.loginStatus === LOGIN_STATUS.WECHAT
  }

  /**
   * 检查是否为游客模式
   */
  isGuestMode() {
    return this.loginStatus === LOGIN_STATUS.GUEST
  }
}

// 创建单例实例
export const loginManager = new LoginManager()

// 导出类（用于测试）
export { LoginManager }
