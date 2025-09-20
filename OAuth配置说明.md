# OAuth登录配置说明

## 概述
为了实现真实的社交媒体登录功能，您需要在各个平台注册应用并获取相应的客户端ID。

## 1. Microsoft Azure AD 配置

### 步骤：
1. 访问 [Azure Portal](https://portal.azure.com)
2. 搜索并选择 "Azure Active Directory"
3. 在左侧菜单中选择 "应用注册"
4. 点击 "新注册"
5. 填写应用信息：
   - 名称：阮铭泽工具箱
   - 支持的账户类型：任何组织目录(任何 Azure AD 目录 - 多租户)中的账户和个人 Microsoft 账户
   - 重定向 URI：选择"Web"，输入您的网站URL
6. 注册完成后，复制 "应用程序(客户端) ID"

### 配置代码：
```javascript
microsoft: {
    clientId: '您的_MICROSOFT_CLIENT_ID', // 替换为实际的客户端ID
    redirectUri: window.location.origin + window.location.pathname,
    scope: 'openid profile email',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
}
```

## 2. Google OAuth 配置

### 步骤：
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 转到 "凭据" 页面
5. 点击 "创建凭据" > "OAuth 客户端 ID"
6. 选择 "Web应用程序"
7. 添加授权的重定向URI：您的网站URL
8. 创建完成后，复制客户端ID

### 配置代码：
```javascript
google: {
    clientId: '您的_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // 替换为实际的客户端ID
    redirectUri: window.location.origin + window.location.pathname,
    scope: 'openid profile email',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
}
```

## 3. GitHub OAuth 配置

### 步骤：
1. 登录 GitHub
2. 转到 Settings > Developer settings > OAuth Apps
3. 点击 "New OAuth App"
4. 填写应用信息：
   - Application name：阮铭泽工具箱
   - Homepage URL：您的网站URL
   - Authorization callback URL：您的网站URL
5. 创建完成后，复制 Client ID

### 配置代码：
```javascript
github: {
    clientId: '您的_GITHUB_CLIENT_ID', // 替换为实际的客户端ID
    redirectUri: window.location.origin + window.location.pathname,
    scope: 'user:email',
    authUrl: 'https://github.com/login/oauth/authorize'
}
```

## 4. 后端API配置（推荐）

为了安全起见，建议创建后端API来处理OAuth回调：

### 创建 `/api/oauth/callback` 端点：

```javascript
app.post('/api/oauth/callback', async (req, res) => {
    const { provider, code, redirectUri } = req.body;
    
    try {
        // 使用授权码交换访问令牌
        const tokenResponse = await exchangeCodeForToken(provider, code, redirectUri);
        
        // 使用访问令牌获取用户信息
        const userInfo = await getUserInfo(provider, tokenResponse.access_token);
        
        res.json({
            success: true,
            user: {
                name: userInfo.name,
                email: userInfo.email,
                avatar: userInfo.picture || userInfo.avatar_url,
                provider: provider
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
```

## 5. 安全注意事项

1. **永远不要在前端代码中暴露客户端密钥（Client Secret）**
2. **使用HTTPS**：OAuth要求使用安全连接
3. **验证state参数**：防止CSRF攻击
4. **实现适当的错误处理**
5. **定期更新访问令牌**

## 6. 测试步骤

1. 更新代码中的OAUTH_CONFIG
2. 部署到HTTPS域名
3. 在各平台的应用设置中配置正确的重定向URI
4. 测试登录流程

## 故障排除

### 常见错误：
- **redirect_uri_mismatch**：检查重定向URI是否完全匹配
- **invalid_client**：检查客户端ID是否正确
- **access_denied**：用户拒绝授权或配置错误

### 调试技巧：
1. 查看浏览器开发者工具的网络标签页
2. 检查控制台错误信息
3. 验证OAuth配置参数

---

**注意**：当前代码包含fallback机制，如果后端不可用，会使用模拟数据进行演示。