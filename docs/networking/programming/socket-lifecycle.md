---
title: 为什么 Socket 服务端要 bind、listen、accept
author: zmd6s6
description: 建立从端口监听到数据读写再到关闭的完整生命周期。
category: networking
tags:
  - socket
  - tcp
  - cpp
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 为什么 Socket 服务端要 bind、listen、accept

## 先看一个现象
应用“启动成功”，但客户端连接报拒绝。启动进程并不代表已经**监听**相应的 IP 和端口。

## Socket 是什么
**Socket** 是应用调用操作系统网络栈的接口和通信端点抽象；像程序租用的一部电话。开发者关心 API，TCP 协议具体的确认和重传一般由内核处理。

## 典型 TCP 服务端
1. `socket()` 创建套接字。
2. `bind()` 绑定本地地址与端口。
3. `listen()` 进入监听状态，内核处理连接队列相关机制。
4. `accept()` 接受一个已建立的客户端连接，得到**新的已连接 socket**；监听 socket 保留用于继续接受连接。
5. `recv()/send()` 或 `read()/write()` 收发字节。
6. `close()` 释放资源。

典型 TCP 客户端：`socket() → connect() → send/recv → close()`。不同操作系统及语言封装 API 名称不同。

## 三种 bind 地址
- `127.0.0.1`：只接收本机 IPv4 环回流量。
- `0.0.0.0`：监听所有本机 IPv4 地址（不代表防火墙自动开放）。
- 某个具体内网 IP：只绑定该本地地址。

## 观察监听
```bash
# Linux
ss -lnt
# Windows
# netstat -ano
```

## 关键陷阱
`send()` 成功写入部分或全部字节，通常只意味着内核接受了这些字节，不等于远端业务已经消费成功。`recv()` 返回 0 在 TCP 语义下通常表示对端有序关闭了发送方向。

## 自测
为什么一个 TCP 服务端通常同时存在一个监听 socket 和多个已连接 socket？

## 相关知识
- [TCP 连接状态](../transport/tcp-connection-lifecycle.md)
- [消息边界](./tcp-message-framing.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、加入复现方法与自测问题 |
