# TabBar 图标使用说明

## 问题解决

✅ **已修复的问题：**
- 微信小程序 tabBar 图标只支持 PNG、JPG、JPEG 格式
- 已将 `pages.json` 中的图标路径改回 PNG 格式
- 保留了 SVG 格式图标用于其他用途

## 图标格式要求

### 1. TabBar 图标限制
- **支持格式：** 仅支持 `.png`、`.jpg`、`.jpeg`
- **不支持格式：** SVG、WebP、GIF 等
- **原因：** 微信小程序的平台限制

### 2. 当前图标配置
```json
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/home-active.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/learn/index",
        "iconPath": "static/tabbar/learn.png",
        "selectedIconPath": "static/tabbar/learn-active.png",
        "text": "学习"
      },
      {
        "pagePath": "pages/practice/index",
        "iconPath": "static/tabbar/practice.png",
        "selectedIconPath": "static/tabbar/practice-active.png",
        "text": "练习"
      },
      {
        "pagePath": "pages/review/index",
        "iconPath": "static/tabbar/review.png",
        "selectedIconPath": "static/tabbar/review-active.png",
        "text": "复习"
      },
      {
        "pagePath": "pages/profile/index",
        "iconPath": "static/tabbar/profile.png",
        "selectedIconPath": "static/tabbar/profile-active.png",
        "text": "我的"
      }
    ]
  }
}
```

## 图标资源说明

### 1. PNG 图标（用于 TabBar）
- **home.png** - 首页图标（未选中状态）
- **home-active.png** - 首页图标（选中状态）
- **learn.png** - 学习图标（未选中状态）
- **learn-active.png** - 学习图标（选中状态）
- **practice.png** - 练习图标（未选中状态）
- **practice-active.png** - 练习图标（选中状态）
- **review.png** - 复习图标（未选中状态）
- **review-active.png** - 复习图标（选中状态）
- **profile.png** - 个人中心图标（未选中状态）
- **profile-active.png** - 个人中心图标（选中状态）

### 2. SVG 图标（用于其他用途）
- 保留了所有 SVG 格式图标
- 可用于页面内的图标显示
- 支持自定义颜色和尺寸

## 最佳实践

### 1. 图标设计原则
- **尺寸一致：** 建议使用 81x81 像素（27px@3x）
- **风格统一：** 保持视觉风格的一致性
- **对比明显：** 选中和未选中状态要有明显区别
- **简洁明了：** 避免过于复杂的细节

### 2. 颜色配置
```json
{
  "tabBar": {
    "color": "#7A7E83",        // 未选中文字颜色
    "selectedColor": "#3cc51f", // 选中文字颜色
    "backgroundColor": "#ffffff" // 背景颜色
  }
}
```

### 3. 图标命名规范
- **未选中状态：** `{name}.png`
- **选中状态：** `{name}-active.png`
- **命名示例：** `home.png`、`home-active.png`

## 注意事项

1. **格式限制：** TabBar 图标必须使用 PNG/JPG/JPEG 格式
2. **文件大小：** 建议单个图标文件不超过 10KB
3. **分辨率：** 建议提供 3x 分辨率以支持高清屏幕
4. **测试验证：** 在不同设备上测试图标显示效果
5. **备份管理：** 保留原始设计文件，便于后续修改

## 常见问题

### Q: 为什么不能使用 SVG 图标？
A: 微信小程序的 TabBar 组件只支持位图格式，这是平台限制。

### Q: 图标显示不清晰怎么办？
A: 检查图标分辨率，建议使用 81x81 像素或更高分辨率。

### Q: 如何自定义图标颜色？
A: 通过 `selectedColor` 和 `color` 属性设置文字颜色，图标本身颜色需要预先设计。

### Q: 图标文件太大怎么办？
A: 使用图片压缩工具优化文件大小，保持清晰度的同时减少文件体积。
