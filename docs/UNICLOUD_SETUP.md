# uniCloud 云服务部署指南

## 概述

本项目已重构为使用 uniCloud 云服务，无需自建服务器即可实现完整的微信登录功能。

## 部署步骤

### 1. 配置 uniCloud 空间

#### 1.1 在 HBuilderX 中创建 uniCloud 空间
1. 打开 HBuilderX
2. 点击菜单：工具 → uniCloud → 创建云服务空间
3. 选择阿里云
4. 填写空间名称（如：grammar-master）
5. 选择付费方式（建议选择按量付费，有免费额度）

#### 1.2 关联项目
1. 在 HBuilderX 中右键点击项目根目录
2. 选择：关联云服务空间
3. 选择刚创建的空间

### 2. 配置微信小程序

#### 2.1 获取 AppSecret
1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入：开发 → 开发管理 → 开发设置
3. 复制 AppSecret（注意保密）

#### 2.2 更新云函数配置
在 `uniCloud-aliyun/cloudfunctions/login/index.js` 中：
```javascript
secret: 'YOUR_APP_SECRET', // 替换为你的真实 AppSecret
```

#### 2.3 更新 manifest.json
在 `manifest.json` 中填入你的 uniCloud 空间信息：
```json
"uniCloud": {
  "provider": "aliyun",
  "spaceId": "你的空间ID",
  "clientSecret": "你的客户端密钥"
}
```

### 3. 部署云函数

#### 3.1 部署 login 云函数
1. 在 HBuilderX 中右键点击 `uniCloud-aliyun/cloudfunctions/login`
2. 选择：上传并运行：云端安装依赖
3. 等待部署完成

#### 3.2 部署 getUserInfo 云函数
1. 在 HBuilderX 中右键点击 `uniCloud-aliyun/cloudfunctions/getUserInfo`
2. 选择：上传并运行：云端安装依赖
3. 等待部署完成

### 4. 创建数据库集合

#### 4.1 创建 users 集合
1. 在 HBuilderX 中展开 uniCloud 目录
2. 右键点击 `database` 目录
3. 选择：新建集合
4. 集合名称：`users`
5. 导入 `users.schema.json` 文件

#### 4.2 创建 login_logs 集合
1. 右键点击 `database` 目录
2. 选择：新建集合
3. 集合名称：`login_logs`
4. 导入 `login_logs.schema.json` 文件

### 5. 测试功能

#### 5.1 本地测试
1. 在微信开发者工具中运行项目
2. 测试微信登录功能
3. 检查控制台日志

#### 5.2 真机测试
1. 上传代码到微信后台
2. 在真机上测试登录功能
3. 验证用户数据是否正确保存

## 配置说明

### 云函数配置

#### login 云函数
- **功能**：处理微信登录
- **输入**：`{ code, userInfo }`
- **输出**：`{ success, message, data: { userInfo, token, openId } }`

#### getUserInfo 云函数
- **功能**：获取用户信息
- **输入**：`{ userId }`
- **输出**：`{ success, message, data: userInfo }`

### 数据库集合

#### users 集合
存储用户基本信息，包括：
- 微信用户信息（openid, unionid, nickname, avatar 等）
- 用户状态（createTime, lastLoginTime, loginCount 等）

#### login_logs 集合
记录用户登录日志，包括：
- 登录时间、IP、用户代理等
- 登录成功/失败状态

## 安全配置

### 权限控制
- 用户只能读取和修改自己的数据
- 登录日志只能创建，不能修改或删除
- 使用 openid 进行身份验证

### 数据加密
- 敏感信息（如 AppSecret）不在客户端存储
- 用户 token 使用随机字符串生成
- 支持 JWT 令牌（可扩展）

## 常见问题

### Q: 云函数部署失败怎么办？
A: 检查网络连接，确保 HBuilderX 版本是最新的。

### Q: 登录时提示"微信登录验证失败"？
A: 检查 AppSecret 是否正确，确保微信小程序已通过审核。

### Q: 数据库集合创建失败？
A: 检查 schema 文件格式，确保 JSON 语法正确。

### Q: 真机测试登录失败？
A: 确保小程序已上传到微信后台，并且域名已配置。

## 扩展功能

### 1. 添加更多云函数
- `updateUser` - 更新用户信息
- `refreshToken` - 刷新用户令牌
- `getUserStats` - 获取用户统计信息

### 2. 数据库优化
- 添加索引提升查询性能
- 实现数据分页
- 添加数据备份策略

### 3. 监控和日志
- 集成云监控服务
- 实现详细的日志记录
- 添加性能分析

## 成本说明

### 免费额度
- 云函数：每月 100 万次调用
- 云数据库：每月 2GB 存储
- 云存储：每月 5GB 存储

### 超出免费额度
- 云函数：0.0001 元/万次调用
- 云数据库：0.1 元/GB/月
- 云存储：0.1 元/GB/月

## 联系支持

如遇到问题，可以：
1. 查看 [uniCloud 官方文档](https://uniapp.dcloud.net.cn/uniCloud/)
2. 在 [DCloud 社区](https://ask.dcloud.net.cn/) 提问
3. 联系项目维护者

---

**注意**：部署完成后，请及时删除或保护包含敏感信息的文件，避免泄露。
