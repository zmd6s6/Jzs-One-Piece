---
title: 为什么网络要分层：HTTP、TCP、IP 是怎样叠起来的
author: zmd6s6
description: 用快递包装类比理解 TCP/IP 分层、封装和解封装。
category: networking
tags:
  - fundamentals
  - tcp-ip
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 为什么网络要分层：HTTP、TCP、IP 是怎样叠起来的

## 先看一个现象
HTTP 客户端只想发送“GET /”，却要经过操作系统、网卡、路由器。为何一个请求需要多套协议？因为每一层只解决一个相对独立的问题。

## 四层先够用
| 层次 | 负责什么 | 直观例子 |
|---|---|---|
| 应用层 | 应用双方按什么业务格式说话 | HTTP 请求/响应；DNS 查询 |
| 传输层 | 进程间通信、可靠性或简单数据报 | TCP、UDP |
| 网络层 | 跨网络找到目的主机 | IP、ICMP |
| 链路层 | 在当前链路/局域网交付帧 | Ethernet、Wi-Fi |

**OSI 七层**是理解职责的参考模型；日常互联网排查更常用 TCP/IP 分层。不要把“某层”理解成必须存在的独立设备。

## 封装是什么
像寄快递：应用数据是物品，TCP/UDP 加上运输信息，IP 再加上目的地信息，最后以太网或 Wi-Fi 帧在当前链路发送。接收方按反方向拆开，称为**解封装**。每经过路由器，链路层帧通常会重新封装；端到端的 IP 目标通常保持不变（NAT 是例外）。

```text
应用数据
  ↓ + TCP/UDP 首部
传输层报文段/数据报
  ↓ + IP 首部
IP 数据包
  ↓ + 以太网首部及尾部
链路层帧 → 网络介质
```

**MTU** 是链路可承载的最大网络层数据包大小，像货车单次可装多大的箱子。包过大可能需要分片或调整上层发包大小。

## 动手观察
用 Wireshark 过滤 `tcp` 或 `dns`，点开一帧后依次查看 Ethernet、Internet Protocol、Transmission Control Protocol 和应用数据。某些环回接口不显示 Ethernet 头，这是正常的。

## 自测
- 为什么 HTTP 的“成功”不能仅用 TCP 连通来判断？
- MAC 地址和 IP 地址为什么可以同时出现在一帧里？

## 相关知识
- [四种地址](./four-kinds-of-address.md)
- [交换机与 ARP](../lan/ethernet-switch-arp.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
