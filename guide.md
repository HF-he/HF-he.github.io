# 使用指南

## 目录结构

```
docfile/
├── index.html        # 本地离线入口（所有资源引用 vendor/）
├── index_online.html # 在线单文件入口（所有库引用 CDN，放大插件内联）
├── README.md         # 首页
├── _coverpage.md     # 封面
├── _navbar.md        # 顶部导航
├── _sidebar.md       # 左侧目录
├── _404.md           # 404 页面
├── serve.sh          # 本地预览脚本
├── .nojekyll         # 供 GitHub Pages 使用
└── vendor/           # 离线资源（docsify v5 / 插件 / KaTeX 字体 / Prism 语言）
```

两个入口内容一致，只是资源来源不同：

- `index.html`：库与主题引用本地 `vendor/`，**可完全离线**（字体除外，见下）。
- `index_online.html`：库与主题全部走 CDN，放大插件内联，适合直接托管单页。

> [!NOTE]
> 站点字体通过 `@import url("https://fontsapi.zeoseven.com/521/main/result.css")` 引入
> 并将 `body` 设为 `"JetBrains Maple Mono"`，这一步需要联网。


## 新增一篇文档

1. 在根目录新建 `xxx.md`；
2. 在 `_sidebar.md` 里加一行 `- [标题](xxx.md)`。

## 开关插件与切换主题

打开 `index.html`，用注释即可启停：

```html
<!-- 关闭代码复制插件：在整行前加注释 -->
<!-- <script src="vendor/plugins/docsify-copy-code.min.js"></script> -->
```

主题说明（详见 `index.html` 顶部注释）：

- 默认：`core.min.css` + `addons/core-dark.min.css`（带 `media="(prefers-color-scheme: dark)"`，**深浅色跟随系统**）。
- 想改用 v4 经典 Vue 外观：注释掉 `core-dark` 那一行，取消注释 `addons/vue.min.css`。

> [!NOTE]
> 深浅色由操作系统/浏览器偏好决定，没有手动按钮；如需手动切换需自行加按钮。
