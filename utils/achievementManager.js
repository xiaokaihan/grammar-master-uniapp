// 成就管理系统
class AchievementManager {
  // 成就定义
  static achievements = [
    // 学习相关成就
    {
      id: 'first_lesson',
      name: '初来乍到',
      description: '完成第一节课',
      icon: '🎯',
      condition: (userData) => userData.completedLessons >= 1,
      reward: { experience: 100, points: 50 }
    },
    {
      id: 'lesson_master',
      name: '课程达人',
      description: '完成10节课',
      icon: '📚',
      condition: (userData) => userData.completedLessons >= 10,
      reward: { experience: 500, points: 200 }
    },
    {
      id: 'grammar_expert',
      name: '语法专家',
      description: '完成50节课',
      icon: '👑',
      condition: (userData) => userData.completedLessons >= 50,
      reward: { experience: 2000, points: 1000 }
    },
    
    // 连续学习成就
    {
      id: 'week_streak',
      name: '坚持不懈',
      description: '连续学习7天',
      icon: '🔥',
      condition: (userData) => userData.streak >= 7,
      reward: { experience: 300, points: 150 }
    },
    {
      id: 'month_streak',
      name: '时间管理',
      description: '连续学习30天',
      icon: '⏰',
      condition: (userData) => userData.streak >= 30,
      reward: { experience: 1000, points: 500 }
    },
    {
      id: 'hundred_streak',
      name: '百折不挠',
      description: '连续学习100天',
      icon: '💎',
      condition: (userData) => userData.streak >= 100,
      reward: { experience: 5000, points: 2500 }
    },
    
    // 练习相关成就
    {
      id: 'practice_beginner',
      name: '练习新手',
      description: '完成第一次练习',
      icon: '✏️',
      condition: (userData) => userData.practiceCount >= 1,
      reward: { experience: 50, points: 25 }
    },
    {
      id: 'practice_master',
      name: '练习大师',
      description: '完成100次练习',
      icon: '🎯',
      condition: (userData) => userData.practiceCount >= 100,
      reward: { experience: 800, points: 400 }
    },
    {
      id: 'perfect_score',
      name: '完美主义',
      description: '单次练习100%正确',
      icon: '💯',
      condition: (userData) => userData.perfectScores >= 1,
      reward: { experience: 200, points: 100 }
    },
    
    // 测评相关成就
    {
      id: 'assessment_first',
      name: '首次测评',
      description: '完成第一次能力测评',
      icon: '📊',
      condition: (userData) => userData.assessmentCount >= 1,
      reward: { experience: 150, points: 75 }
    },
    {
      id: 'high_score',
      name: '高分达人',
      description: '测评得分90分以上',
      icon: '🏆',
      condition: (userData) => userData.highestScore >= 90,
      reward: { experience: 400, points: 200 }
    },
    {
      id: 'assessment_master',
      name: '测评专家',
      description: '完成10次测评',
      icon: '📈',
      condition: (userData) => userData.assessmentCount >= 10,
      reward: { experience: 600, points: 300 }
    },
    
    // 特殊成就
    {
      id: 'early_bird',
      name: '早起的鸟儿',
      description: '在早上6-9点学习',
      icon: '🌅',
      condition: (userData) => userData.earlyBirdCount >= 1,
      reward: { experience: 100, points: 50 }
    },
    {
      id: 'night_owl',
      name: '夜猫子',
      description: '在晚上10点后学习',
      icon: '🌙',
      condition: (userData) => userData.nightOwlCount >= 1,
      reward: { experience: 100, points: 50 }
    },
    {
      id: 'weekend_warrior',
      name: '周末战士',
      description: '在周末学习',
      icon: '📅',
      condition: (userData) => userData.weekendCount >= 1,
      reward: { experience: 100, points: 50 }
    }
  ]

  // 检查成就
  static checkAchievements(userData) {
    const newAchievements = []
    const currentAchievements = userData.achievements || []
    
    this.achievements.forEach(achievement => {
      // 检查是否已经获得
      if (currentAchievements.includes(achievement.id)) {
        return
      }
      
      // 检查是否满足条件
      if (achievement.condition(userData)) {
        newAchievements.push(achievement)
        currentAchievements.push(achievement.id)
      }
    })
    
    return {
      newAchievements,
      updatedAchievements: currentAchievements
    }
  }

  // 获得成就
  static unlockAchievement(achievementId, userData) {
    const achievement = this.achievements.find(a => a.id === achievementId)
    if (!achievement) {
      return null
    }
    
    // 应用奖励
    const updatedUserData = { ...userData }
    
    if (achievement.reward.experience) {
      updatedUserData.experience = (updatedUserData.experience || 0) + achievement.reward.experience
    }
    
    if (achievement.reward.points) {
      updatedUserData.points = (updatedUserData.points || 0) + achievement.reward.points
    }
    
    // 检查是否升级
    const newLevel = this.calculateLevel(updatedUserData.experience)
    if (newLevel > updatedUserData.level) {
      updatedUserData.level = newLevel
      updatedUserData.levelUp = true
    }
    
    return {
      achievement,
      updatedUserData,
      reward: achievement.reward
    }
  }

  // 计算等级
  static calculateLevel(experience) {
    // 简单的等级计算：每1000经验升一级
    return Math.floor(experience / 1000) + 1
  }

  // 获取成就信息
  static getAchievement(achievementId) {
    return this.achievements.find(a => a.id === achievementId)
  }

  // 获取所有成就
  static getAllAchievements() {
    return this.achievements
  }

  // 获取用户成就进度
  static getAchievementProgress(userData) {
    const totalAchievements = this.achievements.length
    const unlockedAchievements = (userData.achievements || []).length
    const progress = Math.round((unlockedAchievements / totalAchievements) * 100)
    
    return {
      total: totalAchievements,
      unlocked: unlockedAchievements,
      progress,
      remaining: totalAchievements - unlockedAchievements
    }
  }

  // 获取即将解锁的成就
  static getUpcomingAchievements(userData) {
    const currentAchievements = userData.achievements || []
    
    return this.achievements
      .filter(achievement => !currentAchievements.includes(achievement.id))
      .map(achievement => {
        // 计算距离解锁还需要多少
        let remaining = 0
        let target = 0
        
        if (achievement.id.includes('lesson')) {
          remaining = Math.max(0, achievement.condition({ ...userData, completedLessons: 0 }) ? 0 : 1)
          target = userData.completedLessons + remaining
        } else if (achievement.id.includes('streak')) {
          remaining = Math.max(0, achievement.condition({ ...userData, streak: 0 }) ? 0 : 1)
          target = userData.streak + remaining
        } else if (achievement.id.includes('practice')) {
          remaining = Math.max(0, achievement.condition({ ...userData, practiceCount: 0 }) ? 0 : 1)
          target = userData.practiceCount + remaining
        }
        
        return {
          ...achievement,
          remaining,
          target
        }
      })
      .sort((a, b) => a.remaining - b.remaining)
      .slice(0, 5) // 只显示前5个即将解锁的成就
  }

  // 成就通知
  static showAchievementNotification(achievement) {
    uni.showToast({
      title: `🎉 获得成就：${achievement.name}`,
      icon: 'none',
      duration: 3000
    })
    
    // 可以在这里添加震动反馈
    if (uni.vibrateShort) {
      uni.vibrateShort()
    }
  }

  // 批量检查成就（用于每日任务完成时）
  static checkDailyAchievements(userData) {
    const today = new Date()
    const hour = today.getHours()
    const dayOfWeek = today.getDay()
    
    const updatedUserData = { ...userData }
    let achievementsUnlocked = []
    
    // 检查早鸟成就
    if (hour >= 6 && hour <= 9) {
      updatedUserData.earlyBirdCount = (updatedUserData.earlyBirdCount || 0) + 1
    }
    
    // 检查夜猫子成就
    if (hour >= 22) {
      updatedUserData.nightOwlCount = (updatedUserData.nightOwlCount || 0) + 1
    }
    
    // 检查周末战士成就
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      updatedUserData.weekendCount = (updatedUserData.weekendCount || 0) + 1
    }
    
    // 检查成就
    const result = this.checkAchievements(updatedUserData)
    
    if (result.newAchievements.length > 0) {
      result.newAchievements.forEach(achievement => {
        const unlockResult = this.unlockAchievement(achievement.id, updatedUserData)
        if (unlockResult) {
          achievementsUnlocked.push(unlockResult)
          this.showAchievementNotification(achievement)
        }
      })
    }
    
    return {
      updatedUserData,
      achievementsUnlocked
    }
  }
}

export default AchievementManager
