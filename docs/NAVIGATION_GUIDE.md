# 导航使用指南

## 问题说明

在微信小程序中，不能使用 `uni.navigateTo()` 跳转到 tabBar 页面，必须使用 `uni.switchTab()`。

## 解决方案

### 1. 已修复的问题

✅ **首页快速访问按钮** - 已修复为智能导航
✅ **复习页面跳转测评** - 已修复为使用 `switchTab`

### 2. 导航方法说明

#### 智能导航（推荐）
```javascript
// 自动判断页面类型并使用合适的导航方法
navigateTo(path) {
  if (path.startsWith('/pages/')) {
    const tabBarPages = [
      '/pages/index/index',
      '/pages/learn/index', 
      '/pages/practice/index',
      '/pages/review/index',
      '/pages/profile/index'
    ]
    
    if (tabBarPages.includes(path)) {
      uni.switchTab({ url: path })
    } else {
      uni.navigateTo({ url: path })
    }
  } else {
    uni.navigateTo({ url: path })
  }
}
```

#### 手动指定导航类型
```javascript
// 跳转到 tabBar 页面
uni.switchTab({
  url: '/pages/learn/index'
})

// 跳转到非 tabBar 页面
uni.navigateTo({
  url: '/pages/learn/detail'
})
```

### 3. tabBar 页面列表

以下页面属于 tabBar 页面，必须使用 `switchTab`：

- `/pages/index/index` - 首页
- `/pages/learn/index` - 学习页面
- `/pages/practice/index` - 练习页面
- `/pages/review/index` - 复习页面
- `/pages/profile/index` - 个人中心

### 4. 常见错误

❌ **错误用法：**
```javascript
// 这会报错：can not navigateTo a tabbar page
uni.navigateTo({
  url: '/pages/learn/index'
})
```

✅ **正确用法：**
```javascript
uni.switchTab({
  url: '/pages/learn/index'
})
```

### 5. 最佳实践

1. **使用智能导航方法** - 自动判断页面类型
2. **明确指定导航类型** - 如果知道目标页面类型
3. **统一管理页面路径** - 避免硬编码路径
4. **添加错误处理** - 处理导航失败的情况

### 6. 工具函数

我们还提供了 `utils/navigation.js` 工具文件，包含：

- `smartNavigate(path)` - 智能导航
- `navigateToTab(path)` - 导航到 tabBar 页面
- `navigateToPage(path)` - 导航到非 tabBar 页面
- `goBack(delta)` - 返回上一页
- `redirectTo(path)` - 重定向
- `reLaunch(path)` - 重启到页面

## 注意事项

- 确保所有 tabBar 页面都使用 `switchTab`
- 非 tabBar 页面使用 `navigateTo`
- 测试所有导航路径，确保没有错误
- 保持代码的一致性和可维护性
