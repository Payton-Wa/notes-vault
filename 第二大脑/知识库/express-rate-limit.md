# express-rate-limit

**一句话：** Express 中间件，按 IP 地址限制 API 请求频率，防止恶意刷接口和 DDoS 攻击。

**适用场景：**
- 防止暴力破解登录接口
- 限制 API 调用频率保护后端资源
- 防爬虫、防恶意扫描

**公式（如果有）：**
```js
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1分钟窗口
  max: 100,             // 最多100次请求
  standardHeaders: true,
  message: { error: '请求过于频繁，请稍后再试' },
});
app.use('/api', apiLimiter); // 只对 /api 路径限流
```

**什么时候不能用 / 容易踩的坑：**
- Nginx 反代后所有 IP 都是 `127.0.0.1`，需 `app.set('trust proxy', 1)` 才能读到真实 IP
- `windowMs` 过短 + `max` 过低会误伤正常用户（Note Flow 设 100/min 较宽松）
- 内存存储重启后计数清零；生产环境应换 Redis 存储
- 不要全局限制所有路由，静态资源和公开页面应跳过

**与哪些概念关联：**
- [[Express 中间件]]
- [[Nginx 反向代理]]
- [[DDoS]]

**来源：** [[2026-07-04]] · Note Flow API 限流配置
