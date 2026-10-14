---
title: 改了配置，程序却还用旧的
author: zmd6s6
description: ConfigMap 单文件挂载（subPath）不跟随源更新——改完配置必须重启服务，这条要写进操作手册。
category: devops
tags:
  - kubernetes
  - postmortem
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 改了配置，程序却还用旧的

## 现象

改了配置内容（ConfigMap，K8s 存配置的地方），容器里的文件**纹丝不动**，程序行为照旧。

## 根因

该文件是以"单文件挂载"（术语 subPath）方式挂进容器的——这种挂载方式**不跟随源更新**（整目录挂载才会自动刷新内容）。这是设计行为不是 bug。

## 修复与预防

改完配置**必须重启对应服务**：

```bash
kubectl -n 命名空间 rollout restart deploy/服务名
```

这条要写进操作手册的固定步骤（改配置 → 重启 → 验证三连），因为"我明明改了呀"的错觉每年都会坑人。机制细节见[配置渲染与挂载](../../../devops/kubernetes/internals/kustomize-and-config.md)。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从《K3s 事故复盘》长文拆分独立成篇 |
