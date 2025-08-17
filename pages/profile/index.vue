<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card card">
      <view class="user-header">
        <view class="avatar-section">
          <image class="avatar" :src="userAvatar" mode="aspectFill"></image>
          <view class="avatar-edit" @click="editAvatar">
            <text class="edit-icon">✏️</text>
          </view>
          <view class="level-badge">
            <text class="level-text">Lv.{{ userInfo.level }}</text>
          </view>
        </view>
        <view class="user-info">
          <view class="username-section">
            <text class="username">{{ userInfo.nickname || '未设置昵称' }}</text>
            <view class="edit-nickname" @click="editNickname">
              <text class="edit-icon">✏️</text>
            </view>
          </view>
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

    <!-- 基本信息 -->
    <view class="basic-info card">
      <view class="section-header">
        <text class="section-title">基本信息</text>
        <text class="edit-btn" @click="editBasicInfo">编辑</text>
      </view>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">性别</text>
          <text class="info-value">{{ formatGender(userInfo.gender) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">地区</text>
          <text class="info-value">{{ formatLocation(userInfo.country, userInfo.province, userInfo.city) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">语言</text>
          <text class="info-value">{{ formatLanguage(userInfo.language) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">注册时间</text>
          <text class="info-value">{{ formatDate(userInfo.createTime) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">最后登录</text>
          <text class="info-value">{{ formatDate(userInfo.lastLoginTime) }}</text>
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
        <view class="menu-item" @click="navigateTo('/pages/profile/loginHistory')">
          <view class="menu-icon">📝</view>
          <text class="menu-text">登录历史</text>
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

    <!-- 昵称编辑弹窗 -->
    <view class="modal-overlay" v-if="showNicknameModal" @click="closeNicknameModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">修改昵称</text>
          <text class="modal-close" @click="closeNicknameModal">×</text>
        </view>
        <view class="modal-body">
          <input 
            class="nickname-input" 
            v-model="editingNickname" 
            placeholder="请输入新昵称"
            maxlength="20"
          />
          <text class="input-tip">昵称长度1-20个字符</text>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="closeNicknameModal">取消</button>
          <button class="btn-confirm" @click="saveNickname">确定</button>
        </view>
      </view>
    </view>

    <!-- 基本信息编辑弹窗 -->
    <view class="modal-overlay" v-if="showBasicInfoModal" @click="closeBasicInfoModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">编辑基本信息</text>
          <text class="modal-close" @click="closeBasicInfoModal">×</text>
        </view>
        <view class="modal-body">
          <view class="form-item">
            <text class="form-label">性别</text>
            <picker 
              class="form-picker" 
              :value="editingBasicInfo.gender" 
              :range="genderOptions" 
              @change="onGenderChange"
            >
              <text class="picker-text">{{ formatGender(editingBasicInfo.gender) }}</text>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">国家</text>
            <input 
              class="form-input" 
              v-model="editingBasicInfo.country" 
              placeholder="请输入国家"
            />
          </view>
          <view class="form-item">
            <text class="form-label">省份</text>
            <input 
              class="form-input" 
              v-model="editingBasicInfo.province" 
              placeholder="请输入省份"
            />
          </view>
          <view class="form-item">
            <text class="form-label">城市</text>
            <input 
              class="form-input" 
              v-model="editingBasicInfo.city" 
              placeholder="请输入城市"
            />
          </view>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="closeBasicInfoModal">取消</button>
          <button class="btn-confirm" @click="saveBasicInfo">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { authService, AUTH_STATUS } from '@/utils/authService.js'

export default {
  data() {
    return {
      userInfo: {
        nickname: '',
        description: '正在加载用户信息',
        level: 1,
        nextLevelExp: 999,
        levelProgress: 0,
        studyDays: 0,
        completedLessons: 0,
        gender: 0,
        country: '',
        province: '',
        city: '',
        language: 'zh_CN',
        createTime: null,
        lastLoginTime: null
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
      authStatus: AUTH_STATUS.UNKNOWN,
      
      // 弹窗状态
      showNicknameModal: false,
      showBasicInfoModal: false,
      editingNickname: '',
      editingBasicInfo: {
        gender: 0,
        country: '',
        province: '',
        city: ''
      },
      
      // 选项数据
      genderOptions: ['保密', '男', '女']
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
    authService.removeStatusListener(this.handleStatusChange)
  },
  
  computed: {
    userAvatar() {
      // 根据性别设置默认头像
      if (this.userInfo.gender === 1) {
        return '/static/images/avatar-male.svg'
      } else if (this.userInfo.gender === 2) {
        return '/static/images/avatar-female.svg'
      } else {
        return '/static/images/avatar-default.svg'
      }
    }
  },
  
  methods: {
    /**
     * 初始化认证服务
     */
    async initAuth() {
      try {
        authService.addStatusListener(this.handleStatusChange)
        await authService.init()
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
        this.redirectToLogin()
      } else {
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
        if (!currentUser) {
          throw new Error('用户信息获取失败')
        }

        // 更新用户信息显示
        this.userInfo = {
          ...this.userInfo,
          nickname: currentUser.nickname || '未设置昵称',
          gender: currentUser.gender || 0,
          country: currentUser.country || '',
          province: currentUser.province || '',
          city: currentUser.city || '',
          language: currentUser.language || 'zh_CN',
          createTime: currentUser.createTime || null,
          lastLoginTime: currentUser.lastLoginTime || null
        }
        
        if (authService.isGuest()) {
          this.userInfo.description = '游客模式 - 功能受限'
          this.userInfo.level = 1
          this.userInfo.nextLevelExp = 999
          this.userInfo.levelProgress = 0
          this.userInfo.studyDays = 0
          this.userInfo.completedLessons = 0
          
          this.learningStats.completedLessons = 0
          this.learningStats.accuracy = 0
          this.learningStats.streak = 0
        } else {
          this.userInfo.description = '坚持学习，提升英语语法水平'
          this.learningStats.completedLessons = 23
          this.learningStats.accuracy = 78
          this.learningStats.streak = 15
        }

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
        this.achievements.forEach(achievement => {
          achievement.unlocked = achievement.id <= 2
        })
      } else {
        const completedLessons = this.learningStats.completedLessons
        
        this.achievements.forEach(achievement => {
          switch (achievement.id) {
            case 1:
              achievement.unlocked = completedLessons >= 1
              break
            case 2:
              achievement.unlocked = this.learningStats.streak >= 7
              break
            case 3:
              achievement.unlocked = completedLessons >= 10
              break
            case 4:
              achievement.unlocked = this.learningStats.accuracy >= 100
              break
            case 5:
              achievement.unlocked = this.learningStats.streak >= 30
              break
            case 6:
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
      
      uni.showToast({
        title: '认证失败，请重新登录',
        icon: 'none',
        duration: 2000
      })
      
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
          uni.reLaunch({
            url: '/pages/login/index'
          })
        }
      })
    },

    /**
     * 编辑头像
     */
    editAvatar() {
      if (authService.isGuest()) {
        uni.showToast({
          title: '游客模式无法修改头像',
          icon: 'none'
        })
        return
      }
      
      uni.showActionSheet({
        itemList: ['从相册选择', '拍照'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.chooseImage('album')
          } else if (res.tapIndex === 1) {
            this.chooseImage('camera')
          }
        }
      })
    },

    /**
     * 选择图片
     */
    chooseImage(sourceType) {
      uni.chooseImage({
        count: 1,
        sourceType: [sourceType],
        success: (res) => {
          this.uploadAvatar(res.tempFilePaths[0])
        }
      })
    },

    /**
     * 上传头像
     */
    async uploadAvatar(filePath) {
      try {
        uni.showLoading({ title: '上传中...' })
        
        // 这里应该调用云函数上传头像
        // 暂时模拟上传成功
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({
            title: '头像上传成功',
            icon: 'success'
          })
        }, 2000)
        
      } catch (error) {
        uni.hideLoading()
        uni.showToast({
          title: '头像上传失败',
          icon: 'none'
        })
      }
    },

    /**
     * 编辑昵称
     */
    editNickname() {
      if (authService.isGuest()) {
        uni.showToast({
          title: '游客模式无法修改昵称',
          icon: 'none'
        })
        return
      }
      
      this.editingNickname = this.userInfo.nickname === '未设置昵称' ? '' : this.userInfo.nickname
      this.showNicknameModal = true
    },

    /**
     * 关闭昵称编辑弹窗
     */
    closeNicknameModal() {
      this.showNicknameModal = false
      this.editingNickname = ''
    },

    /**
     * 保存昵称
     */
    async saveNickname() {
      if (!this.editingNickname.trim()) {
        uni.showToast({
          title: '昵称不能为空',
          icon: 'none'
        })
        return
      }
      
      try {
        uni.showLoading({ title: '保存中...' })
        
        const currentUser = authService.getUser()
        if (!currentUser || !currentUser._id) {
          throw new Error('用户信息不完整')
        }
        
        // 调用云函数更新昵称
        const result = await uniCloud.callFunction({
          name: 'updateUserInfo',
          data: {
            userId: currentUser._id,
            updateData: {
              nickname: this.editingNickname.trim()
            }
          }
        })
        
        if (result.result.success) {
          // 更新本地用户信息
          this.userInfo.nickname = this.editingNickname.trim()
          
          // 更新认证服务中的用户信息
          if (authService.updateUserInfo) {
            await authService.updateUserInfo(result.result.data)
          }
          
          this.closeNicknameModal()
          uni.showToast({
            title: '昵称修改成功',
            icon: 'success'
          })
        } else {
          throw new Error(result.result.message)
        }
        
      } catch (error) {
        console.error('昵称修改失败:', error)
        uni.showToast({
          title: error.message || '昵称修改失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },

    /**
     * 编辑基本信息
     */
    editBasicInfo() {
      if (authService.isGuest()) {
        uni.showToast({
          title: '游客模式无法修改信息',
          icon: 'none'
        })
        return
      }
      
      this.editingBasicInfo = {
        gender: this.userInfo.gender,
        country: this.userInfo.country,
        province: this.userInfo.province,
        city: this.userInfo.city
      }
      this.showBasicInfoModal = true
    },

    /**
     * 关闭基本信息编辑弹窗
     */
    closeBasicInfoModal() {
      this.showBasicInfoModal = false
    },

    /**
     * 性别选择变化
     */
    onGenderChange(e) {
      this.editingBasicInfo.gender = parseInt(e.detail.value)
    },

    /**
     * 保存基本信息
     */
    async saveBasicInfo() {
      try {
        uni.showLoading({ title: '保存中...' })
        
        const currentUser = authService.getUser()
        if (!currentUser || !currentUser._id) {
          throw new Error('用户信息不完整')
        }
        
        // 调用云函数更新基本信息
        const result = await uniCloud.callFunction({
          name: 'updateUserInfo',
          data: {
            userId: currentUser._id,
            updateData: {
              gender: this.editingBasicInfo.gender,
              country: this.editingBasicInfo.country,
              province: this.editingBasicInfo.province,
              city: this.editingBasicInfo.city
            }
          }
        })
        
        if (result.result.success) {
          // 更新本地用户信息
          this.userInfo = {
            ...this.userInfo,
            ...this.editingBasicInfo
          }
          
          // 更新认证服务中的用户信息
          if (authService.updateUserInfo) {
            await authService.updateUserInfo(result.result.data)
          }
          
          this.closeBasicInfoModal()
          uni.showToast({
            title: '信息修改成功',
            icon: 'success'
          })
        } else {
          throw new Error(result.result.message)
        }
        
      } catch (error) {
        console.error('信息修改失败:', error)
        uni.showToast({
          title: error.message || '信息修改失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },

    /**
     * 格式化性别显示
     */
    formatGender(gender) {
      const genderMap = ['保密', '男', '女']
      return genderMap[gender] || '保密'
    },

    /**
     * 格式化地区显示
     */
    formatLocation(country, province, city) {
      if (!country && !province && !city) {
        return '未设置'
      }
      
      const parts = [country, province, city].filter(Boolean)
      return parts.join(' ')
    },

    /**
     * 格式化语言显示
     */
    formatLanguage(language) {
      const languageMap = {
        'zh_CN': '简体中文',
        'zh_TW': '繁体中文',
        'en_US': 'English'
      }
      return languageMap[language] || language
    },

    /**
     * 格式化日期显示
     */
    formatDate(timestamp) {
      if (!timestamp) return '未知'
      
      const date = new Date(timestamp)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
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
        const studied = Math.random() > 0.3
        
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

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.edit-icon {
  font-size: 24rpx;
  color: white;
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

.username-section {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.edit-nickname {
  margin-left: 10rpx;
  padding: 5rpx 10rpx;
  background: #f0f0f0;
  border-radius: 10rpx;
}

.edit-nickname .edit-icon {
  font-size: 24rpx;
  color: #667eea;
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

.basic-info {
  margin-bottom: 30rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.edit-btn {
  font-size: 28rpx;
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
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

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 20rpx;
  width: 90%;
  max-width: 600rpx;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.nickname-input {
  font-size: 28rpx;
  color: #333;
  padding: 15rpx 20rpx;
  border: 1rpx solid #ccc;
  border-radius: 10rpx;
  background: #f8f9fa;
}

.input-tip {
  font-size: 20rpx;
  color: #999;
  margin-top: 5rpx;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
  min-width: 100rpx;
}

.form-picker {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  padding: 15rpx 20rpx;
  border: 1rpx solid #ccc;
  border-radius: 10rpx;
  background: #f8f9fa;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  padding: 15rpx 20rpx;
  border: 1rpx solid #ccc;
  border-radius: 10rpx;
  background: #f8f9fa;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  font-size: 32rpx;
  padding: 15rpx 0;
  border-radius: 10rpx;
  text-align: center;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
  border: 1rpx solid #ccc;
}

.btn-confirm {
  background: #667eea;
  color: white;
  border: none;
}

.btn-cancel:active {
  background: #e0e0e0;
}

.btn-confirm:active {
  background: #5a67d8;
}
</style>
