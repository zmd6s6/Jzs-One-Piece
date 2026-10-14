---
title: 存储与镜像：磁盘申请单和镜像快递
author: zmd6s6
description: local-path 存储的真相是"机器上的一个目录"（数据绑死节点）；镜像如何到达节点（本地没有就去拉、离线=永远超时）；Java 程序启动的链接。
category: devops
tags:
  - kubernetes
  - internals
  - storage
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 存储与镜像：磁盘申请单和镜像快递

## 存储：local-path 的真相

K8s 的存储申请单叫 PVC（"我要一块 10G 的盘"）。K3s 默认的分配器 local-path 做法非常朴素：**在容器所在那台机器上建一个目录**，挂进容器当磁盘。

**推论（坑）**：数据从此**绑死那台机器**——容器被调度到另一台机器时，拿到的是那边的新空目录（数据没丢，躺在原机器上）。测试环境能接受；要求"容器随便漂、数据跟着走"就要换网络存储（见[选型：平台与拓扑](../../../projects/medical-platform/decisions/platform-and-topology.md)）。

## 镜像：怎么到达节点

**镜像**=打包好的、可直接运行的程序压缩包。K3s 内置运行时 containerd（不是 Docker），操作入口：

```bash
k3s ctr -n k8s.io images ls -q        # 看本机有哪些镜像（-n k8s.io 别忘）
k3s ctr -n k8s.io images import x.tar # 导入离线镜像
```

**拉取策略的坑**：默认策略 IfNotPresent（"本地有就不下载"）的后半句是——**本地没有就去远端下载**。离线环境=去 Docker Hub=永远超时挂起，这就是[镜像漏分发事故](../../../projects/medical-platform/incidents/imagepullbackoff-missing-node.md)的机制根源。另一个冷知识：磁盘紧张时系统会**清理"没在用"的旧镜像**——回滚前先确认旧版本还在。

## Java 程序的启动

容器入口怎么写、为什么 `java -cp` 比 `java -jar` 稳，见[classpath 白话](../../../backend/java-classpath-basics.md)；内存三块与容器限额，见[JVM 内存白话](../../../backend/jvm-memory-anatomy.md)。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从《原理篇》长文拆分独立成篇 |
