<template>
  <view class="container">
    <!-- 复习统计 -->
    <view class="review-stats card">
      <view class="stats-header">
        <text class="stats-title">复习统计</text>
        <text class="stats-subtitle">今日复习进度</text>
      </view>
      <view class="stats-content">
        <view class="stat-row">
          <view class="stat-item">
            <text class="stat-number">{{ reviewStats.todayCount }}</text>
            <text class="stat-label">今日复习</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ reviewStats.totalCount }}</text>
            <text class="stat-label">总复习数</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ reviewStats.streak }}</text>
            <text class="stat-label">连续天数</text>
          </view>
        </view>
        <view class="progress-section">
          <text class="progress-label">今日目标: {{ reviewStats.todayGoal }}</text>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: progressPercentage + '%' }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- SRS复习 -->
    <view class="srs-review card">
      <view class="section-header">
        <text class="section-title">智能复习</text>
        <text class="section-subtitle">基于遗忘曲线的间隔重复</text>
      </view>
      <view class="srs-list">
        <view 
          class="srs-item" 
          v-for="item in srsReviewList" 
          :key="item.id"
          @click="startSRSReview(item)"
        >
          <view class="srs-header">
            <view class="srs-icon">{{ item.icon }}</view>
            <view class="srs-info">
              <text class="srs-title">{{ item.title }}</text>
              <text class="srs-desc">{{ item.description }}</text>
            </view>
            <view class="srs-status">
              <view class="status-badge" :class="item.status">
                {{ getSRSStatusText(item.status) }}
              </view>
            </view>
          </view>
          <view class="srs-footer">
            <view class="srs-schedule">
              <text class="schedule-label">下次复习：</text>
              <text class="schedule-time">{{ item.nextReview }}</text>
            </view>
            <view class="srs-count">
              <text class="count-text">{{ item.reviewCount }}次</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 能力测评 -->
    <view class="assessment-section card">
      <view class="section-header">
        <text class="section-title">能力测评</text>
        <text class="section-subtitle">20题快速测评你的语法水平</text>
      </view>
      <view class="assessment-info">
        <view class="assessment-stats">
          <view class="stat-item">
            <text class="stat-number">{{ assessmentStats.lastScore }}</text>
            <text class="stat-label">上次得分</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ assessmentStats.bestScore }}</text>
            <text class="stat-label">最佳成绩</text>
          </view>
          <view class="stat-item">
            <text class="stat-number">{{ assessmentStats.totalTests }}</text>
            <text class="stat-label">测评次数</text>
          </view>
        </view>
        <view class="assessment-action">
          <button class="btn-primary" @click="startAssessment">开始测评</button>
        </view>
      </view>
    </view>

    <!-- 复习建议 -->
    <view class="review-tips card">
      <text class="section-title">复习建议</text>
      <view class="tips-list">
        <view class="tip-item" v-for="tip in reviewTips" :key="tip.id">
          <view class="tip-icon">{{ tip.icon }}</view>
          <view class="tip-content">
            <text class="tip-title">{{ tip.title }}</text>
            <text class="tip-desc">{{ tip.description }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 复习历史 -->
    <view class="review-history card">
      <text class="section-title">复习历史</text>
      <view class="history-list">
        <view 
          class="history-item" 
          v-for="item in reviewHistory" 
          :key="item.id"
          @click="viewReviewDetail(item)"
        >
          <view class="history-icon">{{ item.icon }}</view>
          <view class="history-content">
            <text class="history-title">{{ item.title }}</text>
            <text class="history-time">{{ item.time }}</text>
          </view>
          <view class="history-result">
            <text class="result-text">{{ item.result }}</text>
            <text class="result-score">{{ item.score }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reviewStats: {
        todayCount: 8,
        totalCount: 156,
        streak: 15,
        todayGoal: 10
      },
      srsReviewList: [
        {
          id: 1,
          title: '一般现在时',
          description: '表示经常性、习惯性的动作',
          icon: '⏰',
          status: 'due',
          nextReview: '今天',
          reviewCount: 3
        },
        {
          id: 2,
          title: '被动语态',
          description: '主语是动作的承受者',
          icon: '🎯',
          status: 'overdue',
          nextReview: '昨天',
          reviewCount: 2
        },
        {
          id: 3,
          title: '定语从句',
          description: '修饰名词或代词的从句',
          icon: '🔗',
          status: 'upcoming',
          nextReview: '明天',
          reviewCount: 1
        },
        {
          id: 4,
          title: '介词搭配',
          description: '常用介词的用法和搭配',
          icon: '📍',
          status: 'completed',
          nextReview: '已完成',
          reviewCount: 5
        }
      ],
      assessmentStats: {
        lastScore: 85,
        bestScore: 92,
        totalTests: 8
      },
      reviewTips: [
        {
          id: 1,
          icon: '⏰',
          title: '最佳复习时间',
          description: '建议在睡前1小时进行复习，有助于记忆巩固'
        },
        {
          id: 2,
          icon: '🔄',
          title: '间隔重复',
          description: '根据遗忘曲线，合理安排复习间隔时间'
        },
        {
          id: 3,
          icon: '📝',
          title: '错题重点',
          description: '重点关注错题，理解错误原因并加强练习'
        }
      ],
      reviewHistory: [
        {
          id: 1,
          title: '时态综合复习',
          icon: '⏰',
          time: '2小时前',
          result: '良好',
          score: '8/10'
        },
        {
          id: 2,
          title: '从句专项复习',
          icon: '🔗',
          time: '昨天',
          result: '优秀',
          score: '9/10'
        },
        {
          id: 3,
          title: '介词用法复习',
          icon: '📍',
          time: '3天前',
          result: '良好',
          score: '7/10'
        }
      ]
    }
  },
  computed: {
    progressPercentage() {
      return this.reviewStats.todayGoal > 0 
        ? Math.round((this.reviewStats.todayCount / this.reviewStats.todayGoal) * 100) 
        : 0
    }
  },
  methods: {
    getSRSStatusText(status) {
      const statusMap = {
        'due': '待复习',
        'overdue': '已逾期',
        'upcoming': '即将到期',
        'completed': '已完成'
      }
      return statusMap[status] || '未知'
    },
    startSRSReview(item) {
      uni.navigateTo({
        url: `/pages/review/srs?id=${item.id}&title=${encodeURIComponent(item.title)}`
      })
    },
    startAssessment() {
      uni.switchTab({
        url: '/pages/assessment/index'
      })
    },
    viewReviewDetail(item) {
      uni.navigateTo({
        url: `/pages/review/detail?id=${item.id}&title=${encodeURIComponent(item.title)}`
      })
    }
  }
}
</script>

<style scoped>
.review-stats {
  margin-bottom: 30rpx;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
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

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.stat-row {
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

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.progress-label {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
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

.section-header {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.section-subtitle {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.srs-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.srs-item {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
  transition: all 0.3s ease;
}

.srs-item:active {
  background: #e9ecef;
}

.srs-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.srs-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.srs-info {
  flex: 1;
}

.srs-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.srs-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.srs-status {
  margin-left: 20rpx;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.status-badge.due {
  background: #fff3cd;
  color: #856404;
}

.status-badge.overdue {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.upcoming {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.srs-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.srs-schedule {
  display: flex;
  align-items: center;
}

.schedule-label {
  font-size: 24rpx;
  color: #666;
  margin-right: 10rpx;
}

.schedule-time {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.srs-count {
  background: #667eea;
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.assessment-section {
  margin-bottom: 30rpx;
}

.assessment-info {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.assessment-stats {
  display: flex;
  justify-content: space-around;
}

.assessment-action {
  text-align: center;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.tip-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  margin-top: 4rpx;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.tip-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  display: block;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.history-item:active {
  background: #e9ecef;
}

.history-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.history-content {
  flex: 1;
}

.history-title {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.history-time {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.history-result {
  text-align: right;
}

.result-text {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 5rpx;
  display: block;
}

.result-score {
  font-size: 22rpx;
  color: #667eea;
  font-weight: 500;
  display: block;
}
</style>
