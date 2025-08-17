#!/bin/bash

echo "🚀 GrammarMaster 英语语法学习小程序启动脚本"
echo "================================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到Node.js，请先安装Node.js 16+"
    echo "下载地址：https://nodejs.org/"
    exit 1
fi

# 检查Node.js版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ 错误：Node.js版本过低，需要16+，当前版本：$(node -v)"
    echo "请升级Node.js到16+版本"
    exit 1
fi

echo "✅ Node.js版本检查通过：$(node -v)"

# 检查包管理器
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    echo "✅ 检测到pnpm包管理器"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "✅ 检测到npm包管理器"
else
    echo "❌ 错误：未检测到包管理器，请安装npm或pnpm"
    exit 1
fi

# 安装依赖
echo "📦 正在安装项目依赖..."
$PACKAGE_MANAGER install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败，请检查网络连接或手动安装"
    exit 1
fi

echo "✅ 依赖安装完成"

# 显示启动选项
echo ""
echo "🎯 选择启动方式："
echo "1. 微信小程序开发模式"
echo "2. H5开发模式"
echo "3. App开发模式"
echo "4. 构建微信小程序"
echo "5. 构建H5版本"
echo "6. 退出"

read -p "请输入选项 (1-6): " choice

case $choice in
    1)
        echo "🚀 启动微信小程序开发模式..."
        $PACKAGE_MANAGER run dev:mp-weixin
        ;;
    2)
        echo "🚀 启动H5开发模式..."
        $PACKAGE_MANAGER run dev:h5
        ;;
    3)
        echo "🚀 启动App开发模式..."
        $PACKAGE_MANAGER run dev:app
        ;;
    4)
        echo "🔨 构建微信小程序..."
        $PACKAGE_MANAGER run build:mp-weixin
        ;;
    5)
        echo "🔨 构建H5版本..."
        $PACKAGE_MANAGER run build:h5
        ;;
    6)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选项，请重新运行脚本"
        exit 1
        ;;
esac
