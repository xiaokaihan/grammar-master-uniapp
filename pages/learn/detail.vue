<template>
  <view class="container">
    <!-- 知识点标题 -->
    <view class="lesson-header card">
      <view class="lesson-title">
        <text class="title-icon">{{ lessonInfo.icon }}</text>
        <text class="title-text">{{ lessonInfo.title }}</text>
      </view>
      <view class="lesson-meta">
        <view class="meta-item">
          <text class="meta-label">难度：</text>
          <view class="difficulty-stars">
            <text v-for="i in 5" :key="i" class="star" :class="{ filled: i <= lessonInfo.difficulty }">★</text>
          </view>
        </view>
        <view class="meta-item">
          <text class="meta-label">预计时长：</text>
          <text class="meta-value">{{ lessonInfo.duration }}分钟</text>
        </view>
      </view>
    </view>

    <!-- 学习进度 -->
    <view class="progress-section card">
      <view class="progress-header">
        <text class="progress-title">学习进度</text>
        <text class="progress-text">{{ lessonInfo.progress }}%</text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: lessonInfo.progress + '%' }"></view>
      </view>
      <view class="progress-actions">
        <button class="btn-primary" @click="startLearning" v-if="lessonInfo.progress === 0">
          开始学习
        </button>
        <button class="btn-primary" @click="continueLearning" v-else-if="lessonInfo.progress < 100">
          继续学习
        </button>
        <button class="btn-secondary" @click="reviewLesson" v-else>
          复习课程
        </button>
        <button class="btn-secondary" @click="startPractice">开始练习</button>
      </view>
    </view>

    <!-- 知识点讲解 -->
    <view class="lesson-content card">
      <text class="section-title">知识点讲解</text>
      
      <!-- 基础概念 -->
      <view class="concept-section">
        <text class="concept-title">基础概念</text>
        <text class="concept-desc">{{ lessonInfo.concept }}</text>
      </view>
      
      <!-- 用法规则 -->
      <view class="rules-section">
        <text class="rules-title">用法规则</text>
        <view class="rule-list">
          <view class="rule-item" v-for="(rule, index) in lessonInfo.rules" :key="index">
            <text class="rule-number">{{ index + 1 }}</text>
            <text class="rule-text">{{ rule }}</text>
          </view>
        </view>
      </view>
      
      <!-- 例句展示 -->
      <view class="examples-section">
        <text class="examples-title">例句展示</text>
        <view class="example-list">
          <view class="example-item" v-for="(example, index) in lessonInfo.examples" :key="index">
            <view class="example-header">
              <text class="example-number">例{{ index + 1 }}</text>
              <text class="example-type">{{ example.type }}</text>
            </view>
            <text class="example-sentence">{{ example.sentence }}</text>
            <text class="example-translation">{{ example.translation }}</text>
            <text class="example-explanation">{{ example.explanation }}</text>
          </view>
        </view>
      </view>
      
      <!-- 注意事项 -->
      <view class="notes-section" v-if="lessonInfo.notes && lessonInfo.notes.length > 0">
        <text class="notes-title">注意事项</text>
        <view class="note-list">
          <view class="note-item" v-for="(note, index) in lessonInfo.notes" :key="index">
            <text class="note-icon">⚠️</text>
            <text class="note-text">{{ note }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 相关练习 -->
    <view class="related-practice card">
      <text class="section-title">相关练习</text>
      <view class="practice-list">
        <view 
          class="practice-item" 
          v-for="practice in relatedPractice" 
          :key="practice.id"
          @click="startPracticeItem(practice)"
        >
          <view class="practice-icon">{{ practice.icon }}</view>
          <view class="practice-info">
            <text class="practice-title">{{ practice.title }}</text>
            <text class="practice-desc">{{ practice.description }}</text>
          </view>
          <view class="practice-status">
            <text class="status-text" :class="practice.status">{{ getPracticeStatusText(practice.status) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习笔记 -->
    <view class="notes-section card">
      <view class="notes-header">
        <text class="section-title">学习笔记</text>
        <text class="add-note" @click="addNote">+ 添加笔记</text>
      </view>
      <view class="note-list" v-if="userNotes.length > 0">
        <view class="note-item" v-for="(note, index) in userNotes" :key="index">
          <view class="note-content">
            <text class="note-text">{{ note.content }}</text>
            <text class="note-time">{{ note.time }}</text>
          </view>
          <view class="note-actions">
            <text class="note-edit" @click="editNote(index)">编辑</text>
            <text class="note-delete" @click="deleteNote(index)">删除</text>
          </view>
        </view>
      </view>
      <view class="empty-notes" v-else>
        <text class="empty-text">暂无笔记，点击添加笔记记录学习心得</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      lessonId: null,
      lessonInfo: {
        title: '一般现在时',
        icon: '⏰',
        difficulty: 2,
        duration: 15,
        progress: 0,
        concept: '一般现在时表示经常性、习惯性的动作或状态，以及客观事实和真理。',
        rules: [
          '第三人称单数主语后，动词要加s或es',
          '表示经常性、习惯性的动作',
          '表示客观事实和真理',
          '表示按计划、安排将要发生的动作'
        ],
        examples: [
          {
            type: '肯定句',
            sentence: 'I go to school every day.',
            translation: '我每天去上学。',
            explanation: '表示经常性的动作'
          },
          {
            type: '否定句',
            sentence: 'He doesn\'t like coffee.',
            translation: '他不喜欢咖啡。',
            explanation: '第三人称单数否定句用doesn\'t'
          },
          {
            type: '疑问句',
            sentence: 'Do you speak English?',
            translation: '你会说英语吗？',
            explanation: '一般疑问句用Do/Does开头'
          }
        ],
        notes: [
          '注意第三人称单数动词变化规则',
          '时间状语常用every day, usually, often等',
          '否定句和疑问句的助动词使用'
        ]
      },
      relatedPractice: [
        {
          id: 1,
          title: '一般现在时练习',
          description: '基础用法练习',
          icon: '✏️',
          status: 'not-started'
        },
        {
          id: 2,
          title: '时态对比练习',
          description: '与其他时态的区别',
          icon: '🔄',
          status: 'in-progress'
        },
        {
          id: 3,
          title: '综合应用练习',
          description: '实际语境中的应用',
          icon: '🎯',
          status: 'completed'
        }
      ],
      userNotes: []
    }
  },
  onLoad(options) {
    if (options.id) {
      this.lessonId = options.id
      this.loadLessonData()
    }
    if (options.title) {
      this.lessonInfo.title = decodeURIComponent(options.title)
    }
    this.loadUserNotes()
  },
  methods: {
    loadLessonData() {
      // 从本地存储或API加载课程数据
      const savedProgress = uni.getStorageSync(`lesson_${this.lessonId}_progress`)
      if (savedProgress !== null) {
        this.lessonInfo.progress = savedProgress
      }
    },
    loadUserNotes() {
      const notes = uni.getStorageSync(`lesson_${this.lessonId}_notes`) || []
      this.userNotes = notes
    },
    startLearning() {
      this.lessonInfo.progress = 25
      this.saveProgress()
      uni.showToast({
        title: '开始学习',
        icon: 'success'
      })
    },
    continueLearning() {
      this.lessonInfo.progress = Math.min(this.lessonInfo.progress + 25, 100)
      this.saveProgress()
      uni.showToast({
        title: '继续学习',
        icon: 'success'
      })
    },
    reviewLesson() {
      uni.showToast({
        title: '开始复习',
        icon: 'success'
      })
    },
    startPractice() {
      uni.navigateTo({
        url: `/pages/practice/exercise?lesson=${this.lessonId}&title=${encodeURIComponent(this.lessonInfo.title)}`
      })
    },
    startPracticeItem(practice) {
      uni.navigateTo({
        url: `/pages/practice/exercise?practice=${practice.id}&title=${encodeURIComponent(practice.title)}`
      })
    },
    saveProgress() {
      uni.setStorageSync(`lesson_${this.lessonId}_progress`, this.lessonInfo.progress)
    },
    getPracticeStatusText(status) {
      const statusMap = {
        'not-started': '未开始',
        'in-progress': '进行中',
        'completed': '已完成'
      }
      return statusMap[status] || '未知'
    },
    addNote() {
      uni.showModal({
        title: '添加笔记',
        editable: true,
        placeholderText: '请输入你的学习笔记...',
        success: (res) => {
          if (res.confirm && res.content.trim()) {
            const note = {
              content: res.content.trim(),
              time: new Date().toLocaleString()
            }
            this.userNotes.unshift(note)
            this.saveUserNotes()
            uni.showToast({
              title: '笔记已保存',
              icon: 'success'
            })
          }
        }
      })
    },
    editNote(index) {
      const note = this.userNotes[index]
      uni.showModal({
        title: '编辑笔记',
        editable: true,
        content: note.content,
        success: (res) => {
          if (res.confirm && res.content.trim()) {
            this.userNotes[index].content = res.content.trim()
            this.userNotes[index].time = new Date().toLocaleString()
            this.saveUserNotes()
            uni.showToast({
              title: '笔记已更新',
              icon: 'success'
            })
          }
        }
      })
    },
    deleteNote(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条笔记吗？',
        success: (res) => {
          if (res.confirm) {
            this.userNotes.splice(index, 1)
            this.saveUserNotes()
            uni.showToast({
              title: '笔记已删除',
              icon: 'success'
            })
          }
        }
      })
    },
    saveUserNotes() {
      uni.setStorageSync(`lesson_${this.lessonId}_notes`, this.userNotes)
    }
  }
}
</script>

<style scoped>
.lesson-header {
  margin-bottom: 30rpx;
}

.lesson-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.title-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.lesson-meta {
  display: flex;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-label {
  font-size: 24rpx;
  color: #666;
  margin-right: 10rpx;
}

.meta-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.difficulty-stars {
  display: flex;
}

.star {
  font-size: 24rpx;
  color: #ddd;
  margin-right: 2rpx;
}

.star.filled {
  color: #ffc107;
}

.progress-section {
  margin-bottom: 30rpx;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.progress-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.progress-text {
  font-size: 24rpx;
  color: #667eea;
  font-weight: bold;
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

.progress-actions {
  display: flex;
  gap: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.concept-section, .rules-section, .examples-section, .notes-section {
  margin-bottom: 40rpx;
}

.concept-title, .rules-title, .examples-title, .notes-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.concept-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: block;
}

.rule-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.rule-item {
  display: flex;
  align-items: flex-start;
}

.rule-number {
  background: #667eea;
  color: white;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: bold;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.rule-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
  flex: 1;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

.example-item {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.example-number {
  font-size: 24rpx;
  color: #667eea;
  font-weight: bold;
}

.example-type {
  background: #e9ecef;
  color: #6c757d;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
}

.example-sentence {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
  display: block;
}

.example-translation {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.example-explanation {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.note-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.note-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.note-icon {
  font-size: 24rpx;
  margin-right: 15rpx;
  margin-top: 4rpx;
}

.note-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  flex: 1;
}

.related-practice {
  margin-bottom: 30rpx;
}

.practice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.practice-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.practice-item:active {
  background: #e9ecef;
}

.practice-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.practice-info {
  flex: 1;
}

.practice-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.practice-desc {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.practice-status {
  margin-left: 20rpx;
}

.status-text {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.status-text.not-started {
  background: #f8f9fa;
  color: #6c757d;
}

.status-text.in-progress {
  background: #fff3cd;
  color: #856404;
}

.status-text.completed {
  background: #d4edda;
  color: #155724;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.add-note {
  font-size: 26rpx;
  color: #667eea;
  font-weight: 500;
}

.note-content {
  flex: 1;
}

.note-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.note-actions {
  display: flex;
  gap: 20rpx;
  margin-left: 20rpx;
}

.note-edit, .note-delete {
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  cursor: pointer;
}

.note-edit {
  background: #e9ecef;
  color: #6c757d;
}

.note-delete {
  background: #f8d7da;
  color: #721c24;
}

.empty-notes {
  text-align: center;
  padding: 60rpx 20rpx;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
  display: block;
}
</style>
