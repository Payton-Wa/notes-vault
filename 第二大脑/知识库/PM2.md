# PM2

**一句话：** Node.js 应用的进程管理器，提供进程守护、自动重启、日志管理、负载均衡、开机自启等功能。

**适用场景：**
- 生产环境部署 Node.js 应用，崩溃后自动重启
- 单机多实例负载均衡（cluster mode）
- 查看实时日志：`pm2 logs app-name`
- 内存/CPU 监控告警、自动重启

**公式（如果有）：**
```bash
pm2 start server.js --name note-flow        # 启动
pm2 restart note-flow                       # 重启
pm2 logs note-flow --lines 50               # 查看最近50行日志
pm2 logs note-flow --err --lines 20         # 只看错误日志
pm2 status                                  # 查看所有进程状态
pm2 save                                    # 保存当前进程列表（重启后自动恢复）
pm2 startup                                 # 设置开机自启

# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'note-flow',
    script: './server.js',
    instances: 1,
    autorestart: true,
    max_memory_restart: '500M',
  }],
};
```

**什么时候不能用 / 容易踩的坑：**
- `pm2 restart` 会短暂中断服务（用 `pm2 reload` 实现零停机重启）
- 日志默认存放在 `~/.pm2/logs/`，需定期清理或配置 `pm2-logrotate`
- `max_memory_restart: '500M'` 设太低会导致频繁重启
- Docker 环境中不推荐 PM2（用 Docker 自身的 restart policy）
- `pm2 save` 后升级 Node.js 版本需重新 `pm2 update`

**与哪些概念关联：**
- [[Node.js]]
- [[systemd]]
- [[Docker]]

**来源：** [[2026-07-04]] · Note Flow 服务器部署
