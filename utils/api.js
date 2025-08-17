// API模拟工具
class ApiService {
  // 模拟网络延迟
  static delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 模拟API响应
  static mockResponse(data, success = true, message = '') {
    return {
      success,
      message,
      data,
      timestamp: new Date().toISOString()
    }
  }

  // 用户相关API
  static async login(credentials) {
    await this.delay(1000)
    
    if (credentials.username && credentials.password) {
      return this.mockResponse({
        token: 'mock_token_' + Date.now(),
        userInfo: {
          id: 1,
          username: credentials.username,
          email: credentials.email || 'user@example.com',
          avatar: '/static/images/avatar-default.png',
          level: 1,
          experience: 0
        }
      }, true, '登录成功')
    } else {
      return this.mockResponse(null, false, '用户名或密码错误')
    }
  }

  static async getUserInfo() {
    await this.delay(500)
    
    return this.mockResponse({
      id: 1,
      username: '语法学习者',
      email: 'user@example.com',
      avatar: '/static/images/avatar-default.png',
      level: 8,
      experience: 7500,
      joinDate: '2024-01-01',
      lastLoginDate: new Date().toISOString()
    })
  }

  static async updateUserInfo(userInfo) {
    await this.delay(800)
    
    return this.mockResponse({
      ...userInfo,
      updatedAt: new Date().toISOString()
    }, true, '用户信息更新成功')
  }

  // 学习相关API
  static async getLessons(params = {}) {
    await this.delay(600)
    
    const { category = 'all', page = 1, pageSize = 10, keyword = '' } = params
    
    // 这里应该调用DataManager获取数据
    let lessons = []
    
    if (keyword) {
      lessons = lessons.filter(lesson => 
        lesson.title.includes(keyword) || 
        lesson.description.includes(keyword)
      )
    }
    
    if (category !== 'all') {
      lessons = lessons.filter(lesson => lesson.category === category)
    }
    
    const total = lessons.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = lessons.slice(start, end)
    
    return this.mockResponse({
      list: data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  }

  static async getLessonDetail(lessonId) {
    await this.delay(500)
    
    // 这里应该调用DataManager获取数据
    const lesson = {
      id: lessonId,
      title: '一般现在时',
      category: 'tense',
      difficulty: 2,
      duration: 15,
      icon: '⏰',
      description: '表示经常性、习惯性的动作或状态',
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
        }
      ],
      notes: [
        '注意第三人称单数动词变化规则',
        '时间状语常用every day, usually, often等'
      ]
    }
    
    return this.mockResponse(lesson)
  }

  static async updateLessonProgress(lessonId, progress) {
    await this.delay(300)
    
    return this.mockResponse({
      lessonId,
      progress,
      updatedAt: new Date().toISOString()
    }, true, '学习进度更新成功')
  }

  // 练习相关API
  static async getPracticeQuestions(params = {}) {
    await this.delay(800)
    
    const { type = 'mixed', category = 'all', difficulty = 5, count = 10 } = params
    
    // 这里应该调用DataManager获取数据
    const questions = [
      {
        id: 1,
        type: 'single',
        category: 'tense',
        difficulty: 2,
        question: 'He _____ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 1,
        explanation: '第三人称单数用goes'
      }
    ]
    
    return this.mockResponse({
      questions: questions.slice(0, count),
      total: questions.length
    })
  }

  static async submitPracticeResult(result) {
    await this.delay(500)
    
    return this.mockResponse({
      resultId: 'result_' + Date.now(),
      score: result.score,
      accuracy: result.accuracy,
      submittedAt: new Date().toISOString()
    }, true, '练习结果提交成功')
  }

  // 测评相关API
  static async getAssessmentQuestions() {
    await this.delay(1000)
    
    const questions = [
      {
        id: 1,
        type: 'single',
        question: 'He _____ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 1,
        explanation: '第三人称单数用goes'
      }
    ]
    
    return this.mockResponse({
      questions,
      total: questions.length,
      estimatedTime: 20
    })
  }

  static async submitAssessmentResult(result) {
    await this.delay(800)
    
    return this.mockResponse({
      assessmentId: 'assessment_' + Date.now(),
      score: result.score,
      accuracy: result.accuracy,
      timeUsed: result.timeUsed,
      submittedAt: new Date().toISOString()
    }, true, '测评结果提交成功')
  }

  // 复习相关API
  static async getReviewItems() {
    await this.delay(600)
    
    const items = [
      {
        id: 1,
        type: 'lesson',
        title: '一般现在时',
        description: '表示经常性、习惯性的动作或状态',
        icon: '⏰',
        nextReview: '今天',
        reviewCount: 3
      }
    ]
    
    return this.mockResponse({
      items,
      total: items.length
    })
  }

  static async updateReviewStatus(itemId, status) {
    await this.delay(300)
    
    return this.mockResponse({
      itemId,
      status,
      updatedAt: new Date().toISOString()
    }, true, '复习状态更新成功')
  }

  // 统计相关API
  static async getLearningStats() {
    await this.delay(700)
    
    return this.mockResponse({
      totalLessons: 50,
      completedLessons: 23,
      totalPractice: 156,
      correctRate: 78,
      streak: 15,
      totalTime: 1200,
      achievements: 8
    })
  }

  static async getProgressChart(days = 7) {
    await this.delay(500)
    
    const chartData = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        lessons: Math.floor(Math.random() * 3) + 1,
        practice: Math.floor(Math.random() * 10) + 5,
        review: Math.floor(Math.random() * 5) + 2
      })
    }
    
    return this.mockResponse(chartData)
  }

  // 成就相关API
  static async getAchievements() {
    await this.delay(400)
    
    const achievements = [
      {
        id: 'first_lesson',
        name: '初来乍到',
        description: '完成第一节课',
        icon: '🎯',
        unlocked: true,
        unlockedAt: '2024-01-01'
      }
    ]
    
    return this.mockResponse(achievements)
  }

  static async checkAchievements(userData) {
    await this.delay(300)
    
    // 这里应该调用AchievementManager检查成就
    return this.mockResponse({
      newAchievements: [],
      totalUnlocked: 8,
      totalAchievements: 12
    })
  }

  // 设置相关API
  static async getSettings() {
    await this.delay(200)
    
    return this.mockResponse({
      dailyGoal: 5,
      reminderTime: '20:00',
      soundEnabled: true,
      vibrationEnabled: true,
      autoReview: true,
      theme: 'light'
    })
  }

  static async updateSettings(settings) {
    await this.delay(400)
    
    return this.mockResponse({
      ...settings,
      updatedAt: new Date().toISOString()
    }, true, '设置更新成功')
  }

  // 数据备份相关API
  static async exportData() {
    await this.delay(1000)
    
    const exportData = {
      userData: {},
      practiceHistory: [],
      assessmentHistory: [],
      settings: {},
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    }
    
    return this.mockResponse({
      data: JSON.stringify(exportData, null, 2),
      filename: `grammar_master_backup_${new Date().toISOString().split('T')[0]}.json`
    })
  }

  static async importData(dataString) {
    await this.delay(800)
    
    try {
      const data = JSON.parse(dataString)
      
      if (!data.version || !data.exportTime) {
        throw new Error('无效的备份数据格式')
      }
      
      return this.mockResponse({
        importedItems: Object.keys(data).length,
        importTime: new Date().toISOString()
      }, true, '数据导入成功')
    } catch (error) {
      return this.mockResponse(null, false, '数据导入失败：' + error.message)
    }
  }

  // 错误处理
  static handleError(error) {
    console.error('API Error:', error)
    
    if (error.response) {
      // 服务器响应错误
      return this.mockResponse(null, false, `服务器错误: ${error.response.status}`)
    } else if (error.request) {
      // 网络请求错误
      return this.mockResponse(null, false, '网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      return this.mockResponse(null, false, error.message || '未知错误')
    }
  }
}

export default ApiService
