<template>
  <view class="exercise-container">
    <view class="exercise-header">
      <text class="exercise-title">语法练习</text>
      <text class="exercise-subtitle">巩固你的语法知识</text>
    </view>
    
    <view class="exercise-content">
      <view class="question-card">
        <text class="question-text">请选择正确的答案：</text>
        <view class="options-list">
          <view class="option-item" v-for="(option, index) in options" :key="index" @click="selectOption(index)">
            <text class="option-text">{{ option.text }}</text>
          </view>
        </view>
      </view>
      
      <view class="navigation-buttons">
        <button class="btn btn-secondary" @click="previousQuestion">上一题</button>
        <button class="btn btn-primary" @click="nextQuestion">下一题</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Exercise',
  data() {
    return {
      currentQuestion: 0,
      options: [
        { text: '选项 A', isCorrect: false },
        { text: '选项 B', isCorrect: true },
        { text: '选项 C', isCorrect: false },
        { text: '选项 D', isCorrect: false }
      ],
      selectedOption: -1
    }
  },
  methods: {
    selectOption(index) {
      this.selectedOption = index;
    },
    previousQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.selectedOption = -1;
      }
    },
    nextQuestion() {
      this.currentQuestion++;
      this.selectedOption = -1;
    }
  }
}
</script>

<style lang="scss" scoped>
.exercise-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.exercise-header {
  text-align: center;
  padding: 40rpx 0;
  
  .exercise-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .exercise-subtitle {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.exercise-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-top: 20rpx;
}

.question-card {
  margin-bottom: 40rpx;
  
  .question-text {
    display: block;
    font-size: 32rpx;
    color: #333;
    margin-bottom: 30rpx;
    line-height: 1.5;
  }
}

.options-list {
  .option-item {
    background-color: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    transition: all 0.3s ease;
    
    &:active {
      background-color: #e9ecef;
      transform: scale(0.98);
    }
    
    .option-text {
      font-size: 30rpx;
      color: #333;
    }
  }
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  
  .btn {
    flex: 1;
    height: 80rpx;
    border-radius: 12rpx;
    font-size: 30rpx;
    border: none;
    
    &.btn-primary {
      background-color: #007aff;
      color: #fff;
    }
    
    &.btn-secondary {
      background-color: #6c757d;
      color: #fff;
    }
  }
}
</style>
