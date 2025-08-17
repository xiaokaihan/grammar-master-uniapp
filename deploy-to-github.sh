#!/bin/bash

# GrammarMaster 项目快速部署到 GitHub 脚本
echo "🚀 GrammarMaster 项目 GitHub 部署脚本"
echo "=================================="

# 检查是否已配置远程仓库
if git remote -v | grep -q "origin"; then
    echo "✅ 远程仓库已配置:"
    git remote -v
    echo ""
    
    # 推送代码
    echo "📤 推送代码到 GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ 代码推送成功！"
        echo ""
        echo "🎯 下一步操作："
        echo "1. 访问你的 GitHub 仓库页面"
        echo "2. 检查代码是否正确上传"
        echo "3. 设置项目描述和标签"
        echo "4. 配置 GitHub Pages（可选）"
        echo "5. 设置 GitHub Actions（可选）"
    else
        echo "❌ 代码推送失败，请检查错误信息"
        exit 1
    fi
else
    echo "📝 远程仓库未配置，请先运行以下命令："
    echo ""
    echo "1. 在 GitHub 上创建新仓库"
    echo "2. 配置远程仓库："
    echo "   git remote add origin https://github.com/<用户名>/grammar-master-uniapp.git"
    echo ""
    echo "3. 然后重新运行此脚本"
    echo ""
    echo "📚 详细步骤请参考: docs/GITHUB_DEPLOYMENT.md"
    exit 1
fi

echo ""
echo "🎉 部署完成！你的 GrammarMaster 项目现在已经在 GitHub 上了！"
echo ""
echo "🔗 相关链接："
echo "- 项目文档: docs/"
echo "- GitHub 部署指南: docs/GITHUB_DEPLOYMENT.md"
echo "- 项目总结: docs/PROJECT_SUMMARY.md"
