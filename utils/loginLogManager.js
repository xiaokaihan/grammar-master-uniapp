/**
 * 登录日志管理工具
 * 用于查询、统计和管理用户登录日志
 */

import { getUniCloud } from '@/config/unicloud.js'

// 登录日志集合名称
const LOGIN_LOGS_COLLECTION = 'login_logs'

/**
 * 登录日志管理器
 */
class LoginLogManager {
  constructor() {
    this.db = null
    this.loginLogsCollection = null
  }

  /**
   * 初始化数据库连接
   */
  async init() {
    try {
      this.db = await getUniCloud()
      this.loginLogsCollection = this.db.collection(LOGIN_LOGS_COLLECTION)
      console.log('登录日志管理器初始化成功')
    } catch (error) {
      console.error('登录日志管理器初始化失败:', error)
      throw error
    }
  }

  /**
   * 获取用户登录历史
   * @param {string} userId - 用户ID
   * @param {number} limit - 限制数量，默认20
   * @param {number} offset - 偏移量，默认0
   * @returns {Promise<Array>} 登录日志列表
   */
  async getUserLoginHistory(userId, limit = 20, offset = 0) {
    try {
      if (!this.loginLogsCollection) {
        await this.init()
      }

      const result = await this.loginLogsCollection
        .where({
          userId: userId
        })
        .orderBy('loginTime', 'desc')
        .skip(offset)
        .limit(limit)
        .get()

      return {
        success: true,
        data: result.data,
        total: result.data.length
      }
    } catch (error) {
      console.error('获取用户登录历史失败:', error)
      return {
        success: false,
        message: '获取登录历史失败',
        error: error.message
      }
    }
  }

  /**
   * 获取登录统计信息
   * @param {string} userId - 用户ID（可选，不传则获取全局统计）
   * @param {number} days - 统计天数，默认30天
   * @returns {Promise<Object>} 统计信息
   */
  async getLoginStatistics(userId = null, days = 30) {
    try {
      if (!this.loginLogsCollection) {
        await this.init()
      }

      const startTime = Date.now() - (days * 24 * 60 * 60 * 1000)
      const whereCondition = {
        loginTime: {
          $gte: startTime
        }
      }

      if (userId) {
        whereCondition.userId = userId
      }

      // 获取总登录次数
      const totalLogins = await this.loginLogsCollection
        .where(whereCondition)
        .count()

      // 获取成功登录次数
      const successfulLogins = await this.loginLogsCollection
        .where({
          ...whereCondition,
          success: true
        })
        .count()

      // 获取失败登录次数
      const failedLogins = await this.loginLogsCollection
        .where({
          ...whereCondition,
          success: false
        })
        .count()

      // 获取每日登录趋势
      const dailyTrend = await this.getDailyLoginTrend(whereCondition, days)

      return {
        success: true,
        data: {
          totalLogins: totalLogins.total,
          successfulLogins: successfulLogins.total,
          failedLogins: failedLogins.total,
          successRate: totalLogins.total > 0 ? (successfulLogins.total / totalLogins.total * 100).toFixed(2) : 0,
          dailyTrend: dailyTrend
        }
      }
    } catch (error) {
      console.error('获取登录统计失败:', error)
      return {
        success: false,
        message: '获取登录统计失败',
        error: error.message
      }
    }
  }

  /**
   * 获取每日登录趋势
   * @param {Object} whereCondition - 查询条件
   * @param {number} days - 天数
   * @returns {Promise<Array>} 每日趋势数据
   */
  async getDailyLoginTrend(whereCondition, days) {
    try {
      const trend = []
      const now = new Date()

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
        const endOfDay = startOfDay + (24 * 60 * 60 * 1000)

        const dayCondition = {
          ...whereCondition,
          loginTime: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        }

        const count = await this.loginLogsCollection
          .where(dayCondition)
          .count()

        trend.push({
          date: date.toISOString().split('T')[0],
          count: count.total
        })
      }

      return trend
    } catch (error) {
      console.error('获取每日登录趋势失败:', error)
      return []
    }
  }

  /**
   * 检测异常登录
   * @param {string} userId - 用户ID
   * @param {number} hours - 检测时间范围（小时），默认24小时
   * @returns {Promise<Object>} 异常登录检测结果
   */
  async detectAbnormalLogin(userId, hours = 24) {
    try {
      if (!this.loginLogsCollection) {
        await this.init()
      }

      const startTime = Date.now() - (hours * 60 * 60 * 1000)
      
      // 获取指定时间范围内的登录记录
      const recentLogins = await this.loginLogsCollection
        .where({
          userId: userId,
          loginTime: {
            $gte: startTime
          }
        })
        .orderBy('loginTime', 'desc')
        .get()

      const logins = recentLogins.data
      const abnormalities = []

      // 检测登录频率异常
      if (logins.length > 10) {
        abnormalities.push({
          type: 'high_frequency',
          message: `24小时内登录次数过多: ${logins.length}次`,
          risk: 'medium'
        })
      }

      // 检测IP地址异常
      const ipCounts = {}
      logins.forEach(login => {
        if (login.ip) {
          ipCounts[login.ip] = (ipCounts[login.ip] || 0) + 1
        }
      })

      const suspiciousIPs = Object.entries(ipCounts)
        .filter(([ip, count]) => count > 5)
        .map(([ip, count]) => ({ ip, count }))

      if (suspiciousIPs.length > 0) {
        abnormalities.push({
          type: 'suspicious_ip',
          message: '检测到可疑IP地址',
          details: suspiciousIPs,
          risk: 'high'
        })
      }

      // 检测失败登录
      const failedLogins = logins.filter(login => !login.success)
      if (failedLogins.length > 3) {
        abnormalities.push({
          type: 'multiple_failures',
          message: `检测到多次登录失败: ${failedLogins.length}次`,
          risk: 'high'
        })
      }

      return {
        success: true,
        data: {
          totalLogins: logins.length,
          abnormalities: abnormalities,
          hasAbnormal: abnormalities.length > 0,
          riskLevel: this.calculateRiskLevel(abnormalities)
        }
      }
    } catch (error) {
      console.error('检测异常登录失败:', error)
      return {
        success: false,
        message: '检测异常登录失败',
        error: error.message
      }
    }
  }

  /**
   * 计算风险等级
   * @param {Array} abnormalities - 异常列表
   * @returns {string} 风险等级
   */
  calculateRiskLevel(abnormalities) {
    if (abnormalities.length === 0) return 'low'
    
    const highRiskCount = abnormalities.filter(ab => ab.risk === 'high').length
    const mediumRiskCount = abnormalities.filter(ab => ab.risk === 'medium').length
    
    if (highRiskCount > 0) return 'high'
    if (mediumRiskCount > 1) return 'medium'
    return 'low'
  }

  /**
   * 清理过期日志
   * @param {number} days - 保留天数，默认90天
   * @returns {Promise<Object>} 清理结果
   */
  async cleanExpiredLogs(days = 90) {
    try {
      if (!this.loginLogsCollection) {
        await this.init()
      }

      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000)
      
      const result = await this.loginLogsCollection
        .where({
          loginTime: {
            $lt: cutoffTime
          }
        })
        .remove()

      return {
        success: true,
        message: `成功清理${result.deleted}条过期日志`,
        deletedCount: result.deleted
      }
    } catch (error) {
      console.error('清理过期日志失败:', error)
      return {
        success: false,
        message: '清理过期日志失败',
        error: error.message
      }
    }
  }
}

// 创建单例实例
const loginLogManager = new LoginLogManager()

export default loginLogManager
