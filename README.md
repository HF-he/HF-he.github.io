# PIKAQIANG'DOC

> 基于 **docsify v5** 的纯静态文档站 —— 无构建、零 Node/npm，所有资源离线在 `vendor/`。

文档由浏览器实时渲染 Markdown，主题与插件均按 [docsify 官网](https://docsify.js.org/) 推荐方式配置。

## 快速预览

```bash
./serve.sh          # 默认 http://localhost:3000
./serve.sh 8080     # 指定端口
```

> [!TIP]
> 只用 `python3 -m http.server`，没有任何 Node 相关依赖。

## v5 内置能力（无需插件）

> [!NOTE]
> 这类提示框（NOTE / TIP / IMPORTANT / WARNING / CAUTION）是 **docsify v5 原生 callout**，直接写 `> [!NOTE]` 即可。

> [!IMPORTANT]
> 侧边栏多级折叠也是 v5 内置（`collapsibleSidebarGroups`），见左侧「使用指南」。

> [!WARNING]
> 这是一个 WARNING 警告框。

> [!CAUTION]
> 这是一个 CAUTION 危险框。

## 代码复制

```python
def hello(name: str) -> str:
    return f"Hello, {name}!"

print(hello("PIKAQIANG"))
```

## 标签页

<!-- tabs:start -->

#### **Python**

```python
print("Hello from Python")
```

#### **JavaScript**

```javascript
console.log("Hello from JavaScript");
```

<!-- tabs:end -->

## Mermaid 图表（点击可放大）

```mermaid
graph LR
    A[Markdown] --> B(docsify v5)
    B --> C{浏览器渲染}
    C -->|是| D[静态文档页]
```
```mermaid
flowchart TD
    REQ(["用户请求进入"]) --> GW["接入网关"]

    subgraph GATE["接入层"]
        direction TB
        GW --> CDN{"CDN 缓存命中?"}
        CDN -->|"命中"| HIT["直接返回缓存"]
        CDN -->|"未命中"| SSR["交给构建产物 / SSR"]
    end

    subgraph BUILD["构建流水线"]
        direction TB
        CI["npm ci 安装依赖"] --> ASTRO["Astro 构建"]
        ASTRO --> OG["Satori 生成社交卡片"]
        ASTRO --> PF["Pagefind 生成搜索索引"]
        ASTRO --> SM["生成 sitemap / RSS"]
        OG --> DIST["产出 dist/"]
        PF --> DIST
        SM --> DIST
    end

    subgraph THEME["主题系统"]
        direction TB
        CFG["读取 site.config.ts"] --> MODE{"主题模式?"}
        MODE -->|"single"| S1["单一配色"]
        MODE -->|"light-dark-auto"| S2["浅色 / 深色 / 跟随系统"]
        MODE -->|"select"| S3["读者自选配色"]
        S1 --> VAR["注入 CSS 变量"]
        S2 --> VAR
        S3 --> VAR
        VAR --> MM["mermaid 跟随明暗重渲染"]
    end

    subgraph CONTENT["内容管线"]
        direction TB
        RM["remark 插件"] --> RH["rehype 插件"]
        RH --> EC["Expressive Code 代码高亮"]
        RH --> KTX["KaTeX 数学公式"]
        RH --> ADM["Admonition 提示块"]
        RH --> MRM["astro-mermaid 图表"]
        RH --> TOC["目录 / 锚点"]
    end

    subgraph SEARCH["搜索与发现"]
        direction LR
        Q["关键词"] --> IDX["Pagefind 索引"]
        IDX --> RES["结果列表"]
        TAGN["标签云"] --> RES
        RSSF["RSS 订阅"] --> RES
    end

    subgraph DEPLOY["部署目标"]
        direction TB
        GHP["GitHub Pages"] --> LIVE["线上站点"]
        CFP["Cloudflare Pages"] --> LIVE
    end

    SSR --> BUILD
    BUILD --> THEME
    THEME --> CONTENT
    DIST --> DEPLOY
    DEPLOY --> LIVE
    CONTENT --> SEARCH
    SEARCH --> DONE(["完成"])
    LIVE --> DONE
    HIT --> DONE

    classDef entry fill:#6366f1,stroke:#4338ca,color:#fff,stroke-width:2px;
    classDef decision fill:#f59e0b,stroke:#b45309,color:#111,stroke-width:2px;
    classDef build fill:#0ea5e9,stroke:#0369a1,color:#fff;
    classDef theme fill:#a855f7,stroke:#7e22ce,color:#fff;
    classDef content fill:#22c55e,stroke:#15803d,color:#fff;
    classDef deploy fill:#ef4444,stroke:#b91c1c,color:#fff;
    classDef done fill:#111827,stroke:#374151,color:#fff,stroke-width:2px;

    class REQ,HIT entry;
    class CDN,MODE decision;
    class CI,ASTRO,OG,PF,SM,DIST build;
    class CFG,S1,S2,S3,VAR,MM theme;
    class RM,RH,EC,KTX,ADM,MRM,TOC content;
    class GHP,CFP,LIVE deploy;
    class DONE done;
```

## 数学公式（点击可放大）

行内公式：质能方程 $E = mc^2$。

块级公式（可点击放大）：

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## 下一步

- 修改本文件更新首页；
- 在 `_sidebar.md` 增加目录条目；
- 在 `index.html` 中注释 / 取消注释来开关插件与主题；
- 更多说明见 [使用指南](guide.md) 和 [插件清单](plugins.md)。
