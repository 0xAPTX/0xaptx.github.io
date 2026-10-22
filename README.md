# 知新资讯站与研究报告

打开 <https://0xaptx.github.io/> 会自动进入 [知新首页](https://0xaptx.github.io/ai-daily/#/)。

本仓库维护根域名入口与 `public/reports/` 研究报告。资讯站的代码、数据采集和定时发布由 [0xAPTX/ai-daily](https://github.com/0xAPTX/ai-daily) 维护，首页内容随资讯站更新。

入口使用页面跳转，并提供手动进入链接。需要更换目标首页时，统一修改 `public/index.html` 中的跳转地址及备用链接；推送到 `main` 后由 GitHub Actions 自动部署。

## 研究报告

| 报告 | 发布日期 | 阅读 |
|---|---|---|
| Claude iOS 1.261019.20 逆向与地区风控分析 | 2026-10-22 | [网页与 TOP20](https://0xaptx.github.io/reports/claude-ios-1.261019.20/) |

[报告索引](https://0xaptx.github.io/reports/)。报告提供 Word、Markdown 下载与证据摘要 JSON。TOP20 区分官方确认、包内静态线索与服务端假设；调查优先级不代表封号概率。

Pages 发布方式为 GitHub Actions，发布目录为 `public/`。部署完成后，工作流会按字节核对根域名入口、报告页面和下载文件，防止旧缓存被误认为已经更新。
