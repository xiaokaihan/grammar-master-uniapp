<template>
  <view class="container">
    <!-- 练习统计 -->
    <view class="stats-section card">
      <view class="stats-header">
        <text class="stats-title">练习统计</text>
        <text class="stats-subtitle">本周练习情况</text>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-number">{{ practiceStats.totalQuestions }}</text>
          <text class="stat-label">总题数</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ practiceStats.correctRate }}%</text>
          <text class="stat-label">正确率</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ practiceStats.streak }}</text>
          <text class="stat-label">连续正确</text>
        </view>
      </view>
    </view>

    <!-- 题型选择 -->
    <view class="question-types card">
      <text class="section-title">选择题型</text>
      <view class="type-grid">
        <view 
          class="type-item" 
          v-for="type in questionTypes" 
          :key="type.id"
          @click="selectQuestionType(type)"
        >
          <view class="type-icon">{{ type.icon }}</view>
          <text class="type-title">{{ type.title }}</text>
          <text class="type-desc">{{ type.description }}</text>
          <view class="type-stats">
            <text class="type-count">{{ type.questionCount }}题</text>
            <text class="type-accuracy">{{ type.accuracy }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 推荐练习 -->
    <view class="recommended-practice card">
      <text class="section-title">推荐练习</text>
      <view class="recommendation-list">
        <view 
          class="recommendation-item" 
          v-for="item in recommendedPractice" 
          :key="item.id"
          @click="startPractice(item)"
        >
          <view class="rec-header">
            <view class="rec-icon">{{ item.icon }}</view>
            <view class="rec-info">
              <text class="rec-title">{{ item.title }}</text>
              <text class="rec-desc">{{ item.description }}</text>
            </view>
            <view class="rec-difficulty">
              <text class="difficulty-text">难度 {{ item.difficulty }}</text>
            </view>
          </view>
          <view class="rec-footer">
            <view class="rec-progress">
              <text class="progress-text">进度 {{ item.progress }}%</text>
              <view class="progress-bar">
                <view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
              </view>
            </view>
            <view class="rec-action">
              <text class="action-text">{{ item.progress === 100 ? '重新练习' : '开始练习' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 练习历史 -->
    <view class="practice-history card">
      <text class="section-title">练习历史</text>
      <view class="history-list">
        <view 
          class="history-item" 
          v-for="item in practiceHistory" 
          :key="item.id"
          @click="viewHistoryDetail(item)"
        >
          <view class="history-icon">{{ item.icon }}</view>
          <view class="history-content">
            <text class="history-title">{{ item.title }}</text>
            <text class="history-time">{{ item.time }}</text>
          </view>
          <view class="history-score">
            <text class="score-text">{{ item.score }}/{{ item.total }}</text>
            <text class="score-percentage">{{ item.percentage }}%</text>
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
      practiceStats: {
        totalQuestions: 156,
        correctRate: 78,
        streak: 12
      },
      questionTypes: [
        {
          id: 'single',
          title: '单选题',
          description: '从四个选项中选择正确答案',
          icon: '🔘',
          questionCount: 45,
          accuracy: 82
        },
        {
          id: 'fill',
          title: '填空题',
          description: '根据语境填写正确的单词或短语',
          icon: '📝',
          questionCount: 38,
          accuracy: 75
        },
        {
          id: 'correction',
          title: '改错题',
          description: '找出并改正句子中的语法错误',
          icon: '✏️',
          questionCount: 32,
          accuracy: 68
        }
      ],
      recommendedPractice: [
        {
          id: 1,
          title: '时态综合练习',
          description: '包含各种时态的混合练习',
          icon: '⏰',
          difficulty: 3,
          progress: 60
        },
        {
          id: 2,
          title: '从句专项训练',
          description: '定语从句、状语从句等',
          icon: '🔗',
          difficulty: 4,
          progress: 30
        },
        {
          id: 3,
          title: '介词搭配练习',
          description: '常用介词的用法和搭配',
          icon: '📍',
          difficulty: 2,
          progress: 100
        }
      ],
      practiceHistory: [
        {
          id: 1,
          title: '一般现在时练习',
          icon: '⏰',
          time: '2小时前',
          score: 8,
          total: 10,
          percentage: 80
        },
        {
          id: 2,
          title: '被动语态练习',
          icon: '🎯',
          time: '昨天',
          score: 6,
          total: 10,
          percentage: 60
        },
        {
          id: 3,
          title: '定语从句练习',
          icon: '🔗',
          time: '3天前',
          score: 9,
          total: 10,
          percentage: 90
        }
      ]
    }
  },
  methods: {
    selectQuestionType(type) {
      uni.navigateTo({
        url: `/pages/practice/exercise?type=${type.id}&title=${encodeURIComponent(type.title)}`
      })
    },
    startPractice(item) {
      uni.navigateTo({
        url: `/pages/practice/exercise?type=mixed&title=${encodeURIComponent(item.title)}&difficulty=${item.difficulty}`
      })
    },
    viewHistoryDetail(item) {
      uni.navigateTo({
        url: `/pages/practice/history?id=${item.id}&title=${encodeURIComponent(item.title)}`
      })
    }
  }
}
</script>

<style scoped>
.stats-section {
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

.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.type-item {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.type-item:active {
  transform: scale(0.95);
  background: #e9ecef;
}

.type-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
  display: block;
}

.type-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.type-desc {
  font-size: 22rpx;
  color: #666;
  line-height: 1.3;
  margin-bottom: 20rpx;
  display: block;
}

.type-stats {
  display: flex;
  justify-content: space-between;
  font-size: 20rpx;
}

.type-count {
  color: #667eea;
}

.type-accuracy {
  color: #28a745;
}

.recommendation-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.recommendation-item {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
  transition: all 0.3s ease;
}

.recommendation-item:active {
  background: #e9ecef;
}

.rec-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.rec-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.rec-info {
  flex: 1;
}

.rec-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.rec-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.rec-difficulty {
  background: #fff3cd;
  color: #856404;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.rec-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rec-progress {
  display: flex;
  align-items: center;
}

.progress-text {
  font-size: 24rpx;
  color: #667eea;
  margin-right: 15rpx;
  font-weight: 500;
}

.progress-bar {
  width: 80rpx;
  height: 8rpx;
  background: #f0f0f0;
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.rec-action {
  background: #667eea;
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
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
  font-size: 40rpx;
  margin-right: 20rpx;
}

.history-content {
  flex: 1;
}

.history-title {
  font-size: 28rpx;
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

.history-score {
  text-align: right;
}

.score-text {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
  display: block;
}

.score-percentage {
  font-size: 22rpx;
  color: #667eea;
  display: block;
}
</style>
