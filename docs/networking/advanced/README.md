---
title: 第八阶段：网络性能、安全与云原生通信
author: zmd6s6
description: 把网络理解用于性能分析、安全边界和容器网络，而不是只会背协议。
category: networking
tags:
  - map
  - advanced
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第八阶段：网络性能、安全与云原生通信

## 按路径学
1. [吞吐、RTT、丢包与 P99：怎样量化网络性能](./network-performance.md)
2. [防火墙、TLS 与零信任等安全边界](./network-security.md)
3. [容器 Pod/Service 网络为什么不同于宿主机](./container-networking.md)

## 按症状找
| 现象 | 重点 |
|---|---|
| 链路大带宽却吞吐低 | [网络性能](./network-performance.md) |
| 内网可用却公网不可用 | [安全边界](./network-security.md) |
| 宿主机通、容器内失败 | [容器网络](./container-networking.md) |

## 按决策查
- 在选型和优化前定义目标：延迟分布、吞吐、丢包、可用性、资源成本、攻击面。
- 实验数据必须写明环境和工具，不用单次跑分替代架构论证。

## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、建立学习入口和参考资料 |
