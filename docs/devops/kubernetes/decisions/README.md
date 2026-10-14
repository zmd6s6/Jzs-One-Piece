---
title: 选型决策索引：当时为什么这么选
author: zmd6s6
description: 12 组 Kubernetes 体系选型决策的导航：按主题分四篇（平台与拓扑/镜像与启动/运行时与配置/流程与工具），每条含候选、适用条件、代价与反转条件。
category: devops
tags:
  - kubernetes
  - adr
  - map
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 选型决策索引：当时为什么这么选

> 每条记录 = **当时条件下**的选择，不做普适推荐；同一条在别的约束下答案可能相反。

| 主题 | 收录的决策 |
|---|---|
| [平台与拓扑](./platform-and-topology.md) | 容器平台选型（K3s vs 标准 K8s）；节点拓扑（单/双/多节点）；工作负载类型与存储 |
| [镜像与启动](./image-and-startup.md) | 镜像分发（私有仓库 vs 逐台导入）；Java 产物形态与容器入口；Dockerfile 放哪 |
| [运行时与配置](./runtime-and-config.md) | 配置分层（kustomize）；集群外中间件的名字源；探针方案；JVM 内存参数 |
| [流程与工具](./process-and-tooling.md) | 版本与发布策略；观察方式（图形客户端 vs 命令行） |

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 从《选型决策记录》长文按主题拆分建索引 |
