---
title: 机制原理索引：Kubernetes 是怎么工作的
author: zmd6s6
description: K3s/Kubernetes 机制原理的导航：集群是什么、一次请求的旅程、集群内 DNS、存储与镜像、健康探针、配置渲染——每篇一个机制，底层链接基础域。
category: devops
tags:
  - kubernetes
  - internals
  - map
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 机制原理索引：Kubernetes 是怎么工作的

> 每篇一个机制，先讲"它替你做了什么"，再讲"在哪会坏、坏了长什么样"（案例见[事故库](../incidents/README.md)）。

| 篇目 | 回答什么问题 |
|---|---|
| [K3s 是什么](./what-is-k3s.md) | 集群、K8s、K3s 各是什么关系；排障第一入口 |
| [一次请求的完整旅程](./request-journey.md) | 从 `http://节点IP:30080` 到容器，中间经过哪几跳 |
| [集群内的 DNS](./in-cluster-dns.md) | 容器里的短名是怎么翻译成地址的 |
| [存储与镜像](./storage-and-images.md) | "要一块盘"的申请单怎么变成机器上的目录；镜像怎么到达节点 |
| [健康探针](./health-probes.md) | K8s 怎么判断程序死活，判错了会怎样 |
| [配置渲染与挂载](./kustomize-and-config.md) | 多环境清单怎么管理，配置怎么进容器、为什么不热更新 |

**机制层速查表**（症状 → 指向哪篇 → 一行验证）：

| 症状 | 指向 | 一行验证 |
|---|---|---|
| 跨机器容器互访超时，同机器正常 | [请求旅程](./request-journey.md) | 两机器互测 UDP 8472 |
| 虚拟地址访问卡死 | [请求旅程](./request-journey.md) | `get endpoints` 看后端；直连容器地址对照 |
| 刚改的名字解析不到 | [集群内 DNS](./in-cluster-dns.md) | 等 30~60 秒（负缓存） |
| 名字永远解析不到 | [集群内 DNS](./in-cluster-dns.md) | 检查是否 ExternalName 填了 IP |
| 某台机器副本拉镜像挂死 | [存储与镜像](./storage-and-images.md) | 逐台 `ctr images ls \| grep` |
| 容器漂移后"数据没了" | [存储与镜像](./storage-and-images.md) | 看数据卷在原机器上 |
| 改配置不生效 | [配置渲染与挂载](./kustomize-and-config.md) | 重启对应服务 |

## 学习路径

零基础按序读：[K3s 是什么](./what-is-k3s.md) → [一次请求的旅程](./request-journey.md) → [集群内的 DNS](./in-cluster-dns.md) → 其余按需。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 从《原理篇》长文拆分建索引 |
