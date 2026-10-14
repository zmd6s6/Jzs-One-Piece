---
title: Kubernetes 子域地图
author: zmd6s6
description: Kubernetes/K3s 知识的导航入口：按症状找事故、按路径学机制、按主题查决策。
category: devops
tags:
  - kubernetes
  - map
status: active
created: 2026-10-14
updated: 2026-10-14
---

# Kubernetes 子域地图

> 背景故事见[项目实践](../../projects/medical-it-delivery-practice/README.md)；文中服务名已脱敏（gateway/platform/pacs 泛指网关、平台、影像处理三类 Java 服务）。

## 我遇到问题了 → [事故复盘](./incidents/README.md)

按症状查索引表（"容器不报错却被杀""只有一个副本起不来"……），每起事故一篇，含完整排查推理。

## 我想搞懂机制 → [机制原理](./internals/README.md)

从"K3s 是什么"到"一次请求的完整旅程"，每个机制一篇；底层地基（DNS/端口/路由/NAT/JVM）链接[基础域](../../networking/README.md)。

## 我想查当时的选型 → [选型决策](./decisions/README.md)

12 组决策按主题分成 4 篇：平台与拓扑 / 镜像与启动 / 运行时与配置 / 流程与工具——每条含候选方案、适用条件、代价与反转条件。

## 我只想查个词 → [术语表](./glossary.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 创建；原 devops 下 4 篇长文按"一个知识点一篇"拆分到三个类型目录 |
