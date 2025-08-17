@echo off
chcp 65001 >nul
echo 🚀 GrammarMaster 英语语法学习小程序启动脚本
echo ================================================

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Node.js，请先安装Node.js 16+
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)

REM 检查Node.js版本
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ 错误：Node.js版本过低，需要16+，当前版本：
    node --version
    echo 请升级Node.js到16+版本
    pause
    exit /b 1
)

echo ✅ Node.js版本检查通过：
node --version

REM 检查包管理器
pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=pnpm
    echo ✅ 检测到pnpm包管理器
) else (
    npm --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PACKAGE_MANAGER=npm
        echo ✅ 检测到npm包管理器
    ) else (
        echo ❌ 错误：未检测到包管理器，请安装npm或pnpm
        pause
        exit /b 1
    )
)

REM 安装依赖
echo 📦 正在安装项目依赖...
%PACKAGE_MANAGER% install

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败，请检查网络连接或手动安装
    pause
    exit /b 1
)

echo ✅ 依赖安装完成

REM 显示启动选项
echo.
echo 🎯 选择启动方式：
echo 1. 微信小程序开发模式
echo 2. H5开发模式
echo 3. App开发模式
echo 4. 构建微信小程序
echo 5. 构建H5版本
echo 6. 退出

set /p choice=请输入选项 (1-6): 

if "%choice%"=="1" (
    echo 🚀 启动微信小程序开发模式...
    %PACKAGE_MANAGER% run dev:mp-weixin
) else if "%choice%"=="2" (
    echo 🚀 启动H5开发模式...
    %PACKAGE_MANAGER% run dev:h5
) else if "%choice%"=="3" (
    echo 🚀 启动App开发模式...
    %PACKAGE_MANAGER% run dev:app
) else if "%choice%"=="4" (
    echo 🔨 构建微信小程序...
    %PACKAGE_MANAGER% run build:mp-weixin
) else if "%choice%"=="5" (
    echo 🔨 构建H5版本...
    %PACKAGE_MANAGER% run build:h5
) else if "%choice%"=="6" (
    echo 👋 再见！
    pause
    exit /b 0
) else (
    echo ❌ 无效选项，请重新运行脚本
    pause
    exit /b 1
)

pause
