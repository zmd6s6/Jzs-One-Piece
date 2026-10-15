---
title: 计算机网络术语表：初学常见概念一站查阅
author: zmd6s6
description: 把第一次出现容易混淆的网络术语转成白话定义。
category: networking
tags:
  - glossary
  - reference
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 计算机网络术语表：初学常见概念一站查阅

学习过程中的最小字典。术语首次出现后尽量回到对应主题的完整笔记，而不是只背定义。

| 术语 | 白话定义 | 进入哪篇 |
|---|---|---|
| 主机 Host | 能运行网络软件的设备 | [网页请求](./foundations/first-network-request.md) |
| 客户端 Client | 主动发请求的一方 | [网页请求](./foundations/first-network-request.md) |
| 服务端 Server | 提供网络服务的一方 | [网页请求](./foundations/first-network-request.md) |
| 数据包 Packet | 网络层承载数据的基本单元 | [分层](./foundations/layers-and-encapsulation.md) |
| 帧 Frame | 链路层的一份数据交付单 | [交换与 ARP](./lan/ethernet-switch-arp.md) |
| 交换机 Switch | 根据链路层地址转发的设备 | [交换与 ARP](./lan/ethernet-switch-arp.md) |
| 路由器 Router | 在不同网络之间转发数据包 | [路由](./ip-subnet-and-routing.md) |
| MAC | 链路层接口标识 | [四种地址](./foundations/four-kinds-of-address.md) |
| IP | 网络层寻址标识 | [四种地址](./foundations/four-kinds-of-address.md) |
| 子网 Subnet | 共享同一网络前缀的地址分组 | [CIDR](./internet/subnet-cidr-calculation.md) |
| 默认网关 Gateway | 目标不在本地网段时的默认下一跳 | [路由](./ip-subnet-and-routing.md) |
| ARP | IPv4 到本链路地址的映射机制 | [交换与 ARP](./lan/ethernet-switch-arp.md) |
| DNS | 名字与地址等信息的查询体系 | [DNS](./dns-name-to-address.md) |
| NAT | 改写网络流的源/目的地址或端口 | [NAT](./nat-and-port-forward.md) |
| 端口 Port | 传输层通信端点编号 | [四种地址](./foundations/four-kinds-of-address.md) |
| Socket | 应用与操作系统网络栈的接口 | [Socket](./programming/socket-lifecycle.md) |
| TCP | 可靠、有序、面向连接的字节流传输 | [TCP/UDP](./transport/tcp-vs-udp.md) |
| UDP | 不保证可靠交付的数据报传输 | [TCP/UDP](./transport/tcp-vs-udp.md) |
| RTT | 一次往返通信所经历的时间 | [网络性能](./advanced/network-performance.md) |
| MTU | 某条链路允许的网络层最大包大小 | [分层](./foundations/layers-and-encapsulation.md) |
| TLS | 保护网络传输的安全协议 | [HTTPS](./application/https-tls.md) |
| HTTP | 应用层的请求响应通信语义 | [HTTP](./application/http-core.md) |
| QUIC | 基于 UDP 的安全多路复用传输协议 | [HTTP/3](./application/http-versions.md) |
| 幂等 | 重复执行不改变最终业务效果 | [超时重试](./operations/timeouts-retries-idempotency.md) |
| IO 多路复用 | 一个线程等待多个 IO 端点就绪 | [事件循环](./programming/io-multiplexing.md) |

## 自测方式
从表中随机抽一个概念，用“它是什么 → 类比 → 在哪一步起作用 → 如何验证”四句话回答。回答不出来时返回对应主题。

## 相关知识
- [总学习地图](./README.md)
- [优质学习资源](./reading-list.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 创建、建立学习入口和参考资料 |
