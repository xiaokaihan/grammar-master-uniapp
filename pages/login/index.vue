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
          <image class="logo" src="/static/images/logo.svg" mode="aspectFit"></image>
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
import { loginManager } from '@/utils/loginManager.js'

export default {
  name: 'Login',
  data() {
    return {
      isLoggingIn: false
    }
  },
  onLoad() {
    // 检查是否已经登录
    this.checkLoginStatus()
  },
  methods: {
    // 检查登录状态
    async checkLoginStatus() {
      try {
        const isLoggedIn = await loginManager.checkLoginStatus()
        if (isLoggedIn) {
          this.redirectToMain()
        }
      } catch (error) {
        console.log('检查登录状态失败:', error)
      }
    },

    // 处理微信登录
    async handleWechatLogin() {
      if (this.isLoggingIn) return
      
      this.isLoggingIn = true
      
      try {
        // 获取微信授权
        const authResult = await this.getWechatAuth()
        
        if (authResult.success) {
          // 使用授权信息登录
          const loginResult = await loginManager.wechatLogin(authResult.data)
          
          if (loginResult.success) {
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            })
            
            // 跳转到主页面
            this.redirectToMain()
          } else {
            throw new Error(loginResult.message)
          }
        } else {
          throw new Error(authResult.message)
        }
      } catch (error) {
        console.error('微信登录失败:', error)
        uni.showModal({
          title: '登录失败',
          content: error.message || '登录过程中出现错误，请重试',
          showCancel: false
        })
      } finally {
        this.isLoggingIn = false
      }
    },

    // 获取微信授权
    getWechatAuth() {
      return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
          provider: 'weixin',
          success: (loginRes) => {
            if (loginRes.code) {
              // 获取用户信息
              uni.getUserProfile({
                desc: '用于完善用户资料',
                success: (profileRes) => {
                  resolve({
                    success: true,
                    data: {
                      code: loginRes.code,
                      userInfo: profileRes.userInfo
                    }
                  })
                },
                fail: (profileErr) => {
                  reject(new Error('获取用户信息失败'))
                }
              })
            } else {
              reject(new Error('微信登录失败'))
            }
          },
          fail: (loginErr) => {
            reject(new Error('微信授权失败'))
          }
        })
        // #endif

        // #ifndef MP-WEIXIN
        // 非微信小程序环境，模拟登录
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              code: 'mock_code',
              userInfo: {
                nickName: '测试用户',
                avatarUrl: '/static/images/avatar-default.svg'
              }
            }
          })
        }, 1000)
        // #endif
      })
    },

    // 游客登录
    handleGuestLogin() {
      uni.showModal({
        title: '游客模式',
        content: '游客模式功能受限，建议使用微信登录获得完整体验',
        confirmText: '继续',
        cancelText: '微信登录',
        success: (res) => {
          if (res.confirm) {
            // 设置游客模式
            loginManager.setGuestMode()
            this.redirectToMain()
          }
        }
      })
    },

    // 跳转到主页面
    redirectToMain() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },

    // 查看用户协议
    viewUserAgreement() {
      uni.navigateTo({
        url: '/pages/login/agreement?type=user'
      })
    },

    // 查看隐私政策
    viewPrivacyPolicy() {
      uni.navigateTo({
        url: '/pages/login/agreement?type=privacy'
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

.logo {
  width: 120rpx;
  height: 120rpx;
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
