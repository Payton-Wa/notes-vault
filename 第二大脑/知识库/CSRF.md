# CSRF

**一句话：** 跨站请求伪造攻击，利用用户已登录的身份在用户不知情的情况下发起恶意请求；通过 CSRF Token 校验来防护。

**适用场景：**
- 所有有登录态的 Web 应用都应该做 CSRF 防护
- 表单提交、AJAX 请求等修改数据的操作必须带 Token
- 公开接口（登录/注册）和 GET 请求可以跳过

**公式（如果有）：**
```js
// 服务端生成 Token 存入 Session
app.use('/api', (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// 修改请求必须携带 Token
function csrfProtection(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const token = req.headers['x-csrf-token'];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'CSRF 校验失败' });
  }
  next();
}
```

**什么时候不能用 / 容易踩的坑：**
- Same-Site Cookie 设为 `lax` 已经是第一道防线，但不能替代 CSRF Token
- 前端需要在每个非 GET 请求的 header 中带上 `x-csrf-token`
- Token 泄露（如 XSS 攻击读取了 Token）会使防护失效
- 公开 API（无需登录的）不需要 CSRF 防护

**与哪些概念关联：**
- [[XSS]]
- [[Express 中间件]]
- [[Helmet]]

**来源：** [[2026-07-04]] · Note Flow CSRF 防护实现
