---
title: K3s 是什么：管家、打包与全家桶
author: zmd6s6
description: 用小白视角讲清集群/Kubernetes/K3s 三者的关系：K3s 是把管家和全套家具塞进一个可执行文件的发行版——以及为什么要认识它自带的全家桶。
category: devops
tags:
  - kubernetes
  - internals
status: active
created: 2026-10-14
updated: 2026-10-14
---

# K3s 是什么：管家、打包与全家桶

## 集群（Kubernetes）是干嘛的

先说**集群**：你交给它一份"期望清单"（想要 2 个网关、1 个数据库……，术语叫清单/manifest），它负责**让现实和清单一致**——机器不够找机器、程序挂了拉起来、滚动升级照单执行。可以理解成**一个自动执行部署与运维意愿的管家**。Kubernetes 常写作 K8s（K 和 s 之间 8 个字母）。

## K3s：把管家和全套家具塞进一个文件

**K3s** 是 K8s 的一个"打包发行版"：把管家和全套家具（容器运行时 containerd、网络组件 flannel、DNS、存储插件）塞进**一个可执行文件**。两台低配服务器、断网环境也能 5 分钟起集群——这正是[项目实践](../../../projects/medical-platform/README.md)选它的原因（见[选型：平台与拓扑](../../../projects/medical-platform/decisions/platform-and-topology.md)）。

代价：默认家具都是选好的，**不认识它们就会被默认值坑**（本文末尾逐一报名字）。

```
管理节点（一个 k3s 进程包办）：大脑（API/调度/控制） + 数据账本
每台机器上的代理人（kubelet）：照清单把容器拉起来、按探针重启
```

## 全家桶成员（认脸）

| 成员 | 干什么 | 不认识它会怎样 |
|---|---|---|
| containerd | 真正运行容器的引擎（**不是 Docker**，机器上没有 docker 命令是正常的） | 用 docker 命令操作会找不到东西；正确入口 `k3s ctr -n k8s.io ...`（`-n k8s.io` 是储藏室编号，忘写=看起来空空如也） |
| CoreDNS | 集群内的名字翻译（见[集群内 DNS](./in-cluster-dns.md)） | 名字解析问题不知道去哪查 |
| local-path | 把"机器上的目录"当磁盘用（见[存储与镜像](./storage-and-images.md)） | 以为数据会跟着容器走，其实绑死机器 |
| flannel | 跨机器的容器网络（见[请求旅程](./request-journey.md)） | 跨机器不通时想不到是 UDP 8472 被挡 |
| traefik | 高级路由（按域名转发）；只用端口直连时可忽略 | 看到它的容器不知道是干嘛的 |

## 排障第一入口

管理节点上 `journalctl -u k3s`——k3s 进程自己的日志，一切**集群级**问题（节点不就绪、组件报错）的第一现场。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从《原理篇》长文拆分独立成篇 |
