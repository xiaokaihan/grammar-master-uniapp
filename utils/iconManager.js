/**
 * 图标管理工具
 * 统一管理应用中的图标资源
 */

// TabBar 图标配置
export const TABBAR_ICONS = {
  HOME: {
    normal: '/static/tabbar/home.png',
    active: '/static/tabbar/home-active.png'
  },
  LEARN: {
    normal: '/static/tabbar/learn.png',
    active: '/static/tabbar/learn-active.png'
  },
  PRACTICE: {
    normal: '/static/tabbar/practice.png',
    active: '/static/tabbar/practice-active.png'
  },
  REVIEW: {
    normal: '/static/tabbar/review.png',
    active: '/static/tabbar/review-active.png'
  },
  PROFILE: {
    normal: '/static/tabbar/profile.png',
    active: '/static/tabbar/profile-active.png'
  }
}

// SVG 图标配置（用于页面内显示）
export const SVG_ICONS = {
  HOME: '/static/tabbar/home.svg',
  LEARN: '/static/tabbar/learn.svg',
  PRACTICE: '/static/tabbar/practice.svg',
  REVIEW: '/static/tabbar/review.svg',
  PROFILE: '/static/tabbar/profile.svg'
}

// 图标尺寸配置
export const ICON_SIZES = {
  XS: '32rpx',
  SM: '48rpx',
  MD: '64rpx',
  LG: '80rpx',
  XL: '96rpx'
}

/**
 * 获取 TabBar 图标路径
 * @param {string} pageName - 页面名称
 * @param {boolean} isActive - 是否为激活状态
 * @returns {string} 图标路径
 */
export function getTabBarIcon(pageName, isActive = false) {
  const iconConfig = TABBAR_ICONS[pageName.toUpperCase()]
  if (!iconConfig) {
    console.warn(`未找到页面 ${pageName} 的图标配置`)
    return TABBAR_ICONS.HOME[isActive ? 'active' : 'normal']
  }
  
  return isActive ? iconConfig.active : iconConfig.normal
}

/**
 * 获取 SVG 图标路径
 * @param {string} iconName - 图标名称
 * @returns {string} 图标路径
 */
export function getSvgIcon(iconName) {
  const iconPath = SVG_ICONS[iconName.toUpperCase()]
  if (!iconPath) {
    console.warn(`未找到图标 ${iconName} 的 SVG 配置`)
    return SVG_ICONS.HOME
  }
  
  return iconPath
}

/**
 * 获取图标样式
 * @param {string} size - 图标尺寸
 * @param {object} customStyle - 自定义样式
 * @returns {string} 样式字符串
 */
export function getIconStyle(size = 'MD', customStyle = {}) {
  const baseStyle = {
    width: ICON_SIZES[size] || ICON_SIZES.MD,
    height: ICON_SIZES[size] || ICON_SIZES.MD,
    ...customStyle
  }
  
  return Object.entries(baseStyle)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ')
}

/**
 * 获取完整的图标组件属性
 * @param {object} options - 配置选项
 * @returns {object} 图标组件属性
 */
export function getIconProps(options = {}) {
  const {
    type = 'svg', // 'svg' 或 'tabbar'
    name = 'HOME',
    size = 'MD',
    isActive = false,
    customStyle = {}
  } = options
  
  let src
  if (type === 'tabbar') {
    src = getTabBarIcon(name, isActive)
  } else {
    src = getSvgIcon(name)
  }
  
  return {
    src,
    style: getIconStyle(size, customStyle)
  }
}

/**
 * 验证图标文件是否存在
 * @param {string} iconPath - 图标路径
 * @returns {boolean} 是否存在
 */
export function validateIconPath(iconPath) {
  if (!iconPath) return false
  
  // 检查路径格式
  if (!iconPath.startsWith('/static/')) {
    return false
  }
  
  // 检查文件扩展名
  const validExtensions = ['.png', '.jpg', '.jpeg', '.svg']
  const hasValidExtension = validExtensions.some(ext => 
    iconPath.toLowerCase().endsWith(ext)
  )
  
  return hasValidExtension
}

/**
 * 获取所有可用的图标
 * @returns {object} 所有图标配置
 */
export function getAllIcons() {
  return {
    tabbar: TABBAR_ICONS,
    svg: SVG_ICONS,
    sizes: ICON_SIZES
  }
}
