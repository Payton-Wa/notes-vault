# Helmet

**一句话：** Express.js 的安全中间件集合，通过设置 HTTP 响应头来防护常见 Web 攻击（XSS、点击劫持、MIME 嗅探等）。

**适用场景：**
- 任何 Express 生产应用的基础安全加固（应默认启用）
- 配置 Content-Security-Policy（CSP）限制脚本/样式来源
- 防止浏览器 MIME 类型嗅探、DNS 预取泄露
- 隐藏 `X-Powered-By: Express` 响应头

**公式（如果有）：**
```js
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],  // 允许内联脚本
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
}));
```

**什么时候不能用 / 容易踩的坑：**
- CSP 设太严格会导致第三方 CDN 资源（Google Fonts、CDN 图片）加载失败
- `"'unsafe-inline'"` 降低了 XSS 防护强度，但纯 HTML 应用往往必须开
- Nginx 层如果也设了安全头，和 Helmet 会重复（不影响功能但冗余）
- 开发环境可能因为 `HTTPS` 相关头（HSTS）导致 `localhost` 无法访问

**与哪些概念关联：**
- [[Express 中间件]]
- [[CSP (Content Security Policy)]]
- [[XSS]]

**来源：** [[2026-07-04]] · Note Flow server.js 安全配置
