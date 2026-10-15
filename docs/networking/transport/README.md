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

## 按路径学
1. [TCP 和 UDP 分别在解决什么问题](./tcp-vs-udp.md)
2. [TCP 三次握手、四次挥手与状态机](./tcp-connection-lifecycle.md)
3. [序列号、ACK、超时重传、接收窗口](./tcp-reliability.md)
4. [流量控制与拥塞控制为什么不是一回事](./tcp-congestion-control.md)
5. 衔接已有笔记：[端口拒绝和超时](../tcp-udp-refused-vs-timeout.md)。

## 按症状找
| 现象 | 核心机制 |
|---|---|
| 连不上/连接建立时失败 | [连接状态](./tcp-connection-lifecycle.md) |
| 发送一次却收到两次、一次发送被拆开 | [TCP 字节流](./tcp-reliability.md) + [消息帧](../programming/tcp-message-framing.md) |
| 高带宽但吞吐低 | [流量/拥塞控制](./tcp-congestion-control.md) |

## 按决策查
- 需要可靠有序字节流通常选 TCP；需要独立报文或自主可靠性机制可考虑 UDP/QUIC，具体由业务需求决定。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
