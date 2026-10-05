# 插件清单

本站 `index.html` 中启用的全部插件及其离线文件位置。

## 官方（docsify v5）

| 功能 | 文件 | 说明 |
| --- | --- | --- |
| 全文搜索 | `vendor/docsify/plugins/search.min.js` | v5 基于 IndexedDB |
| 图片缩放 | `vendor/docsify/plugins/zoom-image.min.js` | 仅作用于 `img`，内含 medium-zoom |
| 提示框 callout | 内置 | `> [!NOTE]` / `[!TIP]` / `[!IMPORTANT]` / `[!WARNING]` / `[!CAUTION]` |
| 侧边栏折叠 | 内置 | `collapsibleSidebarGroups` + chevron 类 |
| 404 页 | 内置 | `notFoundPage: true` + `_404.md` |

## 第三方（最新版）

| 功能 | 文件 | 版本 |
| --- | --- | --- |
| 代码复制 | `vendor/plugins/docsify-copy-code.min.js` | 3.0.2 |
| 分页 | `vendor/plugins/docsify-pagination.min.js` | 2.10.1 |
| 目录 TOC | `vendor/plugins/docsify-toc.js` + `toc.css` | 1.1.0 |
| 标签页 | `vendor/plugins/docsify-tabs.min.js` | 1.6.3 |
| 数学公式 | `vendor/plugins/docsify-katex-ex.min.js` + `vendor/katex/` | 3.0.1 / katex 0.19.0 |
| 语法高亮语言包 | `vendor/prism/prism-langs.min.js` | prismjs 1.29.0 |
| 图表/公式点击放大 | `vendor/plugins/zoom-element.js` | 自包含，无依赖 |

## 语法高亮

`vendor/prism/prism-langs.min.js` 是把 prismjs@1.29.0 的语言组件按依赖顺序拼接成的单文件，包含：

```
clike markup css javascript typescript jsx tsx json json5 python java c cpp
csharp go rust bash yaml toml ini properties sql php ruby markdown diff docker
nginx makefile powershell http kotlin swift dart lua scss less graphql git regex
js-extras shell-session uri
```

需要增删语言时，用相同方式重新拼接即可（组件地址形如
`https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-<语言>.min.js`，
注意依赖顺序，例如 `jsx` 需在 `markup`+`javascript` 之后）。

## 图表 / 公式放大

官方 `zoom-image` 只处理 `<img>`，而 medium-zoom 面向图片，对 `<svg>` 和公式元素无效，
因此 `vendor/plugins/zoom-element.js` 用自包含的浮层实现：

- 采用**克隆**方式并保留元素 id：Mermaid 的配色写在 SVG 内嵌的 `#<id> ...` 作用域
  `<style>` 里，保留 id 即自动带上整套样式，放大后配色不变；
- 底色/文字色跟随主题（`var(--color-bg)` / `var(--color-text)`），深浅色都可读；
- 支持**鼠标滚轮缩放、触屏双指缩放、拖动平移、双击复位**；
- 点击空白处或按 `Esc` 关闭；
- 默认作用于 `.markdown-section .mermaid svg` 与 `.markdown-section .katex-display`。

## 版本

- docsify **5.0.0**
- mermaid **9.3.0**（官网推荐上限，同步渲染）
- katex **0.19.0**
- prismjs **1.29.0**
- 其余见上表。
