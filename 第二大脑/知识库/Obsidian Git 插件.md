# Obsidian Git 插件

**一句话：** Obsidian 社区插件，自动将 vault 通过 git 同步到 GitHub/GitLab，支持自动 commit、push、pull，实现多设备笔记同步。

**适用场景：**
- Mac + iPhone + iPad 间的 Obsidian 笔记同步（替代 iCloud Sync 或 Obsidian Sync）
- 笔记版本控制，可回滚到任意历史版本
- 自动化：修改后自动 commit、定时 pull 远程更新

**公式（如果有）：**
```json
// .obsidian/plugins/obsidian-git/data.json
{
  "autoSaveInterval": 0,        // 自动 commit 间隔（分钟），0=关闭
  "autoPullInterval": 5,        // 自动 pull 间隔（分钟），0=关闭
  "autoPullOnBoot": true,       // 打开 Obsidian 时自动 pull
  "pullBeforePush": true,       // push 前先 pull 避免冲突
  "syncMethod": "merge",        // 冲突时 merge（vs rebase）
  "currentBranch": "main",
  "remote": "origin"
}
```

**什么时候不能用 / 容易踩的坑：**
- **iOS 端不支持 SSH**：remote 必须用 HTTPS（`https://github.com/...`），否则报 `unrecognized transport protocol: ssh`
- HTTPS 推送需要 GitHub Personal Access Token 或 credential helper
- 多设备同时编辑同一文件会产生 merge conflict
- `autoPullInterval` 只在 Obsidian 运行时有效，关掉 App 不会后台拉取
- 手机上后台刷新受限，建议打开 `autoPullOnBoot` 确保打开时拿到最新

**与哪些概念关联：**
- [[Git merge conflict & rebase]]
- [[launchd]]
- [[Obsidian]]

**来源：** [[2026-07-06]] · Mac + iOS 多端同步修复
