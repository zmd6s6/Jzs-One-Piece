---
title: Java Socket、NIO 和 Netty 应该按什么顺序学
author: zmd6s6
description: 从阻塞 Socket 和 ByteBuffer 进入 Selector 与 Netty 的事件驱动模型。
category: networking
tags:
  - java
  - nio
  - netty
status: active
created: 2026-10-15
updated: 2026-10-15
---

# Java Socket、NIO 和 Netty 应该按什么顺序学

## 先看一个现象
一个简单 TCP Echo 服务端用 `ServerSocket` 很容易写；当要维护很多长连接时，逐连接分配线程会产生调度和资源压力。这时才需要学习 NIO 和 Netty。

## 学习递进
1. **java.net.Socket / ServerSocket**：同步阻塞 API，最适合验证协议正确性。
2. **java.nio.channels.SocketChannel / ServerSocketChannel**：通道式 IO；可切换非阻塞模式。
3. **ByteBuffer**：操作字节缓冲；`flip()` 把写入后的缓冲切到读取状态，`compact()` 用于保留尚未消费的数据。
4. **Selector**：一个线程观察多个通道的就绪事件。
5. **Netty**：封装事件循环、连接生命周期、ChannelPipeline、编解码等重复机制的异步网络应用框架。

## 理解 Netty 组件
- `EventLoop` 负责关联 Channel 的 IO 事件与任务，像负责多个窗口的调度员。
- `ChannelPipeline` 是依次处理入站/出站事件的流水线。
- `ByteBuf` 管理字节缓冲及相关生命周期，需注意引用计数。
- **解码器**负责应用消息分帧，不能假定一次 read 恰好是一条业务消息。

## 核心原则
网络 IO 与阻塞数据库/重 CPU 处理要做合理隔离；否则即便用了 Netty，也会因为阻塞 EventLoop 导致所有关联连接变慢。超时与重试依旧属于应用设计问题。

## 学习材料
[Oracle Socket 教程](https://docs.oracle.com/javase/tutorial/networking/sockets/) 偏基础、基于较早 JDK；[Netty 4.x 官方指南](https://netty.io/wiki/user-guide-for-4.x.html) 学事件与流水线，涉及版本时以官方最新对应 API 文档核对。

## 自测
为什么引入 Netty 不会自动解决“业务粘包”和“幂等性”？

## 相关知识
- [IO 多路复用](./io-multiplexing.md)
- [消息边界](./tcp-message-framing.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
