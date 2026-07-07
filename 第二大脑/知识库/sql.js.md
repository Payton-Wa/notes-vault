# sql.js

**一句话：** 在浏览器和 Node.js 中运行 SQLite 数据库的 WebAssembly 实现，无需编译原生模块。

**适用场景：**
- Node.js 项目中需要轻量级嵌入式数据库，不想安装 `better-sqlite3` 原生依赖
- 浏览器端离线 SQLite 数据库（如 Web 应用离线存储）
- sql.js WASM 文件可直接打包，跨平台一致

**公式（如果有）：**
```js
const st = db.prepare("SELECT * FROM users WHERE id = ?");
st.bind([userId]);
while (st.step()) rows.push(st.getAsObject());
st.free();
```

**什么时候不能用 / 容易踩的坑：**
- 数据在内存中，必须手动 `fs.writeFileSync` 持久化到文件（Note Flow 用 1 秒防抖写入）
- `INSERT … ON CONFLICT DO UPDATE` 语法支持，但子查询和复杂 JOIN 比原生 SQLite 慢
- 不支持 `better-sqlite3` 的同步 API，需用包装器模拟 `.get()/.all()/.run()`

**与哪些概念关联：**
- [[SQLite]]
- [[WebAssembly]]
- [[better-sqlite3]]

**来源：** [[2026-07-04]] · Note Flow 数据库层选型
