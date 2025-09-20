@echo off
echo 正在启动阮铭泽工具箱后端服务...
echo.

REM 检查是否已安装Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否已安装npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到npm，请先安装Node.js (包含npm)
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js版本: 
node --version
echo npm版本: 
npm --version
echo.

REM 检查是否存在node_modules目录
if not exist "node_modules" (
    echo 正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖包安装失败
        pause
        exit /b 1
    )
    echo 依赖包安装完成
    echo.
)

echo 正在启动服务器...
echo 访问 http://localhost:3000 查看服务状态
echo 按 Ctrl+C 停止服务
echo.

node server.js

pause