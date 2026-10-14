---
title: 事故复盘索引：按症状找
author: zmd6s6
description: Kubernetes 相关事故的症状速查索引：一句话定位到对应篇目，每篇含完整的现象、排查推理、根因与预防。
category: devops
tags:
  - kubernetes
  - postmortem
  - map
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 事故复盘索引：按症状找

> 排查方法论：先分层定位（哪一层的问题），再进对应篇目。判据速用：**端口秒回"拒绝"=没监听；干等"超时"=路不通**（详见[端口基础](../../../networking/tcp-udp-refused-vs-timeout.md)）。

| 症状 | 一句话 | 篇目 |
|---|---|---|
| 容器一启动就退出，报"找不到类" | 启动方式与打包布局不匹配 | [启动即退出](./noclassdeffound-on-start.md) |
| 容器不报错却被反复杀 | 内存三块之和超过限额 | [静默被杀：三起 OOM](./container-killed-silently-oom.md) |
| 服务注册失败导致启动中断（网页打得开） | 端口没放全：8848 通不代表 9848 通 | [注册失败](./registration-failed-multi-port.md) |
| 只有一个副本起不来，一挂几小时 | 镜像没分发到那台机器 | [单副本挂死](./imagepullbackoff-missing-node.md) |
| 引用外部数据库的名字解析不到 | ExternalName 填了 IP（CNAME 死路） | [名字解析失败](./externalname-to-ip-nxdomain.md) |
| 健康检查把好端端的程序杀了 | 探针打了"综合健康报告" | [探针杀容器](./probe-kills-healthy-container.md) |
| 改了配置程序还用旧的 | 单文件挂载不热更新 | [配置不生效](./config-not-hot-reloaded.md) |
| 发布产物版本对不上源码 | 流水线连了同名旧仓库 | [连错仓库两个月](./ci-built-from-stale-repo.md) |
| 部署产物多一层无用的壳 | tar 外面又包了 zip | [产物多余包装](./release-artifact-extra-layer.md) |
| 跨网段时好时坏 | 子网间路由间歇被挡 | [间歇性失联](./intermittent-subnet-outage.md) |

## 学习路径（按机制分组读）

1. 镜像与启动：[启动即退出](./noclassdeffound-on-start.md) → [静默被杀](./container-killed-silently-oom.md) → [产物多余包装](./release-artifact-extra-layer.md)
2. 集群与依赖：[名字解析失败](./externalname-to-ip-nxdomain.md) → [单副本挂死](./imagepullbackoff-missing-node.md) → [注册失败](./registration-failed-multi-port.md) → [探针杀容器](./probe-kills-healthy-container.md) → [配置不生效](./config-not-hot-reloaded.md)
3. 流程与网络：[连错仓库](./ci-built-from-stale-repo.md) → [间歇性失联](./intermittent-subnet-outage.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6（AI 辅助） | 从《K3s 事故复盘》长文拆分建索引；补入注册失败案例 |
