/**
 * 微信登录 API 配置
 * 处理真实的微信小程序登录流程
 */

import { WECHAT_CONFIG } from '../config/wechat.js'

// 登录相关接口
const API_ENDPOINTS = {
  LOGIN: '/auth/wechat-login',
  REFRESH_TOKEN: '/auth/refresh-token',
  USER_INFO: '/user/info',
  UPDATE_USER: '/user/update'
}

/**
 * 微信登录 API 类
 */
class WechatApi {
  constructor() {
    this.baseUrl = WECHAT_CONFIG.API_BASE_URL
    this.appId = WECHAT_CONFIG.APP_ID
  }

  /**
   * 获取微信登录凭证
   * @returns {Promise<Object>} 登录凭证
   */
  async getWechatCode() {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.login({
        provider: 'weixin',
        success: (res) => {
          if (res.code) {
            resolve({
              success: true,
              data: {
                code: res.code,
                appId: this.appId
              }
            })
          } else {
            reject(new Error('获取微信登录凭证失败'))
          }
        },
        fail: (err) => {
          console.error('微信登录失败:', err)
          reject(new Error('微信登录失败'))
        }
      })
      // #endif

      // #ifndef MP-WEIXIN
      reject(new Error('当前环境不支持微信登录'))
      // #endif
    })
  }

  /**
   * 获取用户信息
   * @param {Object} options - 获取用户信息选项
   * @returns {Promise<Object>} 用户信息
   */
  async getUserProfile(options = {}) {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.getUserProfile({
        desc: options.desc || '用于完善用户资料',
        lang: options.lang || 'zh_CN',
        success: (res) => {
          resolve({
            success: true,
            data: res.userInfo
          })
        },
        fail: (err) => {
          console.error('获取用户信息失败:', err)
          reject(new Error('获取用户信息失败'))
        }
      })
      // #endif

      // #ifndef MP-WEIXIN
      reject(new Error('当前环境不支持获取用户信息'))
      // #endif
    })
  }

  /**
   * 调用后端登录接口
   * @param {Object} loginData - 登录数据
   * @returns {Promise<Object>} 登录结果
   */
  async callLoginApi(loginData) {
    try {
      const response = await uni.request({
        url: this.baseUrl + API_ENDPOINTS.LOGIN,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          code: loginData.code,
          userInfo: loginData.userInfo,
          appId: this.appId
        }
      })

      if (response.statusCode === 200) {
        const result = response.data
        
        if (result.success) {
          return {
            success: true,
            data: result.data,
            message: result.message || '登录成功'
          }
        } else {
          throw new Error(result.message || '登录失败')
        }
      } else {
        throw new Error(`HTTP ${response.statusCode}: ${response.data?.message || '网络请求失败'}`)
      }
    } catch (error) {
      console.error('调用登录接口失败:', error)
      throw error
    }
  }

  /**
   * 刷新访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise<Object>} 刷新结果
   */
  async refreshToken(refreshToken) {
    try {
      const response = await uni.request({
        url: this.baseUrl + API_ENDPOINTS.REFRESH_TOKEN,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      })

      if (response.statusCode === 200) {
        const result = response.data
        
        if (result.success) {
          return {
            success: true,
            data: result.data,
            message: result.message || '令牌刷新成功'
          }
        } else {
          throw new Error(result.message || '令牌刷新失败')
        }
      } else {
        throw new Error(`HTTP ${response.statusCode}: ${response.data?.message || '网络请求失败'}`)
      }
    } catch (error) {
      console.error('刷新令牌失败:', error)
      throw error
    }
  }

  /**
   * 获取用户详细信息
   * @param {string} accessToken - 访问令牌
   * @returns {Promise<Object>} 用户信息
   */
  async getUserInfo(accessToken) {
    try {
      const response = await uni.request({
        url: this.baseUrl + API_ENDPOINTS.USER_INFO,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.statusCode === 200) {
        const result = response.data
        
        if (result.success) {
          return {
            success: true,
            data: result.data,
            message: result.message || '获取用户信息成功'
          }
        } else {
          throw new Error(result.message || '获取用户信息失败')
        }
      } else {
        throw new Error(`HTTP ${response.statusCode}: ${response.data?.message || '网络请求失败'}`)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  /**
   * 更新用户信息
   * @param {string} accessToken - 访问令牌
   * @param {Object} userData - 用户数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateUserInfo(accessToken, userData) {
    try {
      const response = await uni.request({
        url: this.baseUrl + API_ENDPOINTS.UPDATE_USER,
        method: 'PUT',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        data: userData
      })

      if (response.statusCode === 200) {
        const result = response.data
        
        if (result.success) {
          return {
            success: true,
            data: result.data,
            message: result.message || '更新用户信息成功'
          }
        } else {
          throw new Error(result.message || '更新用户信息失败')
        }
      } else {
        throw new Error(`HTTP ${response.statusCode}: ${response.data?.message || '网络请求失败'}`)
      }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  }

  /**
   * 检查网络状态
   * @returns {Promise<boolean>} 网络是否可用
   */
  async checkNetworkStatus() {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          const isConnected = res.networkType !== 'none'
          resolve(isConnected)
        },
        fail: () => {
          resolve(false)
        }
      })
    })
  }

  /**
   * 显示网络错误提示
   */
  showNetworkError() {
    uni.showModal({
      title: '网络连接失败',
      content: '请检查网络连接后重试',
      showCancel: false
    })
  }

  /**
   * 显示登录错误提示
   * @param {string} message - 错误信息
   */
  showLoginError(message) {
    uni.showModal({
      title: '登录失败',
      content: message || '登录过程中出现错误，请重试',
      showCancel: false
    })
  }
}

// 创建单例实例
export const wechatApi = new WechatApi()

// 导出类（用于测试）
export { WechatApi }
