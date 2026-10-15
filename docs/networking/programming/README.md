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

到这里才让应用程序自己负责网络通信：先写一个简单、正确的 Socket 收发，再考虑消息边界，最后学习非阻塞、Java 和 Qt。

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

## 本阶段如何验收

实现本地 TCP 收发并能应对消息被拆成多次读取；逐步解释 Java/Qt 异步 IO 为何需要事件处理。

不能独立解释时，请回到首次出现该名词的文章，而不是重新背一遍缩写。

## 按决策查
- 先验证同步阻塞实现正确性，再引入 Reactor/Netty；“异步”不是自动更快。
- 先验证本地长度前缀 TCP 分帧能正确解析多条和不完整的字节流。

## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
| 2026-10-15 | zmd6s6 | 按真正零基础的知识依赖重排入口，增加日常场景与阶段验收 |
