# 图标使用指南

## 概述

我们提供了完整的图标管理系统，包括 TabBar 图标和 SVG 图标，以及相应的管理工具。

## 图标类型

### 1. TabBar 图标
- **格式：** PNG 格式（微信小程序要求）
- **用途：** 底部导航栏
- **特点：** 固定尺寸，支持选中/未选中状态

### 2. SVG 图标
- **格式：** SVG 格式（矢量图）
- **用途：** 页面内显示
- **特点：** 可缩放，支持自定义颜色

## 使用方法

### 1. 基本使用

#### 导入工具
```javascript
import { getTabBarIcon, getSvgIcon, getIconProps } from '@/utils/iconManager.js'
```

#### 获取 TabBar 图标
```javascript
// 获取首页图标
const homeIcon = getTabBarIcon('HOME', false)        // 未选中状态
const homeActiveIcon = getTabBarIcon('HOME', true)   // 选中状态

// 获取学习图标
const learnIcon = getTabBarIcon('LEARN', false)
const learnActiveIcon = getTabBarIcon('LEARN', true)
```

#### 获取 SVG 图标
```javascript
// 获取 SVG 图标
const homeSvg = getSvgIcon('HOME')
const learnSvg = getSvgIcon('LEARN')
```

### 2. 在 Vue 组件中使用

#### 简单图标显示
```vue
<template>
  <view class="icon-container">
    <!-- TabBar 图标 -->
    <image 
      :src="homeIcon" 
      class="icon"
      mode="aspectFit">
    </image>
    
    <!-- SVG 图标 -->
    <image 
      :src="homeSvg" 
      class="icon"
      mode="aspectFit">
    </image>
  </view>
</template>

<script>
import { getTabBarIcon, getSvgIcon } from '@/utils/iconManager.js'

export default {
  data() {
    return {
      homeIcon: getTabBarIcon('HOME', false),
      homeSvg: getSvgIcon('HOME')
    }
  }
}
</script>
```

#### 动态图标状态
```vue
<template>
  <view class="navigation">
    <view 
      v-for="item in navItems" 
      :key="item.name"
      class="nav-item"
      @click="selectItem(item)">
      <image 
        :src="getCurrentIcon(item.name)"
        class="nav-icon"
        mode="aspectFit">
      </image>
      <text class="nav-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
import { getTabBarIcon } from '@/utils/iconManager.js'

export default {
  data() {
    return {
      selectedItem: 'HOME',
      navItems: [
        { name: 'HOME', text: '首页' },
        { name: 'LEARN', text: '学习' },
        { name: 'PRACTICE', text: '练习' },
        { name: 'REVIEW', text: '复习' },
        { name: 'PROFILE', text: '我的' }
      ]
    }
  },
  methods: {
    getCurrentIcon(itemName) {
      const isActive = this.selectedItem === itemName
      return getTabBarIcon(itemName, isActive)
    },
    selectItem(item) {
      this.selectedItem = item.name
    }
  }
}
</script>
```

#### 使用图标属性工具
```vue
<template>
  <view class="icon-grid">
    <image 
      v-for="icon in iconList"
      :key="icon.name"
      v-bind="icon.props"
      class="grid-icon"
      mode="aspectFit">
    </image>
  </view>
</template>

<script>
import { getIconProps } from '@/utils/iconManager.js'

export default {
  data() {
    return {
      iconList: [
        {
          name: 'home',
          props: getIconProps({ type: 'svg', name: 'HOME', size: 'LG' })
        },
        {
          name: 'learn',
          props: getIconProps({ type: 'svg', name: 'LEARN', size: 'MD' })
        },
        {
          name: 'practice',
          props: getIconProps({ type: 'svg', name: 'PRACTICE', size: 'SM' })
        }
      ]
    }
  }
}
</script>
```

### 3. 样式配置

#### 图标尺寸
```javascript
import { ICON_SIZES } from '@/utils/iconManager.js'

// 可用的尺寸
console.log(ICON_SIZES.XS)  // '32rpx'
console.log(ICON_SIZES.SM)  // '48rpx'
console.log(ICON_SIZES.MD)  // '64rpx'
console.log(ICON_SIZES.LG)  // '80rpx'
console.log(ICON_SIZES.XL)  // '96rpx'
```

#### 自定义样式
```javascript
import { getIconStyle } from '@/utils/iconManager.js'

// 基础样式
const baseStyle = getIconStyle('LG')

// 自定义样式
const customStyle = getIconStyle('LG', {
  border: '2rpx solid #ccc',
  borderRadius: '8rpx',
  backgroundColor: '#f5f5f5'
})
```

## 最佳实践

### 1. 图标命名规范
- 使用大写字母和下划线
- 保持命名的一致性
- 避免使用特殊字符

### 2. 性能优化
- 图标文件大小控制在合理范围内
- 使用适当的图标格式
- 避免重复加载相同图标

### 3. 错误处理
- 始终提供默认图标
- 验证图标路径的有效性
- 处理图标加载失败的情况

### 4. 响应式设计
- 使用 rpx 单位确保在不同设备上的一致性
- 根据设备像素密度选择合适的图标尺寸
- 考虑不同屏幕尺寸的适配

## 常见问题

### Q: 如何添加新的图标？
A: 在 `utils/iconManager.js` 中的 `TABBAR_ICONS` 和 `SVG_ICONS` 对象中添加新配置。

### Q: 图标显示不正确怎么办？
A: 检查图标路径是否正确，确认文件是否存在，验证图标格式是否支持。

### Q: 如何自定义图标颜色？
A: SVG 图标可以通过 CSS 的 `filter` 属性或直接修改 SVG 文件来改变颜色。

### Q: 图标文件太大怎么办？
A: 使用图片压缩工具优化文件大小，选择合适的图片格式和分辨率。
