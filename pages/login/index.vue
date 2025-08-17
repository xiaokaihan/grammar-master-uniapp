<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="background-decoration">
      <view class="decoration-circle circle-1"></view>
      <view class="decoration-circle circle-2"></view>
      <view class="decoration-circle circle-3"></view>
    </view>

    <!-- 主要内容 -->
    <view class="main-content">
      <!-- Logo 和标题 -->
      <view class="header-section">
        <view class="logo-container">
          <view class="logo-placeholder">📚</view>
        </view>
        <text class="app-title">GrammarMaster</text>
        <text class="app-subtitle">让语法学习更简单、更高效</text>
      </view>

      <!-- 登录表单 -->
      <view class="login-form">
        <view class="welcome-text">
          <text class="welcome-title">欢迎使用</text>
          <text class="welcome-desc">请使用微信账号登录，开始你的语法学习之旅</text>
        </view>

        <!-- 微信登录按钮 -->
        <view class="login-options">
          <button 
            class="wechat-login-btn"
            @click="handleWechatLogin"
            :disabled="isLoggingIn"
          >
            <view class="btn-content">
              <view class="wechat-icon">📱</view>
              <text class="btn-text">{{ isLoggingIn ? '登录中...' : '微信授权登录' }}</text>
            </view>
          </button>

          <!-- 游客模式 -->
          <view class="guest-login">
            <text class="guest-text">或者</text>
            <text class="guest-link" @click="handleGuestLogin">以游客身份体验</text>
          </view>
        </view>

        <!-- 用户协议 -->
        <view class="agreement-section">
          <text class="agreement-text">
            登录即表示同意
            <text class="agreement-link" @click="viewUserAgreement">《用户协议》</text>
            和
            <text class="agreement-link" @click="viewPrivacyPolicy">《隐私政策》</text>
          </text>
        </view>
      </view>

      <!-- 功能特色 -->
      <view class="features-section">
        <view class="feature-item">
          <view class="feature-icon">🎯</view>
          <text class="feature-text">系统化学习</text>
        </view>
        <view class="feature-item">
          <view class="feature-icon">📚</view>
          <text class="feature-text">丰富题库</text>
        </view>
        <view class="feature-item">
          <view class="feature-icon">🔥</view>
          <text class="feature-text">智能复习</text>
        </view>
      </view>
    </view>

    <!-- 加载指示器 -->
    <view class="loading-overlay" v-if="isLoggingIn">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">正在登录...</text>
      </view>
    </view>
  </view>
</template>

<script>
import { authService, AUTH_STATUS } from '@/utils/authService.js'

export default {
  name: 'Login',
  data() {
    return {
      isLoggingIn: false,
      authStatus: AUTH_STATUS.UNKNOWN
    }
  },
  onLoad() {
    // 初始化认证服务
    this.initAuth()
  },
  onUnload() {
    // 移除状态监听器
    authService.removeStatusListener(this.handleStatusChange)
  },
  methods: {
    /**
     * 初始化认证服务
     */
    async initAuth() {
      try {
        // 添加状态变化监听器
        authService.addStatusListener(this.handleStatusChange)
        
        // 初始化认证服务
        await authService.init()
        
        // 检查是否已经登录
        if (authService.isLoggedIn()) {
          this.redirectToMain()
        }
      } catch (error) {
        console.error('初始化认证服务失败:', error)
        uni.showToast({
          title: '初始化失败，请重试',
          icon: 'none'
        })
      }
    },

    /**
     * 处理认证状态变化
     */
    handleStatusChange(status, user, permissions) {
      this.authStatus = status
      
      // 如果登录成功，自动跳转
      if (status === AUTH_STATUS.WECHAT || status === AUTH_STATUS.GUEST) {
        this.redirectToMain()
      }
    },

    /**
     * 处理微信登录
     */
    async handleWechatLogin() {
      if (this.isLoggingIn) return
      
      this.isLoggingIn = true
      
      try {
        const result = await authService.wechatLogin()
        
        if (result.success) {
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          // 状态变化监听器会自动处理跳转
        }
      } catch (error) {
        console.error('微信登录失败:', error)
        
        // 显示具体的错误信息
        let errorMessage = error.message || '登录过程中出现错误，请重试'
        
        // 根据错误类型提供不同的处理建议
        if (error.message.includes('拒绝授权')) {
          errorMessage = '您拒绝了授权，请点击"微信授权登录"按钮并允许获取用户信息'
        } else if (error.message.includes('超时')) {
          errorMessage = '网络超时，请检查网络连接后重试'
        } else if (error.message.includes('取消授权')) {
          errorMessage = '您取消了授权，请重新点击登录按钮'
        }
        
        uni.showModal({
          title: '登录失败',
          content: errorMessage,
          showCancel: false,
          confirmText: '我知道了'
        })
      } finally {
        this.isLoggingIn = false
      }
    },

    /**
     * 处理游客登录
     */
    async handleGuestLogin() {
      if (this.isLoggingIn) return
      
      uni.showModal({
        title: '游客模式',
        content: '游客模式功能受限，建议使用微信登录获得完整体验',
        confirmText: '继续',
        cancelText: '微信登录',
        success: async (res) => {
          if (res.confirm) {
            this.isLoggingIn = true
            
            try {
              await authService.guestLogin()
              
              uni.showToast({
                title: '游客模式已启用',
                icon: 'success'
              })
              
              // 状态变化监听器会自动处理跳转
            } catch (error) {
              console.error('游客登录失败:', error)
              uni.showToast({
                title: '游客模式启用失败',
                icon: 'none'
              })
            } finally {
              this.isLoggingIn = false
            }
          }
        }
      })
    },

    /**
     * 跳转到主页面
     */
    redirectToMain() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },

    /**
     * 查看用户协议
     */
    viewUserAgreement() {
      uni.showModal({
        title: '用户协议',
        content: '感谢您使用 GrammarMaster 语法学习小程序！\n\n我们致力于为您提供优质的语法学习体验。\n\n使用本应用即表示您同意遵守相关服务条款。',
        showCancel: false,
        confirmText: '我知道了'
      })
    },

    /**
     * 查看隐私政策
     */
    viewPrivacyPolicy() {
      uni.showModal({
        title: '隐私政策',
        content: '我们重视您的隐私保护。\n\n您的个人信息仅用于提供学习服务，我们承诺不会泄露给第三方。\n\n您可以随时在设置中管理您的隐私选项。',
        showCancel: false,
        confirmText: '我知道了'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 200rpx;
  height: 200rpx;
  top: -100rpx;
  right: -100rpx;
}

.circle-2 {
  width: 150rpx;
  height: 150rpx;
  bottom: 200rpx;
  left: -75rpx;
}

.circle-3 {
  width: 100rpx;
  height: 100rpx;
  top: 50%;
  right: 50rpx;
}

.main-content {
  position: relative;
  z-index: 1;
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 80rpx;
}

.logo-container {
  margin-bottom: 30rpx;
}

.logo-placeholder {
  width: 120rpx;
  height: 120rpx;
  font-size: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin: 0 auto;
}

.app-title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 20rpx;
}

.app-subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  margin-bottom: 60rpx;
  backdrop-filter: blur(10rpx);
}

.welcome-text {
  text-align: center;
  margin-bottom: 50rpx;
}

.welcome-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.welcome-desc {
  display: block;
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.login-options {
  margin-bottom: 40rpx;
}

.wechat-login-btn {
  width: 100%;
  height: 100rpx;
  background: #07c160;
  border: none;
  border-radius: 50rpx;
  margin-bottom: 30rpx;
  transition: all 0.3s ease;
}

.wechat-login-btn:active {
  transform: scale(0.98);
  background: #06ad56;
}

.wechat-login-btn:disabled {
  background: #ccc;
  opacity: 0.7;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.wechat-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.btn-text {
  font-size: 32rpx;
  color: white;
  font-weight: 500;
}

.guest-login {
  text-align: center;
}

.guest-text {
  font-size: 26rpx;
  color: #999;
  margin-right: 20rpx;
}

.guest-link {
  font-size: 26rpx;
  color: #667eea;
  text-decoration: underline;
}

.agreement-section {
  text-align: center;
}

.agreement-text {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
}

.agreement-link {
  color: #667eea;
  text-decoration: underline;
}

.features-section {
  display: flex;
  justify-content: space-around;
  margin-top: auto;
}

.feature-item {
  text-align: center;
  flex: 1;
}

.feature-icon {
  font-size: 48rpx;
  margin-bottom: 20rpx;
  display: block;
}

.feature-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-content {
  background: white;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  text-align: center;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 30rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #333;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
