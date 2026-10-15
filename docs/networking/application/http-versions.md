---
title: HTTP/1.1、HTTP/2、HTTP/3 为什么都存在
author: zmd6s6
description: 对比队头阻塞、多路复用、QUIC 与连接建立成本。
category: networking
tags:
  - http2
  - http3
  - quic
status: active
created: 2026-10-15
updated: 2026-10-15
---

# HTTP/1.1、HTTP/2、HTTP/3 为什么都存在

## 先看一个现象
明明都叫 HTTP，抓包里 HTTP/1.1 能看到文本请求行，HTTP/2 却是二进制帧；HTTP/3 则经常看到 UDP 443。这是不同版本的底层承载和帧机制不同。

## 按演进理解
- **HTTP/1.1**：支持持久连接；传统情况下一个连接中的响应交付存在队头阻塞问题，浏览器通常会用多条连接缓解。
- **HTTP/2**：单个 TCP 连接上复用多条 HTTP 流，以二进制帧传输并支持头部压缩；但底层 TCP 丢包仍可能阻塞该连接的多个流。
- **HTTP/3**：HTTP 语义运行在 **QUIC** 上。QUIC 是基于 UDP 的安全传输协议，提供多条流和独立的可靠性机制，从而缓解 TCP 连接层队头阻塞。

## 关键不是“新版一定快”
实际性能受网络丢包、RTT、服务器支持、代理/CDN、客户端配置影响。某环境阻断 UDP 443 时，HTTP/3 可能不可用并回退到其他版本。

## 动手观察
```bash
curl -I --http1.1 https://example.com
curl -I --http2 https://example.com
curl -V
```
第二个命令取决于 curl 是否编译了 HTTP/2；HTTP/3 同样依赖客户端构建支持，不能仅看参数是否存在。

## 自测
为什么 HTTP/2 多路复用不代表 TCP 丢包影响完全消失？

## 相关知识
- [TCP 拥塞控制](../transport/tcp-congestion-control.md)
- [TLS](./https-tls.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习内容及验证问题 |
