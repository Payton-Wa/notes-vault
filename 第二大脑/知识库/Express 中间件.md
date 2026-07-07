# Express 中间件

**一句话：** Express.js 中的函数管道，每个请求依次经过各中间件处理（鉴权→解析→日志→路由），通过 `app.use()` 注册，`next()` 传递控制权。

**适用场景：**
- 请求日志记录（如 Note Flow 的访问记录中间件）
- 身份认证 / Session 管理
- 请求体解析（`express.json()`）
- CSRF 防护、频率限制、安全头注入
- CORS 跨域处理

**公式（如果有）：**
```js
// 中间件基本形态
app.use((req, res, next) => {
  // 处理请求...
  console.log(`${req.method} ${req.path}`);
  next(); // 传递给下一个中间件或路由
});

// 错误处理中间件（四个参数）
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```

**什么时候不能用 / 容易踩的坑：**
- **顺序至关重要**：中间件按 `app.use()` 调用顺序执行
- 忘记 `next()` 会导致请求挂起（超时）
- 静态文件中间件（`express.static`）放在频率限制之前，会被计入请求量
- 异步中间件需要 try/catch 或 `.catch(next)`，否则异常会吞掉
- `req.ip` 在 Nginx 代理后取到的是 `127.0.0.1`，需 `app.set('trust proxy', 1)` + 读取 `x-forwarded-for` 头

**与哪些概念关联：**
- [[Node.js]]
- [[Helmet]]
- [[CSRF]]
- [[express-rate-limit]]

**来源：** [[2026-07-04]] · Note Flow server.js 中间件设计
