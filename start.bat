@echo off
echo �������������󹤾����˷���...
echo.

REM ����Ƿ��Ѱ�װNode.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ����: δ�ҵ�Node.js�����Ȱ�װNode.js
    echo ���ص�ַ: https://nodejs.org/
    pause
    exit /b 1
)

REM ����Ƿ��Ѱ�װnpm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ����: δ�ҵ�npm�����Ȱ�װNode.js (����npm)
    echo ���ص�ַ: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js�汾: 
node --version
echo npm�汾: 
npm --version
echo.

REM ����Ƿ����node_modulesĿ¼
if not exist "node_modules" (
    echo ���ڰ�װ������...
    npm install
    if %errorlevel% neq 0 (
        echo ����: ��������װʧ��
        pause
        exit /b 1
    )
    echo ��������װ���
    echo.
)

echo ��������������...
echo ���� http://localhost:3000 �鿴����״̬
echo �� Ctrl+C ֹͣ����
echo.

node server.js

pause