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

前一阶段学的是“我家或办公室内部如何送达”，现在追问“要送到另一座城市，该怎么出去”。先学地址范围与路口，再学测试工具和转换规则。

## 按路径学

1. [IP 地址、子网、网关、路由与 CIDR（主知识页）](../ip-subnet-and-routing.md)
2. [ping 能证明什么、不能证明什么](./icmp-and-path-probing.md)
3. [为什么一个出口能替多台内网设备联网](../nat-and-port-forward.md)
4. [IPv6 为什么采用另一种地址体系](./ipv6-first-look.md)

## 按症状找
| 现象 | 对应 |
|---|---|
| 不知道两个 IP 是否同网段 | [IP、子网与 CIDR](../ip-subnet-and-routing.md) |
| ping 不通但业务可能正常 | [ICMP](./icmp-and-path-probing.md) |
| 内网正常、跨网段异常 | [路由](../ip-subnet-and-routing.md) |

## 本阶段如何验收

计算给定地址的子网范围；查看本机路由表并指出默认出口；分清“ping 无回应”和“TCP 端口不可用”。

不能独立解释时，请回到首次出现该名词的文章，而不是重新背一遍缩写。

## 按决策查
- 在设计防火墙规则/子网前，先准确算清 CIDR 范围。
## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
| 2026-10-15 | zmd6s6 | 将 CIDR 和子网计算与既有 IP/路由笔记合并成单入口 |
| 2026-10-15 | zmd6s6 | 按真正零基础的知识依赖重排入口，增加日常场景与阶段验收 |
