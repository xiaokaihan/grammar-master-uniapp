/**
 * 微信小程序配置文件
 * 包含 AppID、API 地址等配置信息
 */

// 开发环境配置
const DEV_CONFIG = {
  APP_ID: 'wx7205f37efa5fb5d4',
  USE_UNICLOUD: true,
  ENV: 'development'
}

// 生产环境配置
const PROD_CONFIG = {
  APP_ID: 'wx7205f37efa5fb5d4',
  USE_UNICLOUD: true,
  ENV: 'production'
}

// 测试环境配置
const TEST_CONFIG = {
  APP_ID: 'wx7205f37efa5fb5d4',
  USE_UNICLOUD: true,
  ENV: 'test'
}

// 根据环境选择配置
function getConfig() {
  // #ifdef MP-WEIXIN
  // 微信小程序环境，根据版本类型选择配置
  const accountInfo = uni.getAccountInfoSync()
  const envVersion = accountInfo.miniProgram.envVersion
  
  switch (envVersion) {
    case 'develop':
      return DEV_CONFIG
    case 'trial':
      return TEST_CONFIG
    case 'release':
      return PROD_CONFIG
    default:
      return DEV_CONFIG
  }
  // #endif

  // #ifndef MP-WEIXIN
  // 非微信小程序环境，使用开发配置
  return DEV_CONFIG
  // #endif
}

// 导出当前环境的配置
export const WECHAT_CONFIG = getConfig()

// 导出环境信息
export const ENV_INFO = {
  isDev: WECHAT_CONFIG.ENV === 'development',
  isTest: WECHAT_CONFIG.ENV === 'test',
  isProd: WECHAT_CONFIG.ENV === 'production',
  currentEnv: WECHAT_CONFIG.ENV
}

// 导出配置验证函数
export function validateConfig() {
  const requiredFields = ['APP_ID', 'USE_UNICLOUD']
  const missingFields = requiredFields.filter(field => !WECHAT_CONFIG[field])
  
  if (missingFields.length > 0) {
    console.error('微信配置缺失:', missingFields)
    return false
  }
  
  return true
}

// 导出配置信息
export function getConfigInfo() {
  return {
    appId: WECHAT_CONFIG.APP_ID,
    useUniCloud: WECHAT_CONFIG.USE_UNICLOUD,
    environment: WECHAT_CONFIG.ENV,
    isValid: validateConfig()
  }
}
