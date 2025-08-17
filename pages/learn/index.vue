<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索语法知识点..." 
          v-model="searchKeyword"
          @input="onSearch"
        />
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="category-section">
      <scroll-view class="category-scroll" scroll-x="true">
        <view class="category-list">
          <view 
            class="category-item" 
            :class="{ active: selectedCategory === category.id }"
            v-for="category in categories" 
            :key="category.id"
            @click="selectCategory(category.id)"
          >
            <text class="category-text">{{ category.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 知识点列表 -->
    <view class="grammar-list">
      <view 
        class="grammar-item card" 
        v-for="item in filteredGrammarList" 
        :key="item.id"
        @click="navigateToDetail(item)"
      >
        <view class="grammar-header">
          <view class="grammar-icon">{{ item.icon }}</view>
          <view class="grammar-info">
            <text class="grammar-title">{{ item.title }}</text>
            <text class="grammar-desc">{{ item.description }}</text>
          </view>
          <view class="grammar-status">
            <view class="status-badge" :class="item.status">
              {{ getStatusText(item.status) }}
            </view>
          </view>
        </view>
        
        <view class="grammar-footer">
          <view class="difficulty">
            <text class="difficulty-label">难度：</text>
            <view class="difficulty-stars">
              <text v-for="i in 5" :key="i" class="star" :class="{ filled: i <= item.difficulty }">★</text>
            </view>
          </view>
          <view class="progress-info">
            <text class="progress-text">{{ item.progress }}%</text>
            <view class="progress-bar">
              <view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="filteredGrammarList.length === 0">
      <text class="empty-icon">📚</text>
      <text class="empty-text">暂无相关语法知识点</text>
      <text class="empty-subtext">尝试调整搜索条件或选择其他分类</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchKeyword: '',
      selectedCategory: 'all',
      categories: [
        { id: 'all', name: '全部' },
        { id: 'basic', name: '基础语法' },
        { id: 'tense', name: '时态' },
        { id: 'voice', name: '语态' },
        { id: 'clause', name: '从句' },
        { id: 'preposition', name: '介词' },
        { id: 'conjunction', name: '连词' }
      ],
      grammarList: [
        {
          id: 1,
          title: '一般现在时',
          description: '表示经常性、习惯性的动作或状态',
          icon: '⏰',
          category: 'tense',
          difficulty: 2,
          progress: 80,
          status: 'learning'
        },
        {
          id: 2,
          title: '一般过去时',
          description: '表示过去某个时间发生的动作或状态',
          icon: '📅',
          category: 'tense',
          difficulty: 2,
          progress: 60,
          status: 'learning'
        },
        {
          id: 3,
          title: '现在进行时',
          description: '表示现在正在进行的动作',
          icon: '🔄',
          category: 'tense',
          difficulty: 3,
          progress: 40,
          status: 'learning'
        },
        {
          id: 4,
          title: '被动语态',
          description: '表示主语是动作的承受者',
          icon: '🎯',
          category: 'voice',
          difficulty: 4,
          progress: 20,
          status: 'not-started'
        },
        {
          id: 5,
          title: '定语从句',
          description: '修饰名词或代词的从句',
          icon: '🔗',
          category: 'clause',
          difficulty: 5,
          progress: 0,
          status: 'not-started'
        },
        {
          id: 6,
          title: '介词用法',
          description: '掌握常用介词的用法和搭配',
          icon: '📍',
          category: 'preposition',
          difficulty: 3,
          progress: 100,
          status: 'completed'
        }
      ]
    }
  },
  computed: {
    filteredGrammarList() {
      let filtered = this.grammarList
      
      // 按分类筛选
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(item => item.category === this.selectedCategory)
      }
      
      // 按搜索关键词筛选
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
        )
      }
      
      return filtered
    }
  },
  methods: {
    onSearch() {
      // 搜索逻辑已在computed中处理
    },
    selectCategory(categoryId) {
      this.selectedCategory = categoryId
    },
    navigateToDetail(item) {
      uni.navigateTo({
        url: `/pages/learn/detail?id=${item.id}&title=${encodeURIComponent(item.title)}`
      })
    },
    getStatusText(status) {
      const statusMap = {
        'not-started': '未开始',
        'learning': '学习中',
        'completed': '已完成'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
.search-section {
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.search-box {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 25rpx;
  padding: 20rpx 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: #999;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.category-section {
  margin-bottom: 30rpx;
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: flex;
  padding: 0 20rpx;
}

.category-item {
  display: inline-block;
  padding: 16rpx 32rpx;
  margin-right: 20rpx;
  background: #f8f9fa;
  border-radius: 25rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.category-item.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.category-text {
  font-size: 26rpx;
  font-weight: 500;
}

.grammar-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.grammar-item {
  transition: all 0.3s ease;
}

.grammar-item:active {
  transform: scale(0.98);
}

.grammar-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.grammar-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.grammar-info {
  flex: 1;
}

.grammar-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.grammar-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
  display: block;
}

.grammar-status {
  margin-left: 20rpx;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

.status-badge.not-started {
  background: #f8f9fa;
  color: #6c757d;
}

.status-badge.learning {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.grammar-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.difficulty {
  display: flex;
  align-items: center;
}

.difficulty-label {
  font-size: 24rpx;
  color: #666;
  margin-right: 10rpx;
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

.progress-info {
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

.empty-state {
  text-align: center;
  padding: 100rpx 20rpx;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 15rpx;
  display: block;
}

.empty-subtext {
  font-size: 26rpx;
  color: #666;
  display: block;
}
</style>
