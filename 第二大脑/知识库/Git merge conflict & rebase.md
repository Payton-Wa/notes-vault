# Git merge conflict & rebase

**一句话：** Git 版本控制中的两个核心操作：merge 合并分支产生冲突需要手动解决；rebase 将提交变基到目标分支之上，提交历史更线性但需要处理冲突。

**适用场景：**
- 多人协作或同一文件在多端编辑时产生 merge conflict
- `git pull --rebase`：拉取远程更新并把本地提交重放到远程历史之上（推荐用于个人项目）
- `git merge`：合并分支，保留完整的分支历史

**公式（如果有）：**
```bash
# 查看冲突状态
git status

# 接受远程版本，放弃本地修改
git checkout --theirs path/to/file
git add path/to/file
git commit

# 接受本地版本，放弃远程修改
git checkout --ours path/to/file

# 放弃 rebase，回到 rebase 之前的状态
git rebase --abort

# 解决冲突后继续 rebase
git add resolved_file
git rebase --continue

# 拉取时的策略选择
git pull --rebase    # rebase 方式（推荐）
git pull --merge     # merge 方式（默认）
```

**什么时候不能用 / 容易踩的坑：**
- `git rebase --abort` 只能回到本次 rebase 前，不能撤销已完成的 rebase
- 多人协作的主分支**不要** rebase（会改写历史导致队友冲突），用 merge
- `git checkout --theirs` 会完全覆盖本地文件，丢失所有本地修改
- iCloud vault 很容易因多设备自动 commit 产生分叉（diverged branches）
- 解决方案：用 `git reset --hard origin/main` 强制同步远程（会丢失本地未推送的提交）

**与哪些概念关联：**
- [[Obsidian Git 插件]]
- [[Git]]

**来源：** [[2026-07-06]] · iCloud vault 冲突解决
