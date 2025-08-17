/**
 * 用户认证状态管理 Composable
 * 基于 Vue 3 Composition API
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { authService, AUTH_STATUS } from './authService.js'

/**
 * 使用认证状态的 Composable
 */
export function useAuth() {
  // 响应式状态
  const authStatus = ref(AUTH_STATUS.UNKNOWN)
  const currentUser = ref(null)
  const permissions = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // 计算属性
  const isLoggedIn = computed(() => {
    return authStatus.value === AUTH_STATUS.WECHAT || authStatus.value === AUTH_STATUS.GUEST
  })

  const isWechatUser = computed(() => {
    return authStatus.value === AUTH_STATUS.WECHAT
  })

  const isGuest = computed(() => {
    return authStatus.value === AUTH_STATUS.GUEST
  })

  const canAccessReview = computed(() => {
    return permissions.value?.canReview || false
  })

  const canSaveProgress = computed(() => {
    return permissions.value?.canSaveProgress || false
  })

  const canSyncData = computed(() => {
    return permissions.value?.canSyncData || false
  })

  // 状态变化处理函数
  const handleStatusChange = (status, user, userPermissions) => {
    authStatus.value = status
    currentUser.value = user
    permissions.value = userPermissions
    isLoading.value = status === AUTH_STATUS.LOADING
    error.value = null
  }

  // 初始化认证服务
  const initAuth = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      // 添加状态监听器
      authService.addStatusListener(handleStatusChange)
      
      // 初始化认证服务
      await authService.init()
      
    } catch (err) {
      error.value = err.message || '初始化认证服务失败'
      console.error('初始化认证服务失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 微信登录
  const wechatLogin = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await authService.wechatLogin()
      return result
      
    } catch (err) {
      error.value = err.message || '微信登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 游客登录
  const guestLogin = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await authService.guestLogin()
      return result
      
    } catch (err) {
      error.value = err.message || '游客登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await authService.logout()
      return result
      
    } catch (err) {
      error.value = err.message || '退出登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 刷新用户信息
  const refreshUserInfo = async () => {
    try {
      await authService.refreshUserInfo()
    } catch (err) {
      error.value = err.message || '刷新用户信息失败'
      console.error('刷新用户信息失败:', err)
    }
  }

  // 检查页面访问权限
  const checkPageAccess = (pagePath) => {
    return authService.checkPageAccess(pagePath)
  }

  // 导航到指定页面（带权限检查）
  const navigateToPage = async (pagePath, options = {}) => {
    try {
      return await authService.navigateToPage(pagePath, options)
    } catch (err) {
      error.value = err.message || '页面导航失败'
      throw err
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 生命周期钩子
  onMounted(() => {
    initAuth()
  })

  onUnmounted(() => {
    authService.removeStatusListener(handleStatusChange)
  })

  return {
    // 状态
    authStatus,
    currentUser,
    permissions,
    isLoading,
    error,
    
    // 计算属性
    isLoggedIn,
    isWechatUser,
    isGuest,
    canAccessReview,
    canSaveProgress,
    canSyncData,
    
    // 方法
    initAuth,
    wechatLogin,
    guestLogin,
    logout,
    refreshUserInfo,
    checkPageAccess,
    navigateToPage,
    clearError
  }
}

/**
 * 使用用户信息的 Composable
 */
export function useUserInfo() {
  const { currentUser, isLoggedIn, isWechatUser, isGuest } = useAuth()

  // 用户基本信息
  const username = computed(() => {
    return currentUser.value?.nickname || '未登录用户'
  })

  const avatar = computed(() => {
    return currentUser.value?.avatar || '/static/images/avatar-default.svg'
  })

  const userId = computed(() => {
    return currentUser.value?.id || null
  })

  const isGuestMode = computed(() => {
    return isGuest.value
  })

  const isWechatMode = computed(() => {
    return isWechatUser.value
  })

  // 用户等级信息
  const userLevel = computed(() => {
    if (isGuestMode.value) return 1
    return currentUser.value?.level || 1
  })

  const userExperience = computed(() => {
    if (isGuestMode.value) return 0
    return currentUser.value?.experience || 0
  })

  // 学习统计
  const studyStats = computed(() => {
    if (isGuestMode.value) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        accuracy: 0,
        streak: 0,
        studyDays: 0
      }
    }
    
    return {
      totalLessons: currentUser.value?.totalLessons || 0,
      completedLessons: currentUser.value?.completedLessons || 0,
      accuracy: currentUser.value?.accuracy || 0,
      streak: currentUser.value?.streak || 0,
      studyDays: currentUser.value?.studyDays || 0
    }
  })

  return {
    username,
    avatar,
    userId,
    isGuestMode,
    isWechatMode,
    userLevel,
    userExperience,
    studyStats
  }
}
