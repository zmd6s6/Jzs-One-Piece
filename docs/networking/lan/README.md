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

先去看自己家里的路由器、网线和 Wi-Fi，再学习它们里面的通信机制。设备认不清时，不急着背 ARP 缩写。

## 按路径学

1. [家用光猫、路由器、交换机与 Wi-Fi 入口的分工](./home-network-devices.md)
2. [同一局域网怎样依靠交换机和 ARP 交付](./ethernet-switch-arp.md)
3. [一台新手机的网络地址为什么能自动配置](./dhcp-automatic-addressing.md)
4. [Wi-Fi 满格为什么仍可能卡](./wifi-and-ethernet.md)

## 按症状找
| 现象 | 对应知识 |
|---|---|
| 插了网线却拿不到地址 | [DHCP](./dhcp-automatic-addressing.md) |
| IP 配对了但同网段互不相通 | [ARP/交换](./ethernet-switch-arp.md) |
| Wi-Fi 信号好但延迟抖动大 | [Wi-Fi](./wifi-and-ethernet.md) |

## 本阶段如何验收

看家中设备连接和网卡设置，解释网卡、无线入口、交换机、网关是哪个角色；能从邻居缓存举出 IP 与 MAC 的对应关系。

不能独立解释时，请回到首次出现该名词的文章，而不是重新背一遍缩写。

## 按决策查
- 先核对本机配置、掩码、下一跳，再判断跨网段问题；不要一上来调应用层超时。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
| 2026-10-15 | zmd6s6 | 将路由专题归到第三阶段，局域网阶段保留正确前置链接 |
| 2026-10-15 | zmd6s6 | 按真正零基础的知识依赖重排入口，增加日常场景与阶段验收 |
