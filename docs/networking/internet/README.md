---
title: 第三阶段：跨网络寻址与路由
author: zmd6s6
description: 子网、路由、ICMP、NAT、IPv6 的递进阅读入口。
category: networking
tags:
  - map
  - ip
  - routing
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第三阶段：跨网络寻址与路由

## 按路径学
1. [IP、子网与路由](../ip-subnet-and-routing.md)（已有基础页）
2. [CIDR 怎么做子网计算](./subnet-cidr-calculation.md)
3. [ICMP、ping、traceroute 真正测到了什么](./icmp-and-path-probing.md)
4. [NAT 与端口转发](../nat-and-port-forward.md)（已有基础页）
5. [IPv6 与 IPv4 不只是地址位数不同](./ipv6-first-look.md)

## 按症状找
| 现象 | 对应 |
|---|---|
| 不知道两个 IP 是否同网段 | [CIDR](./subnet-cidr-calculation.md) |
| ping 不通但业务可能正常 | [ICMP](./icmp-and-path-probing.md) |
| 内网正常、跨网段异常 | [路由](../ip-subnet-and-routing.md) |

## 按决策查
- 在设计防火墙规则/子网前，先准确算清 CIDR 范围。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
