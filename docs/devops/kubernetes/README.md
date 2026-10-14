---
title: Kubernetes 学习路径
author: zmd6s6
description: Kubernetes/K3s 基础知识的学习路径：从"K3s 是什么"到"一次请求的旅程"，每个机制一篇，底层链接计算机网络与后端基础域。
category: devops
tags:
  - kubernetes
  - map
status: active
created: 2026-10-14
updated: 2026-10-14
---

# Kubernetes 学习路径

> 这是纯知识域，不含具体项目内容。实践（事故与选型）在[项目](../../projects/medical-platform/README.md)里，通过链接串联到这里。

## 按此顺序读（线性递进）

| 序 | 篇目 | 前置知识 | 回答什么问题 |
|---|---|---|---|
| 1 | [K3s 是什么](./internals/what-is-k3s.md) | 无 | 集群、K8s、K3s 的关系；排障第一入口 |
| 2 | [一次请求的完整旅程](./internals/request-journey.md) | [端口](../../networking/tcp-udp-refused-vs-timeout.md)、[NAT](../../networking/nat-and-port-forward.md) | 从 `http://IP:30080` 到容器经过哪几跳 |
| 3 | [集群内的 DNS](./internals/in-cluster-dns.md) | [DNS 基础](../../networking/dns-name-to-address.md) | 容器里短名怎么翻译 |
| 4 | [存储与镜像](./internals/storage-and-images.md) | 无 | "要一块盘"怎么变成目录；镜像怎么到节点 |
| 5 | [健康探针](./internals/health-probes.md) | 无 | K8s 怎么判断死活，判错了会怎样 |
| 6 | [配置渲染与挂载](./internals/kustomize-and-config.md) | 无 | 多环境清单怎么管；配置怎么进容器 |

查词：[术语表](./glossary.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从子域地图改为纯知识学习路径；事故与选型迁至项目域 |
