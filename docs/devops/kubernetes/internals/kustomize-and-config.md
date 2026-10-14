---
title: 配置渲染与挂载：kustomize 和"改了不生效"
author: zmd6s6
description: 多环境清单的底稿+差异页模型（kustomize base/overlay）、按名字合并的规则与目录引用限制；配置怎么进容器、单文件挂载为什么不热更新。
category: devops
tags:
  - kubernetes
  - internals
  - kustomize
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 配置渲染与挂载：kustomize 和"改了不生效"

## 渲染：底稿 + 差异页

多环境的部署清单常"大同小异"。kustomize 的模型是**底稿（base）+ 每环境一张差异页（overlay）**，渲染出最终清单交给 K8s。三个实用点：

1. **渲染结果可先审**：`kubectl kustomize <目录>` 直接输出最终清单——可读、可 diff、可评审，这是"配置也能代码评审"的根基；
2. **按名字合并**：差异页改容器按容器名、改环境变量按变量名——**同名覆盖、异名追加**，不会误伤既有项；
3. **目录引用限制**：差异页不能引用自己目录之外的**单个文件**（防路径逃逸）——要引用整个目录，或把文件复制进来。

选型对比（vs Helm / sed 改文件）见[选型：运行时与配置](../../../projects/medical-platform/decisions/runtime-and-config.md)。

## 挂载：配置怎么进容器、为什么不热更新

配置（ConfigMap）进容器有整目录挂载和**单文件挂载（subPath）**两种。后者**不跟随源更新**——这就是[改配置不生效事故](../../../projects/medical-platform/incidents/config-not-hot-reloaded.md)的根源。操作铁律：**改配置 → 重启服务 → 验证** 三连。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从《原理篇》长文拆分独立成篇 |
