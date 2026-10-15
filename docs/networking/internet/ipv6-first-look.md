---
title: IPv6 除了地址更长，还有哪些网络变化
author: zmd6s6
description: 从 IPv4 地址瓶颈过渡到 IPv6、邻居发现与双栈。
category: networking
tags:
  - ipv6
  - ip
status: active
created: 2026-10-15
updated: 2026-10-15
---

# IPv6 除了地址更长，还有哪些网络变化

## 先看一个现象
一台电脑既有 `192.168.1.20`，又有 `2001:db8::20` 或 `fe80::...` 地址。它可能同时运行 IPv4 与 IPv6，这叫**双栈**，类似同时拥有两种邮政编码体系。

## 初学需要记住什么
- IPv4 地址长 32 位；IPv6 长 128 位，以冒号分隔的十六进制表示。
- `::` 可压缩一段连续的 0；`fe80::/10` 是链路本地范围，通常不能当公网地址直接用。
- IPv6 不使用 ARP，而用 ICMPv6 中的**邻居发现协议 NDP**；没有 IPv4 式广播。
- IPv6 常用 SLAAC、DHCPv6 或静态配置。不是“IPv6 无需防火墙”或“每台机器都会有固定公网地址”。

## 动手
```bash
# Linux
ip -6 addr
ip -6 route
# Windows
# ipconfig /all
# ping -6 ::1
```
本机 `::1` 是 IPv6 环回地址，像 IPv4 的 `127.0.0.1`。

## 常见问题
DNS 的 `A` 对应 IPv4，`AAAA` 对应 IPv6。应用“解析成功却连不上”，可能实际选中了错误地址族。可比较 `curl -4` 和 `curl -6` 的行为，但取决于网络支持。

## 相关知识
- [四种地址](../foundations/four-kinds-of-address.md)
- [DNS 基础](../dns-name-to-address.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
