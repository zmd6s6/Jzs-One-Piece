---
title: 第一阶段：网络世界的基本规则
author: zmd6s6
description: 零前置：先看现象，再理解设备、分层和四种地址。
category: networking
tags:
  - map
  - fundamentals
status: active
created: 2026-10-15
updated: 2026-10-15
---

# 第一阶段：网络世界的基本规则

假设你打开网页，却看到“无法访问此网站”。先别背协议名：你需要知道谁在通信、数据走过哪些环节，以及如何辨别卡在了哪里。

## 按路径学
1. [一次网页请求怎么穿过互联网](./first-network-request.md)
2. [为什么网络要分层、数据为什么会被封装](./layers-and-encapsulation.md)
3. [域名、IP、MAC、端口分别标识谁](./four-kinds-of-address.md)
4. 接着去[局域网阶段](../lan/README.md)。

## 按症状找
| 现象 | 先学 |
|---|---|
| 浏览器能打开 IP，打不开域名 | [四种地址](./four-kinds-of-address.md)，再看[DNS](../dns-name-to-address.md) |
| 不清楚 HTTP/TCP/IP 的关系 | [分层与封装](./layers-and-encapsulation.md) |

## 按决策查
- 还不能画出“电脑 → 网关 → 服务器”的路径，就不要先钻 TCP 参数。
- 每个概念至少能用自己的话描述，并给出一个真实的地址或命令示例。

## 相关知识
- [总学习地图](../README.md)

## 修订记录

| 日期 | 作者 | 变更 |
|---|---|---|
| 2026-10-15 | zmd6s6 | 初建线性学习笔记、例子与验收题 |
