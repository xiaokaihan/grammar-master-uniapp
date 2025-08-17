// 本地存储管理工具
class StorageManager {
  // 用户数据相关
  static setUserData(data) {
    try {
      uni.setStorageSync('userData', data)
      return true
    } catch (e) {
      console.error('保存用户数据失败:', e)
      return false
    }
  }

  static getUserData() {
    try {
      return uni.getStorageSync('userData') || {
        username: '语法学习者',
        level: 1,
        experience: 0,
        streak: 0,
        totalProgress: 0,
        completedLessons: 0,
        achievements: []
      }
    } catch (e) {
      console.error('获取用户数据失败:', e)
      return null
    }
  }

  // 学习进度相关
  static setLessonProgress(lessonId, progress) {
    try {
      const key = `lesson_${lessonId}_progress`
      uni.setStorageSync(key, progress)
      return true
    } catch (e) {
      console.error('保存课程进度失败:', e)
      return false
    }
  }

  static getLessonProgress(lessonId) {
    try {
      const key = `lesson_${lessonId}_progress`
      return uni.getStorageSync(key) || 0
    } catch (e) {
      console.error('获取课程进度失败:', e)
      return 0
    }
  }

  // 练习记录相关
  static setPracticeRecord(record) {
    try {
      const history = this.getPracticeHistory()
      history.unshift({
        ...record,
        timestamp: Date.now()
      })
      // 只保留最近50条记录
      if (history.length > 50) {
        history.splice(50)
      }
      uni.setStorageSync('practiceHistory', history)
      return true
    } catch (e) {
      console.error('保存练习记录失败:', e)
      return false
    }
  }

  static getPracticeHistory() {
    try {
      return uni.getStorageSync('practiceHistory') || []
    } catch (e) {
      console.error('获取练习历史失败:', e)
      return []
    }
  }

  // 测评记录相关
  static setAssessmentRecord(record) {
    try {
      const history = this.getAssessmentHistory()
      history.unshift({
        ...record,
        timestamp: Date.now()
      })
      // 只保留最近20条记录
      if (history.length > 20) {
        history.splice(20)
      }
      uni.setStorageSync('assessmentHistory', history)
      return true
    } catch (e) {
      console.error('保存测评记录失败:', e)
      return false
    }
  }

  static getAssessmentHistory() {
    try {
      return uni.getStorageSync('assessmentHistory') || []
    } catch (e) {
      console.error('获取测评历史失败:', e)
      return []
    }
  }

  // 学习笔记相关
  static setLessonNotes(lessonId, notes) {
    try {
      const key = `lesson_${lessonId}_notes`
      uni.setStorageSync(key, notes)
      return true
    } catch (e) {
      console.error('保存学习笔记失败:', e)
      return false
    }
  }

  static getLessonNotes(lessonId) {
    try {
      const key = `lesson_${lessonId}_notes`
      return uni.getStorageSync(key) || []
    } catch (e) {
      console.error('获取学习笔记失败:', e)
      return []
    }
  }

  // 今日目标相关
  static setTodayGoal(goal) {
    try {
      const today = new Date().toDateString()
      const key = `todayGoal_${today}`
      uni.setStorageSync(key, goal)
      return true
    } catch (e) {
      console.error('保存今日目标失败:', e)
      return false
    }
  }

  static getTodayGoal() {
    try {
      const today = new Date().toDateString()
      const key = `todayGoal_${today}`
      return uni.getStorageSync(key) || {
        completed: 0,
        total: 5,
        lessons: 0,
        practice: 0,
        review: 0
      }
    } catch (e) {
      console.error('获取今日目标失败:', e)
      return null
    }
  }

  // 设置相关
  static setSettings(settings) {
    try {
      uni.setStorageSync('appSettings', settings)
      return true
    } catch (e) {
      console.error('保存设置失败:', e)
      return false
    }
  }

  static getSettings() {
    try {
      return uni.getStorageSync('appSettings') || {
        dailyGoal: 5,
        reminderTime: '20:00',
        soundEnabled: true,
        vibrationEnabled: true,
        autoReview: true
      }
    } catch (e) {
      console.error('获取设置失败:', e)
      return null
    }
  }

  // 清除数据
  static clearUserData() {
    try {
      const keys = [
        'userData',
        'practiceHistory',
        'assessmentHistory',
        'appSettings'
      ]
      
      // 清除课程相关数据
      const lessonKeys = []
      for (let i = 1; i <= 100; i++) {
        lessonKeys.push(`lesson_${i}_progress`, `lesson_${i}_notes`)
      }
      
      keys.push(...lessonKeys)
      
      keys.forEach(key => {
        try {
          uni.removeStorageSync(key)
        } catch (e) {
          console.warn(`清除${key}失败:`, e)
        }
      })
      
      return true
    } catch (e) {
      console.error('清除用户数据失败:', e)
      return false
    }
  }

  // 数据导出
  static exportData() {
    try {
      const data = {
        userData: this.getUserData(),
        practiceHistory: this.getPracticeHistory(),
        assessmentHistory: this.getAssessmentHistory(),
        settings: this.getSettings(),
        exportTime: new Date().toISOString()
      }
      
      return JSON.stringify(data, null, 2)
    } catch (e) {
      console.error('导出数据失败:', e)
      return null
    }
  }

  // 数据导入
  static importData(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      
      if (data.userData) {
        this.setUserData(data.userData)
      }
      if (data.practiceHistory) {
        uni.setStorageSync('practiceHistory', data.practiceHistory)
      }
      if (data.assessmentHistory) {
        uni.setStorageSync('assessmentHistory', data.assessmentHistory)
      }
      if (data.settings) {
        this.setSettings(data.settings)
      }
      
      return true
    } catch (e) {
      console.error('导入数据失败:', e)
      return false
    }
  }
}

export default StorageManager
