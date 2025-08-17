/**
 * 页面导航工具
 * 提供稳定的页面跳转方法，避免超时问题
 */

/**
 * 智能页面跳转
 * 优先使用 switchTab，失败时使用 navigateTo
 */
export const smartNavigate = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    // 检查是否为 tabBar 页面
    const tabBarPages = [
      '/pages/index/index',
      '/pages/learn/index', 
      '/pages/practice/index',
      '/pages/review/index',
      '/pages/profile/index'
    ]
    
    const isTabBarPage = tabBarPages.includes(path)
    
    if (isTabBarPage) {
      // 使用 switchTab 跳转到 tabBar 页面
      uni.switchTab({
        url: path,
        success: () => {
          resolve({ success: true, method: 'switchTab' })
        },
        fail: (error) => {
          console.error('switchTab 失败，尝试 navigateTo:', error)
          // 如果 switchTab 失败，尝试 navigateTo
          uni.navigateTo({
            url: path,
            ...options,
            success: () => {
              resolve({ success: true, method: 'navigateTo' })
            },
            fail: (error) => {
              console.error('navigateTo 也失败:', error)
              reject(error)
            }
          })
        }
      })
    } else {
      // 非 tabBar 页面使用 navigateTo
      uni.navigateTo({
        url: path,
        ...options,
        success: () => {
          resolve({ success: true, method: 'navigateTo' })
        },
        fail: (error) => {
          console.error('navigateTo 失败:', error)
          reject(error)
        }
      })
    }
  })
}

/**
 * 安全的重定向（避免超时问题）
 * 使用 navigateTo 替代 redirectTo
 */
export const safeRedirect = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    // 先尝试 navigateTo
    uni.navigateTo({
      url: path,
      ...options,
      success: () => {
        // 如果成功，延迟后关闭当前页面
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
            fail: () => {
              // 如果返回失败，尝试重新加载页面
              const pages = getCurrentPages()
              if (pages.length > 0) {
                const currentPage = pages[pages.length - 1]
                if (currentPage && currentPage.route) {
                  uni.reLaunch({
                    url: `/${currentPage.route}`,
                    success: () => resolve({ success: true, method: 'reLaunch' }),
                    fail: reject
                  })
                } else {
                  resolve({ success: true, method: 'navigateTo' })
                }
              } else {
                resolve({ success: true, method: 'navigateTo' })
              }
            }
          })
        }, 100)
      },
      fail: (error) => {
        console.error('safeRedirect 失败，尝试 reLaunch:', error)
        // 如果 navigateTo 失败，使用 reLaunch
        uni.reLaunch({
          url: path,
          ...options,
          success: () => {
            resolve({ success: true, method: 'reLaunch' })
          },
          fail: reject
        })
      }
    })
  })
}

/**
 * 带超时的页面跳转
 */
export const navigateWithTimeout = (path, options = {}, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('页面跳转超时')), timeout)
    })
    
    const navigatePromise = smartNavigate(path, options)
    
    Promise.race([navigatePromise, timeoutPromise])
      .then(resolve)
      .catch(reject)
  })
}

/**
 * 检查页面是否可访问
 */
export const checkPageAccess = (path) => {
  return new Promise((resolve) => {
    // 简单的页面存在性检查
    const validPaths = [
      '/pages/index/index',
      '/pages/learn/index',
      '/pages/learn/detail',
      '/pages/practice/index',
      '/pages/practice/exercise',
      '/pages/review/index',
      '/pages/assessment/index',
      '/pages/profile/index',
      '/pages/login/index'
    ]
    
    const isValid = validPaths.includes(path)
    resolve(isValid)
  })
}
