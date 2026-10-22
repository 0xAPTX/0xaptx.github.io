# 知新资讯站 · 根域名入口

打开 <https://0xaptx.github.io/> 会自动进入 [知新首页](https://0xaptx.github.io/ai-daily/#/)。

本仓库只维护根域名入口。资讯站的代码、数据采集和定时发布由 [0xAPTX/ai-daily](https://github.com/0xAPTX/ai-daily) 维护，首页内容随资讯站更新。

入口使用页面跳转，并提供手动进入链接。需要更换目标首页时，统一修改 `public/index.html` 中的跳转地址及备用链接；推送到 `main` 后由 GitHub Actions 自动部署。

Pages 发布方式为 GitHub Actions，发布目录为 `public/`。部署完成后，工作流会核对根域名实际返回的入口文件，防止默认页面或旧缓存被误认为已经更新。
