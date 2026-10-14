# AGENTS.md

## Mission

This repository is a long-term personal knowledge base.

AI agents working in this repository should optimize for:

1. correctness;
2. durable knowledge;
3. clear information architecture;
4. low duplication;
5. future compatibility with static-site generation and RAG.

Do not treat this repository as a chat log or generic note dump.

## Repository Contract

- Primary knowledge lives under `docs/`.
- Reusable media lives under `assets/`.
- Document templates live under `templates/`.
- Markdown is the canonical content format.
- Website code, if introduced later, must not make the knowledge content dependent on a specific frontend framework.

## Before Adding Knowledge

Before creating a new document:

1. Search the repository for an existing document covering the same topic.
2. Prefer updating an existing canonical document over creating a duplicate.
3. Choose the narrowest appropriate domain directory.
4. If the content is immature or uncertain, place it under `docs/notes/` or mark it `status: draft`.

## Required Front Matter

Knowledge documents should contain:

```yaml
---
title: Document Title
description: One-sentence description
category: cpp | qt | backend | devops | ai | architecture | projects | finance | notes
tags:
  - tag
status: draft | active | stable | deprecated
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

## Recommended Document Structure

Use sections when applicable:

```markdown
# Title

## Problem / Context

## Core Idea

## Design / Solution

## Example

## Pitfalls

## Decision / Trade-offs

## References
```

Do not force empty sections into every document.

## Writing Rules

- Prefer precise technical language.
- Explain why, not only how.
- Separate facts, assumptions, and opinions.
- Preserve commands, error messages, version numbers, and configuration details when they are important to reproducibility.
- Avoid unexplained screenshots when text or diagrams can encode the same knowledge.
- Use relative links for repository-local references.
- Avoid duplicating large blocks of content across documents.
- Keep titles stable once linked from other pages.
- Update `updated` when materially changing knowledge content.

## 写作规范（Reader-First Standards，优先级高于以上行文偏好）

以下三条适用于所有知识文档：

### 1. 小白视角

- 默认读者**不懂任何专业名词**。术语**首次出现**时必须做到三件事：①一句白话解释它是什么；②一个生活类比或最小示例；③链接到术语表或对应的基础知识笔记（如存在）。
- 行文顺序：先讲**现象和场景**（"有一天，程序报了这样一个错……"），再讲原理，最后才是操作命令。不要以命令、定义或表格开头。
- 表格里的术语同样要能独立读懂，做不到就拆开用正文讲。
- **示例是必需品不是装饰**：每个概念至少配一个可运行的命令、一段真实日志或一个生活类比。

### 2. 事故记录格式

事故类文档必须包含三段，缺一不可：

1. **事件链路**：按时间线完整还原——什么时间、谁做了什么、系统表现是什么（包括后来被证明无关的细节，它们是排查的一部分）；
2. **思考链路**：还原排查者当时的推理——第一反应是什么、验证了什么、结果如何、排除了什么、为什么转向下一个假设；
3. **层层剖析**：从表象逐层剥到根因（表象 → 直接原因 → 机制原因 → 流程/制度原因），每层回答"为什么这一层成立"。

结尾必须有：修复方案（含命令）、预防措施（落到模板/门禁/检查清单，不写"下次注意"）。

### 3. 基础知识归位（实践帖拆分）

- 实践类文章（部署、排障、项目复盘）用到的底层知识（网络、OS、JVM、数据库等），应拆成**独立的基础知识笔记放进对应知识域**（如 `docs/networking/`、`docs/backend/`），写成不依赖任何具体项目的小白文。
- 实践文章在用到的地方链接过去（"要看懂这一步，先理解 X → 链接"）；基础笔记末尾用"实战应用"小节链接回实践案例，形成双向网。
- 不允许在实践文章里内联展开大段底层原理（那属于基础域笔记），也不允许基础笔记依赖某个具体项目才能读懂。

## Architecture Decision Records

For important technical decisions, include:

- context;
- constraints;
- options considered;
- decision;
- trade-offs;
- consequences.

## AI-Generated Content

AI may:

- convert discussions into structured notes;
- normalize terminology;
- add examples;
- improve navigation;
- identify duplicated or outdated content;
- propose cross-links.

AI must not:

- fabricate references or test results;
- silently convert uncertain claims into facts;
- remove historical decisions without preserving context;
- rewrite domain-specific conclusions merely for stylistic consistency.

## Commit Guidance

Prefer small, semantic commits, for example:

- `docs(qt): add plugin lifecycle notes`
- `docs(k3s): document pod networking troubleshooting`
- `docs(ai): add RAG architecture overview`
- `chore(kb): refine knowledge metadata schema`

## Future Website Constraint

When a website is added:

- `docs/` remains source-of-truth.
- Frontend metadata should derive from Markdown front matter where possible.
- Avoid framework-specific syntax in knowledge content unless isolated and optional.
- Content must remain readable directly on GitHub.

## Future RAG Constraint

Documents should remain semantically self-contained enough to chunk and retrieve.

Prefer explicit headings and terminology over references such as “as mentioned earlier” when the referenced context is critical.
