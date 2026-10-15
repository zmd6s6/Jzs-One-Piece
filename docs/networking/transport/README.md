---
title: 第四阶段：传输层 TCP 与 UDP
author: zmd6s6
description: 按连接、可靠性、流控、拥塞控制顺序建立 TCP 机制模型。
category: networking
tags:
  - map
  - transport
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第四阶段：传输层 TCP 与 UDP

网络知道“发往哪台设备”，却还没保证“送给哪项程序、按什么顺序”。这一阶段从寄信会丢、电话先接通等问题逐步理解 TCP 与 UDP。

## 按路径学

1. [可靠的字节流与独立数据报有什么不同](./tcp-vs-udp.md)
2. [连接被拒绝和等待超时到底差在哪](../tcp-udp-refused-vs-timeout.md)
3. [为什么 TCP 需要握手、断开和状态](./tcp-connection-lifecycle.md)
4. [字节丢了以后怎样确认和重传](./tcp-reliability.md)
5. [接收方忙与网络拥堵为何要分别控制](./tcp-congestion-control.md)

## 按症状找
| 现象 | 核心机制 |
|---|---|
| 连不上/连接建立时失败 | [连接状态](./tcp-connection-lifecycle.md) |
| 发送一次却收到两次、一次发送被拆开 | [TCP 字节流](./tcp-reliability.md) + [消息帧](../programming/tcp-message-framing.md) |
| 高带宽但吞吐低 | [流量/拥塞控制](./tcp-congestion-control.md) |

## 本阶段如何验收

能从寄快递类比解释 TCP/UDP，并解释 SYN/ACK/重传、为什么连接成功不代表业务成功。

不能独立解释时，请回到首次出现该名词的文章，而不是重新背一遍缩写。

## 按决策查
- 需要可靠有序字节流通常选 TCP；需要独立报文或自主可靠性机制可考虑 UDP/QUIC，具体由业务需求决定。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
| 2026-10-15 | zmd6s6 | 把旧端口诊断笔记纳入传输层正式学习顺序 |
| 2026-10-15 | zmd6s6 | 按真正零基础的知识依赖重排入口，增加日常场景与阶段验收 |
