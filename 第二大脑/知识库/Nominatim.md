# Nominatim (OpenStreetMap)

**一句话：** 基于 OpenStreetMap 数据的免费反向地理编码服务，输入经纬度返回精确到街道门牌号的地址。

**适用场景：**
- 将 GPS 坐标转换为人类可读的地址（反向地理编码）
- 将地址文本转换为经纬度（正向地理编码）
- 不需要 API Key 的免费地理编码（适合低流量项目）

**公式（如果有）：**
```js
// 反向地理编码：经纬度 → 地址
const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&accept-language=zh&addressdetails=1`;
const resp = await fetch(url, {
  headers: { 'User-Agent': 'YourApp/1.0 (your@email.com)' }
});
const data = await resp.json();
// data.address.road → 道路名
// data.address.house_number → 门牌号
// data.address.suburb → 街区
```

**什么时候不能用 / 容易踩的坑：**
- **速率限制严格**：1 req/sec，超速会被封 IP（Note Flow 用 1100ms 间隔）
- **必须设置 User-Agent header**，否则直接返回 403
- 免费版不适合高并发生产环境（如需大规模用 Google Maps API / 高德 API）
- `zoom=18` 返回建筑级精度，`zoom=10` 只到城市级
- 与 ip-api 串联：先用 ip-api 获取 IP 经纬度，再用 Nominatim 反查地址

**与哪些概念关联：**
- [[ip-api.com]]
- [[OpenStreetMap]]
- [[反向地理编码]]
- [[高德地图 API]]

**来源：** [[2026-07-05]] · IP 街道级定位实现
