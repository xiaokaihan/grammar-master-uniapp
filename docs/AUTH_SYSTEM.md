# 认证系统架构文档

## 概述

GrammarMaster 小程序采用现代化的认证架构，提供完整的用户登录、状态管理和权限控制功能。

## 系统架构

### 核心组件

#### 1. AuthService (认证服务)
- **位置**: `utils/authService.js`
- **职责**: 统一管理所有认证相关操作
- **特性**:
  - 微信登录和游客登录
  - 用户状态管理
  - 权限控制
  - 状态变化监听

#### 2. LoginManager (登录管理器)
- **位置**: `utils/loginManager.js`
- **职责**: 底层登录逻辑和存储管理
- **特性**:
  - 云函数调用
  - 本地存储管理
  - 会话过期处理

#### 3. Navigation (导航工具)
- **位置**: `utils/navigation.js`
- **职责**: 智能页面导航和权限检查
- **特性**:
  - 自动选择最佳导航方法
  - 权限验证
  - 错误处理和降级策略

#### 4. useAuth Composable
- **位置**: `utils/useAuth.js`
- **职责**: Vue 3 Composition API 集成
- **特性**:
  - 响应式状态管理
  - 生命周期管理
  - 类型安全的 API

## 功能特性

### 登录方式

#### 微信登录
- 使用 `uni.login` 获取登录凭证
- 使用 `uni.getUserProfile` 获取用户信息
- 支持超时处理和错误恢复
- 自动处理授权拒绝和取消

#### 游客登录
- 无需微信授权
- 功能受限但可快速体验
- 可随时升级为微信登录

### 权限系统

#### 游客权限
```javascript
{
  canLearn: true,        // 可以学习
  canPractice: true,     // 可以练习
  canReview: false,      // 不能复习
  canAccessProfile: true, // 可以访问个人中心
  canSaveProgress: false, // 不能保存进度
  canSyncData: false     // 不能同步数据
}
```

#### 微信用户权限
```javascript
{
  canLearn: true,        // 可以学习
  canPractice: true,     // 可以练习
  canReview: true,       // 可以复习
  canAccessProfile: true, // 可以访问个人中心
  canSaveProgress: true,  // 可以保存进度
  canSyncData: true      // 可以同步数据
}
```

### 状态管理

#### 认证状态
- `UNKNOWN`: 未知状态
- `LOADING`: 加载中
- `LOGGED_OUT`: 已退出
- `GUEST`: 游客模式
- `WECHAT`: 微信登录
- `ERROR`: 错误状态

#### 状态监听
```javascript
// 添加状态监听器
authService.addStatusListener((status, user, permissions) => {
  console.log('状态变化:', status, user, permissions)
})

// 移除状态监听器
authService.removeStatusListener(listener)
```

## 使用方法

### 在页面中使用

#### 基本用法
```javascript
import { authService } from '@/utils/authService.js'

export default {
  async onLoad() {
    // 检查登录状态
    if (!authService.isLoggedIn()) {
      uni.navigateTo({ url: '/pages/login/index' })
      return
    }
    
    // 获取用户信息
    const user = authService.getUser()
    const permissions = authService.getPermissions()
  }
}
```

#### 使用 Composable (Vue 3)
```javascript
import { useAuth, useUserInfo } from '@/utils/useAuth.js'

export default {
  setup() {
    const { 
      isLoggedIn, 
      wechatLogin, 
      logout 
    } = useAuth()
    
    const { 
      username, 
      avatar, 
      isGuestMode 
    } = useUserInfo()
    
    return {
      isLoggedIn,
      wechatLogin,
      logout,
      username,
      avatar,
      isGuestMode
    }
  }
}
```

### 权限检查

#### 页面访问权限
```javascript
// 检查页面访问权限
const accessCheck = authService.checkPageAccess('/pages/review/index')
if (!accessCheck.allowed) {
  console.log('访问受限:', accessCheck.reason)
  return
}
```

#### 功能权限检查
```javascript
// 检查特定权限
if (authService.hasPermission('canReview')) {
  // 显示复习功能
} else {
  // 隐藏复习功能或显示升级提示
}
```

### 页面导航

#### 智能导航
```javascript
// 自动选择最佳导航方法
await authService.navigateToPage('/pages/index/index')
```

#### 带权限检查的导航
```javascript
// 导航前自动检查权限
const success = await authService.navigateToPage('/pages/review/index')
if (!success) {
  // 权限不足，已自动显示提示
}
```

## 错误处理

### 常见错误类型

#### 微信授权错误
- **拒绝授权**: 用户拒绝获取用户信息
- **超时错误**: 网络请求超时
- **取消授权**: 用户取消授权操作

#### 网络错误
- **连接失败**: 网络连接问题
- **服务器错误**: 后端服务异常
- **超时错误**: 请求超时

### 错误处理策略

#### 用户友好提示
```javascript
try {
  await authService.wechatLogin()
} catch (error) {
  let message = '登录失败，请重试'
  
  if (error.message.includes('拒绝授权')) {
    message = '您拒绝了授权，请允许获取用户信息后重试'
  } else if (error.message.includes('超时')) {
    message = '网络超时，请检查网络连接后重试'
  }
  
  uni.showModal({
    title: '登录失败',
    content: message,
    showCancel: false
  })
}
```

#### 自动重试机制
- 网络错误自动重试
- 超时错误提供重试选项
- 权限错误引导用户重新授权

## 安全特性

### 数据保护
- 用户信息本地加密存储
- 敏感数据不暴露给前端
- 会话自动过期机制

### 权限验证
- 前端权限检查
- 后端权限验证
- 页面访问控制

### 错误处理
- 详细的错误日志
- 用户友好的错误提示
- 安全的错误恢复机制

## 性能优化

### 状态缓存
- 用户信息本地缓存
- 权限信息内存存储
- 减少重复 API 调用

### 异步操作
- 非阻塞的登录流程
- 后台状态同步
- 智能错误恢复

### 资源管理
- 自动清理过期数据
- 内存泄漏防护
- 生命周期管理

## 扩展性

### 新登录方式
```javascript
// 在 AuthService 中添加新方法
async customLogin(credentials) {
  // 实现自定义登录逻辑
  const result = await this.callCustomLoginApi(credentials)
  if (result.success) {
    await this.saveLoginStatus('custom', result.user)
  }
  return result
}
```

### 新权限类型
```javascript
// 在 USER_PERMISSIONS 中添加新权限
CUSTOM: {
  canLearn: true,
  canPractice: true,
  canReview: true,
  canAccessProfile: true,
  canSaveProgress: true,
  canSyncData: true,
  canCustomFeature: true  // 新权限
}
```

### 新页面类型
```javascript
// 在 checkPageAccess 中添加新页面
case '/pages/custom/index':
  if (!this.hasPermission('canCustomFeature')) {
    return { allowed: false, reason: '需要特定权限' }
  }
  break
```

## 测试建议

### 功能测试
1. 微信登录流程完整性
2. 游客登录功能
3. 权限控制准确性
4. 状态管理稳定性

### 错误测试
1. 网络异常情况
2. 用户拒绝授权
3. 超时错误处理
4. 权限不足情况

### 性能测试
1. 登录响应时间
2. 状态同步性能
3. 内存使用情况
4. 错误恢复速度

## 维护说明

### 日志监控
- 关注认证失败日志
- 监控权限检查频率
- 跟踪状态变化事件

### 性能监控
- 登录成功率
- 平均响应时间
- 错误发生频率

### 用户反馈
- 收集登录问题反馈
- 分析权限使用情况
- 优化用户体验

## 总结

新的认证系统提供了：
- **完整的登录功能**: 支持微信和游客两种登录方式
- **智能的状态管理**: 自动同步和状态监听
- **灵活的权限控制**: 细粒度的功能权限管理
- **优秀的用户体验**: 友好的错误提示和自动恢复
- **良好的扩展性**: 易于添加新功能和权限
- **稳定的性能**: 优化的异步操作和缓存策略

这套系统为 GrammarMaster 小程序提供了坚实的用户认证基础，确保用户可以安全、便捷地使用各项功能。
