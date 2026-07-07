# launchd

**一句话：** macOS 的初始化系统和服务管理器，用于创建定时任务、守护进程和开机自启服务，相当于 Linux 的 systemd + cron。

**适用场景：**
- 创建定时运行的后台脚本（替代 Linux cron）
- 设置开机自启服务（替代 systemd service）
- 管理 macOS 用户级和系统级守护进程
- 例子：每 5 分钟 git pull、每天早上生成日志

**公式（如果有）：**
```xml
<!-- ~/Library/LaunchAgents/com.example.job.plist -->
<dict>
    <key>Label</key><string>com.example.job</string>
    <key>ProgramArguments</key>
    <array><string>/path/to/script.sh</string></array>
    <key>StartInterval</key><integer>300</integer>  <!-- 每5分钟 -->
    <key>RunAtLoad</key><true/>
</dict>
```
```bash
launchctl load ~/Library/LaunchAgents/com.example.job.plist
launchctl bootstrap gui/$uid ~/Library/LaunchAgents/com.example.job.plist
launchctl list | grep com.example
```

**什么时候不能用 / 容易踩的坑：**
- **沙箱限制**：后台进程无法访问 `~/Documents`、`~/Desktop`，需在系统设置→隐私→完全磁盘访问权限中授权 `/bin/bash`
- exit code `126`：Permission denied；`128`：SSH 密钥无法加载
- `WorkingDirectory` 不要设为 `~/Documents`，用 `/tmp` 再在脚本里 cd
- `StartCalendarInterval` 用 24 小时制，`Hour` 范围 0-23
- 卸载用 `launchctl unload` 而非直接删 plist

**与哪些概念关联：**
- [[cron]]
- [[systemd]]
- [[macOS 系统权限]]

**来源：** [[2026-07-04]] · Mac auto-pull 定时任务搭建
