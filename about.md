# 关于

**PIKAQIANG'DOC** 是一个基于 [docsify](https://docsify.js.org/) **v5** 的纯静态文档站。

- 无需构建：直接编辑 Markdown
- 无需 Node：本地预览只用 Python 自带的 `http.server`
- 全离线：所有 JS / CSS / 字体都在 `vendor/`

## 本地预览

```bash
./serve.sh
# 打开 http://localhost:3000
```

## 部署

把整个目录（含 `vendor/`）上传到任意静态托管即可：GitHub Pages、Cloudflare Pages、Nginx、Caddy 等。

> [!TIP]
> 部署到 GitHub Pages 时，`.nojekyll` 已在目录中，用于避免 `_sidebar.md` 等以下划线开头的文件被忽略。
