---
title: 选型：运行时与配置
author: zmd6s6
description: 配置分层选 kustomize 的理由；集群外中间件名字源的六案对比（headless+Endpoints 胜出）；探针方案；JVM 内存参数显式 vs 百分比。
category: devops
tags:
  - kubernetes
  - adr
status: active
created: 2026-10-13
updated: 2026-10-14
---

# 选型：运行时与配置

> 返回[决策索引](./README.md)。机制地基：[DNS](../../../networking/dns-name-to-address.md)、[JVM 内存](../../../backend/jvm-memory-anatomy.md)。

## 1. 配置分层：kustomize / Helm / 多套清单+脚本替换

| 候选 | 什么条件下合适 | 优点 | 代价 |
|---|---|---|---|
| kustomize | 环境少、差异集中在少数字段 | 无模板语言、渲染可 diff 评审、内置 | 表达力有限；不能引目录外单文件 |
| Helm | 对外发布复用、values 组合多、用社区 chart | 模板强、生态大 | 模板+values 两层心智；结果难肉眼核对 |
| 多套完整清单 / sed | 只有一套环境 | 直观 | 环境一多就发散（漂移事故源头） |

**本项目**：kustomize（底稿+差异页）。**该换**：要发布给别人复用、环境数爆炸时 Helm。

## 2. 集群外中间件的名字源（六案对比）

| 候选 | 什么条件下合适 | 代价/失效模式 |
|---|---|---|
| 配置直连 IP | 临时环境 | 换地址改 N 处 |
| ExternalName | 目标是**域名** | 目标写 IP 字面量=NXDOMAIN（死路，[事故](../incidents/externalname-to-ip-nxdomain.md)） |
| hostAliases（注入容器 hosts） | 少量负载临时兼容 | 逐负载声明、配置散落 |
| 节点 /etc/hosts | 节点上的裸机进程 | **容器不读**；k3s 同步机制不可靠 |
| 独立 DNS（dnsmasq/公司 DNS） | 中间件多、跨集群复用 | 多一个保活服务或需网管配合 |
| **headless Service + 同名 Endpoints** | 把集群外 IP 以集群内名字引用且进版本管理 | 需理解同名绑定；30 秒负缓存 |

**本项目**：headless+Endpoints（换库只改一行 IP）。**该换**：中间件增多或跨集群复用时上独立 DNS 做单一来源。

## 3. 探针方案

| 候选 | 什么条件下合适 | 失效模式 |
|---|---|---|
| 不配 | 试验负载、人工值守 | 假健康（DB 断连数天照样绿灯） |
| 聚合端点 + initialDelay | 依赖很少、启动快 | 依赖抖动→探针杀好容器（[事故](../incidents/probe-kills-healthy-container.md)） |
| **分组端点 + startupProbe** | 依赖多、启动慢 | 需确认框架暴露分组端点 |
| tcpSocket | 无 HTTP 端点时兜底 | 只证端口不证可用 |

**本项目**：分组端点+startupProbe。**该换**：无 HTTP 的服务用 tcpSocket。

## 4. JVM 内存参数：显式数值 / 百分比

| 候选 | 什么条件下合适 | 代价 |
|---|---|---|
| 显式（Xmx+Metaspace+Direct） | 需要精确对账、环境限额差异大 | 限额一改容易漏改某项（[三起 OOM](../incidents/container-killed-silently-oom.md)） |
| MaxRAMPercentage | 镜像被多环境复用、限额各异 | 只覆盖堆；Metaspace/堆外仍要显式 |

**本项目**：过渡期显式口径表，镜像默认值迁移到百分比。约束永远是"三块之和 < 限额"。

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-13 | zmd6s6（AI 辅助） | 创建于《选型决策记录》长文 |
| 2026-10-14 | zmd6s6（AI 辅助） | 按主题拆分独立成篇 |
