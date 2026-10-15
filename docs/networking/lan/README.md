---
title: 第二阶段：局域网与网络接入
author: zmd6s6
description: 先理解同一局域网如何交付，再进入跨网络路由。
category: networking
tags:
  - map
  - lan
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第二阶段：局域网与网络接入

## 按路径学
1. [交换机、以太网帧与 ARP](./ethernet-switch-arp.md)
2. [DHCP 与 IPv4 自动配置](./dhcp-automatic-addressing.md)
3. [Wi-Fi 为什么也是一种链路](./wifi-and-ethernet.md)
4. [IP、子网、网关与路由（已有笔记）](../ip-subnet-and-routing.md)

## 按症状找
| 现象 | 对应知识 |
|---|---|
| 插了网线却拿不到地址 | [DHCP](./dhcp-automatic-addressing.md) |
| IP 配对了但同网段互不相通 | [ARP/交换](./ethernet-switch-arp.md) |
| Wi-Fi 信号好但延迟抖动大 | [Wi-Fi](./wifi-and-ethernet.md) |

## 按决策查
- 先核对本机配置、掩码、下一跳，再判断跨网段问题；不要一上来调应用层超时。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
