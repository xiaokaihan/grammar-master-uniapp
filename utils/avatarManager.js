/**
 * 头像管理工具
 * 统一管理应用中的头像资源
 */

// 默认头像配置
export const AVATAR_CONFIG = {
  // 默认头像路径
  DEFAULT: '/static/images/avatar-default.svg',
  
  // 头像尺寸配置
  SIZES: {
    SMALL: '60rpx',
    MEDIUM: '80rpx',
    LARGE: '120rpx',
    XLARGE: '160rpx'
  },
  
  // 头像样式配置
  STYLES: {
    ROUND: 'border-radius: 50%;',
    SQUARE: 'border-radius: 16rpx;',
    CUSTOM: ''
  }
}

/**
 * 获取头像路径
 * @param {string} avatarPath - 用户头像路径
 * @param {string} fallback - 备用头像路径
 * @returns {string} 头像路径
 */
export function getAvatarPath(avatarPath, fallback = AVATAR_CONFIG.DEFAULT) {
  if (!avatarPath) {
    return fallback
  }
  
  // 如果是网络图片，直接返回
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }
  
  // 如果是本地图片，检查是否存在
  if (avatarPath.startsWith('/static/')) {
    return avatarPath
  }
  
  // 默认返回备用头像
  return fallback
}

/**
 * 获取头像样式
 * @param {string} size - 头像尺寸
 * @param {string} style - 头像样式类型
 * @param {object} customStyle - 自定义样式
 * @returns {string} 样式字符串
 */
export function getAvatarStyle(size = 'MEDIUM', style = 'ROUND', customStyle = {}) {
  const baseStyle = {
    width: AVATAR_CONFIG.SIZES[size] || AVATAR_CONFIG.SIZES.MEDIUM,
    height: AVATAR_CONFIG.SIZES[size] || AVATAR_CONFIG.SIZES.MEDIUM,
    ...AVATAR_CONFIG.STYLES[style] && { borderRadius: style === 'ROUND' ? '50%' : '16rpx' },
    ...customStyle
  }
  
  return Object.entries(baseStyle)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ')
}

/**
 * 生成随机头像颜色
 * @param {string} userId - 用户ID
 * @returns {string} 颜色值
 */
export function generateAvatarColor(userId) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ]
  
  if (!userId) {
    return colors[0]
  }
  
  // 简单的哈希算法生成颜色索引
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * 获取头像组件属性
 * @param {object} options - 配置选项
 * @returns {object} 头像组件属性
 */
export function getAvatarProps(options = {}) {
  const {
    src = AVATAR_CONFIG.DEFAULT,
    size = 'MEDIUM',
    style = 'ROUND',
    customStyle = {},
    mode = 'aspectFill'
  } = options
  
  return {
    src: getAvatarPath(src),
    style: getAvatarStyle(size, style, customStyle),
    mode
  }
}
