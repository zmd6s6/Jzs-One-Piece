---
title: 第七阶段：网络故障定位与运行期问题
author: zmd6s6
description: 按照现象、证据、假设、验证的次序，而不是随机修改参数。
category: networking
tags:
  - map
  - troubleshooting
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第七阶段：网络故障定位与运行期问题

已经懂每一层做什么，才有办法排错。先收集“名字是否查到、路由是否存在、服务是否监听、通信是否加密成功”等证据，而非同时修改五种配置。

## 按路径学
1. [诊断顺序：DNS → 路由 → TCP → TLS → HTTP](./troubleshooting-order.md)
2. [Wireshark 与 tcpdump 抓包证据](./packet-capture-basics.md)
3. [超时、重试、幂等与熔断](./timeouts-retries-idempotency.md)
4. [反向代理、负载均衡与 502/504](./reverse-proxy-load-balancer.md)

## 按症状找
| 现象 | 先看 |
|---|---|
| connection refused / timed out | [既有端口诊断](../tcp-udp-refused-vs-timeout.md) |
| 抓不到 HTTP 明文 | [抓包与 TLS](./packet-capture-basics.md) |
| 服务重试导致重复执行 | [超时与幂等](./timeouts-retries-idempotency.md) |
| 网关 502/504 | [代理与负载均衡](./reverse-proxy-load-balancer.md) |

## 本阶段如何验收

独立提交一条故障从症状到验证的证据链，区分 DNS、网络、连接、TLS 和 HTTP 的故障。

不能独立解释时，请回到首次出现该名词的文章，而不是重新背一遍缩写。

## 按决策查
- 排障先写最小复现、时间轴与观测证据；修改超时之前先查耗时分布。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
| 2026-10-15 | zmd6s6 | 按真正零基础的知识依赖重排入口，增加日常场景与阶段验收 |
