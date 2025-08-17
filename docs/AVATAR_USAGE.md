# 头像使用指南

## 问题解决

✅ **已修复的问题：**
- 删除了损坏的 `avatar-default.png` 文件
- 创建了新的 SVG 格式默认头像
- 更新了所有头像引用路径
- 创建了头像管理工具

## 头像资源

### 1. 默认头像
- **路径：** `/static/images/avatar-default.svg`
- **格式：** SVG（矢量图，清晰度高）
- **设计：** 简洁的用户图标，包含头部和身体

### 2. 头像配置
```javascript
import { AVATAR_CONFIG } from '@/utils/avatarManager.js'

// 默认头像路径
AVATAR_CONFIG.DEFAULT // '/static/images/avatar-default.svg'

// 头像尺寸
AVATAR_CONFIG.SIZES.SMALL   // '60rpx'
AVATAR_CONFIG.SIZES.MEDIUM  // '80rpx'
AVATAR_CONFIG.SIZES.LARGE   // '120rpx'
AVATAR_CONFIG.SIZES.XLARGE  // '160rpx'
```

## 使用方法

### 1. 基本使用
```vue
<template>
  <image 
    :src="avatarSrc" 
    mode="aspectFill"
    class="avatar">
  </image>
</template>

<script>
import { getAvatarPath } from '@/utils/avatarManager.js'

export default {
  data() {
    return {
      userAvatar: null
    }
  },
  computed: {
    avatarSrc() {
      return getAvatarPath(this.userAvatar)
    }
  }
}
</script>
```

### 2. 使用头像管理工具
```vue
<template>
  <image 
    v-bind="avatarProps"
    class="avatar">
  </image>
</template>

<script>
import { getAvatarProps } from '@/utils/avatarManager.js'

export default {
  data() {
    return {
      userAvatar: null
    }
  },
  computed: {
    avatarProps() {
      return getAvatarProps({
        src: this.userAvatar,
        size: 'LARGE',
        style: 'ROUND'
      })
    }
  }
}
</script>
```

### 3. 动态头像样式
```vue
<template>
  <image 
    :src="avatarSrc"
    :style="avatarStyle"
    mode="aspectFill">
  </image>
</template>

<script>
import { getAvatarPath, getAvatarStyle } from '@/utils/avatarManager.js'

export default {
  data() {
    return {
      userAvatar: null,
      avatarSize: 'MEDIUM'
    }
  },
  computed: {
    avatarSrc() {
      return getAvatarPath(this.userAvatar)
    },
    avatarStyle() {
      return getAvatarStyle(this.avatarSize, 'ROUND', {
        border: '2rpx solid #fff',
        boxShadow: '0 2rpx 8rpx rgba(0,0,0,0.1)'
      })
    }
  }
}
</script>
```

## 工具函数说明

### 1. `getAvatarPath(avatarPath, fallback)`
- **功能：** 获取头像路径，自动处理空值和备用头像
- **参数：**
  - `avatarPath`: 用户头像路径
  - `fallback`: 备用头像路径（可选）
- **返回：** 有效的头像路径

### 2. `getAvatarStyle(size, style, customStyle)`
- **功能：** 生成头像样式
- **参数：**
  - `size`: 头像尺寸（SMALL/MEDIUM/LARGE/XLARGE）
  - `style`: 头像样式（ROUND/SQUARE/CUSTOM）
  - `customStyle`: 自定义样式对象
- **返回：** CSS 样式字符串

### 3. `getAvatarProps(options)`
- **功能：** 获取完整的头像组件属性
- **参数：** 配置选项对象
- **返回：** 包含 src、style、mode 的属性对象

## 最佳实践

1. **统一管理：** 使用头像管理工具，避免硬编码路径
2. **错误处理：** 始终提供备用头像，避免显示错误
3. **性能优化：** 使用 SVG 格式，文件小且清晰
4. **样式统一：** 使用预定义的尺寸和样式，保持一致性
5. **响应式：** 根据设备像素密度选择合适的头像尺寸

## 注意事项

- SVG 格式在微信小程序中完全支持
- 头像路径必须以 `/static/` 开头
- 建议使用 `aspectFill` 模式保持头像比例
- 定期检查和更新默认头像资源
