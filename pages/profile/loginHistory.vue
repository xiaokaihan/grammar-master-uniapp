<template>
  <view class="login-history-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">登录历史</text>
      <text class="page-subtitle">查看您的登录记录和安全状态</text>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-section">
      <view class="stats-card">
        <view class="stats-item">
          <text class="stats-number">{{ statistics.totalLogins }}</text>
          <text class="stats-label">总登录次数</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{ statistics.successRate }}%</text>
          <text class="stats-label">成功率</text>
        </view>
        <view class="stats-item">
          <text class="stats-number">{{ statistics.failedLogins }}</text>
          <text class="stats-label">失败次数</text>
        </view>
      </view>
    </view>

    <!-- 安全状态 -->
    <view class="security-section" v-if="securityStatus.hasAbnormal">
      <view class="security-card" :class="`risk-${securityStatus.riskLevel}`">
        <view class="security-header">
          <view class="security-icon">⚠️</view>
          <text class="security-title">安全提醒</text>
        </view>
        <text class="security-message">{{ securityStatus.message }}</text>
        <view class="security-details" v-if="securityStatus.abnormalities">
          <view 
            class="abnormality-item" 
            v-for="(item, index) in securityStatus.abnormalities" 
            :key="index"
          >
            <text class="abnormality-type">{{ item.type }}</text>
            <text class="abnormality-message">{{ item.message }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 登录记录列表 -->
    <view class="history-section">
      <view class="section-header">
        <text class="section-title">最近登录记录</text>
        <text class="refresh-btn" @click="refreshHistory">刷新</text>
      </view>
      
      <view class="history-list">
        <view 
          class="history-item" 
          v-for="(item, index) in loginHistory" 
          :key="index"
          :class="{ 'failed': !item.success }"
        >
          <view class="history-main">
            <view class="history-info">
              <text class="login-time">{{ formatTime(item.loginTime) }}</text>
              <text class="login-platform">{{ item.platform || '未知平台' }}</text>
            </view>
            <view class="history-status">
              <text class="status-badge" :class="{ 'success': item.success, 'failed': !item.success }">
                {{ item.success ? '成功' : '失败' }}
              </text>
            </view>
          </view>
          
          <view class="history-details" v-if="item.ip || item.userAgent">
            <text class="detail-item" v-if="item.ip">IP: {{ item.ip }}</text>
            <text class="detail-item" v-if="item.userAgent">设备: {{ formatUserAgent(item.userAgent) }}</text>
            <text class="detail-item" v-if="item.errorMessage">错误: {{ item.errorMessage }}</text>
          </view>
        </view>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <text class="load-more-btn" @click="loadMore">加载更多</text>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-if="loginHistory.length === 0 && !isLoading">
        <text class="empty-icon">📝</text>
        <text class="empty-text">暂无登录记录</text>
      </view>
    </view>

    <!-- 加载指示器 -->
    <view class="loading-overlay" v-if="isLoading">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import loginLogManager from '@/utils/loginLogManager.js'
import { authService } from '@/utils/authService.js'

export default {
  name: 'LoginHistory',
  data() {
    return {
      isLoading: false,
      loginHistory: [],
      statistics: {
        totalLogins: 0,
        successRate: 0,
        failedLogins: 0
      },
      securityStatus: {
        hasAbnormal: false,
        riskLevel: 'low',
        message: '',
        abnormalities: []
      },
      pagination: {
        limit: 20,
        offset: 0,
        hasMore: true
      }
    }
  },
  
  computed: {
    hasMore() {
      return this.pagination.hasMore
    }
  },
  
  onLoad() {
    this.loadData()
  },
  
  methods: {
    /**
     * 加载数据
     */
    async loadData() {
      if (this.isLoading) return
      
      this.isLoading = true
      
      try {
        // 获取当前用户
        const currentUser = authService.getCurrentUser()
        if (!currentUser) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return
        }
        
        // 并行加载数据
        await Promise.all([
          this.loadStatistics(currentUser._id),
          this.loadSecurityStatus(currentUser._id),
          this.loadLoginHistory(currentUser._id)
        ])
        
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 加载统计信息
     */
    async loadStatistics(userId) {
      try {
        const result = await loginLogManager.getLoginStatistics(userId, 30)
        if (result.success) {
          this.statistics = result.data
        }
      } catch (error) {
        console.error('加载统计信息失败:', error)
      }
    },
    
    /**
     * 加载安全状态
     */
    async loadSecurityStatus(userId) {
      try {
        const result = await loginLogManager.detectAbnormalLogin(userId, 24)
        if (result.success) {
          this.securityStatus = result.data
        }
      } catch (error) {
        console.error('加载安全状态失败:', error)
      }
    },
    
    /**
     * 加载登录历史
     */
    async loadLoginHistory(userId, isLoadMore = false) {
      try {
        const { limit, offset } = this.pagination
        
        const result = await loginLogManager.getUserLoginHistory(userId, limit, offset)
        if (result.success) {
          if (isLoadMore) {
            this.loginHistory = [...this.loginHistory, ...result.data]
          } else {
            this.loginHistory = result.data
          }
          
          // 更新分页状态
          this.pagination.hasMore = result.data.length === limit
          this.pagination.offset += result.data.length
        }
      } catch (error) {
        console.error('加载登录历史失败:', error)
      }
    },
    
    /**
     * 刷新历史记录
     */
    async refreshHistory() {
      this.pagination.offset = 0
      this.pagination.hasMore = true
      await this.loadData()
      
      uni.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    },
    
    /**
     * 加载更多
     */
    async loadMore() {
      if (this.isLoading || !this.hasMore) return
      
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        await this.loadLoginHistory(currentUser._id, true)
      }
    },
    
    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      if (!timestamp) return '未知时间'
      
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      // 小于1分钟
      if (diff < 60 * 1000) {
        return '刚刚'
      }
      
      // 小于1小时
      if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))}分钟前`
      }
      
      // 小于24小时
      if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
      }
      
      // 大于24小时
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    /**
     * 格式化用户代理
     */
    formatUserAgent(userAgent) {
      if (!userAgent) return '未知设备'
      
      // 简化用户代理显示
      if (userAgent.includes('MicroMessenger')) {
        return '微信小程序'
      }
      
      if (userAgent.includes('iPhone')) {
        return 'iPhone'
      }
      
      if (userAgent.includes('Android')) {
        return 'Android'
      }
      
      return '其他设备'
    }
  }
}
</script>

<style lang="scss" scoped>
.login-history-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
}

.page-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.page-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.page-subtitle {
  display: block;
  font-size: 28rpx;
  color: #666;
}

.stats-section {
  margin-bottom: 30rpx;
}

.stats-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.stats-item {
  text-align: center;
}

.stats-number {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10rpx;
}

.stats-label {
  display: block;
  font-size: 24rpx;
  color: #666;
}

.security-section {
  margin-bottom: 30rpx;
}

.security-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  border-left: 8rpx solid;
  
  &.risk-low {
    border-left-color: #52c41a;
  }
  
  &.risk-medium {
    border-left-color: #faad14;
  }
  
  &.risk-high {
    border-left-color: #ff4d4f;
  }
}

.security-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.security-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.security-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.security-message {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  line-height: 1.5;
}

.security-details {
  border-top: 1rpx solid #eee;
  padding-top: 20rpx;
}

.abnormality-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.abnormality-type {
  font-size: 24rpx;
  color: #999;
  background: #f0f0f0;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.abnormality-message {
  font-size: 26rpx;
  color: #666;
  flex: 1;
  margin-left: 20rpx;
}

.history-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.refresh-btn {
  font-size: 28rpx;
  color: #667eea;
  padding: 10rpx 20rpx;
  border: 1rpx solid #667eea;
  border-radius: 20rpx;
}

.history-list {
  margin-bottom: 30rpx;
}

.history-item {
  border-bottom: 1rpx solid #eee;
  padding: 25rpx 0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.failed {
    background: #fff2f0;
    border-radius: 12rpx;
    padding: 25rpx;
    margin: 0 -30rpx;
  }
}

.history-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.history-info {
  flex: 1;
}

.login-time {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.login-platform {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.history-status {
  margin-left: 20rpx;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  
  &.success {
    background: #f6ffed;
    color: #52c41a;
    border: 1rpx solid #b7eb8f;
  }
  
  &.failed {
    background: #fff2f0;
    color: #ff4d4f;
    border: 1rpx solid #ffccc7;
  }
}

.history-details {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.detail-item {
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
}

.load-more {
  text-align: center;
  margin-top: 30rpx;
}

.load-more-btn {
  display: inline-block;
  padding: 20rpx 40rpx;
  background: #667eea;
  color: white;
  border-radius: 25rpx;
  font-size: 28rpx;
}

.empty-state {
  text-align: center;
  padding: 80rpx 0;
}

.empty-icon {
  display: block;
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
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
