<template>
  <view class="container">
    <!-- 测评说明 -->
    <view class="assessment-intro card" v-if="!isStarted">
      <view class="intro-header">
        <text class="intro-icon">📊</text>
        <text class="intro-title">能力测评</text>
      </view>
      <view class="intro-content">
        <text class="intro-desc">通过20道精选题目，快速评估你的英语语法水平</text>
        <view class="assessment-rules">
          <text class="rule-title">测评规则：</text>
          <text class="rule-item">• 共20道题目，包含单选、填空、改错</text>
          <text class="rule-item">• 每题5分，总分100分</text>
          <text class="rule-item">• 测评时间约15-20分钟</text>
          <text class="rule-item">• 完成后可获得详细分析报告</text>
        </view>
      </view>
      <view class="intro-actions">
        <button class="btn-primary start-btn" @click="startAssessment">开始测评</button>
        <button class="btn-secondary" @click="viewHistory">查看历史</button>
      </view>
    </view>

    <!-- 测评进行中 -->
    <view class="assessment-progress" v-if="isStarted && !isCompleted">
      <!-- 进度条 -->
      <view class="progress-section">
        <view class="progress-header">
          <text class="progress-text">第 {{ currentQuestionIndex + 1 }}/{{ questions.length }} 题</text>
          <text class="progress-percentage">{{ progressPercentage }}%</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercentage + '%' }"></view>
        </view>
      </view>

      <!-- 题目内容 -->
      <view class="question-card card">
        <view class="question-header">
          <text class="question-type">{{ getQuestionTypeText(currentQuestion.type) }}</text>
          <text class="question-number">#{{ currentQuestionIndex + 1 }}</text>
        </view>
        
        <view class="question-content">
          <text class="question-text">{{ currentQuestion.question }}</text>
          
          <!-- 单选题 -->
          <view class="question-options" v-if="currentQuestion.type === 'single'">
            <view 
              class="option-item" 
              :class="{ selected: selectedAnswer === index }"
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              @click="selectAnswer(index)"
            >
              <text class="option-label">{{ String.fromCharCode(65 + index) }}</text>
              <text class="option-text">{{ option }}</text>
            </view>
          </view>
          
          <!-- 填空题 -->
          <view class="question-fill" v-if="currentQuestion.type === 'fill'">
            <input 
              class="fill-input" 
              placeholder="请输入答案..." 
              v-model="fillAnswer"
            />
          </view>
          
          <!-- 改错题 -->
          <view class="question-correction" v-if="currentQuestion.type === 'correction'">
            <text class="correction-text">{{ currentQuestion.sentence }}</text>
            <input 
              class="correction-input" 
              placeholder="请输入正确的句子..." 
              v-model="correctionAnswer"
            />
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="question-actions">
        <button class="btn-secondary" @click="previousQuestion" :disabled="currentQuestionIndex === 0">
          上一题
        </button>
        <button 
          class="btn-primary" 
          @click="nextQuestion"
          :disabled="!canProceed"
        >
          {{ isLastQuestion ? '完成测评' : '下一题' }}
        </button>
      </view>
    </view>

    <!-- 测评结果 -->
    <view class="assessment-result card" v-if="isCompleted">
      <view class="result-header">
        <text class="result-icon">🎉</text>
        <text class="result-title">测评完成！</text>
      </view>
      
      <view class="result-score">
        <text class="score-number">{{ finalScore }}</text>
        <text class="score-label">分</text>
        <text class="score-level">{{ getScoreLevel(finalScore) }}</text>
      </view>
      
      <view class="result-analysis">
        <view class="analysis-item">
          <text class="analysis-label">正确题数：</text>
          <text class="analysis-value">{{ correctCount }}/{{ questions.length }}</text>
        </view>
        <view class="analysis-item">
          <text class="analysis-label">正确率：</text>
          <text class="analysis-value">{{ accuracyPercentage }}%</text>
        </view>
        <view class="analysis-item">
          <text class="analysis-label">用时：</text>
          <text class="analysis-value">{{ formatTime(usedTime) }}</text>
        </view>
      </view>
      
      <view class="result-actions">
        <button class="btn-primary" @click="viewDetailedReport">查看详细报告</button>
        <button class="btn-secondary" @click="retakeAssessment">重新测评</button>
        <button class="btn-secondary" @click="goHome">返回首页</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isStarted: false,
      isCompleted: false,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      fillAnswer: '',
      correctionAnswer: '',
      startTime: null,
      usedTime: 0,
      answers: [],
      questions: [
        {
          id: 1,
          type: 'single',
          question: 'He _____ to school every day.',
          options: ['go', 'goes', 'going', 'went'],
          correctAnswer: 1,
          explanation: '第三人称单数用goes'
        },
        {
          id: 2,
          type: 'single',
          question: 'I _____ my homework when the phone rang.',
          options: ['am doing', 'was doing', 'do', 'did'],
          correctAnswer: 1,
          explanation: '过去进行时表示过去某个时间正在进行的动作'
        },
        {
          id: 3,
          type: 'fill',
          question: 'The book _____ (write) by Shakespeare.',
          correctAnswer: 'was written',
          explanation: '被动语态，过去时'
        },
        {
          id: 4,
          type: 'correction',
          question: '找出并改正句子中的错误：',
          sentence: 'I have been to Paris last year.',
          correctAnswer: 'I went to Paris last year.',
          explanation: 'last year表示过去时间，不能用现在完成时'
        },
        {
          id: 5,
          type: 'single',
          question: 'If it rains tomorrow, I _____ at home.',
          options: ['stay', 'will stay', 'stayed', 'am staying'],
          correctAnswer: 1,
          explanation: 'if引导的条件句中，主句用will'
        }
      ]
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1
    },
    progressPercentage() {
      return Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100)
    },
    canProceed() {
      if (this.currentQuestion.type === 'single') {
        return this.selectedAnswer !== null
      } else if (this.currentQuestion.type === 'fill') {
        return this.fillAnswer.trim() !== ''
      } else if (this.currentQuestion.type === 'correction') {
        return this.correctionAnswer.trim() !== ''
      }
      return false
    },
    correctCount() {
      return this.answers.filter(answer => answer.isCorrect).length
    },
    accuracyPercentage() {
      return Math.round((this.correctCount / this.questions.length) * 100)
    },
    finalScore() {
      return this.correctCount * 5
    }
  },
  methods: {
    startAssessment() {
      this.isStarted = true
      this.startTime = Date.now()
      this.answers = []
    },
    selectAnswer(index) {
      this.selectedAnswer = index
    },
    nextQuestion() {
      // 保存当前答案
      this.saveCurrentAnswer()
      
      if (this.isLastQuestion) {
        this.completeAssessment()
      } else {
        this.currentQuestionIndex++
        this.resetAnswerInputs()
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.loadPreviousAnswer()
      }
    },
    saveCurrentAnswer() {
      const question = this.currentQuestion
      let userAnswer = ''
      let isCorrect = false
      
      if (question.type === 'single') {
        userAnswer = question.options[this.selectedAnswer]
        isCorrect = this.selectedAnswer === question.correctAnswer
      } else if (question.type === 'fill') {
        userAnswer = this.fillAnswer
        isCorrect = this.fillAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
      } else if (question.type === 'correction') {
        userAnswer = this.correctionAnswer
        isCorrect = this.correctionAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
      }
      
      this.answers[this.currentQuestionIndex] = {
        questionId: question.id,
        userAnswer,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      }
    },
    resetAnswerInputs() {
      this.selectedAnswer = null
      this.fillAnswer = ''
      this.correctionAnswer = ''
    },
    loadPreviousAnswer() {
      const answer = this.answers[this.currentQuestionIndex]
      if (answer) {
        if (this.currentQuestion.type === 'single') {
          this.selectedAnswer = this.currentQuestion.options.indexOf(answer.userAnswer)
        } else if (this.currentQuestion.type === 'fill') {
          this.fillAnswer = answer.userAnswer
        } else if (this.currentQuestion.type === 'correction') {
          this.correctionAnswer = answer.userAnswer
        }
      } else {
        this.resetAnswerInputs()
      }
    },
    completeAssessment() {
      this.usedTime = Date.now() - this.startTime
      this.isCompleted = true
      
      // 保存测评结果
      this.saveAssessmentResult()
    },
    saveAssessmentResult() {
      const result = {
        score: this.finalScore,
        accuracy: this.accuracyPercentage,
        correctCount: this.correctCount,
        totalQuestions: this.questions.length,
        usedTime: this.usedTime,
        completedAt: new Date().toISOString(),
        answers: this.answers
      }
      
      // 保存到本地存储
      const history = uni.getStorageSync('assessmentHistory') || []
      history.unshift(result)
      uni.setStorageSync('assessmentHistory', history)
    },
    getQuestionTypeText(type) {
      const typeMap = {
        'single': '单选题',
        'fill': '填空题',
        'correction': '改错题'
      }
      return typeMap[type] || '未知类型'
    },
    getScoreLevel(score) {
      if (score >= 90) return '优秀'
      if (score >= 80) return '良好'
      if (score >= 70) return '中等'
      if (score >= 60) return '及格'
      return '需努力'
    },
    formatTime(ms) {
      const minutes = Math.floor(ms / 60000)
      const seconds = Math.floor((ms % 60000) / 1000)
      return `${minutes}分${seconds}秒`
    },
    viewDetailedReport() {
      uni.navigateTo({
        url: `/pages/assessment/report?score=${this.finalScore}&accuracy=${this.accuracyPercentage}`
      })
    },
    retakeAssessment() {
      this.isStarted = false
      this.isCompleted = false
      this.currentQuestionIndex = 0
      this.answers = []
      this.resetAnswerInputs()
    },
    goHome() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    viewHistory() {
      uni.navigateTo({
        url: '/pages/assessment/history'
      })
    }
  }
}
</script>

<style scoped>
.assessment-intro {
  text-align: center;
  padding: 60rpx 40rpx;
}

.intro-header {
  margin-bottom: 40rpx;
}

.intro-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.intro-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.intro-content {
  margin-bottom: 40rpx;
}

.intro-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 30rpx;
  display: block;
}

.assessment-rules {
  text-align: left;
  background: #f8f9fa;
  padding: 30rpx;
  border-radius: 16rpx;
}

.rule-title {
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.rule-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 10rpx;
  display: block;
}

.intro-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.start-btn {
  font-size: 32rpx;
  padding: 30rpx;
}

.progress-section {
  background: white;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
  border-radius: 0 0 20rpx 20rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.progress-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.progress-percentage {
  font-size: 24rpx;
  color: #667eea;
  font-weight: bold;
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

.question-card {
  margin-bottom: 30rpx;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.question-type {
  background: #667eea;
  color: white;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.question-number {
  font-size: 24rpx;
  color: #999;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.question-text {
  font-size: 30rpx;
  color: #333;
  line-height: 1.6;
  font-weight: 500;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.option-item.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.option-label {
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 20rpx;
  min-width: 40rpx;
}

.option-text {
  font-size: 28rpx;
  flex: 1;
}

.question-fill, .question-correction {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.fill-input, .correction-input {
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333;
}

.correction-text {
  font-size: 26rpx;
  color: #666;
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 8rpx;
  border-left: 4rpx solid #667eea;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  padding: 0 20rpx;
}

.assessment-result {
  text-align: center;
  padding: 60rpx 40rpx;
}

.result-header {
  margin-bottom: 40rpx;
}

.result-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.result-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.result-score {
  margin-bottom: 40rpx;
}

.score-number {
  font-size: 80rpx;
  font-weight: bold;
  color: #667eea;
  margin-right: 10rpx;
}

.score-label {
  font-size: 36rpx;
  color: #333;
  margin-right: 20rpx;
}

.score-level {
  font-size: 28rpx;
  color: #28a745;
  background: #d4edda;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.result-analysis {
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.analysis-item:last-child {
  margin-bottom: 0;
}

.analysis-label {
  font-size: 26rpx;
  color: #666;
}

.analysis-value {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>
