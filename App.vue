<template>
  <view id="app">
    <!-- 全局应用容器 -->
  </view>
</template>

<script>
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
    initApp() {
      // 检查用户登录状态
      const token = uni.getStorageSync('token')
      if (!token) {
        // 可以在这里进行游客登录或其他初始化操作
        console.log('用户未登录，使用游客模式')
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
