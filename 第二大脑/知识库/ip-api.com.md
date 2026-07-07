# ip-api.com

**一句话：** 免费 IP 地理位置查询 API，根据 IP 地址返回国家、省份、城市、经纬度、ISP 等信息，不需要 API Key。

**适用场景：**
- 网站访客地理位置分析（如 Note Flow 的访客记录系统）
- 根据用户 IP 自动推荐语言/时区
- 安全审计：识别来自异常地区的访问
- 爬虫/代理检测（返回 `proxy`、`hosting` 字段）

**公式（如果有）：**
```js
// 免费版 HTTP，付费版支持 HTTPS + 批量查询
// fields 参数按需选择字段，减少响应体积
const resp = await fetch(
  `http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,country,regionName,city,district,lat,lon,isp,org,proxy,hosting`
);
const data = await resp.json();
// data.country → "中国"
// data.regionName → "北京"
// data.city → "北京市"
// data.lat / data.lon → 经纬度
// data.proxy → 是否为代理/VPN
// data.hosting → 是否为托管机房 IP
```

**什么时候不能用 / 容易踩的坑：**
- **免费版限制**：45 req/min，仅 HTTP（非 HTTPS），无批量查询
- 免费版不可用于商业产品（需购买 Commercial 许可）
- IP 定位精度有限：通常到城市级，无法精确到街道（需配合 Nominatim）
- 返回中文需 `?lang=zh-CN`，默认英文
- 国内 IP 可能只返回到省份，国外 IP 精度更高
- 内网 IP（127.0.0.1、192.168.x.x 等）直接跳过，不消耗配额

**与哪些概念关联：**
- [[Nominatim]] — 与 ip-api 串联实现街道级精度
- [[IP 地址]]
- [[GeoIP]]

**来源：** [[2026-07-05]] · 网站访客 IP 定位
