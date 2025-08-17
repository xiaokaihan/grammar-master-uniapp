<template>
  <view class="container">
    <!-- 顶部欢迎区域 -->
    <view class="welcome-section">
      <view class="welcome-text">
        <text class="greeting">{{ greeting }}</text>
        <text class="username">{{ username }}</text>
      </view>
      <view class="avatar">
        <image src="/static/images/avatar-default.svg" mode="aspectFill"></image>
      </view>
    </view>

    <!-- 学习统计卡片 -->
    <view class="stats-card card">
      <view class="stats-header">
        <text class="stats-title">今日学习</text>
        <text class="stats-subtitle">{{ todayProgress.completed }}/{{ todayProgress.total }} 已完成</text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progressPercentage + '%' }"></view>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-number">{{ userStats.streak }}</text>
          <text class="stat-label">连续学习</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ userStats.totalProgress }}</text>
          <text class="stat-label">总进度</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ userStats.completedLessons }}</text>
          <text class="stat-label">已完成课程</text>
        </view>
      </view>
    </view>

    <!-- 快速入口 -->
    <view class="quick-access card">
      <text class="section-title">快速开始</text>
      <view class="quick-grid">
        <view class="quick-item" @click="navigateTo('/pages/learn/index')">
          <view class="quick-icon learn-icon">📚</view>
          <text class="quick-text">语法学习</text>
        </view>
        <view class="quick-item" @click="navigateTo('/pages/practice/index')">
          <view class="quick-icon practice-icon">✏️</view>
          <text class="quick-text">练习题库</text>
        </view>
        <view class="quick-item" @click="navigateTo('/pages/review/index')">
          <view class="quick-icon review-icon">🔄</view>
          <text class="quick-text">每日复习</text>
        </view>
        <view class="quick-item" @click="navigateTo('/pages/assessment/index')">
          <view class="quick-icon assessment-icon">📊</view>
          <text class="quick-text">能力测评</text>
        </view>
      </view>
    </view>

    <!-- 推荐学习 -->
    <view class="recommendation-card card">
      <text class="section-title">推荐学习</text>
      <view class="recommendation-list">
        <view 
          class="recommendation-item" 
          v-for="item in recommendations" 
          :key="item.id"
          @click="navigateTo(item.path)"
        >
          <view class="rec-icon">{{ item.icon }}</view>
          <view class="rec-content">
            <text class="rec-title">{{ item.title }}</text>
            <text class="rec-desc">{{ item.description }}</text>
          </view>
          <view class="rec-arrow">></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      greeting: '早上好',
      username: '学习者',
      todayProgress: {
        completed: 0,
        total: 5
      },
      userStats: {
        streak: 0,
        totalProgress: 0,
        completedLessons: 0
      },
      recommendations: [
        {
          id: 1,
          icon: '🔤',
          title: '基础语法',
          description: '掌握英语基本语法规则',
          path: '/pages/learn/index'
        },
        {
          id: 2,
          icon: '📝',
          title: '时态练习',
          description: '练习各种时态的正确用法',
          path: '/pages/practice/index'
        },
        {
          id: 3,
          icon: '🎯',
          title: '今日复习',
          description: '复习已学过的知识点',
          path: '/pages/review/index'
        }
      ]
    }
  },
  computed: {
    progressPercentage() {
      return this.todayProgress.total > 0 
        ? Math.round((this.todayProgress.completed / this.todayProgress.total) * 100) 
        : 0
    }
  },
  onLoad() {
    this.loadUserData()
    this.updateGreeting()
  },
  onShow() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      // 从本地存储加载用户数据
      const userData = uni.getStorageSync('userData') || {
        streak: 0,
        totalProgress: 0,
        completedLessons: 0
      }
      
      const todayGoal = uni.getStorageSync('todayGoal') || {
        completed: 0,
        total: 5
      }
      
      this.userStats = userData
      this.todayProgress = todayGoal
    },
    updateGreeting() {
      const hour = new Date().getHours()
      if (hour < 6) {
        this.greeting = '夜深了'
      } else if (hour < 12) {
        this.greeting = '早上好'
      } else if (hour < 18) {
        this.greeting = '下午好'
      } else {
        this.greeting = '晚上好'
      }
    },
    navigateTo(path) {
      // 使用智能导航方法
      if (path.startsWith('/pages/')) {
        // 检查是否为 tabBar 页面
        const tabBarPages = [
          '/pages/index/index',
          '/pages/learn/index', 
          '/pages/practice/index',
          '/pages/review/index',
          '/pages/profile/index'
        ]
        
        if (tabBarPages.includes(path)) {
          // 如果是 tabBar 页面，使用 switchTab
          uni.switchTab({
            url: path
          })
        } else {
          // 如果不是 tabBar 页面，使用 navigateTo
          uni.navigateTo({
            url: path
          })
        }
      } else {
        // 如果不是完整路径，使用 navigateTo
        uni.navigateTo({
          url: path
        })
      }
    }
  }
}
</script>

<style scoped>
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  margin-bottom: 30rpx;
  color: white;
}

.welcome-text {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 28rpx;
  opacity: 0.9;
  margin-bottom: 10rpx;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
}

.avatar image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.stats-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.stats-subtitle {
  font-size: 24rpx;
  color: #666;
}

.progress-bar {
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.quick-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.quick-item:active {
  transform: scale(0.95);
  background: #e9ecef;
}

.quick-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
  display: block;
}

.quick-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.recommendation-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.recommendation-item:active {
  background: #e9ecef;
}

.rec-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.rec-content {
  flex: 1;
}

.rec-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.rec-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.rec-arrow {
  color: #ccc;
  font-size: 24rpx;
}
</style>
