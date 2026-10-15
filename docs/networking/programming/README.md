---
title: 第六阶段：从 TCP 原理进入网络编程
author: zmd6s6
description: 围绕 C/C++ Socket、消息帧、事件循环、Java NIO 和 Qt 网络模块逐步实践。
category: networking
tags:
  - map
  - programming
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第六阶段：从 TCP 原理进入网络编程

## 按路径学
1. [Socket：一端要做哪些动作](./socket-lifecycle.md)
2. [TCP 没有消息边界：长度前缀协议](./tcp-message-framing.md)
3. [阻塞、非阻塞、select/poll/epoll](./io-multiplexing.md)
4. [Java Socket、NIO、Netty](./java-nio-netty.md)
5. [Qt 的 QTcpSocket 与线程归属](./qt-network.md)

## 按症状找
| 现象 | 首选知识 |
|---|---|
| recv 收不全、读到两个包 | [消息边界](./tcp-message-framing.md) |
| 单线程处理一条连接就卡住 | [IO 多路复用](./io-multiplexing.md) |
| Qt socket 跨线程报警 | [Qt 网络](./qt-network.md) |
| Netty handler 读到了半个业务包 | [消息边界](./tcp-message-framing.md) |

## 按决策查
- 先验证同步阻塞实现正确性，再引入 Reactor/Netty；“异步”不是自动更快。
- 运行代码见 [动手实验库](../../projects/networking-labs/README.md)。

## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
