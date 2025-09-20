# 阮铭泽工具箱

这是一个功能丰富的在线工具箱，包含天气查询、计算器、编程工具、系统知识等实用功能。

## 功能特性

- 天气预报查询
- 日历功能
- 科学计算器
- 编程工具和资源
- 系统知识查询
- 实用网站推荐
- 主题切换（浅色/深色模式）
- 多语言支持（中文/英文）
- 用户账户系统

## 启动服务

### 方法一：使用启动脚本（推荐）

双击运行 `start.bat` 文件，它会自动检查环境并启动服务。

### 方法二：启动后端服务

双击运行 `start-server.bat` 文件，它会启动后端服务。

### 方法三：同时运行前后端服务

1. 启动后端服务：
   ```
   cd Ruanmingze-toolbox-server
   node server.js
   ```
2. 在新的命令行窗口中启动前端服务：
   ```
   python -m http.server 8000
   ```
3. 访问前端页面：http://localhost:8000
4. 后端API服务：http://localhost:3000

### 方法四：手动启动

1. 确保已安装 Node.js (推荐版本 14+)
2. 打开命令行窗口，进入项目目录
3. 安装依赖包：
   ```
   npm install
   ```
4. 启动服务器：
   ```
   npm start
   ```
   或
   ```
   node server.js
   ```

### 方法五：在Ruanmingze-toolbox-server目录中启动

1. 进入 `Ruanmingze-toolbox-server` 目录
2. 运行：
   ```
   node server.js
   ```

## 访问应用

服务器启动后，可以通过以下地址访问：

- 主页: http://localhost:3000
- 登录页面: http://localhost:3000/login.html
- 注册页面: http://localhost:3000/register.html

## API接口

后端提供以下API接口：

- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录
- `GET /api/user/:username` - 获取用户信息

## 技术栈

- 前端: HTML5, CSS3, JavaScript, Font Awesome图标库
- 后端: Node.js, Express.js
- 数据存储: JSON文件（users.json）

## 开发说明

1. 前端页面使用localStorage存储用户数据（用于演示）
2. 后端服务提供真实的用户注册和登录功能
3. 所有数据存储在本地的users.json文件中

## 注意事项

1. 这是一个本地应用，所有数据存储在本地
2. 密码以明文形式存储，仅用于演示目的，实际项目中应使用加密存储
3. 建议在本地网络环境中使用，不建议在公网环境中部署