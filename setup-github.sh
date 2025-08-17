#!/bin/bash

# GitHub 仓库设置脚本
echo "🚀 GrammarMaster 项目 GitHub 仓库设置"
echo "=================================="

# 检查是否已配置远程仓库
if git remote -v | grep -q "origin"; then
    echo "✅ 远程仓库已配置:"
    git remote -v
    echo ""
    echo "如需更改远程仓库，请运行:"
    echo "git remote set-url origin <新的仓库URL>"
else
    echo "📝 请按以下步骤操作："
    echo ""
    echo "1. 在 GitHub 上创建新仓库"
    echo "2. 复制仓库 URL（例如：https://github.com/username/grammar-master-uniapp.git）"
    echo "3. 运行以下命令添加远程仓库："
    echo "   git remote add origin <仓库URL>"
    echo ""
    echo "4. 推送代码到 GitHub："
    echo "   git push -u origin main"
    echo ""
    echo "5. 验证推送结果："
    echo "   git remote -v"
    echo "   git status"
fi

echo ""
echo "📚 项目信息："
echo "- 项目名称: GrammarMaster"
echo "- 项目类型: UniApp 微信小程序"
echo "- 主要功能: 英语语法学习"
echo "- 技术栈: Vue 3 + UniApp + Vite"
echo ""
echo "🎯 下一步操作："
echo "1. 在 GitHub 上创建仓库"
echo "2. 配置远程仓库"
echo "3. 推送代码"
echo "4. 设置 GitHub Pages（可选）"
echo "5. 配置 GitHub Actions（可选）"
