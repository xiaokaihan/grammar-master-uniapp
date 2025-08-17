<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card card">
      <view class="user-header">
        <view class="avatar-section">
          <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
          <view class="level-badge">
            <text class="level-text">Lv.{{ userInfo.level }}</text>
          </view>
        </view>
        <view class="user-info">
          <text class="username">{{ userInfo.username }}</text>
          <text class="user-desc">{{ userInfo.description }}</text>
          <view class="user-stats">
            <text class="stat-item">学习{{ userInfo.studyDays }}天</text>
            <text class="stat-item">完成{{ userInfo.completedLessons }}课</text>
          </view>
        </view>
      </view>
      <view class="user-progress">
        <view class="progress-info">
          <text class="progress-text">距离下一级还需 {{ userInfo.nextLevelExp }} 经验</text>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: userInfo.levelProgress + '%' }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习统计 -->
    <view class="learning-stats card">
      <text class="section-title">学习统计</text>
      <view class="stats-grid">
        <view class="stat-card">
          <view class="stat-icon">📚</view>
          <text class="stat-number">{{ learningStats.totalLessons }}</text>
          <text class="stat-label">总课程数</text>
        </view>
        <view class="stat-card">
          <view class="stat-icon">✅</view>
          <text class="stat-number">{{ learningStats.completedLessons }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-card">
          <view class="stat-icon">🎯</view>
          <text class="stat-number">{{ learningStats.accuracy }}%</text>
          <text class="stat-label">正确率</text>
        </view>
        <view class="stat-card">
          <view class="stat-icon">🔥</view>
          <text class="stat-number">{{ learningStats.streak }}</text>
          <text class="stat-label">连续天数</text>
        </view>
      </view>
    </view>

    <!-- 成就系统 -->
    <view class="achievements card">
      <view class="section-header">
        <text class="section-title">成就徽章</text>
        <text class="achievement-count">{{ achievements.length }}/{{ totalAchievements }}</text>
      </view>
      <view class="achievement-grid">
        <view 
          class="achievement-item" 
          v-for="achievement in achievements" 
          :key="achievement.id"
          @click="viewAchievementDetail(achievement)"
        >
          <view class="achievement-icon" :class="{ unlocked: achievement.unlocked }">
            {{ achievement.icon }}
          </view>
          <text class="achievement-name">{{ achievement.name }}</text>
          <text class="achievement-desc">{{ achievement.description }}</text>
        </view>
      </view>
    </view>

    <!-- 学习日历 -->
    <view class="learning-calendar card">
      <text class="section-title">学习日历</text>
      <view class="calendar-header">
        <text class="month-text">{{ currentMonth }}</text>
        <view class="calendar-nav">
          <text class="nav-btn" @click="previousMonth">‹</text>
          <text class="nav-btn" @click="nextMonth">›</text>
        </view>
      </view>
      <view class="calendar-grid">
        <view class="calendar-day" v-for="day in calendarDays" :key="day.date">
          <text class="day-number">{{ day.day }}</text>
          <view class="day-indicator" :class="{ studied: day.studied, today: day.isToday }"></view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="function-menu card">
      <text class="section-title">功能设置</text>
      <view class="menu-list">
        <!-- 添加测试按钮 -->
        <view class="menu-item" @click="testNavigation">
          <view class="menu-icon">🧪</view>
          <text class="menu-text">测试导航</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/settings')">
          <view class="menu-icon">⚙️</view>
          <text class="menu-text">应用设置</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/backup')">
          <view class="menu-icon">💾</view>
          <text class="menu-text">数据备份</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/feedback')">
          <view class="menu-icon">💬</view>
          <text class="menu-text">意见反馈</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/about')">
          <view class="menu-icon">ℹ️</view>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="btn-secondary logout-btn" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { authService, AUTH_STATUS } from '@/utils/authService.js'

export default {
  data() {
    return {
      userInfo: {
        username: '加载中...',
        description: '正在加载用户信息',
        level: 1,
        nextLevelExp: 999,
        levelProgress: 0,
        studyDays: 0,
        completedLessons: 0
      },
      learningStats: {
        totalLessons: 50,
        completedLessons: 0,
        accuracy: 0,
        streak: 0
      },
      achievements: [
        {
          id: 1,
          name: '初来乍到',
          description: '完成第一节课',
          icon: '🎯',
          unlocked: false
        },
        {
          id: 2,
          name: '坚持不懈',
          description: '连续学习7天',
          icon: '🔥',
          unlocked: false
        },
        {
          id: 3,
          name: '知识达人',
          description: '完成10节课',
          icon: '📚',
          unlocked: false
        },
        {
          id: 4,
          name: '完美主义',
          description: '单次练习100%正确',
          icon: '💯',
          unlocked: false
        },
        {
          id: 5,
          name: '时间管理',
          description: '连续学习30天',
          icon: '⏰',
          unlocked: false
        },
        {
          id: 6,
          name: '语法大师',
          description: '完成所有课程',
          icon: '👑',
          unlocked: false
        }
      ],
      totalAchievements: 12,
      currentMonth: '2024年1月',
      calendarDays: [],
      authStatus: AUTH_STATUS.UNKNOWN
    }
  },
  onLoad() {
    this.generateCalendarDays()
    this.initAuth()
  },
  onShow() {
    this.refreshUserInfo()
  },
  onUnload() {
    // 移除状态监听器
    authService.removeStatusListener(this.handleStatusChange)
  },
  computed: {
    userAvatar() {
      const currentUser = authService.getUser()
      return currentUser?.avatar || '/static/images/avatar-default.svg'
    }
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
        
        // 加载用户信息
        this.loadUserInfo()
      } catch (error) {
        console.error('初始化认证服务失败:', error)
        this.handleAuthError(error)
      }
    },

    /**
     * 处理认证状态变化
     */
    handleStatusChange(status, user, permissions) {
      this.authStatus = status
      
      if (status === AUTH_STATUS.LOGGED_OUT) {
        // 用户已退出，跳转到登录页面
        this.redirectToLogin()
      } else {
        // 刷新用户信息
        this.loadUserInfo()
      }
    },

    /**
     * 加载用户信息
     */
    async loadUserInfo() {
      try {
        if (!authService.isLoggedIn()) {
          this.redirectToLogin()
          return
        }

        const currentUser = authService.getUser()
        const permissions = authService.getPermissions()
        
        if (!currentUser) {
          throw new Error('用户信息获取失败')
        }

        // 更新用户信息显示
        this.userInfo.username = currentUser.nickname || '用户'
        
        if (authService.isGuest()) {
          this.userInfo.description = '游客模式 - 功能受限'
          this.userInfo.level = 1
          this.userInfo.nextLevelExp = 999
          this.userInfo.levelProgress = 0
          this.userInfo.studyDays = 0
          this.userInfo.completedLessons = 0
          
          // 游客模式下的统计
          this.learningStats.completedLessons = 0
          this.learningStats.accuracy = 0
          this.learningStats.streak = 0
        } else {
          this.userInfo.description = '坚持学习，提升英语语法水平'
          
          // 微信用户的统计（这里可以连接真实数据）
          this.learningStats.completedLessons = 23
          this.learningStats.accuracy = 78
          this.learningStats.streak = 15
        }

        // 更新成就状态
        this.updateAchievements()
        
      } catch (error) {
        console.error('加载用户信息失败:', error)
        this.handleAuthError(error)
      }
    },

    /**
     * 更新成就状态
     */
    updateAchievements() {
      if (authService.isGuest()) {
        // 游客模式只解锁基础成就
        this.achievements.forEach(achievement => {
          achievement.unlocked = achievement.id <= 2
        })
      } else {
        // 微信用户根据学习进度解锁成就
        const completedLessons = this.learningStats.completedLessons
        
        this.achievements.forEach(achievement => {
          switch (achievement.id) {
            case 1: // 初来乍到
              achievement.unlocked = completedLessons >= 1
              break
            case 2: // 坚持不懈
              achievement.unlocked = this.learningStats.streak >= 7
              break
            case 3: // 知识达人
              achievement.unlocked = completedLessons >= 10
              break
            case 4: // 完美主义
              achievement.unlocked = this.learningStats.accuracy >= 100
              break
            case 5: // 时间管理
              achievement.unlocked = this.learningStats.streak >= 30
              break
            case 6: // 语法大师
              achievement.unlocked = completedLessons >= 50
              break
          }
        })
      }
    },

    /**
     * 刷新用户信息
     */
    async refreshUserInfo() {
      try {
        await authService.refreshUserInfo()
        this.loadUserInfo()
      } catch (error) {
        console.error('刷新用户信息失败:', error)
      }
    },

    /**
     * 处理认证错误
     */
    handleAuthError(error) {
      console.error('认证错误:', error)
      
      // 显示错误提示
      uni.showToast({
        title: '认证失败，请重新登录',
        icon: 'none',
        duration: 2000
      })
      
      // 延迟跳转到登录页面
      setTimeout(() => {
        this.redirectToLogin()
      }, 2000)
    },

    /**
     * 跳转到登录页面
     */
    redirectToLogin() {
      uni.navigateTo({
        url: '/pages/login/index',
        fail: (err) => {
          console.error('跳转登录页面失败:', err)
          // 如果跳转失败，使用 reLaunch
          uni.reLaunch({
            url: '/pages/login/index'
          })
        }
      })
    },

    generateCalendarDays() {
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
      
      this.calendarDays = []
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i)
        const isToday = i === today.getDate()
        const studied = Math.random() > 0.3 // 模拟学习数据
        
        this.calendarDays.push({
          date: i,
          day: i,
          studied,
          isToday
        })
      }
    },
    
    previousMonth() {
      console.log('切换到上个月')
    },
    
    nextMonth() {
      console.log('切换到下个月')
    },
    
    viewAchievementDetail(achievement) {
      uni.showModal({
        title: achievement.name,
        content: achievement.description,
        showCancel: false
      })
    },
    
    navigateTo(path) {
      // 使用认证服务检查页面访问权限
      authService.navigateToPage(path).catch(error => {
        console.error('页面导航失败:', error)
        uni.showToast({
          title: '页面访问失败',
          icon: 'none'
        })
      })
    },
    
    async logout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await authService.logout()
              
              if (result.success) {
                uni.showToast({
                  title: '已退出登录',
                  icon: 'success'
                })
                
                // 跳转到登录页面
                this.redirectToLogin()
              } else {
                throw new Error(result.message)
              }
            } catch (error) {
              console.error('退出登录失败:', error)
              uni.showToast({
                title: '退出登录失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    testNavigation() {
      uni.showModal({
        title: '测试导航',
        content: '点击确定将尝试导航到首页。',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await authService.navigateToPage('/pages/index/index')
              if (result) {
                uni.showToast({
                  title: '导航成功',
                  icon: 'success'
                })
              } else {
                uni.showToast({
                  title: '导航失败',
                  icon: 'none'
                })
              }
            } catch (error) {
              console.error('测试导航失败:', error)
              uni.showToast({
                title: '测试导航失败',
                icon: 'none'
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.user-card {
  margin-bottom: 30rpx;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.avatar-section {
  position: relative;
  margin-right: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #667eea;
}

.level-badge {
  position: absolute;
  bottom: -10rpx;
  right: -10rpx;
  background: #ff6b6b;
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: bold;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.user-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
  display: block;
}

.user-stats {
  display: flex;
  gap: 20rpx;
}

.stat-item {
  font-size: 24rpx;
  color: #667eea;
  background: #f8f9fa;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}

.user-progress {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.progress-bar {
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
}

.stat-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
  display: block;
}

.stat-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8rpx;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.achievement-count {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 500;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.achievement-item {
  text-align: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.achievement-item:active {
  transform: scale(0.95);
}

.achievement-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
  display: block;
  opacity: 0.3;
  filter: grayscale(100%);
}

.achievement-icon.unlocked {
  opacity: 1;
  filter: grayscale(0%);
}

.achievement-name {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.achievement-desc {
  font-size: 20rpx;
  color: #666;
  line-height: 1.3;
  display: block;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.month-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.calendar-nav {
  display: flex;
  gap: 20rpx;
}

.nav-btn {
  font-size: 32rpx;
  color: #667eea;
  padding: 10rpx;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.day-number {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.day-indicator {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #f0f0f0;
}

.day-indicator.studied {
  background: #28a745;
}

.day-indicator.today {
  background: #667eea;
  border: 2rpx solid #fff;
  box-shadow: 0 0 0 2rpx #667eea;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f8f9fa;
}

.menu-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  color: #ccc;
  font-size: 24rpx;
}

.logout-section {
  margin-top: 40rpx;
  padding: 0 20rpx;
}

.logout-btn {
  width: 100%;
  background: #f8f9fa;
  color: #dc3545;
  border: 2rpx solid #dc3545;
}

.logout-btn:active {
  background: #dc3545;
  color: white;
}
</style>
