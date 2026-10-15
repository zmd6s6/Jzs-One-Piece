---
title: TCP 与 UDP：可靠传输和数据报究竟差在哪里
author: zmd6s6
description: 从两种不同承诺理解 TCP 与 UDP 的适用场景。
category: networking
tags:
  - tcp
  - udp
  - transport
status: active
created: 2026-10-15
updated: 2026-10-15
---

# TCP 与 UDP：可靠传输和数据报究竟差在哪里

## 先看一个现象
文件传输希望内容顺序准确；在线音视频更在乎实时到达而不一定等待过期片段。为什么它们可能选不同传输机制？

## 两种服务模型
- **TCP**：面向连接的**可靠、有序字节流**。像两人先建立持续通话，双方按序接收字节，TCP 在必要时负责重传。可靠交付不代表应用处理一定成功。
- **UDP**：面向数据报的传输协议，每次发送有报文边界；像扔一张张独立明信片。UDP 自身不保证到达、顺序或去重，但**应用可以在 UDP 上自行建立可靠机制**（例如 QUIC）。

## 对比
| 维度 | TCP | UDP |
|---|---|---|
| 建立通信 | 典型需要握手连接 | 没有 TCP 那样的连接建立 |
| 数据边界 | 没有应用消息边界 | 保留发送数据报边界 |
| 可靠、有序 | 协议机制提供 | 应用自行决定 |
| 常见用法 | HTTP/1.1、HTTP/2、传统数据库连接 | DNS 常见查询、实时通信、QUIC |

DNS 不仅支持 UDP，也可能走 TCP；HTTP/3 基于 QUIC/UDP，不等于“HTTP 必须 TCP”。

## 小实验
使用 Python 标准库的 `socket.socket(socket.AF_INET, socket.SOCK_DGRAM)` 可构造 UDP 通信；TCP 使用 `SOCK_STREAM`。第一遍只区分“数据报”和“字节流”，无需先学 epoll。

## 自测
为什么 TCP 的可靠不等于“客户端发起支付后绝不会重复扣款”？

## 相关知识
- [连接生命周期](./tcp-connection-lifecycle.md)
- [消息边界](../programming/tcp-message-framing.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
