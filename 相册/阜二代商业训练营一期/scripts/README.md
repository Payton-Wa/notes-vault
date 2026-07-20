# 拍立享每日同步

脚本读取美国模块照片直播，只把新增照片放入候选区。候选需经过视觉筛选后才会写入相册，避免重复、模糊或缺少叙事价值的照片自动上线。

```bash
node scripts/sync-pailixiang.mjs bootstrap
node scripts/sync-pailixiang.mjs discover
node scripts/sync-pailixiang.mjs import --selection /tmp/forcome-selection.json
node scripts/sync-pailixiang.mjs dismiss --all
node scripts/sync-pailixiang.mjs status
```

`discover` 将候选缩略图和 `manifest.json` 写入 `~/.cache/forcome-pailixiang/`。`import` 接受的选择文件格式：

```json
[
  {
    "id": "照片 ID",
    "captionZh": "中文文案",
    "captionEn": "English caption",
    "altZh": "中文图片描述",
    "altEn": "English image description"
  }
]
```
