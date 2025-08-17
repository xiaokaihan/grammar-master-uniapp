<template>
  <view id="app">
    <!-- 全局应用容器 -->
  </view>
</template>

<script>
import { authService } from '@/utils/authService.js'

export default {
  onLaunch: function() {
    console.log('App Launch')
    // 初始化应用数据
    this.initApp()
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    async initApp() {
      try {
        console.log('🚀 开始初始化应用...')
        
        // 初始化认证服务
        console.log('🔐 初始化认证服务...')
        await authService.init()
        console.log('✅ 认证服务初始化完成')
        
        // 显示认证状态
        const status = authService.getStatus()
        const user = authService.getUser()
        const permissions = authService.getPermissions()
        
        console.log('📊 当前认证状态:', {
          status,
          user: user ? `${user.nickname || '用户'} (${user.id})` : '未登录',
          permissions: permissions ? Object.keys(permissions).filter(k => permissions[k]).join(', ') : '无权限'
        })
        
        console.log('🎉 应用初始化完成！')
        
      } catch (error) {
        console.error('❌ 应用初始化失败:', error)
        console.error('错误详情:', error.stack)
        
        // 显示错误提示
        uni.showToast({
          title: '应用初始化失败',
          icon: 'none',
          duration: 3000
        })
      }
    }
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 通用样式类 */
.container {
  padding: 20rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 2rpx solid #dee2e6;
  border-radius: 12rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}

.text-primary {
  color: #667eea;
}

.text-success {
  color: #28a745;
}

.text-warning {
  color: #ffc107;
}

.text-danger {
  color: #dc3545;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.mt-20 {
  margin-top: 20rpx;
}

.mb-20 {
  margin-bottom: 20rpx;
}

.p-20 {
  padding: 20rpx;
}
</style>
