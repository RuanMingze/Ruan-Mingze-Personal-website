const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static('.'));

// 用户数据文件路径
const usersFilePath = path.join(__dirname, 'users.json');

// 读取用户数据
async function readUsers() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，创建一个空的用户对象
    return {};
  }
}

// 写入用户数据
async function writeUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

// 注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { name, username, password, email, phone, avatar } = req.body;
    
    // 参数验证
    if (!name || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '姓名、用户名和密码是必填项' 
      });
    }
    
    // 读取现有用户
    const users = await readUsers();
    
    // 检查用户名是否已存在
    if (users[username]) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名已存在' 
      });
    }
    
    // 检查手机号是否已存在
    if (phone) {
      for (const [uname, userData] of Object.entries(users)) {
        if (userData.phone === phone) {
          return res.status(400).json({ 
            success: false, 
            message: '手机号已存在' 
          });
        }
      }
    }
    
    // 检查邮箱是否已存在
    if (email) {
      for (const [uname, userData] of Object.entries(users)) {
        if (userData.email === email) {
          return res.status(400).json({ 
            success: false, 
            message: '邮箱已存在' 
          });
        }
      }
    }
    
    // 创建新用户
    const newUser = {
      name,
      username,
      password, // 注意：在实际应用中应该加密密码
      email: email || '',
      phone: phone || '',
      avatar: avatar || '', // 保存头像信息
      theme: 'light', // 默认主题
      language: 'zh', // 默认语言
      selectedCity: 'beijing', // 默认城市
      createdAt: new Date().toISOString()
    };
    
    // 保存用户
    users[username] = newUser;
    await writeUsers(users);
    
    res.json({ 
      success: true, 
      message: '注册成功' 
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 参数验证
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名/手机号/邮箱和密码是必填项' 
      });
    }
    
    // 读取用户数据
    const users = await readUsers();
    
    // 查找用户（支持通过用户名、手机号或邮箱登录）
    let user = null;
    let foundUsername = null;
    
    for (const [uname, userData] of Object.entries(users)) {
      if (uname === username || userData.phone === username || userData.email === username) {
        user = userData;
        foundUsername = uname;
        break;
      }
    }
    
    // 检查用户是否存在且密码正确
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名/手机号/邮箱或密码错误' 
      });
    }
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;
    
    res.json({ 
      success: true, 
      message: '登录成功',
      user: userInfo
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 获取用户信息接口
app.get('/api/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    // 读取用户数据
    const users = await readUsers();
    
    // 检查用户是否存在
    const user = users[username];
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: '用户不存在' 
      });
    }
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;
    
    res.json({ 
      success: true, 
      user: userInfo
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 更新用户信息接口
app.put('/api/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const updates = req.body;
    
    // 读取用户数据
    const users = await readUsers();
    
    // 检查用户是否存在
    const user = users[username];
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: '用户不存在' 
      });
    }
    
    // 更新用户信息
    Object.keys(updates).forEach(key => {
      // 不允许更新用户名和密码
      if (key !== 'username' && key !== 'password') {
        user[key] = updates[key];
      }
    });
    
    // 保存更新后的用户数据
    await writeUsers(users);
    
    // 返回更新后的用户信息（不包含密码）
    const { password: _, ...userInfo } = user;
    
    res.json({ 
      success: true, 
      message: '用户信息更新成功',
      user: userInfo
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误' 
    });
  }
});

// 根路径返回欢迎信息
app.get('/', (req, res) => {
  res.send(`
    <h1>阮铭泽工具箱后端服务</h1>
    <p>后端服务正在运行</p>
    <p>API接口:</p>
    <ul>
      <li>POST /api/register - 用户注册</li>
      <li>POST /api/login - 用户登录</li>
      <li>GET /api/user/:username - 获取用户信息</li>
      <li>PUT /api/user/:username - 更新用户信息</li>
    </ul>
  `);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 查看服务状态`);
});