---
title: 机制原理索引
author: zmd6s6
description: Kubernetes 机制原理的索引与症状速查表。
category: devops
tags:
  - kubernetes
  - internals
  - map
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 机制原理索引

| 篇目 | 回答什么问题 |
|---|---|
| [K3s 是什么](./what-is-k3s.md) | 集群、K8s、K3s 各是什么关系 |
| [一次请求的完整旅程](./request-journey.md) | 从端口到容器的三跳 |
| [集群内的 DNS](./in-cluster-dns.md) | 短名怎么翻译 |
| [存储与镜像](./storage-and-images.md) | 存储申请与镜像分发 |
| [健康探针](./health-probes.md) | 死活判断机制 |
| [配置渲染与挂载](./kustomize-and-config.md) | 清单管理与配置进容器 |

**症状 → 机制层速查**：

| 症状 | 指向 | 一行验证 |
|---|---|---|
| 跨机器容器互访超时，同机器正常 | [请求旅程](./request-journey.md) | 两机器互测 UDP 8472 |
| 虚拟地址访问卡死 | [请求旅程](./request-journey.md) | `get endpoints` 看后端 |
| 刚改的名字解析不到 | [集群内 DNS](./in-cluster-dns.md) | 等 30~60 秒（负缓存） |
| 某台机器副本拉镜像挂死 | [存储与镜像](./storage-and-images.md) | 逐台 `ctr images ls` |
| 容器漂移后"数据没了" | [存储与镜像](./storage-and-images.md) | 看数据卷在原机器 |
| 改配置不生效 | [配置渲染与挂载](./kustomize-and-config.md) | 重启对应服务 |

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 纯化为知识索引；事故链接移至项目域 |
