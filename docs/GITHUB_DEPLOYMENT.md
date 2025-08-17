# GitHub 部署指南

## 概述

本指南将帮助你将 GrammarMaster 项目部署到 GitHub，包括创建仓库、推送代码、设置 GitHub Pages 和配置 GitHub Actions。

## 步骤 1: 创建 GitHub 仓库

### 1.1 登录 GitHub
1. 访问 [GitHub](https://github.com)
2. 使用你的账号登录

### 1.2 创建新仓库
1. 点击右上角的 "+" 号，选择 "New repository"
2. 填写仓库信息：
   - **Repository name**: `grammar-master-uniapp`
   - **Description**: GrammarMaster - 英语语法学习小程序
   - **Visibility**: 选择 Public 或 Private
   - **Initialize this repository with**: 不要勾选任何选项
3. 点击 "Create repository"

## 步骤 2: 配置本地仓库

### 2.1 添加远程仓库
```bash
# 替换 <你的用户名> 为你的 GitHub 用户名
git remote add origin https://github.com/<你的用户名>/grammar-master-uniapp.git
```

### 2.2 验证远程仓库
```bash
git remote -v
```

应该显示：
```
origin  https://github.com/<你的用户名>/grammar-master-uniapp.git (fetch)
origin  https://github.com/<你的用户名>/grammar-master-uniapp.git (push)
```

## 步骤 3: 推送代码到 GitHub

### 3.1 推送主分支
```bash
git push -u origin main
```

### 3.2 验证推送结果
```bash
git status
```

应该显示：
```
On branch main
Your branch is up to date with 'origin/main'.
```

## 步骤 4: 设置 GitHub Pages（可选）

### 4.1 启用 GitHub Pages
1. 在 GitHub 仓库页面，点击 "Settings"
2. 左侧菜单选择 "Pages"
3. 在 "Source" 部分：
   - 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - Folder 选择 "/ (root)"
4. 点击 "Save"

### 4.2 访问 GitHub Pages
部署完成后，你的项目将在以下地址可用：
```
https://<你的用户名>.github.io/grammar-master-uniapp/
```

## 步骤 5: 配置 GitHub Actions（可选）

### 5.1 创建 Actions 工作流
在项目根目录创建 `.github/workflows/ci.yml` 文件：

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build:mp-weixin
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
```

### 5.2 提交 Actions 配置
```bash
git add .github/workflows/ci.yml
git commit -m "🔧 Add GitHub Actions CI/CD workflow"
git push origin main
```

## 步骤 6: 项目维护

### 6.1 日常开发流程
```bash
# 1. 创建功能分支
git checkout -b feature/新功能名称

# 2. 开发功能
# ... 编写代码 ...

# 3. 提交更改
git add .
git commit -m "✨ Add new feature: 功能描述"

# 4. 推送分支
git push origin feature/新功能名称

# 5. 创建 Pull Request
# 在 GitHub 上创建 PR，等待代码审查

# 6. 合并到主分支
# 审查通过后，合并 PR
```

### 6.2 版本发布
```bash
# 1. 创建发布标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 2. 推送标签
git push origin v1.0.0

# 3. 在 GitHub 上创建 Release
# 访问仓库的 Releases 页面，创建新的 Release
```

## 步骤 7: 项目展示

### 7.1 完善仓库信息
1. 添加项目描述
2. 设置项目标签（Topics）
3. 上传项目截图
4. 编写详细的项目介绍

### 7.2 推荐标签
```
grammar-learning
english-grammar
uniapp
vue3
miniprogram
wechat
education
learning-app
```

## 常见问题

### Q: 推送失败怎么办？
A: 检查网络连接、GitHub 认证和仓库权限。

### Q: 如何更改远程仓库地址？
A: 使用 `git remote set-url origin <新地址>` 命令。

### Q: 如何删除远程分支？
A: 使用 `git push origin --delete <分支名>` 命令。

### Q: GitHub Pages 不显示怎么办？
A: 检查分支设置、文件路径和构建配置。

## 最佳实践

### 1. 提交信息规范
- 使用清晰的描述性信息
- 使用 emoji 增加可读性
- 遵循约定式提交规范

### 2. 分支管理
- 主分支保持稳定
- 功能开发使用独立分支
- 及时清理已合并的分支

### 3. 文档维护
- 保持 README 更新
- 编写详细的开发文档
- 记录重要的配置信息

## 下一步

1. **完善项目文档** - 添加更多使用说明
2. **添加测试用例** - 提高代码质量
3. **配置自动化部署** - 简化发布流程
4. **添加贡献指南** - 欢迎社区贡献
5. **设置问题模板** - 标准化问题报告

---

🎉 恭喜！你的 GrammarMaster 项目现在已经成功部署到 GitHub 了！
