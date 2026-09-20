<p align="center">
  <img src="assets/jzs-one-piece-banner.webp" alt="Jzs-One-Piece" width="100%" />
</p>

# Jzs-One-Piece

> Building my own map of knowledge, one piece at a time.

**Jzs-One-Piece** 是我的个人知识库。它用于长期沉淀技术实践、架构设计、问题复盘、AI/Agent 实验以及其他值得持续积累的知识。

这个仓库的核心目标不是写博客，而是构建一个可长期演进的 **Personal Knowledge Base / Knowledge OS**：

- 内容以 Markdown 为唯一事实来源（Single Source of Truth）
- Git 负责版本管理与知识演进
- 后续可由 VitePress 构建为独立知识网站
- 后续可接入全文搜索、Embedding、RAG、MCP / Agent
- AI 可以协助整理、补充、审阅知识，但知识结构保持稳定、可迁移

## Knowledge Map

| 领域 | 目录 | 内容 |
| --- | --- | --- |
| C++ | `docs/cpp/` | 语言、编译器、CMake、性能、工程实践 |
| Qt | `docs/qt/` | Widgets、Model/View、插件化、多媒体、跨平台 |
| Backend | `docs/backend/` | Java、Spring、微服务、中间件、数据库 |
| DevOps | `docs/devops/` | Linux、Docker、K3s、Jenkins、CI/CD |
| AI | `docs/ai/` | LLM、Agent、RAG、Coding Agent、AI 工作流 |
| Architecture | `docs/architecture/` | 系统架构、客户端架构、服务端架构、设计决策 |
| Projects | `docs/projects/` | 具体项目经验、方案、复盘 |
| Notes | `docs/notes/` | 尚未成熟但值得保留的思考与临时知识 |

## Repository Layout

```text
Jzs-One-Piece/
├─ docs/                    # 知识正文
│  ├─ cpp/
│  ├─ qt/
│  ├─ backend/
│  ├─ devops/
│  ├─ ai/
│  ├─ architecture/
│  ├─ projects/
│  └─ notes/
├─ assets/                  # 图片、图表与附件
├─ templates/               # 知识文档模板
├─ AGENTS.md                # AI / Coding Agent 协作规范
├─ CONTRIBUTING.md          # 内容贡献规范
└─ README.md
```

## Writing Principles

1. **按领域组织，而不是按日期组织。**
2. 一篇文档尽量解决一个明确问题。
3. 优先记录“为什么”和“踩过什么坑”，而不只是记录命令。
4. 对关键架构决策记录背景、约束、方案、取舍和结果。
5. 文档使用统一 Front Matter，方便未来网站、索引和 RAG 使用。
6. 不把聊天记录原样堆进仓库；先提炼为稳定知识。
7. 对尚未验证的结论明确标记状态。

## Document Metadata

推荐每篇知识文档使用：

```yaml
---
title: Qt 插件化架构设计
description: 记录 Qt 客户端插件注册、加载与生命周期设计
category: qt
tags:
  - qt
  - cpp
  - plugin
status: stable
created: 2026-09-20
updated: 2026-09-20
---
```

`status` 推荐值：

- `draft`：草稿 / 待验证
- `active`：持续维护
- `stable`：相对稳定
- `deprecated`：已过时，但保留历史信息

## Roadmap

### Phase 1 — Knowledge Foundation

- [x] 建立仓库
- [x] 建立领域目录
- [x] 定义 Markdown / Front Matter 规范
- [x] 定义 Agent 协作规范
- [ ] 开始迁移已有技术知识

### Phase 2 — Knowledge Website

- [ ] 接入 VitePress
- [ ] 自动生成导航与侧边栏
- [ ] GitHub Actions 自动构建
- [ ] GitHub Pages / Cloudflare Pages 部署
- [ ] 自定义域名

### Phase 3 — Search & AI

- [ ] 全文搜索
- [ ] 文档索引
- [ ] Embedding / Vector Store
- [ ] RAG 问答
- [ ] MCP / Agent 接口

### Phase 4 — Automated Knowledge Pipeline

```text
Conversation / Coding / Research
            ↓
        AI Distill
            ↓
       Markdown Draft
            ↓
        GitHub PR
            ↓
         Review
            ↓
          Merge
            ↓
 Website + Search + RAG Reindex
```

## Philosophy

> One piece at a time.

知识库不追求一次完成。每解决一个问题、完成一次架构设计、踩过一个值得记录的坑，就补上一块自己的知识地图。
