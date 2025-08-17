# 微信授权登录功能说明

## 功能概述

GrammarMaster 应用现已集成完整的微信授权登录系统，支持微信小程序环境下的用户认证和游客模式体验。

## 主要特性

### ✅ **微信授权登录**
- 一键微信授权登录
- 自动获取用户基本信息
- 安全的登录状态管理
- 会话过期自动处理

### ✅ **游客模式**
- 无需登录即可体验基本功能
- 功能受限提示
- 随时可升级为正式用户

### ✅ **智能状态管理**
- 自动检查登录状态
- 页面访问权限控制
- 登录状态持久化
- 安全的退出登录

## 技术架构

### 1. 核心组件

#### `utils/loginManager.js`
- 登录状态管理
- 微信授权处理
- 用户信息管理
- 会话管理

#### `utils/authGuard.js`
- 页面访问权限控制
- 路由守卫
- 全局登录状态检查

#### `pages/login/index.vue`
- 登录页面界面
- 微信授权按钮
- 游客模式入口

### 2. 数据流程

```
用户点击登录 → 微信授权 → 获取用户信息 → 后端验证 → 保存登录状态 → 跳转主页面
```

## 使用方法

### 1. 微信登录

#### 基本流程
1. 用户点击"微信授权登录"按钮
2. 调用 `uni.login()` 获取授权码
3. 调用 `uni.getUserProfile()` 获取用户信息
4. 发送到后端验证（当前为模拟验证）
5. 保存登录状态到本地存储
6. 跳转到主页面

#### 代码示例
```javascript
// 处理微信登录
async handleWechatLogin() {
  try {
    // 获取微信授权
    const authResult = await this.getWechatAuth()
    
    if (authResult.success) {
      // 使用授权信息登录
      const loginResult = await loginManager.wechatLogin(authResult.data)
      
      if (loginResult.success) {
        // 登录成功，跳转主页面
        this.redirectToMain()
      }
    }
  } catch (error) {
    console.error('微信登录失败:', error)
  }
}
```

### 2. 游客模式

#### 启用方式
1. 在登录页面点击"以游客身份体验"
2. 确认游客模式限制提示
3. 自动设置游客状态
4. 跳转主页面

#### 功能限制
- 学习进度不保存
- 无法参与测评
- 部分高级功能受限
- 数据不会同步

### 3. 登录状态检查

#### 自动检查
```javascript
// 在页面加载时自动检查
onLoad() {
  this.checkLoginStatus()
}

// 检查登录状态
async checkLoginStatus() {
  const isLoggedIn = await loginManager.checkLoginStatus()
  
  if (!isLoggedIn) {
    // 未登录，跳转登录页面
    uni.redirectTo({
      url: '/pages/login/index'
    })
  }
}
```

#### 手动检查
```javascript
import { loginManager } from '@/utils/loginManager.js'

// 检查是否已登录
const isLoggedIn = await loginManager.checkLoginStatus()

// 获取当前用户信息
const currentUser = loginManager.getCurrentUser()

// 获取登录状态
const loginStatus = loginManager.getLoginStatus()
```

## 页面权限控制

### 1. 受保护的页面
以下页面需要登录后才能访问：
- `/pages/profile/index` - 个人中心
- `/pages/practice/exercise` - 练习页面
- `/pages/assessment/index` - 能力测评

### 2. 公开页面
以下页面无需登录即可访问：
- `/pages/login/index` - 登录页面
- `/pages/index/index` - 首页

### 3. 权限检查实现
```javascript
import { checkPageAccess } from '@/utils/authGuard.js'

// 检查页面访问权限
const hasAccess = await checkPageAccess('/pages/profile/index')

if (!hasAccess) {
  // 自动跳转到登录页面
  console.log('页面访问被拒绝')
}
```

## 用户信息管理

### 1. 用户数据结构
```javascript
{
  id: 'user_1234567890',
  openid: 'openid_abc123',
  unionid: 'unionid_xyz789',
  nickname: '用户昵称',
  avatar: '头像URL',
  gender: 1, // 0: 未知, 1: 男, 2: 女
  country: '国家',
  province: '省份',
  city: '城市',
  language: 'zh_CN',
  createTime: 1640995200000,
  lastLoginTime: 1640995200000,
  loginCount: 1,
  isGuest: false
}
```

### 2. 更新用户信息
```javascript
// 更新用户信息
const result = await loginManager.updateUserInfo({
  nickname: '新昵称',
  avatar: '新头像URL'
})

if (result.success) {
  console.log('用户信息更新成功')
}
```

## 会话管理

### 1. 会话过期时间
- 默认会话时长：7天
- 自动检查过期状态
- 过期后自动清除登录状态

### 2. 会话刷新
```javascript
// 刷新登录状态
const isStillValid = await loginManager.refreshLoginStatus()

if (!isStillValid) {
  // 会话已过期，需要重新登录
  uni.redirectTo({
    url: '/pages/login/index'
  })
}
```

## 退出登录

### 1. 退出流程
```javascript
// 退出登录
const result = await loginManager.logout()

if (result.success) {
  // 清除所有登录状态
  // 跳转登录页面
  uni.redirectTo({
    url: '/pages/login/index'
  })
}
```

### 2. 数据清理
- 清除内存中的用户信息
- 清除本地存储的登录状态
- 清除微信授权令牌
- 清除会话时间信息

## 错误处理

### 1. 常见错误
- 微信授权失败
- 网络请求超时
- 用户信息获取失败
- 登录状态验证失败

### 2. 错误处理示例
```javascript
try {
  const result = await loginManager.wechatLogin(authData)
  
  if (result.success) {
    // 处理成功情况
  } else {
    // 处理业务错误
    throw new Error(result.message)
  }
} catch (error) {
  // 显示错误提示
  uni.showModal({
    title: '登录失败',
    content: error.message || '登录过程中出现错误，请重试',
    showCancel: false
  })
}
```

## 安全考虑

### 1. 数据安全
- 敏感信息不存储在本地
- 使用安全的存储方式
- 定期清理过期数据

### 2. 权限控制
- 严格的页面访问控制
- 用户身份验证
- 会话状态管理

### 3. 隐私保护
- 遵循微信小程序隐私政策
- 最小化用户信息收集
- 用户可随时退出登录

## 后续扩展

### 1. 功能增强
- 添加手机号绑定
- 支持邮箱登录
- 第三方账号关联
- 多设备登录管理

### 2. 安全升级
- 添加登录日志
- 异常登录检测
- 二次验证支持
- 登录设备管理

### 3. 用户体验
- 记住登录状态
- 自动登录功能
- 登录状态同步
- 个性化设置

---

🎉 微信授权登录功能已完全集成！现在用户可以安全、便捷地使用 GrammarMaster 应用了。
