# Let's Encrypt

**一句话：** 免费、自动化的 SSL/TLS 证书颁发机构，通过 certbot 工具自动申请和续期 HTTPS 证书，有效期 90 天。

**适用场景：**
- 个人网站、小型项目免费启用 HTTPS
- 自动化证书管理，无需手动购买和安装证书
- 配合 Nginx/Apache 自动配置 SSL

**公式（如果有）：**
```bash
# 首次申请
certbot --nginx -d wapayton.cn -d www.wapayton.cn

# 测试续期
certbot renew --dry-run

# 手动续期
certbot renew --nginx
# 证书存放路径
# /etc/letsencrypt/live/wapayton.cn/fullchain.pem
# /etc/letsencrypt/live/wapayton.cn/privkey.pem
```

**什么时候不能用 / 容易踩的坑：**
- 申请需要域名验证（HTTP 或 DNS 挑战），服务器必须能从公网访问
- 每周最多申请 5 次同一域名，超出需等 7 天
- certbot 自动续期依赖 cron/systemd timer，如果服务器关机超过 90 天证书会过期
- 通配符证书需要 DNS 验证（需域名服务商 API Token）
- 证书文件路径在 Nginx 配置中硬编码，续期后无需改

**与哪些概念关联：**
- [[Nginx 反向代理]]
- [[HTTPS]]
- [[SSL TLS]]

**来源：** [[2026-07-04]] · wapayton.cn HTTPS 配置
