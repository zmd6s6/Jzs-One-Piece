---
title: 计算机网络学习路径
author: zmd6s6
description: 计算机网络基础知识的线性学习路径：DNS → 端口 → 子网路由 → NAT，每篇零前置可读。
category: networking
tags:
  - networking
  - map
status: active
created: 2026-10-14
updated: 2026-10-14
---

# 计算机网络学习路径

> 按此顺序读，线性递进。

| 序 | 篇目 | 前置 | 回答什么问题 |
|---|---|---|---|
| 1 | [DNS：名字是怎么变成地址的](./dns-name-to-address.md) | 无 | 电话簿类比、A 记录与 CNAME、缓存与负缓存 |
| 2 | [端口："拒绝"与"超时"](./tcp-udp-refused-vs-timeout.md) | 无 | 敲门类比；两种失败的本质区别 |
| 3 | [IP、子网与路由](./ip-subnet-and-routing.md) | 无 | 小区门牌类比；为什么"在一个公司"≠"在一张网上" |
| 4 | [NAT 与端口转发](./nat-and-port-forward.md) | 3 | 总机类比；K8s Service 的底层机制 |

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-14 | zmd6s6 | 从目录列表改为线性学习路径 |
