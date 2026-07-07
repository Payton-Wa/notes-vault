# Nginx 反向代理

**一句话：** 高性能 HTTP 服务器，通常放在 Node.js 应用前面做反向代理，处理 HTTPS、静态文件、负载均衡、限流。

**适用场景：**
- 为 Node.js 应用提供 HTTPS 支持（SSL 终结）
- 静态文件直接由 Nginx 返回（比 Node.js 快 10x+）
- 多应用共享同一域名（按路径分发到不同 Node 进程）
- 限流、IP 黑白名单、防盗链

**公式（如果有）：**
```nginx
# /etc/nginx/sites-available/wapayton.cn
server {
    listen 443 ssl;
    server_name wapayton.cn www.wapayton.cn;
    ssl_certificate /etc/letsencrypt/live/wapayton.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wapayton.cn/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

**什么时候不能用 / 容易踩的坑：**
- Nginx 反代后 Express 拿到的 `req.ip` 是 `127.0.0.1`，必须 `trust proxy` + 读 `x-forwarded-for`
- `proxy_pass` 末尾有无 `/` 影响 URI 拼接行为
- SSL 证书到期不会自动告警（Let's Encrypt certbot 需配自动续期 cron）
- `client_max_body_size` 默认 1MB，上传大文件需调大

**与哪些概念关联：**
- [[Let's Encrypt]]
- [[Express 中间件]]
- [[PM2]]

**来源：** [[2026-07-04]] · Note Flow 阿里云 ECS 部署
