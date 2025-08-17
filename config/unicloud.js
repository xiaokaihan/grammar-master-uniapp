/**
 * uniCloud 云服务配置
 * 使用云函数和云数据库，无需自建服务器
 */

// 微信小程序配置
export const WECHAT_CONFIG = {
  // 小程序 AppID
  APP_ID: 'wx7205f37efa5fb5d4',
  
  // 使用 uniCloud 云服务
  USE_UNICLOUD: true,
  
  // 云函数名称
  CLOUD_FUNCTIONS: {
    LOGIN: 'login',
    GET_USER_INFO: 'getUserInfo',
    UPDATE_USER: 'updateUser',
    REFRESH_TOKEN: 'refreshToken'
  }
}

// 云数据库集合名称
export const DATABASE_COLLECTIONS = {
  USERS: 'users',
  LOGIN_LOGS: 'login_logs',
  USER_SESSIONS: 'user_sessions'
}

// 环境信息
export const ENV_INFO = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  currentEnv: process.env.NODE_ENV || 'development'
}

// 配置验证
export function validateUniCloudConfig() {
  const requiredFields = ['APP_ID', 'USE_UNICLOUD']
  const missingFields = requiredFields.filter(field => !WECHAT_CONFIG[field])
  
  if (missingFields.length > 0) {
    console.error('uniCloud 配置缺失:', missingFields)
    return false
  }
  
  return true
}

// 获取配置信息
export function getUniCloudConfigInfo() {
  return {
    appId: WECHAT_CONFIG.APP_ID,
    useUniCloud: WECHAT_CONFIG.USE_UNICLOUD,
    cloudFunctions: WECHAT_CONFIG.CLOUD_FUNCTIONS,
    databaseCollections: DATABASE_COLLECTIONS,
    environment: ENV_INFO.currentEnv,
    isValid: validateUniCloudConfig()
  }
}
